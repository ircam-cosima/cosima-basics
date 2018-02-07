import { audioContext, audio } from 'soundworks/client';

class Metronome extends audio.TimeEngine {
  constructor(syncScheduler) {
    super();

    this.syncScheduler = syncScheduler;
    this.period = 1;
  }

  start() {
    const currentTime = this.syncScheduler.currentTime;
    const nextTick = Math.ceil(currentTime);

    if (!this.master)
      this.syncScheduler.add(this, nextTick);
  }

  stop() {
    if (this.master)
      this.syncScheduler.remove(this);
  }

  advanceTime(syncTime) {
    const localTime = this.syncScheduler.audioTime;

    const env = audioContext.createGain();
    env.connect(audioContext.destination);
    env.gain.value = 0;
    env.gain.setValueAtTime(0, localTime);
    env.gain.linearRampToValueAtTime(1, localTime + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, localTime + 0.02);

    const osc = audioContext.createOscillator();
    osc.connect(env);
    osc.frequency.value = (syncTime % 4 === 0) ? 2400 : 1200;
    osc.start(localTime);
    osc.stop(localTime + 0.02);

    return syncTime + this.period;
  }
}

export default Metronome;
