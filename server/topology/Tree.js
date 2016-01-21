'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Vertex = require('./Vertex');

var _Vertex2 = _interopRequireDefault(_Vertex);

var _edge = require('./edge');

var _edge2 = _interopRequireDefault(_edge);

var Tree = (function () {
  function Tree(setup) {
    _classCallCheck(this, Tree);

    this.setup = setup;
    this.vertices = [];
    this.edges = [];
    this.edgesPool = []; // pool of all possible edges
  }

  _createClass(Tree, [{
    key: 'addVertex',
    value: function addVertex(client) {
      var _client$coordinates = client.coordinates;
      var x = _client$coordinates.x;
      var y = _client$coordinates.y;

      var vertex = new _Vertex2['default'](client, x, y);

      this.vertices.push(vertex);

      this.updatePool(vertex);
      this.updateEdges();

      return vertex;
    }
  }, {
    key: 'removeVertex',
    value: function removeVertex(client) {
      var vertex = undefined;
      // find the vertex
      this.vertices.forEach(function (v) {
        if (v.client === client) {
          vertex = v;
        }
      });

      // reset and remove from vertices
      vertex.resetEdges();
      this.vertices.splice(this.vertices.indexOf(vertex), 1);

      // remove all edges pointing to the vertex in the pool
      var index = this.edgesPool.length;
      while (--index >= 0) {
        var edge = this.edgesPool[index];
        if (edge.head === vertex || edge.tail === vertex) {
          this.edgesPool.splice(index, 1);
        }
      }

      // update edges according to remaining vertices
      this.updateEdges();
    }
  }, {
    key: 'updatePool',
    value: function updatePool(vertex) {
      var _this = this;

      this.vertices.forEach(function (sibling) {
        var a = vertex.x - sibling.x;
        var b = vertex.y - sibling.y;
        var dist = Math.sqrt(a * a + b * b);
        var edge = new _edge2['default'](vertex, sibling, dist);
        _this.edgesPool.push(edge);
      });

      this.edgesPool.sort(function (a, b) {
        return a.length < b.length ? -1 : 1;
      });
    }

    // https://en.wikipedia.org/wiki/Disjoint-set_data_structure
    // @todo - understand how this works...
  }, {
    key: '_makeSet',
    value: function _makeSet(vertex) {
      vertex._parent = vertex;
    }
  }, {
    key: '_find',
    value: function _find(x) {
      if (x._parent == x) {
        return x;
      } else {
        return this._find(x._parent);
      }
    }
  }, {
    key: '_union',
    value: function _union(x, y) {
      var xRoot = this._find(x);
      var yRoot = this._find(y);
      xRoot._parent = yRoot;
    }
  }, {
    key: 'updateEdges',
    value: function updateEdges() {
      var _this2 = this;

      this.vertices.forEach(function (vertex) {
        return vertex.resetEdges();
      });
      this.edges = [];

      // https://en.wikipedia.org/wiki/Kruskal%27s_algorithm
      this.vertices.forEach(function (vertice) {
        _this2._makeSet(vertice);
      });

      this.edgesPool.forEach(function (edge) {
        if (_this2._find(edge.tail) !== _this2._find(edge.head)) {
          _this2.edges.push(edge);
          _this2._union(edge.tail, edge.head);

          edge.tail.addEdge(edge);
          edge.head.addEdge(edge);
        }
      });
    }

    // @todo - finish
  }, {
    key: 'bfs',
    value: function bfs(root, syncTime, velocity) {
      // reset all vertices
      this.vertices.forEach(function (vertex) {
        return vertex.reset();
      });

      // start bfs
      var q = [];
      root.visit(syncTime, velocity);
      q.push(root);

      var _loop = function () {
        var node = q.shift();
        // find childs
        node.edges.forEach(function (edge) {
          var child = edge.tail !== node ? edge.tail : edge.head;
          if (child.visited) {
            return;
          }

          child.visit(syncTime, velocity, node, edge);
          q.push(child);
        });
      };

      while (q.length !== 0) {
        _loop();
      }

      this.vertices.sort(function (a, b) {
        return a.depth < b.depth ? -1 : 1;
      });
    }

    // for map visualization
  }, {
    key: 'serializeTriggerPath',
    value: function serializeTriggerPath() {
      var root = this.vertices[0];
      var data = root.serialize();

      function walkThrough(node, data) {
        node.edges.forEach(function (edge) {
          var sibling = edge.tail === node ? edge.head : edge.tail;

          if (sibling !== node.parent) {
            var json = sibling.serialize();
            json.distance = edge.length;

            data.next = data.next || [];
            data.next.push(json);

            walkThrough(sibling, json);
          }
        });
      }

      walkThrough(root, data);
      return data;
    }
  }]);

  return Tree;
})();

