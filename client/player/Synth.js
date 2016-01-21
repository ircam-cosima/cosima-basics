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

// import audio from 'waves-audio';

var audioCtx = _soundworksClient2['default'].audioContext;
var audio = _soundworksClient2['default'].audio;
var scheduler = audio.getSimpleScheduler();

scheduler.period = 0.1;
scheduler.lookahead = 0.2;

var SourceEngine = (function (_audio$TimeEngine) {
  _inherits(SourceEngine, _audio$TimeEngine);

  function SourceEngine(buffer, sync, attackTime, releaseTime, period, offset, frequency, gain) {
    _classCallCheck(this, SourceEngine);

    _get(Object.getPrototypeOf(SourceEngine.prototype), 'constructor', this).call(this);

    this.sync = sync;
    this.period = period;
    this.offset = offset;
    this.frequency = frequency;
    this.gain = gain;
    this.buffer = buffer;

    this.attack = attackTime;
    this.release = releaseTime;

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
      var toIntRatio = Math.pow(10, syncTime.toString().split('.')[1].length);
      var intSyncTime = syncTime * toIntRatio;
      var intPeriod = this.period * toIntRatio;
      var modulo = intSyncTime % intPeriod;
      var gridSyncTime = (intSyncTime - modulo) / toIntRatio;

      var startTime = this.sync.getLocalTime(gridSyncTime) + this.offset;

      if (startTime >= audioCtx.currentTime) {
        // const endTime = startTime + this.release;
        var duration = this.buffer.length / this.buffer.sampleRate;

        // const env = audioCtx.createGain();
        // env.connect(this.output);
        // env.gain.value = 0;
        // env.gain.setValueAtTime(0, startTime);
        // env.gain.linearRampToValueAtTime(this.gain, startTime + this.attack);
        // env.gain.linearRampToValueAtTime(0, endTime);

        // const src = audioCtx.createOscillator();
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

var Synth = (function () {
  function Synth(audioCtx, sync, loader) {
    _classCallCheck(this, Synth);

    this.audioCtx = audioCtx;
    this.sync = sync;
    this.loader = loader;

    this._attackTime;
    this._releaseTime;
  }

  _createClass(Synth, [{
    key: 'setAttackTime',
    value: function setAttackTime(value) {
      this._attackTime = value;
    }
  }, {
    key: 'setReleaseTime',
    value: function setReleaseTime(value) {
      this._releaseTime = value;
    }
  }, {
    key: 'play',
    value: function play(startTime, fadeInDuration, fadeOutDuration, period, offset, frequency, gain) {
      var now = audioCtx.currentTime;
      var endTime = startTime + fadeInDuration + fadeOutDuration;

      var env = audioCtx.createGain();
      env.connect(audioCtx.destination);
      env.gain.value = 0;
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(0.7, startTime + fadeInDuration);
      env.gain.linearRampToValueAtTime(0, endTime);

      // use granular engine
      var buffer = this.loader.buffers[0];
      var src = new SourceEngine(buffer, this.sync, this._attackTime, this._releaseTime, period, offset, frequency, gain);
      src.output.connect(env);
      scheduler.add(src, startTime);

      setTimeout(function () {
        scheduler.remove(src);
        src.disconnect();
        env.disconnect();
      }, (endTime - now) * 1000);
    }
  }]);

  return Synth;
})();

exports['default'] = Synth;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvcGxheWVyL1N5bnRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBQXVCLG1CQUFtQjs7Ozs7O0FBRzFDLElBQU0sUUFBUSxHQUFHLDhCQUFXLFlBQVksQ0FBQztBQUN6QyxJQUFNLEtBQUssR0FBRyw4QkFBVyxLQUFLLENBQUM7QUFDL0IsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7O0FBRTdDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDOztJQUVwQixZQUFZO1lBQVosWUFBWTs7QUFDTCxXQURQLFlBQVksQ0FDSixNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFOzBCQURoRixZQUFZOztBQUVkLCtCQUZFLFlBQVksNkNBRU47O0FBRVIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDOztBQUUzQixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNyQzs7ZUFmRyxZQUFZOztXQWlCTixzQkFBRztBQUNYLFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDMUI7OztXQUVVLHFCQUFDLElBQUks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Qyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUc3QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxVQUFNLEdBQUcsR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFDNUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hFLFNBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGVBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUU5QixnQkFBVSxDQUFDLFlBQU07QUFDZixpQkFBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixXQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDakIsV0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ2xCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFBLEdBQUksSUFBSSxDQUFDLENBQUM7S0FDNUI7OztTQXpDa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9wbGF5ZXIvU3ludGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4vLyBpbXBvcnQgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG5jb25zdCBhdWRpb0N0eCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgYXVkaW8gPSBzb3VuZHdvcmtzLmF1ZGlvO1xuY29uc3Qgc2NoZWR1bGVyID0gYXVkaW8uZ2V0U2ltcGxlU2NoZWR1bGVyKCk7XG5cbnNjaGVkdWxlci5wZXJpb2QgPSAwLjE7XG5zY2hlZHVsZXIubG9va2FoZWFkID0gMC4yO1xuXG5jbGFzcyBTb3VyY2VFbmdpbmUgZXh0ZW5kcyBhdWRpby5UaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IoYnVmZmVyLCBzeW5jLCBhdHRhY2tUaW1lLCByZWxlYXNlVGltZSwgcGVyaW9kLCBvZmZzZXQsIGZyZXF1ZW5jeSwgZ2Fpbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMucGVyaW9kID0gcGVyaW9kO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIHRoaXMuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xuICAgIHRoaXMuZ2FpbiA9IGdhaW47XG4gICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG5cbiAgICB0aGlzLmF0dGFjayA9IGF0dGFja1RpbWU7XG4gICAgdGhpcy5yZWxlYXNlID0gcmVsZWFzZVRpbWU7XG5cbiAgICB0aGlzLm91dHB1dCA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5vdXRwdXQuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgYWR2YW5jZVRpbWUodGltZSkge1xuICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRpbWUpO1xuICAgIGNvbnN0IHRvSW50UmF0aW8gPSBNYXRoLnBvdygxMCwgc3luY1RpbWUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzFdLmxlbmd0aCk7XG4gICAgY29uc3QgaW50U3luY1RpbWUgPSBzeW5jVGltZSAqIHRvSW50UmF0aW87XG4gICAgY29uc3QgaW50UGVyaW9kID0gdGhpcy5wZXJpb2QgKiB0b0ludFJhdGlvO1xuICAgIGNvbnN0IG1vZHVsbyA9IGludFN5bmNUaW1lICUgaW50UGVyaW9kO1xuICAgIGNvbnN0IGdyaWRTeW5jVGltZSA9IChpbnRTeW5jVGltZSAtIG1vZHVsbykgLyB0b0ludFJhdGlvO1xuXG4gICAgbGV0IHN0YXJ0VGltZSA9IHRoaXMuc3luYy5nZXRMb2NhbFRpbWUoZ3JpZFN5bmNUaW1lKSArIHRoaXMub2Zmc2V0O1xuXG4gICAgaWYgKHN0YXJ0VGltZSA+PSBhdWRpb0N0eC5jdXJyZW50VGltZSkge1xuICAgICAgLy8gY29uc3QgZW5kVGltZSA9IHN0YXJ0VGltZSArIHRoaXMucmVsZWFzZTtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5idWZmZXIubGVuZ3RoIC8gdGhpcy5idWZmZXIuc2FtcGxlUmF0ZTtcblxuICAgICAgLy8gY29uc3QgZW52ID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuICAgICAgLy8gZW52LmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgICAgLy8gZW52LmdhaW4udmFsdWUgPSAwO1xuICAgICAgLy8gZW52LmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgc3RhcnRUaW1lKTtcbiAgICAgIC8vIGVudi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZ2Fpbiwgc3RhcnRUaW1lICsgdGhpcy5hdHRhY2spO1xuICAgICAgLy8gZW52LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgZW5kVGltZSk7XG5cbiAgICAgIC8vIGNvbnN0IHNyYyA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIGNvbnN0IHNyYyA9IGF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgc3JjLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgICAgc3JjLmJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuXG4gICAgICBzcmMuc3RhcnQoc3RhcnRUaW1lKTtcbiAgICAgIHNyYy5zdG9wKHN0YXJ0VGltZSArIGR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGltZSArIHRoaXMucGVyaW9kO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bnRoIHtcbiAgY29uc3RydWN0b3IoYXVkaW9DdHgsIHN5bmMsIGxvYWRlcikge1xuICAgIHRoaXMuYXVkaW9DdHggPSBhdWRpb0N0eDtcbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMubG9hZGVyID0gbG9hZGVyO1xuXG4gICAgdGhpcy5fYXR0YWNrVGltZTtcbiAgICB0aGlzLl9yZWxlYXNlVGltZTtcbiAgfVxuXG4gIHNldEF0dGFja1RpbWUodmFsdWUpIHtcbiAgICB0aGlzLl9hdHRhY2tUaW1lID0gdmFsdWU7XG4gIH1cblxuICBzZXRSZWxlYXNlVGltZSh2YWx1ZSkge1xuICAgIHRoaXMuX3JlbGVhc2VUaW1lID0gdmFsdWU7XG4gIH1cblxuICBwbGF5KHN0YXJ0VGltZSwgZmFkZUluRHVyYXRpb24sIGZhZGVPdXREdXJhdGlvbiwgcGVyaW9kLCBvZmZzZXQsIGZyZXF1ZW5jeSwgZ2Fpbikge1xuICAgIGNvbnN0IG5vdyA9IGF1ZGlvQ3R4LmN1cnJlbnRUaW1lO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBzdGFydFRpbWUgKyBmYWRlSW5EdXJhdGlvbiArIGZhZGVPdXREdXJhdGlvbjtcblxuICAgIGNvbnN0IGVudiA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcbiAgICBlbnYuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gICAgZW52LmdhaW4udmFsdWUgPSAwO1xuICAgIGVudi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHN0YXJ0VGltZSk7XG4gICAgZW52LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC43LCBzdGFydFRpbWUgKyBmYWRlSW5EdXJhdGlvbik7XG4gICAgZW52LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgZW5kVGltZSk7XG5cbiAgICAvLyB1c2UgZ3JhbnVsYXIgZW5naW5lXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5sb2FkZXIuYnVmZmVyc1swXTtcbiAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlRW5naW5lKGJ1ZmZlciwgdGhpcy5zeW5jLFxuICAgICAgdGhpcy5fYXR0YWNrVGltZSwgdGhpcy5fcmVsZWFzZVRpbWUsIHBlcmlvZCwgb2Zmc2V0LCBmcmVxdWVuY3ksIGdhaW4pO1xuICAgIHNyYy5vdXRwdXQuY29ubmVjdChlbnYpO1xuICAgIHNjaGVkdWxlci5hZGQoc3JjLCBzdGFydFRpbWUpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzY2hlZHVsZXIucmVtb3ZlKHNyYyk7XG4gICAgICBzcmMuZGlzY29ubmVjdCgpO1xuICAgICAgZW52LmRpc2Nvbm5lY3QoKTtcbiAgICB9LCAoZW5kVGltZSAtIG5vdykgKiAxMDAwKTtcbiAgfVxufVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=