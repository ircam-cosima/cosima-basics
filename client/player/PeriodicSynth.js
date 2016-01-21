'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _soundworksClient = require('soundworks/client');

var _soundworksClient2 = _interopRequireDefault(_soundworksClient);

var audioCtx = _soundworksClient2['default'].audioContext;
var audio = _soundworksClient2['default'].audio;
var scheduler = audio.getSimpleScheduler();

scheduler.period = 0.1;
scheduler.lookahead = 0.2;

var SourceEngine = (function (_audio$TimeEngine) {
  _inherits(SourceEngine, _audio$TimeEngine);

  function SourceEngine(buffer, sync, period, offset) {
    _classCallCheck(this, SourceEngine);

    _get(Object.getPrototypeOf(SourceEngine.prototype), 'constructor', this).call(this);

    this.buffer = buffer;
    this.sync = sync;
    this.period = period;
    this.offset = offset;

    this.output = audioCtx.createGain();
  }

  _createClass(SourceEngine, [{
    key: 'disconnect',
    value: function disconnect() {
      this.output.disconnect();
    }
  }, {
    key: 'advanceTime',
    value: function advanceTime(time) {
      var syncTime = this.sync.getSyncTime(time);
      // console.log(syncTime);
      var toIntRatio = Math.pow(10, syncTime.toString().split('.')[1].length);
      var intSyncTime = syncTime * toIntRatio;
      var intPeriod = this.period * toIntRatio;
      var modulo = intSyncTime % intPeriod;
      var gridSyncTime = (intSyncTime - modulo) / toIntRatio;

      var startTime = this.sync.getLocalTime(gridSyncTime) + this.offset;

      if (startTime >= audioCtx.currentTime) {
        var duration = this.buffer.length / this.buffer.sampleRate;

        var src = audioCtx.createBufferSource();
        src.connect(this.output);
        src.buffer = this.buffer;

        src.start(startTime);
        src.stop(startTime + duration);
      }

      return time + this.period;
    }
  }]);

  return SourceEngine;
})(audio.TimeEngine);

var PeriodicSynth = (function () {
  function PeriodicSynth(audioCtx, sync, loader) {
    _classCallCheck(this, PeriodicSynth);

    this.audioCtx = audioCtx;
    this.sync = sync;
    this.loader = loader;

    this.gain = null;

    var sampleRate = audioCtx.sampleRate;
    var length = 0.024 * sampleRate;
    this.buffer = audioCtx.createBuffer(1, length, sampleRate);

    // populate buffer
    var buffer = this.buffer.getChannelData(0);

    for (var i = 0; i < length; i++) {
      var rand = Math.random();
      var normX = i / length;
      var factor = Math.sin(normX * Math.PI);
      buffer[i] = rand * factor;
    }
  }

  _createClass(PeriodicSynth, [{
    key: 'play',
    value: function play(startTime, fadeInDuration, fadeOutDuration, period, offset) {
      if (this.gain === 0) {
        return;
      }

      var _now = audioCtx.currentTime;
      var _startTime = this.sync.getLocalTime(startTime);
      var _endTime = _startTime + fadeInDuration + fadeOutDuration;

      var env = audioCtx.createGain();
      env.connect(audioCtx.destination);
      env.gain.value = 0;
      env.gain.setValueAtTime(0, _startTime);
      env.gain.linearRampToValueAtTime(this.gain, _startTime + fadeInDuration);
      env.gain.linearRampToValueAtTime(0, _endTime);

      var filter = audioCtx.createBiquadFilter();
      filter.connect(env);
      filter.type = 'highpass';
      filter.frequency.value = 10000;
      filter.Q.value = 6;

      var buffer = this.buffer;
      var src = new SourceEngine(buffer, this.sync, period, offset);
      src.output.connect(filter);
      scheduler.add(src, _startTime);

      setTimeout(function () {
        scheduler.remove(src);
        src.disconnect();
        env.disconnect();
      }, (_endTime - _now) * 1000);
    }
  }]);

  return PeriodicSynth;
})();

