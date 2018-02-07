import * as soundworks from 'soundworks/client';
import getColor from '../shared/getColor';
import ActiveVertex from '../shared/ActiveVertex';
import Boid from '../shared/Boid';
import PlayerRenderer from './PlayerRenderer';
import PeriodicSynth from './PeriodicSynth';
import GranularSynth from './GranularSynth';
import WhiteNoiseSynth from './WhiteNoiseSynth';
import Metronome from './Metronome';

const client = soundworks.client;

const template = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"><p class="big"></p></div>
    <div class="section-center flex-center"></div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

class PlayerExperience extends soundworks.Experience {
  constructor(audioConfig) {
    super();

    this._audioConfig = audioConfig;

    this._platform = this.require('platform');
    this._checkin = this.require('checkin');
    // this._locator = this.require('locator');
    this._placer = this.require('placer');
    this._sync = this.require('sync');
    this._syncScheduler = this.require('sync-scheduler');
    this._sharedParams = this.require('shared-params');
    this._audioBufferManager = this.require('audio-buffer-manager', {
      files: this._audioConfig,
    });

    this._velocityMean = null;
    this._velocitySpread = null;
    this._periodicSynthPeriod = null;
    this._currentAudioConfig = null;

    this._onTouchStart = this._onTouchStart.bind(this);

    this.onSoloistStart = this.onSoloistStart.bind(this);
    this.onSoloistStop = this.onSoloistStop.bind(this);
  }

  start() {
    super.start();

    this.view = new soundworks.CanvasView(template, {}, {
      'touchstart': this._onTouchStart,
    }, {
      id: 'experience',
      className: 'player',
    });

    this.show().then(() => {
      // initialize synths and view
      this.metronome = new Metronome(this._syncScheduler);
      this.periodicSynth = new PeriodicSynth(this._sync);
      this.granularSynth = new GranularSynth(this._sync);
      this.whiteNoiseSynth = new WhiteNoiseSynth();

      const color = getColor(client.index);
      this.renderer = new PlayerRenderer(color);
      this.view.addRenderer(this.renderer);

      this.view.setPreRender((ctx, dt, width, height) => {
        ctx.clearRect(0, 0, width, height);
      });

      this._sharedParams.addParamListener('toggleMetro', value => {
        if (value)
          this.metronome.start();
        else
          this.metronome.stop();
      });

      // listen for controls
      this._sharedParams.addParamListener('velocityMean', value => {
        this._velocityMean = value;
      });

      this._sharedParams.addParamListener('velocitySpread', value => {
        this._velocitySpread = value;
      });

      // mix
      this._sharedParams.addParamListener('gainPeriodic', value => {
        this.periodicSynth.gain = value;
      });

      this._sharedParams.addParamListener('gainGranular', value => {
        this.granularSynth.gain = value;
      });

      // periodic params
      this._sharedParams.addParamListener('periodicPeriod', value => {
        this._periodicSynthPeriod = value;
      });

      // granular params
      this._sharedParams.addParamListener('audioConfig', value => {
        const config = this._audioBufferManager.data[value.toLowerCase()];
        this._currentAudioConfig = config;
        this.granularSynth.config = config;
      });

      this._sharedParams.addParamListener('granularPositionVar', value => {
        this.granularSynth.positionVar = value;
      });

      this._sharedParams.addParamListener('granularPeriod', value => {
        this.granularSynth.period = value;
      });

      this._sharedParams.addParamListener('granularDuration', value => {
        this.granularSynth.duration = value;
      });

      this._sharedParams.addParamListener('granularResampling', value => {
        this.granularSynth.resampling = value;
      });

      this._sharedParams.addParamListener('granularResamplingVar', value => {
        this.granularSynth.resamplingVar = value;
      });

      this._sharedParams.addParamListener('granularSpeed', value => {
        this.granularSynth.grainSpeed = value;
      });

      // reload
      this._sharedParams.addParamListener('reload', () => {
        window.location.reload(true);
      });

      // init communications
      this.receive('subgraph', (data) => {
        this._renderGraph(data);
      });

      this.receive('trigger', (data) => {
        this._scheduleSynth(data, false);
        this._scheduleRendering(data, false);
      });

      this.send('subgraph:request');

      // soloist comms
      this.receive('soloist:start', this.onSoloistStart);
      this.receive('soloist:stop', this.onSoloistStop);
    });
  }

  _renderGraph(data) {
    // console.log(data);
    this.data = data;
    // define ratio for visualisation
    let maxDistance = -Infinity;
    data.adjacentVertices.forEach((vertex) => {
      if (vertex.distance > maxDistance) {
        maxDistance = vertex.distance;
      }
    });

    const width = this.renderer.canvasWidth;
    const height = this.renderer.canvasHeight;
    const ratio = (Math.min(width, height) / 2 - 20) / maxDistance;

    this.renderer.setGraph(data, ratio);
  }

