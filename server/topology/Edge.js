"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
var id = 0;

var Edge = (function () {
  function Edge(tail, head, length) {
    _classCallCheck(this, Edge);

    this.id = id++;
    this.tail = tail;
    this.head = head;
    this.length = length;

    this.tail.addEdge(this);
    this.head.addEdge(this);
  }

  _createClass(Edge, [{
    key: "serialize",
    value: function serialize() {
      return {
        id: this.id,
        tail: { x: this.tail.x, y: this.tail.y },
        head: { x: this.head.x, y: this.head.y },
        length: this.length
      };
    }
  }]);

  return Edge;
})();

exports["default"] = Edge;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvdG9wb2xvZ3kvRWRnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7O0lBRVUsSUFBSTtBQUNaLFdBRFEsSUFBSSxDQUNYLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFOzBCQURiLElBQUk7O0FBRXJCLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDekI7O2VBVGtCLElBQUk7O1dBV2QscUJBQUc7QUFDVixhQUFPO0FBQ0wsVUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ1gsWUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUN4QyxZQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ3hDLGNBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtPQUNwQixDQUFDO0tBQ0g7OztTQWxCa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL3NlcnZlci90b3BvbG9neS9FZGdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGlkID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRnZSB7XG4gIGNvbnN0cnVjdG9yKHRhaWwsIGhlYWQsIGxlbmd0aCkge1xuICAgIHRoaXMuaWQgPSBpZCsrO1xuICAgIHRoaXMudGFpbCA9IHRhaWw7XG4gICAgdGhpcy5oZWFkID0gaGVhZDtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblxuICAgIHRoaXMudGFpbC5hZGRFZGdlKHRoaXMpO1xuICAgIHRoaXMuaGVhZC5hZGRFZGdlKHRoaXMpO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIHRhaWw6IHsgeDogdGhpcy50YWlsLngsIHk6IHRoaXMudGFpbC55IH0sXG4gICAgICBoZWFkOiB7IHg6IHRoaXMuaGVhZC54LCB5OiB0aGlzLmhlYWQueSB9LFxuICAgICAgbGVuZ3RoOiB0aGlzLmxlbmd0aCxcbiAgICB9O1xuICB9XG59XG4iXX0=