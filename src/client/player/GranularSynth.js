import soundworks from 'soundworks/client';

const audioCtx = soundworks.audioContext;
const audio = soundworks.audio;
const scheduler = audio.getSimpleScheduler();


export default class GranularSynth {
  constructor(audioCtx, sync) {
    this.audioCtx = audioCtx;
    this.sync = sync;

    this.positionVar = null;
    this.period = null;
    this.duration = null;
    this.resampling = null;
    this.resamplingVar = null;
    this.grainSpeed = null;

    this.config = null;

    this.gain = null;
  }

  /**
   * @param {Number} startTime - [syncTime]
   * @param {Number} offset - [syncTime] time of the source event (trigger vertex).
   */
  play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex) {
    if (this.gain === 0) { return; }


    const sync = this.sync;
    const _startTime = Math.max(audioCtx.currentTime, sync.getLocalTime(startTime));
    const _endTime = _startTime + fadeInDuration + fadeOutDuration;

    const env = audioCtx.createGain();
    env.connect(audioCtx.destination);
    env.gain.value = 0;
    env.gain.setValueAtTime(0, _startTime);
    env.gain.linearRampToValueAtTime(this.gain, _startTime + fadeInDuration);
    env.gain.linearRampToValueAtTime(0, _endTime);

    const buffer = this.config.buffer;
    const engine = new audio.GranularEngine({ buffer, cyclic: true });
    engine.connect(env);
    scheduler.add(engine);

    const markerTimeOffset = this.config.markers[markerIndex];
    const resamplingValue = this.config.resampling[resamplingIndex];

    // apply current parameters
    engine.positionVar = this.positionVar;
    engine.periodAbs = this.period;
    engine.durationAbs = this.duration;
    engine.resampling = resamplingValue + this.resampling;
    engine.resamplingVar = this.resamplingVar;

    const grainSpeed = this.grainSpeed;
    // advance in the buffer
    (function advancePosition() {
      const _now = sync.getLocalTime();
      const _offsetTime = sync.getLocalTime(offsetTime);
      const position = (_now - _offsetTime) * grainSpeed + markerTimeOffset;
      engine.position = position; // modulo is done inside engine

      if (_now < _endTime) {
        requestAnimationFrame(advancePosition);
      } else {
        scheduler.remove(engine);
        engine.disconnect();
      }
    }());
  }
}