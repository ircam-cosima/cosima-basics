"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vertex = (function () {
  function Vertex(client, x, y) {
    _classCallCheck(this, Vertex);

    this.id = client.uid;
    this.client = client;
    this.x = x;
    this.y = y;

    this.edges = [];

    this.visited = false;
    this.depth = 0;
    this.distance = 0;
    this.parent = null;
  }

  _createClass(Vertex, [{
    key: "addEdge",
    value: function addEdge(edge) {
      this.edges.push(edge);
    }
  }, {
    key: "visit",
    value: function visit(syncTime, velocity) {
      var parent = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var edge = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      this.visited = true;
      this.parent = parent;

      if (parent === null) {
        this.depth = 0;
        this.distance = 0;
      } else {
        this.depth = parent.depth + 1;
        this.distance = parent.distance + edge.length;
      }

      this.triggerTime = syncTime + this.distance / velocity;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.visited = false;
      this.depth = 0;
      this.distance = 0;
    }
  }, {
    key: "resetEdges",
    value: function resetEdges() {
      this.edges.length = 0;
    }

    // @todo - rationnalize serialization
    // Serialize informations with adjacents nodes relatively positionned to `this`
  }, {
    key: "serializeAdjacents",
    value: function serializeAdjacents() {
      var _this = this;

      var data = {
        id: this.id,
        x: 0,
        y: 0,
        adjacentVertices: []
      };

      this.edges.forEach(function (edge) {
        var next = edge.tail === _this ? edge.head : edge.tail;

        data.adjacentVertices.push({
          id: next.id,
          x: next.x - _this.x,
          y: next.y - _this.y,
          distance: edge.length
        });
      });

      return data;
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var _this2 = this;

      var detailled = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var data = {
        id: this.id,
        x: this.x,
        y: this.y,
        depth: this.depth,
        // distanceFromRoot: this.distance,
        triggerTime: this.triggerTime,
        radius: 0.05 };

      // remove from here
      if (this.visited && detailled) {
        data.next = [];

        if (this.parent) {
          data.prev = {
            x: this.parent.x,
            y: this.parent.y,
            distance: this.distance - this.parent.distance,
            triggerTime: this.parent.triggerTime
          };
        }

        this.edges.forEach(function (edge) {
          var sibling = edge.tail === _this2 ? edge.head : edge.tail;

          if (sibling === _this2.parent) {
            data.prev.distance = edge.length;
          } else {
            data.next.push({
              x: sibling.x,
              y: sibling.y,
              distance: edge.length,
              triggerTime: sibling.triggerTime
            });
          }
        });
      }

      return data;
    }
  }]);

  return Vertex;
})();

