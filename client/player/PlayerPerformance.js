'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _soundworksClient = require('soundworks/client');

var _soundworksClient2 = _interopRequireDefault(_soundworksClient);

var _sharedGetColor = require('../shared/getColor');

var _sharedGetColor2 = _interopRequireDefault(_sharedGetColor);

var _sharedActiveVertex = require('../shared/ActiveVertex');

var _sharedActiveVertex2 = _interopRequireDefault(_sharedActiveVertex);

var _sharedBoid = require('../shared/Boid');

var _sharedBoid2 = _interopRequireDefault(_sharedBoid);

var _PlayerRenderer = require('./PlayerRenderer');

var _PlayerRenderer2 = _interopRequireDefault(_PlayerRenderer);

var _PeriodicSynth = require('./PeriodicSynth');

var _PeriodicSynth2 = _interopRequireDefault(_PeriodicSynth);

var _GranularSynth = require('./GranularSynth');

var _GranularSynth2 = _interopRequireDefault(_GranularSynth);

var audioCtx = _soundworksClient2['default'].audioContext;
var client = _soundworksClient2['default'].client;
var ClientPerformance = _soundworksClient2['default'].ClientPerformance;
var motionInput = _soundworksClient2['default'].motionInput;
var Renderer = _soundworksClient2['default'].display.Renderer;
var CanvasView = _soundworksClient2['default'].display.CanvasView;

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"><p class="big"></p></div>\n    <div class="section-center flex-center"></div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var PlayerPerformance = (function (_ClientPerformance) {
  _inherits(PlayerPerformance, _ClientPerformance);

  function PlayerPerformance(audioConfig, sync, control, loader) {
    var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

    _classCallCheck(this, PlayerPerformance);

    _get(Object.getPrototypeOf(PlayerPerformance.prototype), 'constructor', this).call(this, options);

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

  _createClass(PlayerPerformance, [{
    key: 'init',
    value: function init() {
      this.template = template;
      // this.content = {};
      this.viewCtor = CanvasView;
      this.events = { 'touchstart': this._onTouchStart };
      this.view = this.createView();
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(PlayerPerformance.prototype), 'start', this).call(this);

      // extend config with buffers
      _Object$keys(this._audioConfig).forEach(function (key, index) {
        _this._audioConfig[key].buffer = _this._loader.buffers[index];
      });

      // initialize synth and view
      this.periodicSynth = new _PeriodicSynth2['default'](audioCtx, this._sync);
      this.granularSynth = new _GranularSynth2['default'](audioCtx, this._sync);

      var color = (0, _sharedGetColor2['default'])(client.uid);
      this.renderer = new _PlayerRenderer2['default'](color);
      this.view.addRenderer(this.renderer);

      this.view.setPreRender(function (ctx, dt) {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
      });

      // listen for controls
      this._control.addUnitListener('velocityMean', function (value) {
        _this._velocityMean = value;
      });

      this._control.addUnitListener('velocitySpread', function (value) {
        _this._velocitySpread = value;
      });

      // mix
      this._control.addUnitListener('gainPeriodic', function (value) {
        _this.periodicSynth.gain = value;
      });

      this._control.addUnitListener('gainGranular', function (value) {
        _this.granularSynth.gain = value;
      });

      // periodic params
      this._control.addUnitListener('periodicPeriod', function (value) {
        _this._periodicSynthPeriod = value;
      });

      // granular params
      this._control.addUnitListener('audioConfig', function (value) {
        value = value.toLowerCase();
        var config = _this._audioConfig[value];
        _this._currentAudioConfig = config;
        _this.granularSynth.config = config;
      });

      this._control.addUnitListener('granularPositionVar', function (value) {
        _this.granularSynth.positionVar = value;
      });

      this._control.addUnitListener('granularPeriod', function (value) {
        _this.granularSynth.period = value;
      });

      this._control.addUnitListener('granularDuration', function (value) {
        _this.granularSynth.duration = value;
      });

      this._control.addUnitListener('granularResampling', function (value) {
        _this.granularSynth.resampling = value;
      });

      this._control.addUnitListener('granularResamplingVar', function (value) {
        _this.granularSynth.resamplingVar = value;
      });

      this._control.addUnitListener('granularSpeed', function (value) {
        _this.granularSynth.grainSpeed = value;
      });

      // reload
      this._control.addUnitListener('reload', function () {
        window.location.reload(true);
      });

      // init communications
      this.receive('subgraph', function (data) {
        _this._renderGraph(data);
      });

      this.receive('trigger', function (data) {
        _this._scheduleSynth(data, false);
        _this._scheduleRendering(data, false);
      });
    }
  }, {
    key: '_renderGraph',
    value: function _renderGraph(data) {
      this.data = data;
      // define ratio for visualisation
      var maxDistance = -Infinity;
      data.adjacentVertices.forEach(function (vertex) {
        if (vertex.distance > maxDistance) {
          maxDistance = vertex.distance;
        }
      });

      var width = this.renderer.canvasWidth;
      var height = this.renderer.canvasHeight;
      var ratio = (Math.min(width, height) / 2 - 20) / maxDistance;

      this.renderer.setGraph(data, ratio);
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      var triggerTime = this._sync.getSyncTime();
      var velocity = this._velocityMean + (Math.random() * this._velocitySpread - this._velocitySpread / 2);

      var period = this._periodicSynthPeriod;
      // define offset according to period and syncTime
      var toIntRatio = Math.pow(10, triggerTime.toString().split('.')[1].length);
      var _period = period * toIntRatio;
      var _syncTime = triggerTime * toIntRatio;
      var _modulo = _syncTime % _period;
      var offsetPeriod = _modulo / toIntRatio;

      var audioConfig = this._currentAudioConfig;
      var markerIndex = Math.floor(Math.random() * audioConfig.markers.length);
      var resamplingIndex = Math.floor(Math.random() * audioConfig.resampling.length);

      // send to server
      this.send('trigger', triggerTime, velocity, period, offsetPeriod, markerIndex, resamplingIndex);
      // trigger self
      var data = { triggerTime: triggerTime, velocity: velocity, period: period, offsetPeriod: offsetPeriod, markerIndex: markerIndex, resamplingIndex: resamplingIndex };
      this._scheduleSynth(data, true);
      this._scheduleRendering(data, true);
    }

    // @todo - should be encapsulated in `Score` objects
  }, {
    key: '_scheduleSynth',
    value: function _scheduleSynth(data, isSource) {
      var _this2 = this;

      var fadeInDuration = 0;
      var fadeOutDuration = 0.1; // can't be zero, breaks automations
      var triggerTime = data.triggerTime;
      var offsetTime = data.offsetTime;
      var velocity = data.velocity;
      var period = data.period;
      var offsetPeriod = data.offsetPeriod;
      var markerIndex = data.markerIndex;
      var resamplingIndex = data.resamplingIndex;

      if (isSource) {
        (function () {
          var startTime = triggerTime;
          var offsetTime = triggerTime; // start at the beginning of the file

          _this2.data.adjacentVertices.forEach(function (next) {
            fadeOutDuration = next.distance / data.velocity;

            _this2.granularSynth.play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex);
            _this2.periodicSynth.play(startTime, fadeInDuration, fadeOutDuration, period, offsetPeriod);
          });
        })();
      } else if (!isSource && data.next && data.next.length) {
        (function () {
          var startTime = data.prev.triggerTime;
          var fadeInDuration = triggerTime - startTime;

          data.next.forEach(function (next) {
            fadeOutDuration = next.triggerTime - triggerTime;

            _this2.granularSynth.play(startTime, offsetTime, fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex);
            _this2.periodicSynth.play(startTime, fadeInDuration, fadeOutDuration, period, offsetPeriod);
          });
        })();
      } else {
        // is leaf
        var startTime = data.prev.triggerTime;
        var _fadeInDuration = triggerTime - startTime;

        this.granularSynth.play(startTime, offsetTime, _fadeInDuration, fadeOutDuration, markerIndex, resamplingIndex);
        this.periodicSynth.play(startTime, _fadeInDuration, fadeOutDuration, period, offsetPeriod);
      }
    }
  }, {
    key: '_scheduleRendering',
    value: function _scheduleRendering(data, isSource) {
      var _this3 = this;

      var now = this._sync.getLocalTime();
      // renderer should have a scheduler

      if (isSource) {
        (function () {
          var x = 0;
          var y = 0;
          var color = (0, _sharedGetColor2['default'])(client.uid);
          // highlight node
          var activeVertex = new _sharedActiveVertex2['default'](x, y, color);
          _this3.renderer.addActiveVertex(activeVertex);

          // launch boids to adjacent nodes
          _this3.data.adjacentVertices.forEach(function (vertex) {
            var origin = { x: x, y: y };
            var distance = vertex.distance;
            var velocity = data.velocity;
            var boid = new _sharedBoid2['default'](origin, vertex, distance, velocity, color);
            _this3.renderer.addBoid(boid);

            // highlight target node
            setTimeout(function () {
              var activeVertex = new _sharedActiveVertex2['default'](vertex.x, vertex.y, color);
              _this3.renderer.addActiveVertex(activeVertex);
            }, vertex.distance / data.velocity * 1000);
          });
        })();
      } else {
        (function () {
          var prevTriggerTime = _this3._sync.getLocalTime(data.prev.triggerTime);
          var color = (0, _sharedGetColor2['default'])(data.sourceId);
          var x = data.x;
          var y = data.y;

          setTimeout(function () {
            // highlight prev node
            var prevX = data.prev.x - x;
            var prevY = data.prev.y - y;
            var activeVertex = new _sharedActiveVertex2['default'](prevX, prevY, color);
            _this3.renderer.addActiveVertex(activeVertex);

            // launch boids to self
            var dist = data.prev.distance;
            var dt = data.triggerTime - data.prev.triggerTime;
            var velocity = dist / dt;
            var origin = { x: prevX, y: prevY };
            var target = { x: 0, y: 0 };
            var boid = new _sharedBoid2['default'](origin, target, dist, velocity, color);
            _this3.renderer.addBoid(boid);

            setTimeout(function () {
              // highlight self
              var activeVertex = new _sharedActiveVertex2['default'](0, 0, color);
              _this3.renderer.addActiveVertex(activeVertex);

              // laucnh boids to next vertices
              if (data.next && data.next.length) {
                data.next.forEach(function (next) {
                  var nextX = next.x - x;
                  var nextY = next.y - y;
                  var dist = next.distance;
                  var dt = next.triggerTime - data.triggerTime;
                  var velocity = dist / dt;
                  var origin = { x: 0, y: 0 };
                  var target = { x: nextX, y: nextY };

                  var boid = new _sharedBoid2['default'](origin, target, dist, velocity, color);
                  _this3.renderer.addBoid(boid);

                  // highlight next
                  setTimeout(function () {
                    var activeVertex = new _sharedActiveVertex2['default'](nextX, nextY, color);
                    _this3.renderer.addActiveVertex(activeVertex);
                  }, dt * 1000);
                });
              }
            }, dt * 1000);
          }, (prevTriggerTime - now) * 1000);
        })();
      }
    }
  }]);

  return PlayerPerformance;
})(ClientPerformance);