exports['default'] = Tree;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvdG9wb2xvZ3kvVHJlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7b0JBQ1osUUFBUTs7OztJQUVKLElBQUk7QUFDWixXQURRLElBQUksQ0FDWCxLQUFLLEVBQUU7MEJBREEsSUFBSTs7QUFFckIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7R0FDckI7O2VBTmtCLElBQUk7O1dBUWQsbUJBQUMsTUFBTSxFQUFFO2dDQUNDLE1BQU0sQ0FBQyxXQUFXO1VBQTNCLENBQUMsdUJBQUQsQ0FBQztVQUFFLENBQUMsdUJBQUQsQ0FBQzs7QUFDWixVQUFNLE1BQU0sR0FBRyx3QkFBVyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV4QyxVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7O0FBRW5CLGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUdXLHNCQUFDLE1BQU0sRUFBRTtBQUNuQixVQUFJLE1BQU0sWUFBQSxDQUFDOztBQUVYLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQzNCLFlBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFBRSxnQkFBTSxHQUFHLENBQUMsQ0FBQztTQUFFO09BQ3pDLENBQUMsQ0FBQzs7O0FBR0gsWUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxR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QUFFLENBQUMsRUFBSztBQUFFLGVBQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUFFLENBQUMsQ0FBQztLQUNyRTs7Ozs7V0FHbUIsZ0NBQUc7QUFDckIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTlCLGVBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDL0IsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0IsY0FBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUUzRCxjQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQzNCLGdCQUFNLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakMsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFNUIsZ0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7QUFDNUIsZ0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyQix1QkFBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztXQUM1QjtTQUNGLENBQUMsQ0FBQztPQUNKOztBQUVELGlCQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQW5Ka0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL3NlcnZlci90b3BvbG9neS9UcmVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlcnRleCBmcm9tICcuL1ZlcnRleCc7XG5pbXBvcnQgRWRnZSBmcm9tICcuL2VkZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmVlIHtcbiAgY29uc3RydWN0b3Ioc2V0dXApIHtcbiAgICB0aGlzLnNldHVwID0gc2V0dXA7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IFtdO1xuICAgIHRoaXMuZWRnZXMgPSBbXTtcbiAgICB0aGlzLmVkZ2VzUG9vbCA9IFtdOyAvLyBwb29sIG9mIGFsbCBwb3NzaWJsZSBlZGdlc1xuICB9XG5cbiAgYWRkVmVydGV4KGNsaWVudCkge1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gY2xpZW50LmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IHZlcnRleCA9IG5ldyBWZXJ0ZXgoY2xpZW50LCB4LCB5KTtcblxuICAgIHRoaXMudmVydGljZXMucHVzaCh2ZXJ0ZXgpO1xuXG4gICAgdGhpcy51cGRhdGVQb29sKHZlcnRleCk7XG4gICAgdGhpcy51cGRhdGVFZGdlcygpO1xuXG4gICAgcmV0dXJuIHZlcnRleDtcbiAgfVxuXG5cbiAgcmVtb3ZlVmVydGV4KGNsaWVudCkge1xuICAgIGxldCB2ZXJ0ZXg7XG4gICAgLy8gZmluZCB0aGUgdmVydGV4XG4gICAgdGhpcy52ZXJ0aWNlcy5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICBpZiAodi5jbGllbnQgPT09IGNsaWVudCkgeyB2ZXJ0ZXggPSB2OyB9XG4gICAgfSk7XG5cbiAgICAvLyByZXNldCBhbmQgcmVtb3ZlIGZyb20gdmVydGljZXNcbiAgICB2ZXJ0ZXgucmVzZXRFZGdlcygpO1xuICAgIHRoaXMudmVydGljZXMuc3BsaWNlKHRoaXMudmVydGljZXMuaW5kZXhPZih2ZXJ0ZXgpLCAxKTtcblxuICAgIC8vIHJlbW92ZSBhbGwgZWRnZXMgcG9pbnRpbmcgdG8gdGhlIHZlcnRleCBpbiB0aGUgcG9vbFxuICAgIGxldCBpbmRleCA9IHRoaXMuZWRnZXNQb29sLmxlbmd0aDtcbiAgICB3aGlsZSAoLS1pbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBlZGdlID0gdGhpcy5lZGdlc1Bvb2xbaW5kZXhdO1xuICAgICAgaWYgKGVkZ2UuaGVhZCA9PT0gdmVydGV4IHx8IGVkZ2UudGFpbCA9PT0gdmVydGV4KSB7XG4gICAgICAgIHRoaXMuZWRnZXNQb29sLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGVkZ2VzIGFjY29yZGluZyB0byByZW1haW5pbmcgdmVydGljZXNcbiAgICB0aGlzLnVwZGF0ZUVkZ2VzKCk7XG4gIH1cblxuICB1cGRhdGVQb29sKHZlcnRleCkge1xuICAgIHRoaXMudmVydGljZXMuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgY29uc3QgYSA9IHZlcnRleC54IC0gc2libGluZy54O1xuICAgICAgY29uc3QgYiA9IHZlcnRleC55IC0gc2libGluZy55O1xuICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChhICogYSArIGIgKiBiKTtcbiAgICAgIGNvbnN0IGVkZ2UgPSBuZXcgRWRnZSh2ZXJ0ZXgsIHNpYmxpbmcsIGRpc3QpO1xuICAgICAgdGhpcy5lZGdlc1Bvb2wucHVzaChlZGdlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWRnZXNQb29sLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiAoYS5sZW5ndGggPCBiLmxlbmd0aCkgPyAtMSA6IDE7XG4gICAgfSk7XG4gIH1cblxuICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EaXNqb2ludC1zZXRfZGF0YV9zdHJ1Y3R1cmVcbiAgLy8gQHRvZG8gLSB1bmRlcnN0YW5kIGhvdyB0aGlzIHdvcmtzLi4uXG4gIF9tYWtlU2V0KHZlcnRleCkge1xuICAgIHZlcnRleC5fcGFyZW50ID0gdmVydGV4O1xuICB9XG5cbiAgX2ZpbmQoeCkge1xuICAgIGlmICh4Ll9wYXJlbnQgPT0geCkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9maW5kKHguX3BhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgX3VuaW9uKHgsIHkpIHtcbiAgICBjb25zdCB4Um9vdCA9IHRoaXMuX2ZpbmQoeCk7XG4gICAgY29uc3QgeVJvb3QgPSB0aGlzLl9maW5kKHkpO1xuICAgIHhSb290Ll9wYXJlbnQgPSB5Um9vdDtcbiAgfVxuXG4gIHVwZGF0ZUVkZ2VzKCkge1xuICAgIHRoaXMudmVydGljZXMuZm9yRWFjaCh2ZXJ0ZXggPT4gdmVydGV4LnJlc2V0RWRnZXMoKSk7XG4gICAgdGhpcy5lZGdlcyA9IFtdO1xuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvS3J1c2thbCUyN3NfYWxnb3JpdGhtXG4gICAgdGhpcy52ZXJ0aWNlcy5mb3JFYWNoKCh2ZXJ0aWNlKSA9PiB7XG4gICAgICB0aGlzLl9tYWtlU2V0KHZlcnRpY2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lZGdlc1Bvb2wuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2ZpbmQoZWRnZS50YWlsKSAhPT0gdGhpcy5fZmluZChlZGdlLmhlYWQpKSB7XG4gICAgICAgIHRoaXMuZWRnZXMucHVzaChlZGdlKTtcbiAgICAgICAgdGhpcy5fdW5pb24oZWRnZS50YWlsLCBlZGdlLmhlYWQpO1xuXG4gICAgICAgIGVkZ2UudGFpbC5hZGRFZGdlKGVkZ2UpO1xuICAgICAgICBlZGdlLmhlYWQuYWRkRWRnZShlZGdlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIEB0b2RvIC0gZmluaXNoXG4gIGJmcyhyb290LCBzeW5jVGltZSwgdmVsb2NpdHkpIHtcbiAgICAvLyByZXNldCBhbGwgdmVydGljZXNcbiAgICB0aGlzLnZlcnRpY2VzLmZvckVhY2godmVydGV4ID0+IHZlcnRleC5yZXNldCgpKTtcblxuICAgIC8vIHN0YXJ0IGJmc1xuICAgIGNvbnN0IHEgPSBbXTtcbiAgICByb290LnZpc2l0KHN5bmNUaW1lLCB2ZWxvY2l0eSk7XG4gICAgcS5wdXNoKHJvb3QpO1xuXG4gICAgd2hpbGUgKHEubGVuZ3RoICE9PSAwKSB7XG4gICAgICBjb25zdCBub2RlID0gcS5zaGlmdCgpO1xuICAgICAgLy8gZmluZCBjaGlsZHNcbiAgICAgIG5vZGUuZWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGVkZ2UudGFpbCAhPT0gbm9kZSA/IGVkZ2UudGFpbCA6IGVkZ2UuaGVhZDtcbiAgICAgICAgaWYgKGNoaWxkLnZpc2l0ZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgY2hpbGQudmlzaXQoc3luY1RpbWUsIHZlbG9jaXR5LCBub2RlLCBlZGdlKTtcbiAgICAgICAgcS5wdXNoKGNoaWxkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudmVydGljZXMuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYS5kZXB0aCA8IGIuZGVwdGggPyAtMSA6IDEgfSk7XG4gIH1cblxuICAvLyBmb3IgbWFwIHZpc3VhbGl6YXRpb25cbiAgc2VyaWFsaXplVHJpZ2dlclBhdGgoKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMudmVydGljZXNbMF07XG4gICAgY29uc3QgZGF0YSA9IHJvb3Quc2VyaWFsaXplKCk7XG5cbiAgICBmdW5jdGlvbiB3YWxrVGhyb3VnaChub2RlLCBkYXRhKSB7XG4gICAgICBub2RlLmVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICAgICAgY29uc3Qgc2libGluZyA9IGVkZ2UudGFpbCA9PT0gbm9kZSA/IGVkZ2UuaGVhZCA6IGVkZ2UudGFpbDtcblxuICAgICAgICBpZiAoc2libGluZyAhPT0gbm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICBjb25zdCBqc29uID0gc2libGluZy5zZXJpYWxpemUoKTtcbiAgICAgICAgICBqc29uLmRpc3RhbmNlID0gZWRnZS5sZW5ndGg7XG5cbiAgICAgICAgICBkYXRhLm5leHQgPSBkYXRhLm5leHQgfHzCoFtdO1xuICAgICAgICAgIGRhdGEubmV4dC5wdXNoKGpzb24pO1xuXG4gICAgICAgICAgd2Fsa1Rocm91Z2goc2libGluZywganNvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHdhbGtUaHJvdWdoKHJvb3QsIGRhdGEpO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59Il19