exports["default"] = Vertex;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvdG9wb2xvZ3kvVmVydGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUIsTUFBTTtBQUNkLFdBRFEsTUFBTSxDQUNiLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFOzBCQURQLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLFFBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVYLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVoQixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ3BCOztlQWJrQixNQUFNOztXQWVsQixpQkFBQyxJQUFJLEVBQUU7QUFDWixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2Qjs7O1dBRUksZUFBQyxRQUFRLEVBQUUsUUFBUSxFQUE4QjtVQUE1QixNQUFNLHlEQUFHLElBQUk7VUFBRSxJQUFJLHlEQUFHLElBQUk7O0FBQ2xELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixVQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDbkIsWUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixZQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztPQUNuQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFH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USxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ3JCLHlCQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7YUFDakMsQ0FBQyxDQUFDO1dBQ0o7U0FDRixDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFPLElBQUksQ0FBQztLQUNiOzs7U0E1R2tCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9zZXJ2ZXIvdG9wb2xvZ3kvVmVydGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVydGV4IHtcbiAgY29uc3RydWN0b3IoY2xpZW50LCB4LCB5KSB7XG4gICAgdGhpcy5pZCA9IGNsaWVudC51aWQ7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuXG4gICAgdGhpcy5lZGdlcyA9IFtdO1xuXG4gICAgdGhpcy52aXNpdGVkID0gZmFsc2U7XG4gICAgdGhpcy5kZXB0aCA9IDA7XG4gICAgdGhpcy5kaXN0YW5jZSA9IDA7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgYWRkRWRnZShlZGdlKSB7XG4gICAgdGhpcy5lZGdlcy5wdXNoKGVkZ2UpO1xuICB9XG5cbiAgdmlzaXQoc3luY1RpbWUsIHZlbG9jaXR5LCBwYXJlbnQgPSBudWxsLCBlZGdlID0gbnVsbCkge1xuICAgIHRoaXMudmlzaXRlZCA9IHRydWU7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICB0aGlzLmRlcHRoID0gMDtcbiAgICAgIHRoaXMuZGlzdGFuY2UgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlcHRoID0gcGFyZW50LmRlcHRoICsgMTtcbiAgICAgIHRoaXMuZGlzdGFuY2UgPSBwYXJlbnQuZGlzdGFuY2UgKyBlZGdlLmxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXJUaW1lID0gc3luY1RpbWUgKyB0aGlzLmRpc3RhbmNlIC8gdmVsb2NpdHk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZpc2l0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRlcHRoID0gMDtcbiAgICB0aGlzLmRpc3RhbmNlID0gMDtcbiAgfVxuXG4gIHJlc2V0RWRnZXMoKSB7XG4gICAgdGhpcy5lZGdlcy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLy8gQHRvZG8gLSByYXRpb25uYWxpemUgc2VyaWFsaXphdGlvblxuICAvLyBTZXJpYWxpemUgaW5mb3JtYXRpb25zIHdpdGggYWRqYWNlbnRzIG5vZGVzIHJlbGF0aXZlbHkgcG9zaXRpb25uZWQgdG8gYHRoaXNgXG4gIHNlcmlhbGl6ZUFkamFjZW50cygpIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIGFkamFjZW50VmVydGljZXM6IFtdLFxuICAgIH1cblxuICAgIHRoaXMuZWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IGVkZ2UudGFpbCA9PT0gdGhpcyA/IGVkZ2UuaGVhZCA6IGVkZ2UudGFpbDtcblxuICAgICAgZGF0YS5hZGphY2VudFZlcnRpY2VzLnB1c2goe1xuICAgICAgICBpZDogbmV4dC5pZCxcbiAgICAgICAgeDogbmV4dC54IC0gdGhpcy54LFxuICAgICAgICB5OiBuZXh0LnkgLSB0aGlzLnksXG4gICAgICAgIGRpc3RhbmNlOiBlZGdlLmxlbmd0aCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBzZXJpYWxpemUoZGV0YWlsbGVkID0gZmFsc2UpIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICB4OiB0aGlzLngsXG4gICAgICB5OiB0aGlzLnksXG4gICAgICBkZXB0aDogdGhpcy5kZXB0aCxcbiAgICAgIC8vIGRpc3RhbmNlRnJvbVJvb3Q6IHRoaXMuZGlzdGFuY2UsXG4gICAgICB0cmlnZ2VyVGltZTogdGhpcy50cmlnZ2VyVGltZSxcbiAgICAgIHJhZGl1czogMC4wNSwgLy8gcmVtb3ZlIGZyb20gaGVyZVxuICAgIH07XG5cbiAgICBpZiAodGhpcy52aXNpdGVkICYmIGRldGFpbGxlZCkge1xuICAgICAgZGF0YS5uZXh0ID0gW107XG5cbiAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICBkYXRhLnByZXYgPSB7XG4gICAgICAgICAgeDogdGhpcy5wYXJlbnQueCxcbiAgICAgICAgICB5OiB0aGlzLnBhcmVudC55LFxuICAgICAgICAgIGRpc3RhbmNlOiB0aGlzLmRpc3RhbmNlIC0gdGhpcy5wYXJlbnQuZGlzdGFuY2UsXG4gICAgICAgICAgdHJpZ2dlclRpbWU6IHRoaXMucGFyZW50LnRyaWdnZXJUaW1lLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICAgICAgY29uc3Qgc2libGluZyA9IGVkZ2UudGFpbCA9PT0gdGhpcyA/IGVkZ2UuaGVhZCA6IGVkZ2UudGFpbDtcblxuICAgICAgICBpZiAoc2libGluZyA9PT0gdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICBkYXRhLnByZXYuZGlzdGFuY2UgPSBlZGdlLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhLm5leHQucHVzaCh7XG4gICAgICAgICAgICB4OiBzaWJsaW5nLngsXG4gICAgICAgICAgICB5OiBzaWJsaW5nLnksXG4gICAgICAgICAgICBkaXN0YW5jZTogZWRnZS5sZW5ndGgsXG4gICAgICAgICAgICB0cmlnZ2VyVGltZTogc2libGluZy50cmlnZ2VyVGltZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cbiJdfQ==