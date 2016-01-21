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

var _sharedGetColor = require('../shared/getColor');

var _sharedGetColor2 = _interopRequireDefault(_sharedGetColor);

var _sharedBoid = require('../shared/Boid');

var _sharedBoid2 = _interopRequireDefault(_sharedBoid);

var _sharedActiveVertex = require('../shared/ActiveVertex');

var _sharedActiveVertex2 = _interopRequireDefault(_sharedActiveVertex);

var MapRenderer = (function (_soundworks$display$Renderer) {
  _inherits(MapRenderer, _soundworks$display$Renderer);

  function MapRenderer() {
    _classCallCheck(this, MapRenderer);

    _get(Object.getPrototypeOf(MapRenderer.prototype), 'constructor', this).call(this);

    this.boids = [];
    this.activeVertices = [];
  }

  /**
   * @todo - rename to `resize` (same for renderers)
   */

  _createClass(MapRenderer, [{
    key: 'updateSize',
    value: function updateSize(width, height) {
      _get(Object.getPrototypeOf(MapRenderer.prototype), 'updateSize', this).call(this, width, height);

      if (this.area) {
        this._updateRatio();
      }
    }
  }, {
    key: '_updateRatio',
    value: function _updateRatio() {
      var area = this.area;
      var xRatio = this.canvasWidth / area.width;
      var yRatio = this.canvasHeight / area.height;
      this.ratio = Math.min(xRatio, yRatio);
    }
  }, {
    key: 'setArea',
    value: function setArea(area) {
      this.area = area;
      this._updateRatio();
    }
  }, {
    key: 'addVertex',
    value: function addVertex(vertex) {
      this.vertices.push(vertex);
    }
  }, {
    key: 'setEdges',
    value: function setEdges(edges) {
      this.edges = edges;
    }
  }, {
    key: 'triggerPath',
    value: function triggerPath(node) {
      var _this = this;

      var velocity = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var color = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      if (color === null) color = (0, _sharedGetColor2['default'])(node.id);

      var activeVertex = new _sharedActiveVertex2['default'](node.x, node.y, color);
      this.activeVertices.push(activeVertex);

      if (node.next) {
        node.next.forEach(function (dest) {
          var nodeTriggerTime = undefined;

          if (node.currentSyncTime) nodeTriggerTime = node.currentSyncTime;else nodeTriggerTime = node.triggerTime;

          var velocity = dest.distance / (dest.triggerTime - nodeTriggerTime);
          var boid = new _sharedBoid2['default'](node, dest, dest.distance, velocity, color);

          _this.boids.push(boid);
        });
      }
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var index = undefined;
      // update boids
      index = this.boids.length;
      while (--index >= 0) {
        var boid = this.boids[index];
        boid.update(dt);

        if (boid.isDone) {
          this.triggerPath(boid.destination, boid.velocity, boid.color);
          this.boids.splice(index, 1);
        }
      }

      // update active vertices
      index = this.activeVertices.length;
      while (--index >= 0) {
        var vertex = this.activeVertices[index];
        vertex.update(dt);

        if (vertex.isDone) {
          this.activeVertices.splice(index, 1);
        }
      }
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      var _this2 = this;

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      var ratio = this.ratio;

      ctx.beginPath();
      ctx.strokeStyle = '#363636';
      ctx.rect(0, 0, this.area.width * ratio, this.area.height * ratio);
      ctx.stroke();
      ctx.closePath();

      this.boids.forEach(function (boid) {
        boid.render(ctx, _this2.ratio);
      });

      this.activeVertices.forEach(function (vertex) {
        vertex.render(ctx, _this2.ratio);
      });
    }
  }]);

  return MapRenderer;
})(_soundworksClient2['default'].display.Renderer);

exports['default'] = MapRenderer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvbWFwL01hcFJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBQXVCLG1CQUFtQjs7Ozs4QkFDckIsb0JBQW9COzs7OzBCQUN4QixnQkFBZ0I7Ozs7a0NBQ1Isd0JBQXdCOzs7O0lBRTVCLFdBQVc7WUFBWCxXQUFXOztBQUNuQixXQURRLFdBQVcsR0FDaEI7MEJBREssV0FBVzs7QUFFNUIsK0JBRmlCLFdBQVcsNkNBRXBCOztBQUVSLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0dBQzFCOzs7Ozs7ZUFOa0IsV0FBVzs7V0FXcEIsb0JBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUN4QixpQ0FaaUIsV0FBVyw0Q0FZWCxLQUFLLEVBQUUsTUFBTSxFQUFFOztBQUVoQyxVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDYixZQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7T0FDckI7S0FDRjs7O1dBRVcsd0JBQUc7QUFDYixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUM3QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDL0MsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN2Qzs7O1dBRU0saUJBQUMsSUFBSSxFQUFFO0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3JCOzs7V0FFUSxtQkFBQyxNQUFNLEVBQUU7QUFDaEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUI7OztXQUVPLGtCQUFDLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFVSxxQkFBQyxJQUFJLEVBQWlDOzs7VUFBL0IsUUFBUSx5REFBRyxJQUFJO1VBQUUsS0FBSyx5REFBRyxJQUFJOztBQUM3QyxVQUFJLEtBQUssS0FBSyxJQUFJLEVBQ2hCLEtBQUssR0FBRyxpQ0FBUyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRTVCLFVBQU0sWUFBWSxHQUFHLG9DQUFpQixJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXZDLFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzFCLGNBQUksZUFBZSxZQUFBLENBQUM7O0FBRXBCLGNBQUksSUFBSSxDQUFDLGVBQWUsRUFDdEIsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FFdkMsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7O0FBRXJDLGNBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUEsQUFBQyxDQUFDO0FBQ3RFLGNBQU0sSUFBSSxHQUFHLDRCQUFTLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRWxFLGdCQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkIsQ0FBQyxDQUFDO09BQ0o7S0FDRjs7O1dBRUssZ0JBQUMsRUFBRSxFQUFFO0FBQ1QsVUFBSSxLQUFLLFlBQUEsQ0FBQzs7QUFFVixXQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDMUIsYUFBTyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDbkIsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixZQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQixZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixjQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUQsY0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzdCO09BQ0Y7OztBQUdELFdBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxhQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNuQixZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLGNBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWxCLFlBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNqQixjQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEM7T0FDRjtLQUNGOzs7V0FFSyxnQkFBQyxHQUFHLEVBQUU7OztBQUNWLFNBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFekQsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7QUFFekIsU0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxXQUFXLFlBQVksQ0FBQztBQUM1QixTQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ2xFLFNBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNiLFNBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0IsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBSyxLQUFLLENBQUMsQ0FBQztPQUM5QixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDdEMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBSyxLQUFLLENBQUMsQ0FBQztPQUNoQyxDQUFDLENBQUM7S0FDSjs7O1NBM0drQixXQUFXO0dBQVMsOEJBQVcsT0FBTyxDQUFDLFFBQVE7O3FCQUEvQyxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvbWFwL01hcFJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IGdldENvbG9yIGZyb20gJy4uL3NoYXJlZC9nZXRDb2xvcic7XG5pbXBvcnQgQm9pZCBmcm9tICcuLi9zaGFyZWQvQm9pZCc7XG5pbXBvcnQgQWN0aXZlVmVydGV4IGZyb20gJy4uL3NoYXJlZC9BY3RpdmVWZXJ0ZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBSZW5kZXJlciBleHRlbmRzIHNvdW5kd29ya3MuZGlzcGxheS5SZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmJvaWRzID0gW107XG4gICAgdGhpcy5hY3RpdmVWZXJ0aWNlcyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGByZXNpemVgIChzYW1lIGZvciByZW5kZXJlcnMpXG4gICAqL1xuICB1cGRhdGVTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlci51cGRhdGVTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuYXJlYSkge1xuICAgICAgdGhpcy5fdXBkYXRlUmF0aW8oKTtcbiAgICB9XG4gIH1cblxuICBfdXBkYXRlUmF0aW8oKSB7XG4gICAgY29uc3QgYXJlYSA9IHRoaXMuYXJlYTtcbiAgICBjb25zdCB4UmF0aW8gPSB0aGlzLmNhbnZhc1dpZHRoIC8gYXJlYS53aWR0aDtcbiAgICBjb25zdCB5UmF0aW8gPSB0aGlzLmNhbnZhc0hlaWdodCAvIGFyZWEuaGVpZ2h0O1xuICAgIHRoaXMucmF0aW8gPSBNYXRoLm1pbih4UmF0aW8sIHlSYXRpbyk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIHRoaXMuX3VwZGF0ZVJhdGlvKCk7XG4gIH1cblxuICBhZGRWZXJ0ZXgodmVydGV4KSB7XG4gICAgdGhpcy52ZXJ0aWNlcy5wdXNoKHZlcnRleCk7XG4gIH1cblxuICBzZXRFZGdlcyhlZGdlcykge1xuICAgIHRoaXMuZWRnZXMgPSBlZGdlcztcbiAgfVxuXG4gIHRyaWdnZXJQYXRoKG5vZGUsIHZlbG9jaXR5ID0gbnVsbCwgY29sb3IgPSBudWxsKSB7XG4gICAgaWYgKGNvbG9yID09PSBudWxsKVxuICAgICAgY29sb3IgPSBnZXRDb2xvcihub2RlLmlkKTtcblxuICAgIGNvbnN0IGFjdGl2ZVZlcnRleCA9IG5ldyBBY3RpdmVWZXJ0ZXgobm9kZS54LCBub2RlLnksIGNvbG9yKTtcbiAgICB0aGlzLmFjdGl2ZVZlcnRpY2VzLnB1c2goYWN0aXZlVmVydGV4KTtcblxuICAgIGlmIChub2RlLm5leHQpIHtcbiAgICAgIG5vZGUubmV4dC5mb3JFYWNoKChkZXN0KSA9PiB7XG4gICAgICAgIGxldCBub2RlVHJpZ2dlclRpbWU7XG5cbiAgICAgICAgaWYgKG5vZGUuY3VycmVudFN5bmNUaW1lKVxuICAgICAgICAgIG5vZGVUcmlnZ2VyVGltZSA9IG5vZGUuY3VycmVudFN5bmNUaW1lO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbm9kZVRyaWdnZXJUaW1lID0gbm9kZS50cmlnZ2VyVGltZTtcblxuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IGRlc3QuZGlzdGFuY2UgLyAoZGVzdC50cmlnZ2VyVGltZSAtIG5vZGVUcmlnZ2VyVGltZSk7XG4gICAgICAgIGNvbnN0IGJvaWQgPSBuZXcgQm9pZChub2RlLCBkZXN0LCBkZXN0LmRpc3RhbmNlLCB2ZWxvY2l0eSwgY29sb3IpO1xuXG4gICAgICAgIHRoaXMuYm9pZHMucHVzaChib2lkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIGxldCBpbmRleDtcbiAgICAvLyB1cGRhdGUgYm9pZHNcbiAgICBpbmRleCA9IHRoaXMuYm9pZHMubGVuZ3RoO1xuICAgIHdoaWxlICgtLWluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IGJvaWQgPSB0aGlzLmJvaWRzW2luZGV4XTtcbiAgICAgIGJvaWQudXBkYXRlKGR0KTtcblxuICAgICAgaWYgKGJvaWQuaXNEb25lKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlclBhdGgoYm9pZC5kZXN0aW5hdGlvbiwgYm9pZC52ZWxvY2l0eSwgYm9pZC5jb2xvcik7XG4gICAgICAgIHRoaXMuYm9pZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYWN0aXZlIHZlcnRpY2VzXG4gICAgaW5kZXggPSB0aGlzLmFjdGl2ZVZlcnRpY2VzLmxlbmd0aDtcbiAgICB3aGlsZSAoLS1pbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLmFjdGl2ZVZlcnRpY2VzW2luZGV4XTtcbiAgICAgIHZlcnRleC51cGRhdGUoZHQpO1xuXG4gICAgICBpZiAodmVydGV4LmlzRG9uZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZVZlcnRpY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuXG4gICAgY29uc3QgcmF0aW8gPSB0aGlzLnJhdGlvO1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGAjMzYzNjM2YDtcbiAgICBjdHgucmVjdCgwLCAwLCB0aGlzLmFyZWEud2lkdGggKiByYXRpbywgdGhpcy5hcmVhLmhlaWdodCAqIHJhdGlvKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgdGhpcy5ib2lkcy5mb3JFYWNoKChib2lkKSA9PiB7XG4gICAgICBib2lkLnJlbmRlcihjdHgsIHRoaXMucmF0aW8pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVWZXJ0aWNlcy5mb3JFYWNoKCh2ZXJ0ZXgpID0+IHtcbiAgICAgIHZlcnRleC5yZW5kZXIoY3R4LCB0aGlzLnJhdGlvKTtcbiAgICB9KTtcbiAgfVxufSJdfQ==