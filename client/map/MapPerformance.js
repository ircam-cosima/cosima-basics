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

var _MapRenderer = require('./MapRenderer');

var _MapRenderer2 = _interopRequireDefault(_MapRenderer);

var template = '\n  <div class="background">\n    <div id="space"></div>\n    <canvas class="background"></canvas>\n  </div>\n  <div class="foreground" style="display:none">\n    <div class="section-top"></div>\n    <div class="section-center"></div>\n    <div class="section-bottom"></div>\n  </div>\n';

var MapPerformanceView = (function (_soundworks$display$CanvasView) {
  _inherits(MapPerformanceView, _soundworks$display$CanvasView);

  function MapPerformanceView() {
    _classCallCheck(this, MapPerformanceView);

    _get(Object.getPrototypeOf(MapPerformanceView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MapPerformanceView, [{
    key: 'onRender',
    value: function onRender() {
      _get(Object.getPrototypeOf(MapPerformanceView.prototype), 'onRender', this).call(this);
      this.$background = this.$el.querySelector('.background');
    }
  }, {
    key: 'setArea',
    value: function setArea(area) {
      this.area = area;
      this.resizeArea();
    }

    // @note - this looks like a mess...
  }, {
    key: 'resizeArea',
    value: function resizeArea() {
      var xRatio = this.viewportWidth / this.area.width;
      var yRatio = this.viewportHeight / this.area.height;
      var ratio = Math.min(xRatio, yRatio);
      var bgWidth = this.area.width * ratio;
      var bgHeight = this.area.height * ratio;

      this.$background.style.width = bgWidth + 'px';
      this.$background.style.height = bgHeight + 'px';
      this.$background.style.left = '50%';
      this.$background.style.marginLeft = '-' + bgWidth / 2 + 'px';
      this.$background.style.top = '50%';
      this.$background.style.marginTop = '-' + bgHeight / 2 + 'px';

      this._renderingGroup.updateSize(bgWidth, bgHeight);
    }
  }, {
    key: 'onResize',
    value: function onResize(orientation, viewportWidth, viewportHeight) {
      _get(Object.getPrototypeOf(MapPerformanceView.prototype), 'onResize', this).call(this, orientation, viewportWidth, viewportHeight);
      if (this.area) {
        this.resizeArea();
      }
    }
  }]);

  return MapPerformanceView;
})(_soundworksClient2['default'].display.CanvasView);

var MapPerformance = (function (_soundworks$ClientPerformance) {
  _inherits(MapPerformance, _soundworks$ClientPerformance);

  function MapPerformance(sync, options) {
    _classCallCheck(this, MapPerformance);

    _get(Object.getPrototypeOf(MapPerformance.prototype), 'constructor', this).call(this, options);

    this._sync = sync;
    this.init();
  }

  _createClass(MapPerformance, [{
    key: 'init',
    value: function init() {
      this.template = template;
      this.viewCtor = MapPerformanceView;
      this.view = this.createView();
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(MapPerformance.prototype), 'start', this).call(this);

      this.renderer = new _MapRenderer2['default']();

      this.send('request:area');

      this.receive('init:area', function (area) {
        _this.view.setArea(area);
        _this.renderer.setArea(area);
        _this.view.addRenderer(_this.renderer);

        _this.space = new _soundworksClient2['default'].display.SpaceView(area);
        _this.view.setViewComponent('#space', _this.space);
        _this.view.render('#space');

        _this.send('request:map');
      });

      this.receive('init:map', function (vertices, edges) {
        _this.space.addPoints(vertices);
        _this.space.setLines(edges);
      });

      this.receive('add:player', function (vertex, edges) {
        _this.space.addPoint(vertex);
        _this.space.setLines(edges);
      });

      this.receive('remove:player', function (id, edges) {
        _this.space.deletePoint(id);
        _this.space.setLines(edges);
      });

      this.receive('trigger', function (pathInfos) {
        pathInfos.currentSyncTime = _this._sync.getSyncTime();
        _this.renderer.triggerPath(pathInfos);
      });
    }
  }]);

  return MapPerformance;
})(_soundworksClient2['default'].ClientPerformance);

exports['default'] = MapPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvbWFwL01hcFBlcmZvcm1hbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBQXVCLG1CQUFtQjs7OzsyQkFDbEIsZUFBZTs7OztBQUV2QyxJQUFNLFFBQVEsbVNBVWIsQ0FBQzs7SUFFSSxrQkFBa0I7WUFBbEIsa0JBQWtCOztXQUFsQixrQkFBa0I7MEJBQWxCLGtCQUFrQjs7K0JBQWxCLGtCQUFrQjs7O2VBQWxCLGtCQUFrQjs7V0FDZCxvQkFBRztBQUNULGlDQUZFLGtCQUFrQiwwQ0FFSDtBQUNqQixVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUU7QUFDWixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkI7Ozs7O1dBR1Msc0JBQUc7QUFDWCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3BELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdEQsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkMsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFMUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLE9BQU8sT0FBSSxDQUFDO0FBQzlDLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxRQUFRLE9BQUksQ0FBQztBQUNoRCxVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQztBQUNwQyxVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLFNBQU8sT0FBTyxHQUFHLENBQUMsT0FBSSxDQUFDO0FBQ3hELFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsU0FBTyxRQUFRLEdBQUcsQ0FBQyxPQUFJLENBQUM7O0FBRXhELFVBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNwRDs7O1dBRU8sa0JBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUU7QUFDbkQsaUNBOUJFLGtCQUFrQiwwQ0E4QkwsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUU7QUFDM0QsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQUU7S0FDdEM7OztTQWhDRyxrQkFBa0I7R0FBUyw4QkFBVyxPQUFPLENBQUMsVUFBVTs7SUFtQ3pDLGNBQWM7WUFBZCxjQUFjOztBQUN0QixXQURRLGNBQWMsQ0FDckIsSUFBSSxFQUFFLE9BQU8sRUFBRTswQkFEUixjQUFjOztBQUUvQiwrQkFGaUIsY0FBYyw2Q0FFekIsT0FBTyxFQUFFOztBQUVmLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQU5rQixjQUFjOztXQVE3QixnQkFBRztBQUNMLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsa0JBQWtCLENBQUM7QUFDbkMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDL0I7OztXQUVJLGlCQUFHOzs7QUFDTixpQ0FmaUIsY0FBYyx1Q0FlakI7O0FBRWQsVUFBSSxDQUFDLFFBQVEsR0FBRyw4QkFBaUIsQ0FBQzs7QUFFbEMsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDbEMsY0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLGNBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixjQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBSyxRQUFRLENBQUMsQ0FBQzs7QUFFckMsY0FBSyxLQUFLLEdBQUcsSUFBSSw4QkFBVyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELGNBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFLLEtBQUssQ0FBQyxDQUFDO0FBQ2pELGNBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFM0IsY0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7T0FDMUIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQUMsUUFBUSxFQUFFLEtBQUssRUFBSztBQUM1QyxjQUFLLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsY0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzVCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUs7QUFDNUMsY0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLGNBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM1QixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsVUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFLO0FBQzNDLGNBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQixjQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDNUIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ3JDLGlCQUFTLENBQUMsZUFBZSxHQUFHLE1BQUssS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3JELGNBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUN0QyxDQUFDLENBQUM7S0FDSjs7O1NBcERrQixjQUFjO0dBQVMsOEJBQVcsaUJBQWlCOztxQkFBbkQsY0FBYyIsImZpbGUiOiJzcmMvY2xpZW50L21hcC9NYXBQZXJmb3JtYW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBNYXBSZW5kZXJlciBmcm9tICcuL01hcFJlbmRlcmVyJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+XG4gICAgPGRpdiBpZD1cInNwYWNlXCI+PC9kaXY+XG4gICAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jbGFzcyBNYXBQZXJmb3JtYW5jZVZpZXcgZXh0ZW5kcyBzb3VuZHdvcmtzLmRpc3BsYXkuQ2FudmFzVmlldyB7XG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZ3JvdW5kJyk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMucmVzaXplQXJlYSgpO1xuICB9XG5cbiAgLy8gQG5vdGUgLSB0aGlzIGxvb2tzIGxpa2UgYSBtZXNzLi4uXG4gIHJlc2l6ZUFyZWEoKSB7XG4gICAgY29uc3QgeFJhdGlvID0gdGhpcy52aWV3cG9ydFdpZHRoIC8gdGhpcy5hcmVhLndpZHRoO1xuICAgIGNvbnN0IHlSYXRpbyA9IHRoaXMudmlld3BvcnRIZWlnaHQgLyB0aGlzLmFyZWEuaGVpZ2h0O1xuICAgIGNvbnN0IHJhdGlvID0gTWF0aC5taW4oeFJhdGlvLCB5UmF0aW8pO1xuICAgIGNvbnN0IGJnV2lkdGggPSB0aGlzLmFyZWEud2lkdGggKiByYXRpbztcbiAgICBjb25zdCBiZ0hlaWdodCA9IHRoaXMuYXJlYS5oZWlnaHQgKiByYXRpbztcblxuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUud2lkdGggPSBgJHtiZ1dpZHRofXB4YDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmhlaWdodCA9IGAke2JnSGVpZ2h0fXB4YDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmxlZnQgPSBgNTAlYDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLm1hcmdpbkxlZnQgPSBgLSR7YmdXaWR0aCAvIDJ9cHhgO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUudG9wID0gYDUwJWA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7YmdIZWlnaHQgLyAyfXB4YDtcblxuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnVwZGF0ZVNpemUoYmdXaWR0aCwgYmdIZWlnaHQpO1xuICB9XG5cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgc3VwZXIub25SZXNpemUob3JpZW50YXRpb24sIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcbiAgICBpZiAodGhpcy5hcmVhKSB7IHRoaXMucmVzaXplQXJlYSgpOyB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwUGVyZm9ybWFuY2UgZXh0ZW5kcyBzb3VuZHdvcmtzLkNsaWVudFBlcmZvcm1hbmNlIHtcbiAgY29uc3RydWN0b3Ioc3luYywgb3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fc3luYyA9IHN5bmM7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB0aGlzLnZpZXdDdG9yID0gTWFwUGVyZm9ybWFuY2VWaWV3O1xuICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgTWFwUmVuZGVyZXIoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdDphcmVhJyk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2luaXQ6YXJlYScsIChhcmVhKSA9PiB7XG4gICAgICB0aGlzLnZpZXcuc2V0QXJlYShhcmVhKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXJlYShhcmVhKTtcbiAgICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgICAgdGhpcy5zcGFjZSA9IG5ldyBzb3VuZHdvcmtzLmRpc3BsYXkuU3BhY2VWaWV3KGFyZWEpO1xuICAgICAgdGhpcy52aWV3LnNldFZpZXdDb21wb25lbnQoJyNzcGFjZScsIHRoaXMuc3BhY2UpO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignI3NwYWNlJyk7XG5cbiAgICAgIHRoaXMuc2VuZCgncmVxdWVzdDptYXAnKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVjZWl2ZSgnaW5pdDptYXAnLCAodmVydGljZXMsIGVkZ2VzKSA9PiB7XG4gICAgICB0aGlzLnNwYWNlLmFkZFBvaW50cyh2ZXJ0aWNlcyk7XG4gICAgICB0aGlzLnNwYWNlLnNldExpbmVzKGVkZ2VzKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYWRkOnBsYXllcicsICh2ZXJ0ZXgsIGVkZ2VzKSA9PiB7XG4gICAgICB0aGlzLnNwYWNlLmFkZFBvaW50KHZlcnRleCk7XG4gICAgICB0aGlzLnNwYWNlLnNldExpbmVzKGVkZ2VzKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVjZWl2ZSgncmVtb3ZlOnBsYXllcicsIChpZCwgZWRnZXMpID0+IHtcbiAgICAgIHRoaXMuc3BhY2UuZGVsZXRlUG9pbnQoaWQpO1xuICAgICAgdGhpcy5zcGFjZS5zZXRMaW5lcyhlZGdlcyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ3RyaWdnZXInLCAocGF0aEluZm9zKSA9PiB7XG4gICAgICBwYXRoSW5mb3MuY3VycmVudFN5bmNUaW1lID0gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICAgICAgdGhpcy5yZW5kZXJlci50cmlnZ2VyUGF0aChwYXRoSW5mb3MpO1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==