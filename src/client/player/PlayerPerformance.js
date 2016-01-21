import soundworks from 'soundworks/client';
import getColor from '../shared/getColor';
import ActiveVertex from '../shared/ActiveVertex';
import Boid from '../shared/Boid';
import PlayerRenderer from './PlayerRenderer';
import PeriodicSynth from './PeriodicSynth';
import GranularSynth from './GranularSynth';

const audioCtx = soundworks.audioContext;
const client = soundworks.client;
const ClientPerformance = soundworks.ClientPerformance;
const motionInput = soundworks.motionInput;
const Renderer = soundworks.display.Renderer;
const CanvasView = soundworks.display.CanvasView;

const template = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"><p class="big"></p></div>
    <div class="section-center flex-center"></div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;


export default class PlayerPerformance extends ClientPerformance {
  constructor(audioConfig, sync, control, loader, options = {}) {
    super(options);

    this._audioConfig = audioConfig;
    this._sync = sync;
    this._control = control;
    this._loader = loader;

    this._velocityMean = null;
    this._velocitySpread = null;
    this._periodicSynthPeriod = null;
    this._currentAudioConfig = null;

    this._onTouchStart = this._onTouchStart.bind(this);

    this.init();
  }

  init() {
    this.template = template;
    // this.content = {};
    this.viewCtor = CanvasView;
    this.events = { 'touchstart': this._onTouchStart };
    this.view = this.createView();
  }

  start() {
    super.start();

    // extend config with buffers
    Object.keys(this._audioConfig).forEach((key, index) => {
      this._audioConfig[key].buffer = this._loader.buffers[index];
    });

    // initialize synth and view
    this.periodicSynth = new PeriodicSynth(audioCtx, this._sync);
    this.granularSynth = new GranularSynth(audioCtx, this._sync);

    const color = getColor(client.uid);
    this.renderer = new PlayerRenderer(color);
    this.view.addRenderer(this.renderer);

    this.view.setPreRender(function(ctx, dt) {
      ctx.clearRect(0, 0, ctx.width, ctx.height);
    });

    // listen for controls
    this._control.addUnitListener('velocityMean', (value) => {
      this._velocityMean = value;
    });

    this._control.addUnitListener('velocitySpread', (value) => {
      this._velocitySpread = value;
    });

    // mix
    this._control.addUnitListener('gainPeriodic', (value) => {
      this.periodicSynth.gain = value;
    });

    this._control.addUnitListener('gainGranular', (value) => {
      this.granularSynth.gain = value;
    });

    // periodic params
    this._control.addUnitListener('periodicPeriod', (value) => {
      this._periodicSynthPeriod = value;
    });

    // granular params
    this._control.addUnitListener('audioConfig', (value) => {
      value = value.toLowerCase();
      const config = this._audioConfig[value];
      this._currentAudioConfig = config;
      this.granularSynth.config = config;
    });

    this._control.addUnitListener('granularPositionVar', (value) => {
      this.granularSynth.positionVar = value;
    });

    this._control.addUnitListener('granularPeriod', (value) => {
      this.granularSynth.period = value;
    });

    this._control.addUnitListener('granularDuration', (value) => {
      this.granularSynth.duration = value;
    });

    this._control.addUnitListener('granularResampling', (value) => {
      this.granularSynth.resampling = value;
    });

    this._control.addUnitListener('granularResamplingVar', (value) => {
      this.granularSynth.resamplingVar = value;
    });

    this._control.addUnitListener('granularSpeed', (value) => {
      this.granularSynth.grainSpeed = value;
    });

    // reload
    this._control.addUnitListener('reload', () => {
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
  }

  _renderGraph(data) {
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
      const color = getColor(client.uid);
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
}