  _onTouchStart(e) {
    const triggerTime = this._sync.getSyncTime();
    const velocity = this._velocityMean + (Math.random() * this._velocitySpread - this._velocitySpread / 2);

    const period = this._periodicSynthPeriod;
    // define offset according to period and syncTime
    const toIntRatio = Math.pow(10, triggerTime.toString().split('.')[1].length);
    const _period = period * toIntRatio;
    const _syncTime = triggerTime * toIntRatio;
    const _modulo = _syncTime % _period;
    const offsetPeriod = _modulo / toIntRatio;

    const audioConfig = this._currentAudioConfig;
    const markerIndex = Math.floor(Math.random() * audioConfig.markers.length);
    const resamplingIndex = Math.floor(Math.random() * audioConfig.resampling.length);

    // send to server
    this.send('trigger', triggerTime, velocity, period, offsetPeriod, markerIndex, resamplingIndex);
    // trigger self
    const data = { triggerTime, velocity, period, offsetPeriod, markerIndex, resamplingIndex };
    this._scheduleSynth(data, true);
    this._scheduleRendering(data, true);
  }

  // @todo - should be encapsulated in `Score` objects
  _scheduleSynth(data, isSource) {
    let fadeInDuration = 0;
    let fadeOutDuration = 0.1; // can't be zero, breaks automations
    let {
      triggerTime,
      offsetTime,
      velocity,
      period,
      offsetPeriod,
      markerIndex,
      resamplingIndex
    } = data;

    if (isSource) {
      const startTime = triggerTime;
      const offsetTime = triggerTime; // start at the beginning of the file

      this.data.adjacentVertices.forEach((next) => {
        fadeOutDuration = next.distance / data.velocity;

        this.granularSynth.play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex);
        this.periodicSynth.play(startTime, fadeInDuration, fadeOutDuration, period, offsetPeriod);
      });
    } else if (!isSource && data.next && data.next.length) {
      const startTime = data.prev.triggerTime;
      const fadeInDuration = triggerTime - startTime;

      data.next.forEach((next) => {
        fadeOutDuration = next.triggerTime - triggerTime;

        this.granularSynth.play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex);
        this.periodicSynth.play(startTime, fadeInDuration, fadeOutDuration, period, offsetPeriod);
      });
    } else { // is leaf
      const startTime = data.prev.triggerTime;
      const fadeInDuration = triggerTime - startTime;

      this.granularSynth.play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex);
      this.periodicSynth.play(startTime, fadeInDuration, fadeOutDuration, period, offsetPeriod);
    }
  }

  _scheduleRendering(data, isSource) {
    const now = this._sync.getLocalTime();
    // renderer should have a scheduler

    if (isSource) {
      const x = 0;
      const y = 0;
      const color = getColor(client.index);
      // highlight node
      const activeVertex = new ActiveVertex(x, y, color);
      this.renderer.addActiveVertex(activeVertex);

      // launch boids to adjacent nodes
      this.data.adjacentVertices.forEach((vertex) => {
        const origin = { x, y };
        const distance = vertex.distance;
        const velocity = data.velocity;
        const boid = new Boid(origin, vertex, distance, velocity, color);
        this.renderer.addBoid(boid);

        // highlight target node
        setTimeout(() => {
          const activeVertex = new ActiveVertex(vertex.x, vertex.y, color);
          this.renderer.addActiveVertex(activeVertex);
        }, vertex.distance / data.velocity * 1000);
      });
    } else {
      const prevTriggerTime = this._sync.getLocalTime(data.prev.triggerTime);
      const color = getColor(data.sourceId);
      const x = data.x;
      const y = data.y;

      setTimeout(() => {
        // highlight prev node
        const prevX = data.prev.x - x;
        const prevY = data.prev.y - y;
        const activeVertex = new ActiveVertex(prevX, prevY, color);
        this.renderer.addActiveVertex(activeVertex);

        // launch boids to self
        const dist = data.prev.distance;
        const dt = data.triggerTime - data.prev.triggerTime;
        const velocity = dist / dt;
        const origin = { x: prevX, y: prevY };
        const target = { x: 0, y: 0 };
        const boid = new Boid(origin, target, dist, velocity, color);
        this.renderer.addBoid(boid);

        setTimeout(() => {
          // highlight self
          const activeVertex = new ActiveVertex(0, 0, color);
          this.renderer.addActiveVertex(activeVertex);

          // laucnh boids to next vertices
          if (data.next && data.next.length) {
            data.next.forEach((next) => {
              const nextX = next.x - x;
              const nextY = next.y - y;
              const dist = next.distance;
              const dt = next.triggerTime - data.triggerTime;
              const velocity = dist / dt;
              const origin = { x: 0, y: 0 };
              const target = { x: nextX, y: nextY };

              const boid = new Boid(origin, target, dist, velocity, color);
              this.renderer.addBoid(boid);

              // highlight next
              setTimeout(() => {
                const activeVertex = new ActiveVertex(nextX, nextY, color);
                this.renderer.addActiveVertex(activeVertex);
              }, dt * 1000);
            });
          }
        }, dt * 1000);
      }, (prevTriggerTime - now) * 1000);
    }
  }


  // SOUNDFIELD
  onSoloistStart() {
    this.whiteNoiseSynth.start();
    this.view.$el.classList.add('active');
  }

  onSoloistStop() {
    this.whiteNoiseSynth.stop();
    this.view.$el.classList.remove('active');
  }
}

export default PlayerExperience;
