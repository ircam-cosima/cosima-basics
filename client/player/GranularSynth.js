'use strict';

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

var GranularSynth = (function () {
  function GranularSynth(audioCtx, sync) {
    _classCallCheck(this, GranularSynth);

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

  _createClass(GranularSynth, [{
    key: 'play',
    value: function play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex) {
      if (this.gain === 0) {
        return;
      }

      var sync = this.sync;
      var _startTime = Math.max(audioCtx.currentTime, sync.getLocalTime(startTime));
      var _endTime = _startTime + fadeInDuration + fadeOutDuration;

      var env = audioCtx.createGain();
      env.connect(audioCtx.destination);
      env.gain.value = 0;
      env.gain.setValueAtTime(0, _startTime);
      env.gain.linearRampToValueAtTime(this.gain, _startTime + fadeInDuration);
      env.gain.linearRampToValueAtTime(0, _endTime);

      var buffer = this.config.buffer;
      var engine = new audio.GranularEngine({ buffer: buffer, cyclic: true });
      engine.connect(env);
      scheduler.add(engine);

      var markerTimeOffset = this.config.markers[markerIndex];
      var resamplingValue = this.config.resampling[resamplingIndex];

      // apply current parameters
      engine.positionVar = this.positionVar;
      engine.periodAbs = this.period;
      engine.durationAbs = this.duration;
      engine.resampling = resamplingValue + this.resampling;
      engine.resamplingVar = this.resamplingVar;

      var grainSpeed = this.grainSpeed;
      // advance in the buffer
      (function advancePosition() {
        var _now = sync.getLocalTime();
        var _offsetTime = sync.getLocalTime(offsetTime);
        var position = (_now - _offsetTime) * grainSpeed + markerTimeOffset;
        engine.position = position; // modulo is done inside engine

        if (_now < _endTime) {
          requestAnimationFrame(advancePosition);
        } else {
          scheduler.remove(engine);
          engine.disconnect();
        }
      })();
    }
  }]);

  return GranularSynth;
})();

