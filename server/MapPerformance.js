'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _soundworksServer = require('soundworks/server');

var MapPerformance = (function (_ServerPerformance) {
  _inherits(MapPerformance, _ServerPerformance);

  function MapPerformance(options) {
    _classCallCheck(this, MapPerformance);

    _get(Object.getPrototypeOf(MapPerformance.prototype), 'constructor', this).call(this, options);

    this.setup = options.setup;
    this.playerPerformance = options.playerPerformance;
  }

  _createClass(MapPerformance, [{
    key: 'enter',
    value: function enter(client) {
      var _this = this;

      _get(Object.getPrototypeOf(MapPerformance.prototype), 'enter', this).call(this, client);

      // initialize client
      this.receive(client, 'request:area', function () {
        _this.send(client, 'init:area', {
          width: _this.setup.width,
          height: _this.setup.height
        });
      });

      this.receive(client, 'request:map', function () {
        var vertices = _this.playerPerformance.tree.vertices.map(function (vertex) {
          return vertex.serialize();
        });

        var edges = _this.playerPerformance.tree.edges.map(function (edge) {
          return edge.serialize();
        });

        _this.send(client, 'init:map', vertices, edges);
      });

      // listen player performance
      this.playerPerformance.on('add:player', function (vertex, edges) {
        edges = edges.map(function (edge) {
          return edge.serialize();
        });
        _this.send(client, 'add:player', vertex.serialize(), edges);
      });

      this.playerPerformance.on('remove:player', function (id, edges) {
        edges = edges.map(function (edge) {
          return edge.serialize();
        });
        _this.send(client, 'remove:player', id, edges);
      });

      this.playerPerformance.on('trigger', function (pathInfos) {
        _this.send(client, 'trigger', pathInfos);
      });
    }
  }, {
    key: 'exit',
    value: function exit(client) {
      _get(Object.getPrototypeOf(MapPerformance.prototype), 'exit', this).call(this, client);
    }
  }]);

  return MapPerformance;
})(_soundworksServer.ServerPerformance);

exports['default'] = MapPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTWFwUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Z0NBQWtDLG1CQUFtQjs7SUFFaEMsY0FBYztZQUFkLGNBQWM7O0FBQ3RCLFdBRFEsY0FBYyxDQUNyQixPQUFPLEVBQUU7MEJBREYsY0FBYzs7QUFFL0IsK0JBRmlCLGNBQWMsNkNBRXpCLE9BQU8sRUFBRTs7QUFFZixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDM0IsUUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztHQUNwRDs7ZUFOa0IsY0FBYzs7V0FRNUIsZUFBQyxNQUFNLEVBQUU7OztBQUNaLGlDQVRpQixjQUFjLHVDQVNuQixNQUFNLEVBQUU7OztBQUdwQixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsWUFBTTtBQUN6QyxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO0FBQzdCLGVBQUssRUFBRSxNQUFLLEtBQUssQ0FBQyxLQUFLO0FBQ3ZCLGdCQUFNLEVBQUUsTUFBSyxLQUFLLENBQUMsTUFBTTtTQUMxQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLFlBQU07QUFDeEMsWUFBTSxRQUFRLEdBQUcsTUFBSyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUNwRSxpQkFBTyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDM0IsQ0FBQyxDQUFDOztBQUVILFlBQU0sS0FBSyxHQUFHLE1BQUssaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDNUQsaUJBQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3pCLENBQUMsQ0FBQzs7QUFFSCxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNoRCxDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQUMsTUFBTSxFQUFFLEtBQUssRUFBSztBQUN6RCxhQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtTQUFBLENBQUMsQ0FBQztBQUM5QyxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUM1RCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFLO0FBQ3hELGFBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQzlDLGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQy9DLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLFNBQVMsRUFBSztBQUNsRCxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO09BQ3pDLENBQUMsQ0FBQztLQUNKOzs7V0FFRyxjQUFDLE1BQU0sRUFBRTtBQUNYLGlDQWhEaUIsY0FBYyxzQ0FnRHBCLE1BQU0sRUFBRTtLQUNwQjs7O1NBakRrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvc2VydmVyL01hcFBlcmZvcm1hbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmVyUGVyZm9ybWFuY2UgfSBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcFBlcmZvcm1hbmNlIGV4dGVuZHMgU2VydmVyUGVyZm9ybWFuY2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cDtcbiAgICB0aGlzLnBsYXllclBlcmZvcm1hbmNlID0gb3B0aW9ucy5wbGF5ZXJQZXJmb3JtYW5jZTtcbiAgfVxuXG4gIGVudGVyKGNsaWVudCkge1xuICAgIHN1cGVyLmVudGVyKGNsaWVudCk7XG5cbiAgICAvLyBpbml0aWFsaXplIGNsaWVudFxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0OmFyZWEnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnaW5pdDphcmVhJywge1xuICAgICAgICB3aWR0aDogdGhpcy5zZXR1cC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLnNldHVwLmhlaWdodCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3Q6bWFwJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnBsYXllclBlcmZvcm1hbmNlLnRyZWUudmVydGljZXMubWFwKCh2ZXJ0ZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIHZlcnRleC5zZXJpYWxpemUoKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBlZGdlcyA9IHRoaXMucGxheWVyUGVyZm9ybWFuY2UudHJlZS5lZGdlcy5tYXAoKGVkZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuIGVkZ2Uuc2VyaWFsaXplKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2luaXQ6bWFwJywgdmVydGljZXMsIGVkZ2VzKTtcbiAgICB9KTtcblxuICAgIC8vIGxpc3RlbiBwbGF5ZXIgcGVyZm9ybWFuY2VcbiAgICB0aGlzLnBsYXllclBlcmZvcm1hbmNlLm9uKCdhZGQ6cGxheWVyJywgKHZlcnRleCwgZWRnZXMpID0+IHtcbiAgICAgIGVkZ2VzID0gZWRnZXMubWFwKChlZGdlKSA9PiBlZGdlLnNlcmlhbGl6ZSgpKTtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdhZGQ6cGxheWVyJywgdmVydGV4LnNlcmlhbGl6ZSgpLCBlZGdlcyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnBsYXllclBlcmZvcm1hbmNlLm9uKCdyZW1vdmU6cGxheWVyJywgKGlkLCBlZGdlcykgPT4ge1xuICAgICAgZWRnZXMgPSBlZGdlcy5tYXAoKGVkZ2UpID0+IGVkZ2Uuc2VyaWFsaXplKCkpO1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3JlbW92ZTpwbGF5ZXInLCBpZCwgZWRnZXMpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wbGF5ZXJQZXJmb3JtYW5jZS5vbigndHJpZ2dlcicsIChwYXRoSW5mb3MpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICd0cmlnZ2VyJywgcGF0aEluZm9zKTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgc3VwZXIuZXhpdChjbGllbnQpO1xuICB9XG59Il19