exports['default'] = PlayerPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvcGxheWVyL1BsYXllclBlcmZvcm1hbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQ0FBdUIsbUJBQW1COzs7OzhCQUNyQixvQkFBb0I7Ozs7a0NBQ2hCLHdCQUF3Qjs7OzswQkFDaEMsZ0JBQWdCOzs7OzhCQUNOLGtCQUFrQjs7Ozs2QkFDbkIsaUJBQWlCOzs7OzZCQUNqQixpQkFBaUI7Ozs7QUFFM0MsSUFBTSxRQUFRLEdBQUcsOEJBQVcsWUFBWSxDQUFDO0FBQ3pDLElBQU0sTUFBTSxHQUFHLDhCQUFXLE1BQU0sQ0FBQztBQUNqQyxJQUFNLGlCQUFpQixHQUFHLDhCQUFXLGlCQUFpQixDQUFDO0FBQ3ZELElBQU0sV0FBVyxHQUFHLDhCQUFXLFdBQVcsQ0FBQztBQUMzQyxJQUFNLFFBQVEsR0FBRyw4QkFBVyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzdDLElBQU0sVUFBVSxHQUFHLDhCQUFXLE9BQU8sQ0FBQyxVQUFVLENBQUM7O0FBRWpELElBQU0sUUFBUSxpUUFPYixDQUFDOztJQUdtQixpQkFBaUI7WUFBakIsaUJBQWlCOztBQUN6QixXQURRLGlCQUFpQixDQUN4QixXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEekMsaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7QUFDaEMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxv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QUFHLElBQUksQ0FBQyxDQUFDO1dBQ2YsRUFBRSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUEsR0FBSSxJQUFJLENBQUMsQ0FBQzs7T0FDcEM7S0FDRjs7O1NBdlJrQixpQkFBaUI7R0FBUyxpQkFBaUI7O3FCQUEzQyxpQkFBaUIiLCJmaWxlIjoic3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyUGVyZm9ybWFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgZ2V0Q29sb3IgZnJvbSAnLi4vc2hhcmVkL2dldENvbG9yJztcbmltcG9ydCBBY3RpdmVWZXJ0ZXggZnJvbSAnLi4vc2hhcmVkL0FjdGl2ZVZlcnRleCc7XG5pbXBvcnQgQm9pZCBmcm9tICcuLi9zaGFyZWQvQm9pZCc7XG5pbXBvcnQgUGxheWVyUmVuZGVyZXIgZnJvbSAnLi9QbGF5ZXJSZW5kZXJlcic7XG5pbXBvcnQgUGVyaW9kaWNTeW50aCBmcm9tICcuL1BlcmlvZGljU3ludGgnO1xuaW1wb3J0IEdyYW51bGFyU3ludGggZnJvbSAnLi9HcmFudWxhclN5bnRoJztcblxuY29uc3QgYXVkaW9DdHggPSBzb3VuZHdvcmtzLmF1ZGlvQ29udGV4dDtcbmNvbnN0IGNsaWVudCA9IHNvdW5kd29ya3MuY2xpZW50O1xuY29uc3QgQ2xpZW50UGVyZm9ybWFuY2UgPSBzb3VuZHdvcmtzLkNsaWVudFBlcmZvcm1hbmNlO1xuY29uc3QgbW90aW9uSW5wdXQgPSBzb3VuZHdvcmtzLm1vdGlvbklucHV0O1xuY29uc3QgUmVuZGVyZXIgPSBzb3VuZHdvcmtzLmRpc3BsYXkuUmVuZGVyZXI7XG5jb25zdCBDYW52YXNWaWV3ID0gc291bmR3b3Jrcy5kaXNwbGF5LkNhbnZhc1ZpZXc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjxwIGNsYXNzPVwiYmlnXCI+PC9wPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyUGVyZm9ybWFuY2UgZXh0ZW5kcyBDbGllbnRQZXJmb3JtYW5jZSB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ29uZmlnLCBzeW5jLCBjb250cm9sLCBsb2FkZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fYXVkaW9Db25maWcgPSBhdWRpb0NvbmZpZztcbiAgICB0aGlzLl9zeW5jID0gc3luYztcbiAgICB0aGlzLl9jb250cm9sID0gY29udHJvbDtcbiAgICB0aGlzLl9sb2FkZXIgPSBsb2FkZXI7XG5cbiAgICB0aGlzLl92ZWxvY2l0eU1lYW4gPSBudWxsO1xuICAgIHRoaXMuX3ZlbG9jaXR5U3ByZWFkID0gbnVsbDtcbiAgICB0aGlzLl9wZXJpb2RpY1N5bnRoUGVyaW9kID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50QXVkaW9Db25maWcgPSBudWxsO1xuXG4gICAgdGhpcy5fb25Ub3VjaFN0YXJ0ID0gdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIC8vIHRoaXMuY29udGVudCA9IHt9O1xuICAgIHRoaXMudmlld0N0b3IgPSBDYW52YXNWaWV3O1xuICAgIHRoaXMuZXZlbnRzID0geyAndG91Y2hzdGFydCc6IHRoaXMuX29uVG91Y2hTdGFydCB9O1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIC8vIGV4dGVuZCBjb25maWcgd2l0aCBidWZmZXJzXG4gICAgT2JqZWN0LmtleXModGhpcy5fYXVkaW9Db25maWcpLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMuX2F1ZGlvQ29uZmlnW2tleV0uYnVmZmVyID0gdGhpcy5fbG9hZGVyLmJ1ZmZlcnNbaW5kZXhdO1xuICAgIH0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBzeW50aCBhbmQgdmlld1xuICAgIHRoaXMucGVyaW9kaWNTeW50aCA9IG5ldyBQZXJpb2RpY1N5bnRoKGF1ZGlvQ3R4LCB0aGlzLl9zeW5jKTtcbiAgICB0aGlzLmdyYW51bGFyU3ludGggPSBuZXcgR3JhbnVsYXJTeW50aChhdWRpb0N0eCwgdGhpcy5fc3luYyk7XG5cbiAgICBjb25zdCBjb2xvciA9IGdldENvbG9yKGNsaWVudC51aWQpO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUGxheWVyUmVuZGVyZXIoY29sb3IpO1xuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoZnVuY3Rpb24oY3R4LCBkdCkge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHgud2lkdGgsIGN0eC5oZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgLy8gbGlzdGVuIGZvciBjb250cm9sc1xuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCd2ZWxvY2l0eU1lYW4nLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuX3ZlbG9jaXR5TWVhbiA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY29udHJvbC5hZGRVbml0TGlzdGVuZXIoJ3ZlbG9jaXR5U3ByZWFkJywgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLl92ZWxvY2l0eVNwcmVhZCA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgLy8gbWl4XG4gICAgdGhpcy5fY29udHJvbC5hZGRVbml0TGlzdGVuZXIoJ2dhaW5QZXJpb2RpYycsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5wZXJpb2RpY1N5bnRoLmdhaW4gPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCdnYWluR3JhbnVsYXInLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuZ3JhbnVsYXJTeW50aC5nYWluID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICAvLyBwZXJpb2RpYyBwYXJhbXNcbiAgICB0aGlzLl9jb250cm9sLmFkZFVuaXRMaXN0ZW5lcigncGVyaW9kaWNQZXJpb2QnLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuX3BlcmlvZGljU3ludGhQZXJpb2QgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIC8vIGdyYW51bGFyIHBhcmFtc1xuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCdhdWRpb0NvbmZpZycsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fYXVkaW9Db25maWdbdmFsdWVdO1xuICAgICAgdGhpcy5fY3VycmVudEF1ZGlvQ29uZmlnID0gY29uZmlnO1xuICAgICAgdGhpcy5ncmFudWxhclN5bnRoLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCdncmFudWxhclBvc2l0aW9uVmFyJywgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmdyYW51bGFyU3ludGgucG9zaXRpb25WYXIgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCdncmFudWxhclBlcmlvZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5ncmFudWxhclN5bnRoLnBlcmlvZCA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY29udHJvbC5hZGRVbml0TGlzdGVuZXIoJ2dyYW51bGFyRHVyYXRpb24nLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuZ3JhbnVsYXJTeW50aC5kdXJhdGlvbiA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY29udHJvbC5hZGRVbml0TGlzdGVuZXIoJ2dyYW51bGFyUmVzYW1wbGluZycsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5ncmFudWxhclN5bnRoLnJlc2FtcGxpbmcgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCdncmFudWxhclJlc2FtcGxpbmdWYXInLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuZ3JhbnVsYXJTeW50aC5yZXNhbXBsaW5nVmFyID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb250cm9sLmFkZFVuaXRMaXN0ZW5lcignZ3JhbnVsYXJTcGVlZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5ncmFudWxhclN5bnRoLmdyYWluU3BlZWQgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIC8vIHJlbG9hZFxuICAgIHRoaXMuX2NvbnRyb2wuYWRkVW5pdExpc3RlbmVyKCdyZWxvYWQnLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICAgIH0pO1xuXG4gICAgLy8gaW5pdCBjb21tdW5pY2F0aW9uc1xuICAgIHRoaXMucmVjZWl2ZSgnc3ViZ3JhcGgnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5fcmVuZGVyR3JhcGgoZGF0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ3RyaWdnZXInLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5fc2NoZWR1bGVTeW50aChkYXRhLCBmYWxzZSk7XG4gICAgICB0aGlzLl9zY2hlZHVsZVJlbmRlcmluZyhkYXRhLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVuZGVyR3JhcGgoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgLy8gZGVmaW5lIHJhdGlvIGZvciB2aXN1YWxpc2F0aW9uXG4gICAgbGV0IG1heERpc3RhbmNlID0gLUluZmluaXR5O1xuICAgIGRhdGEuYWRqYWNlbnRWZXJ0aWNlcy5mb3JFYWNoKCh2ZXJ0ZXgpID0+IHtcbiAgICAgIGlmICh2ZXJ0ZXguZGlzdGFuY2UgPiBtYXhEaXN0YW5jZSkge1xuICAgICAgICBtYXhEaXN0YW5jZSA9IHZlcnRleC5kaXN0YW5jZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5yZW5kZXJlci5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnJlbmRlcmVyLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCByYXRpbyA9IChNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDIgLSAyMCkgLyBtYXhEaXN0YW5jZTtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0R3JhcGgoZGF0YSwgcmF0aW8pO1xuICB9XG5cbiAgX29uVG91Y2hTdGFydChlKSB7XG4gICAgY29uc3QgdHJpZ2dlclRpbWUgPSB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKCk7XG4gICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLl92ZWxvY2l0eU1lYW4gKyAoTWF0aC5yYW5kb20oKSAqIHRoaXMuX3ZlbG9jaXR5U3ByZWFkIC0gdGhpcy5fdmVsb2NpdHlTcHJlYWQgLyAyKTtcblxuICAgIGNvbnN0IHBlcmlvZCA9IHRoaXMuX3BlcmlvZGljU3ludGhQZXJpb2Q7XG4gICAgLy8gZGVmaW5lIG9mZnNldCBhY2NvcmRpbmcgdG8gcGVyaW9kIGFuZCBzeW5jVGltZVxuICAgIGNvbnN0IHRvSW50UmF0aW8gPSBNYXRoLnBvdygxMCwgdHJpZ2dlclRpbWUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzFdLmxlbmd0aCk7XG4gICAgY29uc3QgX3BlcmlvZCA9IHBlcmlvZCAqIHRvSW50UmF0aW87XG4gICAgY29uc3QgX3N5bmNUaW1lID0gdHJpZ2dlclRpbWUgKiB0b0ludFJhdGlvO1xuICAgIGNvbnN0IF9tb2R1bG8gPSBfc3luY1RpbWUgJSBfcGVyaW9kO1xuICAgIGNvbnN0IG9mZnNldFBlcmlvZCA9IF9tb2R1bG8gLyB0b0ludFJhdGlvO1xuXG4gICAgY29uc3QgYXVkaW9Db25maWcgPSB0aGlzLl9jdXJyZW50QXVkaW9Db25maWc7XG4gICAgY29uc3QgbWFya2VySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhdWRpb0NvbmZpZy5tYXJrZXJzLmxlbmd0aCk7XG4gICAgY29uc3QgcmVzYW1wbGluZ0luZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXVkaW9Db25maWcucmVzYW1wbGluZy5sZW5ndGgpO1xuXG4gICAgLy8gc2VuZCB0byBzZXJ2ZXJcbiAgICB0aGlzLnNlbmQoJ3RyaWdnZXInLCB0cmlnZ2VyVGltZSwgdmVsb2NpdHksIHBlcmlvZCwgb2Zmc2V0UGVyaW9kLCBtYXJrZXJJbmRleCwgcmVzYW1wbGluZ0luZGV4KTtcbiAgICAvLyB0cmlnZ2VyIHNlbGZcbiAgICBjb25zdCBkYXRhID0geyB0cmlnZ2VyVGltZSwgdmVsb2NpdHksIHBlcmlvZCwgb2Zmc2V0UGVyaW9kLCBtYXJrZXJJbmRleCwgcmVzYW1wbGluZ0luZGV4IH07XG4gICAgdGhpcy5fc2NoZWR1bGVTeW50aChkYXRhLCB0cnVlKTtcbiAgICB0aGlzLl9zY2hlZHVsZVJlbmRlcmluZyhkYXRhLCB0cnVlKTtcbiAgfVxuXG4gIC8vIEB0b2RvIC0gc2hvdWxkIGJlIGVuY2Fwc3VsYXRlZCBpbiBgU2NvcmVgIG9iamVjdHNcbiAgX3NjaGVkdWxlU3ludGgoZGF0YSwgaXNTb3VyY2UpIHtcbiAgICBsZXQgZmFkZUluRHVyYXRpb24gPSAwO1xuICAgIGxldCBmYWRlT3V0RHVyYXRpb24gPSAwLjE7IC8vIGNhbid0IGJlIHplcm8sIGJyZWFrcyBhdXRvbWF0aW9uc1xuICAgIGxldCB7XG4gICAgICB0cmlnZ2VyVGltZSxcbiAgICAgIG9mZnNldFRpbWUsXG4gICAgICB2ZWxvY2l0eSxcbiAgICAgIHBlcmlvZCxcbiAgICAgIG9mZnNldFBlcmlvZCxcbiAgICAgIG1hcmtlckluZGV4LFxuICAgICAgcmVzYW1wbGluZ0luZGV4XG4gICAgfSA9IGRhdGE7XG5cbiAgICBpZiAoaXNTb3VyY2UpIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRyaWdnZXJUaW1lO1xuICAgICAgY29uc3Qgb2Zmc2V0VGltZSA9IHRyaWdnZXJUaW1lOyAvLyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlXG5cbiAgICAgIHRoaXMuZGF0YS5hZGphY2VudFZlcnRpY2VzLmZvckVhY2goKG5leHQpID0+IHtcbiAgICAgICAgZmFkZU91dER1cmF0aW9uID0gbmV4dC5kaXN0YW5jZSAvIGRhdGEudmVsb2NpdHk7XG5cbiAgICAgICAgdGhpcy5ncmFudWxhclN5bnRoLnBsYXkoc3RhcnRUaW1lLCBvZmZzZXRUaW1lLCBmYWRlSW5EdXJhdGlvbiwgZmFkZU91dER1cmF0aW9uLCBtYXJrZXJJbmRleCwgcmVzYW1wbGluZ0luZGV4KTtcbiAgICAgICAgdGhpcy5wZXJpb2RpY1N5bnRoLnBsYXkoc3RhcnRUaW1lLCBmYWRlSW5EdXJhdGlvbiwgZmFkZU91dER1cmF0aW9uLCBwZXJpb2QsIG9mZnNldFBlcmlvZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFpc1NvdXJjZSAmJiBkYXRhLm5leHQgJiYgZGF0YS5uZXh0Lmxlbmd0aCkge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gZGF0YS5wcmV2LnRyaWdnZXJUaW1lO1xuICAgICAgY29uc3QgZmFkZUluRHVyYXRpb24gPSB0cmlnZ2VyVGltZSAtIHN0YXJ0VGltZTtcblxuICAgICAgZGF0YS5uZXh0LmZvckVhY2goKG5leHQpID0+IHtcbiAgICAgICAgZmFkZU91dER1cmF0aW9uID0gbmV4dC50cmlnZ2VyVGltZSAtIHRyaWdnZXJUaW1lO1xuXG4gICAgICAgIHRoaXMuZ3JhbnVsYXJTeW50aC5wbGF5KHN0YXJ0VGltZSwgb2Zmc2V0VGltZSwgZmFkZUluRHVyYXRpb24sIGZhZGVPdXREdXJhdGlvbiwgbWFya2VySW5kZXgsIHJlc2FtcGxpbmdJbmRleCk7XG4gICAgICAgIHRoaXMucGVyaW9kaWNTeW50aC5wbGF5KHN0YXJ0VGltZSwgZmFkZUluRHVyYXRpb24sIGZhZGVPdXREdXJhdGlvbiwgcGVyaW9kLCBvZmZzZXRQZXJpb2QpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHsgLy8gaXMgbGVhZlxuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gZGF0YS5wcmV2LnRyaWdnZXJUaW1lO1xuICAgICAgY29uc3QgZmFkZUluRHVyYXRpb24gPSB0cmlnZ2VyVGltZSAtIHN0YXJ0VGltZTtcblxuICAgICAgdGhpcy5ncmFudWxhclN5bnRoLnBsYXkoc3RhcnRUaW1lLCBvZmZzZXRUaW1lLCBmYWRlSW5EdXJhdGlvbiwgZmFkZU91dER1cmF0aW9uLCBtYXJrZXJJbmRleCwgcmVzYW1wbGluZ0luZGV4KTtcbiAgICAgIHRoaXMucGVyaW9kaWNTeW50aC5wbGF5KHN0YXJ0VGltZSwgZmFkZUluRHVyYXRpb24sIGZhZGVPdXREdXJhdGlvbiwgcGVyaW9kLCBvZmZzZXRQZXJpb2QpO1xuICAgIH1cbiAgfVxuXG4gIF9zY2hlZHVsZVJlbmRlcmluZyhkYXRhLCBpc1NvdXJjZSkge1xuICAgIGNvbnN0IG5vdyA9IHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKCk7XG4gICAgLy8gcmVuZGVyZXIgc2hvdWxkIGhhdmUgYSBzY2hlZHVsZXJcblxuICAgIGlmIChpc1NvdXJjZSkge1xuICAgICAgY29uc3QgeCA9IDA7XG4gICAgICBjb25zdCB5ID0gMDtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3IoY2xpZW50LnVpZCk7XG4gICAgICAvLyBoaWdobGlnaHQgbm9kZVxuICAgICAgY29uc3QgYWN0aXZlVmVydGV4ID0gbmV3IEFjdGl2ZVZlcnRleCh4LCB5LCBjb2xvcik7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZEFjdGl2ZVZlcnRleChhY3RpdmVWZXJ0ZXgpO1xuXG4gICAgICAvLyBsYXVuY2ggYm9pZHMgdG8gYWRqYWNlbnQgbm9kZXNcbiAgICAgIHRoaXMuZGF0YS5hZGphY2VudFZlcnRpY2VzLmZvckVhY2goKHZlcnRleCkgPT4ge1xuICAgICAgICBjb25zdCBvcmlnaW4gPSB7IHgsIHkgfTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB2ZXJ0ZXguZGlzdGFuY2U7XG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gZGF0YS52ZWxvY2l0eTtcbiAgICAgICAgY29uc3QgYm9pZCA9IG5ldyBCb2lkKG9yaWdpbiwgdmVydGV4LCBkaXN0YW5jZSwgdmVsb2NpdHksIGNvbG9yKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRCb2lkKGJvaWQpO1xuXG4gICAgICAgIC8vIGhpZ2hsaWdodCB0YXJnZXQgbm9kZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVWZXJ0ZXggPSBuZXcgQWN0aXZlVmVydGV4KHZlcnRleC54LCB2ZXJ0ZXgueSwgY29sb3IpO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQWN0aXZlVmVydGV4KGFjdGl2ZVZlcnRleCk7XG4gICAgICAgIH0sIHZlcnRleC5kaXN0YW5jZSAvIGRhdGEudmVsb2NpdHkgKiAxMDAwKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmV2VHJpZ2dlclRpbWUgPSB0aGlzLl9zeW5jLmdldExvY2FsVGltZShkYXRhLnByZXYudHJpZ2dlclRpbWUpO1xuICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvcihkYXRhLnNvdXJjZUlkKTtcbiAgICAgIGNvbnN0IHggPSBkYXRhLng7XG4gICAgICBjb25zdCB5ID0gZGF0YS55O1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gaGlnaGxpZ2h0IHByZXYgbm9kZVxuICAgICAgICBjb25zdCBwcmV2WCA9IGRhdGEucHJldi54IC0geDtcbiAgICAgICAgY29uc3QgcHJldlkgPSBkYXRhLnByZXYueSAtIHk7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVZlcnRleCA9IG5ldyBBY3RpdmVWZXJ0ZXgocHJldlgsIHByZXZZLCBjb2xvcik7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQWN0aXZlVmVydGV4KGFjdGl2ZVZlcnRleCk7XG5cbiAgICAgICAgLy8gbGF1bmNoIGJvaWRzIHRvIHNlbGZcbiAgICAgICAgY29uc3QgZGlzdCA9IGRhdGEucHJldi5kaXN0YW5jZTtcbiAgICAgICAgY29uc3QgZHQgPSBkYXRhLnRyaWdnZXJUaW1lIC0gZGF0YS5wcmV2LnRyaWdnZXJUaW1lO1xuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IGRpc3QgLyBkdDtcbiAgICAgICAgY29uc3Qgb3JpZ2luID0geyB4OiBwcmV2WCwgeTogcHJldlkgfTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIGNvbnN0IGJvaWQgPSBuZXcgQm9pZChvcmlnaW4sIHRhcmdldCwgZGlzdCwgdmVsb2NpdHksIGNvbG9yKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRCb2lkKGJvaWQpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIGhpZ2hsaWdodCBzZWxmXG4gICAgICAgICAgY29uc3QgYWN0aXZlVmVydGV4ID0gbmV3IEFjdGl2ZVZlcnRleCgwLCAwLCBjb2xvcik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRBY3RpdmVWZXJ0ZXgoYWN0aXZlVmVydGV4KTtcblxuICAgICAgICAgIC8vIGxhdWNuaCBib2lkcyB0byBuZXh0IHZlcnRpY2VzXG4gICAgICAgICAgaWYgKGRhdGEubmV4dCAmJiBkYXRhLm5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhLm5leHQuZm9yRWFjaCgobmV4dCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXh0WCA9IG5leHQueCAtIHg7XG4gICAgICAgICAgICAgIGNvbnN0IG5leHRZID0gbmV4dC55IC0geTtcbiAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IG5leHQuZGlzdGFuY2U7XG4gICAgICAgICAgICAgIGNvbnN0IGR0ID0gbmV4dC50cmlnZ2VyVGltZSAtIGRhdGEudHJpZ2dlclRpbWU7XG4gICAgICAgICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gZGlzdCAvIGR0O1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiBuZXh0WCwgeTogbmV4dFkgfTtcblxuICAgICAgICAgICAgICBjb25zdCBib2lkID0gbmV3IEJvaWQob3JpZ2luLCB0YXJnZXQsIGRpc3QsIHZlbG9jaXR5LCBjb2xvcik7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQm9pZChib2lkKTtcblxuICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgbmV4dFxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVWZXJ0ZXggPSBuZXcgQWN0aXZlVmVydGV4KG5leHRYLCBuZXh0WSwgY29sb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQWN0aXZlVmVydGV4KGFjdGl2ZVZlcnRleCk7XG4gICAgICAgICAgICAgIH0sIGR0ICogMTAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGR0ICogMTAwMCk7XG4gICAgICB9LCAocHJldlRyaWdnZXJUaW1lIC0gbm93KSAqIDEwMDApO1xuICAgIH1cbiAgfVxufVxuXG5cbiJdfQ==