exports['default'] = PeriodicSynth;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvcGxheWVyL1BlcmlvZGljU3ludGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztnQ0FBdUIsbUJBQW1COzs7O0FBRTFDLElBQU0sUUFBUSxHQUFHLDhCQUFXLFlBQVksQ0FBQztBQUN6QyxJQUFNLEtBQUssR0FBRyw4QkFBVyxLQUFLLENBQUM7QUFDL0IsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7O0FBRTdDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDOztJQUVwQixZQUFZO1lBQVosWUFBWTs7QUFDTCxXQURQLFlBQVksQ0FDSixNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7MEJBRHRDLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFTjs7QUFFUixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDckM7O2VBVkcsWUFBWTs7V0FZTixzQkFBRztBQUNYLFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDMUI7OztXQUVVLHFCQUFDLElBQUksRUFBRTtBQUNoQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFN0MsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENB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V0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ2xCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBLEdBQUksSUFBSSxDQUFDLENBQUM7S0FDOUI7OztTQXJEa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9wbGF5ZXIvUGVyaW9kaWNTeW50aC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcblxuY29uc3QgYXVkaW9DdHggPSBzb3VuZHdvcmtzLmF1ZGlvQ29udGV4dDtcbmNvbnN0IGF1ZGlvID0gc291bmR3b3Jrcy5hdWRpbztcbmNvbnN0IHNjaGVkdWxlciA9IGF1ZGlvLmdldFNpbXBsZVNjaGVkdWxlcigpO1xuXG5zY2hlZHVsZXIucGVyaW9kID0gMC4xO1xuc2NoZWR1bGVyLmxvb2thaGVhZCA9IDAuMjtcblxuY2xhc3MgU291cmNlRW5naW5lIGV4dGVuZHMgYXVkaW8uVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgc3luYywgcGVyaW9kLCBvZmZzZXQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gICAgdGhpcy5zeW5jID0gc3luYztcbiAgICB0aGlzLnBlcmlvZCA9IHBlcmlvZDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcblxuICAgIHRoaXMub3V0cHV0ID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLm91dHB1dC5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUodGltZSk7XG4gICAgLy8gY29uc29sZS5sb2coc3luY1RpbWUpO1xuICAgIGNvbnN0IHRvSW50UmF0aW8gPSBNYXRoLnBvdygxMCwgc3luY1RpbWUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzFdLmxlbmd0aCk7XG4gICAgY29uc3QgaW50U3luY1RpbWUgPSBzeW5jVGltZSAqIHRvSW50UmF0aW87XG4gICAgY29uc3QgaW50UGVyaW9kID0gdGhpcy5wZXJpb2QgKiB0b0ludFJhdGlvO1xuICAgIGNvbnN0IG1vZHVsbyA9IGludFN5bmNUaW1lICUgaW50UGVyaW9kO1xuICAgIGNvbnN0IGdyaWRTeW5jVGltZSA9IChpbnRTeW5jVGltZSAtIG1vZHVsbykgLyB0b0ludFJhdGlvO1xuXG4gICAgbGV0IHN0YXJ0VGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUoZ3JpZFN5bmNUaW1lKSArIHRoaXMub2Zmc2V0O1xuXG4gICAgaWYgKHN0YXJ0VGltZSA+PSBhdWRpb0N0eC5jdXJyZW50VGltZSkge1xuICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmJ1ZmZlci5sZW5ndGggLyB0aGlzLmJ1ZmZlci5zYW1wbGVSYXRlO1xuXG4gICAgICBjb25zdCBzcmMgPSBhdWRpb0N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgIHNyYy5jb25uZWN0KHRoaXMub3V0cHV0KTtcbiAgICAgIHNyYy5idWZmZXIgPSB0aGlzLmJ1ZmZlcjtcblxuICAgICAgc3JjLnN0YXJ0KHN0YXJ0VGltZSk7XG4gICAgICBzcmMuc3RvcChzdGFydFRpbWUgKyBkdXJhdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbWUgKyB0aGlzLnBlcmlvZDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJpb2RpY1N5bnRoIHtcbiAgY29uc3RydWN0b3IoYXVkaW9DdHgsIHN5bmMsIGxvYWRlcikge1xuICAgIHRoaXMuYXVkaW9DdHggPSBhdWRpb0N0eDtcbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMubG9hZGVyID0gbG9hZGVyO1xuXG4gICAgdGhpcy5nYWluID0gbnVsbDtcblxuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSBhdWRpb0N0eC5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGxlbmd0aCA9IDAuMDI0ICogc2FtcGxlUmF0ZTtcbiAgICB0aGlzLmJ1ZmZlciA9IGF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlcigxLCBsZW5ndGgsIHNhbXBsZVJhdGUpO1xuXG4gICAgLy8gcG9wdWxhdGUgYnVmZmVyXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCByYW5kID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGNvbnN0IG5vcm1YID0gaSAvIGxlbmd0aDtcbiAgICAgIGNvbnN0IGZhY3RvciA9IE1hdGguc2luKG5vcm1YICogTWF0aC5QSSk7XG4gICAgICBidWZmZXJbaV0gPSByYW5kICogZmFjdG9yO1xuICAgIH1cbiAgfVxuXG4gIHBsYXkoc3RhcnRUaW1lLCBmYWRlSW5EdXJhdGlvbiwgZmFkZU91dER1cmF0aW9uLCBwZXJpb2QsIG9mZnNldCkge1xuICAgIGlmICh0aGlzLmdhaW4gPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBfbm93ID0gYXVkaW9DdHguY3VycmVudFRpbWU7XG4gICAgY29uc3QgX3N0YXJ0VGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUoc3RhcnRUaW1lKTtcbiAgICBjb25zdCBfZW5kVGltZSA9IF9zdGFydFRpbWUgKyBmYWRlSW5EdXJhdGlvbiArIGZhZGVPdXREdXJhdGlvbjtcblxuICAgIGNvbnN0IGVudiA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcbiAgICBlbnYuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gICAgZW52LmdhaW4udmFsdWUgPSAwO1xuICAgIGVudi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIF9zdGFydFRpbWUpO1xuICAgIGVudi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZ2FpbiwgX3N0YXJ0VGltZSArIGZhZGVJbkR1cmF0aW9uKTtcbiAgICBlbnYuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBfZW5kVGltZSk7XG5cbiAgICBjb25zdCBmaWx0ZXIgPSBhdWRpb0N0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICBmaWx0ZXIuY29ubmVjdChlbnYpO1xuICAgIGZpbHRlci50eXBlID0gJ2hpZ2hwYXNzJztcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gMTAwMDA7XG4gICAgZmlsdGVyLlEudmFsdWUgPSA2O1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZUVuZ2luZShidWZmZXIsIHRoaXMuc3luYywgcGVyaW9kLCBvZmZzZXQpO1xuICAgIHNyYy5vdXRwdXQuY29ubmVjdChmaWx0ZXIpO1xuICAgIHNjaGVkdWxlci5hZGQoc3JjLCBfc3RhcnRUaW1lKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2NoZWR1bGVyLnJlbW92ZShzcmMpO1xuICAgICAgc3JjLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGVudi5kaXNjb25uZWN0KCk7XG4gICAgfSwgKF9lbmRUaW1lIC0gX25vdykgKiAxMDAwKTtcbiAgfVxufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=