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

var PlayerRenderer = (function (_soundworks$display$Renderer) {
  _inherits(PlayerRenderer, _soundworks$display$Renderer);

  function PlayerRenderer() {
    _classCallCheck(this, PlayerRenderer);

    _get(Object.getPrototypeOf(PlayerRenderer.prototype), 'constructor', this).call(this, 0); // update bounded to frame rate

    this.graphData = null;
    this.graphRatio = null;

    this.activeVertices = [];
    this.boids = [];
  }

  _createClass(PlayerRenderer, [{
    key: 'setGraph',
    value: function setGraph(data, ratio) {
      this.graphData = data;
      this.graphRatio = ratio;
    }
  }, {
    key: 'setAngle',
    value: function setAngle(angle) {
      this.angle = angle;
    }
  }, {
    key: 'addBoid',
    value: function addBoid(boid) {
      this.boids.push(boid);
    }
  }, {
    key: 'addActiveVertex',
    value: function addActiveVertex(vertex) {
      this.activeVertices.push(vertex);
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
      var ratio = this.graphRatio;
      var centerX = this.canvasWidth / 2;
      var centerY = this.canvasHeight / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(this.angle);

      // render the graph
      if (this.graphData) {
        ctx.save();

        this.graphData.adjacentVertices.forEach(function (vertex) {
          var x = vertex.x * ratio;
          var y = vertex.y * ratio;

          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = 0.4;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(0, 0);
          ctx.stroke();
          ctx.closePath();

          ctx.fillStyle = '#000000'; // getColor(vertex.id);

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2, false);
          ctx.closePath();

          ctx.fill();
          ctx.stroke();
        });

        ctx.globalAlpha = 1;
        ctx.fillStyle = (0, _sharedGetColor2['default'])(this.graphData.id);

        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // render boids and active vertices
      this.boids.forEach(function (boid) {
        boid.render(ctx, ratio);
      });

      this.activeVertices.forEach(function (vertex) {
        vertex.render(ctx, ratio);
      });

      ctx.restore();
    }
  }]);

  return PlayerRenderer;
})(_soundworksClient2['default'].display.Renderer);

