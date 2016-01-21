"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ActiveVertex = (function () {
  function ActiveVertex(x, y, color) {
    _classCallCheck(this, ActiveVertex);

    this.x = x;
    this.y = y;
    this.color = color;
    this.opacity = 1;
    this.radius = 0;
    // this.radius = 50;
    this.isDone = false;
  }

  _createClass(ActiveVertex, [{
    key: "update",
    value: function update() {
      this.radius += 0.05;
      this.opacity -= 0.05;

      if (this.opacity < 0) {
        this.isDone = true;
      }

      // this.opacity = -1;
    }
  }, {
    key: "render",
    value: function render(ctx, ratio) {
      var x = this.x * ratio;
      var y = this.y * ratio;
      var radius = this.radius * ratio;

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }]);

  return ActiveVertex;
})();

exports["default"] = ActiveVertex;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2hhcmVkL0FjdGl2ZVZlcnRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFOzBCQUROLFlBQVk7O0FBRTdCLFFBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsUUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7R0FDckI7O2VBVGtCLFlBQVk7O1dBV3pCLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7QUFDcEIsVUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7O0FBRXJCLFVBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUU7QUFDcEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7T0FDcEI7OztLQUdGOzs7V0FFSyxnQkFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVuQyxTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxTQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsU0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQy9CLFNBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMzQixTQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxTQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsU0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2Y7OztTQW5Da0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9zaGFyZWQvQWN0aXZlVmVydGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aXZlVmVydGV4IHtcbiAgY29uc3RydWN0b3IoeCwgeSwgY29sb3IpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gICAgdGhpcy5yYWRpdXMgPSAwO1xuICAgIC8vIHRoaXMucmFkaXVzID0gNTA7XG4gICAgdGhpcy5pc0RvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJhZGl1cyArPSAwLjA1O1xuICAgIHRoaXMub3BhY2l0eSAtPSAwLjA1O1xuXG4gICAgaWYgKHRoaXMub3BhY2l0eSA8IDApIHtcbiAgICAgIHRoaXMuaXNEb25lID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLm9wYWNpdHkgPSAtMTtcbiAgfVxuXG4gIHJlbmRlcihjdHgsIHJhdGlvKSB7XG4gICAgY29uc3QgeCA9IHRoaXMueCAqIHJhdGlvO1xuICAgIGNvbnN0IHkgPSB0aGlzLnkgKiByYXRpbztcbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLnJhZGl1cyAqIHJhdGlvO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5vcGFjaXR5O1xuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgIGN0eC5hcmMoeCwgeSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiJdfQ==