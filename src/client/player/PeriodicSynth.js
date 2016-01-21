import soundworks from 'soundworks/client';

const audioCtx = soundworks.audioContext;
const audio = soundworks.audio;
const scheduler = audio.getSimpleScheduler();

scheduler.period = 0.1;
scheduler.lookahead = 0.2;

class SourceEngine extends audio.TimeEngine {
  constructor(buffer, sync, period, offset) {
    super();

    this.buffer = buffer;
    this.sync = sync;
    this.period = period;
    this.offset = offset;

    this.output = audioCtx.createGain();
  }

  disconnect() {
    this.output.disconnect();
  }

  advanceTime(time) {
    const syncTime = this.sync.getSyncTime(time);
    // console.log(syncTime);
    const toIntRatio = Math.pow(10, syncTime.toString().split('.')[1].length);
    const intSyncTime = syncTime * toIntRatio;
    const intPeriod = this.period * toIntRatio;
    const modulo = intSyncTime % intPeriod;
    const gridSyncTime = (intSyncTime - modulo) / toIntRatio;

    let startTime = this.sync.getLocalTime(gridSyncTime) + this.offset;

    if (startTime >= audioCtx.currentTime) {
      const duration = this.buffer.length / this.buffer.sampleRate;

      const src = audioCtx.createBufferSource();
      src.connect(this.output);
      src.buffer = this.buffer;

      src.start(startTime);
      src.stop(startTime + duration);
    }

    return time + this.period;
  }
}

export default class PeriodicSynth {
  constructor(audioCtx, sync, loader) {
    this.audioCtx = audioCtx;
    this.sync = sync;
    this.loader = loader;

    this.gain = null;

    const sampleRate = audioCtx.sampleRate;
    const length = 0.024 * sampleRate;
    this.buffer = audioCtx.createBuffer(1, length, sampleRate);

    // populate buffer
    const buffer = this.buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const rand = Math.random();
      const normX = i / length;
      const factor = Math.sin(normX * Math.PI);
      buffer[i] = rand * factor;
    }
  }

  play(startTime, fadeInDuration, fadeOutDuration, period, offset) {
    if (this.gain === 0) { return; }

    const _now = audioCtx.currentTime;
    const _startTime = this.sync.getLocalTime(startTime);
    const _endTime = _startTime + fadeInDuration + fadeOutDuration;

    const env = audioCtx.createGain();
    env.connect(audioCtx.destination);
    env.gain.value = 0;
    env.gain.setValueAtTime(0, _startTime);
    env.gain.linearRampToValueAtTime(this.gain, _startTime + fadeInDuration);
    env.gain.linearRampToValueAtTime(0, _endTime);

    const filter = audioCtx.createBiquadFilter();
    filter.connect(env);
    filter.type = 'highpass';
    filter.frequency.value = 10000;
    filter.Q.value = 6;

    const buffer = this.buffer;
    const src = new SourceEngine(buffer, this.sync, period, offset);
    src.output.connect(filter);
    scheduler.add(src, _startTime);

    setTimeout(() => {
      scheduler.remove(src);
      src.disconnect();
      env.disconnect();
    }, (_endTime - _now) * 1000);
  }
}
