exports['default'] = GranularSynth;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvcGxheWVyL0dyYW51bGFyU3ludGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2dDQUF1QixtQkFBbUI7Ozs7QUFFMUMsSUFBTSxRQUFRLEdBQUcsOEJBQVcsWUFBWSxDQUFDO0FBQ3pDLElBQU0sS0FBSyxHQUFHLDhCQUFXLEtBQUssQ0FBQztBQUMvQixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7SUFHeEIsYUFBYTtBQUNyQixXQURRLGFBQWEsQ0FDcEIsUUFBUSxFQUFFLElBQUksRUFBRTswQkFEVCxhQUFhOztBQUU5QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVuQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7Ozs7OztlQWZrQixhQUFhOztXQXFCNUIsY0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRTtBQUN6RixVQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO0FBQUUsZUFBTztPQUFFOztBQUdoQyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsVUFBTSxRQUFRLEdBQUcsVUFBVSxHQUFHLGNBQWMsR0FBRyxlQUFlLENBQUM7O0FBRS9ELFVBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQyxTQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQyxTQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDbkIsU0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLFNBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEdBQUcsY0FBYyxDQUFDLENBQUM7QUFDekUsU0FBRyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRTlDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFVBQU0sTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbEUsWUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQixlQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QixVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzFELFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7QUFHaEUsWUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ3RDLFlBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMvQixZQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbkMsWUFBTSxDQUFDLFVBQVUsR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUN0RCxZQUFNLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7O0FBRTFDLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRW5DLEFBQUMsT0FBQSxTQUFTLGVBQWUsR0FBRztBQUMxQixZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDakMsWUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxZQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUEsR0FBSSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEUsY0FBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRTNCLFlBQUksSUFBSSxHQUFHLFFBQVEsRUFBRTtBQUNuQiwrQkFBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN4QyxNQUFNO0FBQ0wsbUJBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekIsZ0JBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNyQjtPQUNGLENBQUEsRUFBRSxDQUFFO0tBQ047OztTQWxFa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9wbGF5ZXIvR3JhbnVsYXJTeW50aC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcblxuY29uc3QgYXVkaW9DdHggPSBzb3VuZHdvcmtzLmF1ZGlvQ29udGV4dDtcbmNvbnN0IGF1ZGlvID0gc291bmR3b3Jrcy5hdWRpbztcbmNvbnN0IHNjaGVkdWxlciA9IGF1ZGlvLmdldFNpbXBsZVNjaGVkdWxlcigpO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYW51bGFyU3ludGgge1xuICBjb25zdHJ1Y3RvcihhdWRpb0N0eCwgc3luYykge1xuICAgIHRoaXMuYXVkaW9DdHggPSBhdWRpb0N0eDtcbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuXG4gICAgdGhpcy5wb3NpdGlvblZhciA9IG51bGw7XG4gICAgdGhpcy5wZXJpb2QgPSBudWxsO1xuICAgIHRoaXMuZHVyYXRpb24gPSBudWxsO1xuICAgIHRoaXMucmVzYW1wbGluZyA9IG51bGw7XG4gICAgdGhpcy5yZXNhbXBsaW5nVmFyID0gbnVsbDtcbiAgICB0aGlzLmdyYWluU3BlZWQgPSBudWxsO1xuXG4gICAgdGhpcy5jb25maWcgPSBudWxsO1xuXG4gICAgdGhpcy5nYWluID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRUaW1lIC0gW3N5bmNUaW1lXVxuICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gW3N5bmNUaW1lXSB0aW1lIG9mIHRoZSBzb3VyY2UgZXZlbnQgKHRyaWdnZXIgdmVydGV4KS5cbiAgICovXG4gIHBsYXkoc3RhcnRUaW1lLCBvZmZzZXRUaW1lLCBmYWRlSW5EdXJhdGlvbiwgZmFkZU91dER1cmF0aW9uLCBtYXJrZXJJbmRleCwgcmVzYW1wbGluZ0luZGV4KSB7XG4gICAgaWYgKHRoaXMuZ2FpbiA9PT0gMCkgeyByZXR1cm47IH1cblxuXG4gICAgY29uc3Qgc3luYyA9IHRoaXMuc3luYztcbiAgICBjb25zdCBfc3RhcnRUaW1lID0gTWF0aC5tYXgoYXVkaW9DdHguY3VycmVudFRpbWUsIHN5bmMuZ2V0TG9jYWxUaW1lKHN0YXJ0VGltZSkpO1xuICAgIGNvbnN0IF9lbmRUaW1lID0gX3N0YXJ0VGltZSArIGZhZGVJbkR1cmF0aW9uICsgZmFkZU91dER1cmF0aW9uO1xuXG4gICAgY29uc3QgZW52ID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuICAgIGVudi5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbiAgICBlbnYuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgZW52LmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgX3N0YXJ0VGltZSk7XG4gICAgZW52LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5nYWluLCBfc3RhcnRUaW1lICsgZmFkZUluRHVyYXRpb24pO1xuICAgIGVudi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIF9lbmRUaW1lKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuY29uZmlnLmJ1ZmZlcjtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgYXVkaW8uR3JhbnVsYXJFbmdpbmUoeyBidWZmZXIsIGN5Y2xpYzogdHJ1ZSB9KTtcbiAgICBlbmdpbmUuY29ubmVjdChlbnYpO1xuICAgIHNjaGVkdWxlci5hZGQoZW5naW5lKTtcblxuICAgIGNvbnN0IG1hcmtlclRpbWVPZmZzZXQgPSB0aGlzLmNvbmZpZy5tYXJrZXJzW21hcmtlckluZGV4XTtcbiAgICBjb25zdCByZXNhbXBsaW5nVmFsdWUgPSB0aGlzLmNvbmZpZy5yZXNhbXBsaW5nW3Jlc2FtcGxpbmdJbmRleF07XG5cbiAgICAvLyBhcHBseSBjdXJyZW50IHBhcmFtZXRlcnNcbiAgICBlbmdpbmUucG9zaXRpb25WYXIgPSB0aGlzLnBvc2l0aW9uVmFyO1xuICAgIGVuZ2luZS5wZXJpb2RBYnMgPSB0aGlzLnBlcmlvZDtcbiAgICBlbmdpbmUuZHVyYXRpb25BYnMgPSB0aGlzLmR1cmF0aW9uO1xuICAgIGVuZ2luZS5yZXNhbXBsaW5nID0gcmVzYW1wbGluZ1ZhbHVlICsgdGhpcy5yZXNhbXBsaW5nO1xuICAgIGVuZ2luZS5yZXNhbXBsaW5nVmFyID0gdGhpcy5yZXNhbXBsaW5nVmFyO1xuXG4gICAgY29uc3QgZ3JhaW5TcGVlZCA9IHRoaXMuZ3JhaW5TcGVlZDtcbiAgICAvLyBhZHZhbmNlIGluIHRoZSBidWZmZXJcbiAgICAoZnVuY3Rpb24gYWR2YW5jZVBvc2l0aW9uKCkge1xuICAgICAgY29uc3QgX25vdyA9IHN5bmMuZ2V0TG9jYWxUaW1lKCk7XG4gICAgICBjb25zdCBfb2Zmc2V0VGltZSA9IHN5bmMuZ2V0TG9jYWxUaW1lKG9mZnNldFRpbWUpO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSAoX25vdyAtIF9vZmZzZXRUaW1lKSAqIGdyYWluU3BlZWQgKyBtYXJrZXJUaW1lT2Zmc2V0O1xuICAgICAgZW5naW5lLnBvc2l0aW9uID0gcG9zaXRpb247IC8vIG1vZHVsbyBpcyBkb25lIGluc2lkZSBlbmdpbmVcblxuICAgICAgaWYgKF9ub3cgPCBfZW5kVGltZSkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYWR2YW5jZVBvc2l0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjaGVkdWxlci5yZW1vdmUoZW5naW5lKTtcbiAgICAgICAgZW5naW5lLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH1cbiAgICB9KCkpO1xuICB9XG59Il19