exports['default'] = PlayerRenderer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvcGxheWVyL1BsYXllclJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBQXVCLG1CQUFtQjs7Ozs4QkFDckIsb0JBQW9COzs7O0lBRXBCLGNBQWM7WUFBZCxjQUFjOztBQUN0QixXQURRLGNBQWMsR0FDbkI7MEJBREssY0FBYzs7QUFFL0IsK0JBRmlCLGNBQWMsNkNBRXpCLENBQUMsRUFBRTs7QUFFVCxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDakI7O2VBVGtCLGNBQWM7O1dBV3pCLGtCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7S0FDekI7OztXQUVPLGtCQUFDLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUU7QUFDWixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2Qjs7O1dBRWMseUJBQUMsTUFBTSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFSyxnQkFBQyxFQUFFLEVBQUU7QUFDVCxVQUFJLEtBQUssWUFBQSxDQUFDOztBQUVWLFdBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMxQixhQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtBQUNuQixZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUss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QUM7QUFDaEIsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVYLFdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNmOzs7QUFHRCxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUMzQixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN6QixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDdEMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDM0IsQ0FBQyxDQUFDOztBQUVILFNBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmOzs7U0E5R2tCLGNBQWM7R0FBUyw4QkFBVyxPQUFPLENBQUMsUUFBUTs7cUJBQWxELGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9wbGF5ZXIvUGxheWVyUmVuZGVyZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgZ2V0Q29sb3IgZnJvbSAnLi4vc2hhcmVkL2dldENvbG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyUmVuZGVyZXIgZXh0ZW5kcyBzb3VuZHdvcmtzLmRpc3BsYXkuUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigwKTsgLy8gdXBkYXRlIGJvdW5kZWQgdG8gZnJhbWUgcmF0ZVxuXG4gICAgdGhpcy5ncmFwaERhdGEgPSBudWxsO1xuICAgIHRoaXMuZ3JhcGhSYXRpbyA9IG51bGw7XG5cbiAgICB0aGlzLmFjdGl2ZVZlcnRpY2VzID0gW107XG4gICAgdGhpcy5ib2lkcyA9IFtdO1xuICB9XG5cbiAgc2V0R3JhcGgoZGF0YSwgcmF0aW8pIHtcbiAgICB0aGlzLmdyYXBoRGF0YSA9IGRhdGE7XG4gICAgdGhpcy5ncmFwaFJhdGlvID0gcmF0aW87XG4gIH1cblxuICBzZXRBbmdsZShhbmdsZSkge1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgfVxuXG4gIGFkZEJvaWQoYm9pZCkge1xuICAgIHRoaXMuYm9pZHMucHVzaChib2lkKTtcbiAgfVxuXG4gIGFkZEFjdGl2ZVZlcnRleCh2ZXJ0ZXgpIHtcbiAgICB0aGlzLmFjdGl2ZVZlcnRpY2VzLnB1c2godmVydGV4KTtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIGxldCBpbmRleDtcbiAgICAvLyB1cGRhdGUgYm9pZHNcbiAgICBpbmRleCA9IHRoaXMuYm9pZHMubGVuZ3RoO1xuICAgIHdoaWxlICgtLWluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IGJvaWQgPSB0aGlzLmJvaWRzW2luZGV4XTtcbiAgICAgIGJvaWQudXBkYXRlKGR0KTtcblxuICAgICAgaWYgKGJvaWQuaXNEb25lKSB7XG4gICAgICAgIHRoaXMuYm9pZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYWN0aXZlIHZlcnRpY2VzXG4gICAgaW5kZXggPSB0aGlzLmFjdGl2ZVZlcnRpY2VzLmxlbmd0aDtcbiAgICB3aGlsZSAoLS1pbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLmFjdGl2ZVZlcnRpY2VzW2luZGV4XTtcbiAgICAgIHZlcnRleC51cGRhdGUoZHQpO1xuXG4gICAgICBpZiAodmVydGV4LmlzRG9uZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZVZlcnRpY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGNvbnN0IHJhdGlvID0gdGhpcy5ncmFwaFJhdGlvO1xuICAgIGNvbnN0IGNlbnRlclggPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCBjZW50ZXJZID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKGNlbnRlclgsIGNlbnRlclkpO1xuICAgIGN0eC5yb3RhdGUodGhpcy5hbmdsZSk7XG5cbiAgICAvLyByZW5kZXIgdGhlIGdyYXBoXG4gICAgaWYgKHRoaXMuZ3JhcGhEYXRhKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuXG4gICAgICB0aGlzLmdyYXBoRGF0YS5hZGphY2VudFZlcnRpY2VzLmZvckVhY2goKHZlcnRleCkgPT4ge1xuICAgICAgICBjb25zdCB4ID0gdmVydGV4LnggKiByYXRpbztcbiAgICAgICAgY29uc3QgeSA9IHZlcnRleC55ICogcmF0aW87XG5cbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmZmZmYnO1xuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjQ7XG5cbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgICAgICBjdHgubGluZVRvKDAsIDApO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnOyAvLyBnZXRDb2xvcih2ZXJ0ZXguaWQpO1xuXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyh4LCB5LCAzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XG4gICAgICBjdHguZmlsbFN0eWxlID0gZ2V0Q29sb3IodGhpcy5ncmFwaERhdGEuaWQpO1xuXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKDAsIDAsIDQsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICBjdHguZmlsbCgpO1xuXG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIC8vIHJlbmRlciBib2lkcyBhbmQgYWN0aXZlIHZlcnRpY2VzXG4gICAgdGhpcy5ib2lkcy5mb3JFYWNoKChib2lkKSA9PiB7XG4gICAgICBib2lkLnJlbmRlcihjdHgsIHJhdGlvKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZlVmVydGljZXMuZm9yRWFjaCgodmVydGV4KSA9PiB7XG4gICAgICB2ZXJ0ZXgucmVuZGVyKGN0eCwgcmF0aW8pO1xuICAgIH0pO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIl19