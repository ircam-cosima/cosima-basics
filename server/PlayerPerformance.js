'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _soundworksServer = require('soundworks/server');

var _topologyTree = require('./topology/Tree');

var _topologyTree2 = _interopRequireDefault(_topologyTree);

var PlayerPerformance = (function (_ServerPerformance) {
  _inherits(PlayerPerformance, _ServerPerformance);

  function PlayerPerformance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, PlayerPerformance);

    _get(Object.getPrototypeOf(PlayerPerformance.prototype), 'constructor', this).call(this, options);

    this.tree = new _topologyTree2['default'](options.setup);
    this.sync = options.sync;
    this._velocityMean = null;
    this._velocitySpread = null;
  }

  _createClass(PlayerPerformance, [{
    key: 'enter',
    value: function enter(client) {
      var _this = this;

      _get(Object.getPrototypeOf(PlayerPerformance.prototype), 'enter', this).call(this, client);

      var vertex = this.tree.addVertex(client);
      // for the map (and the rest of the world)
      this.emit('add:player', vertex, this.tree.edges);

      this._sendLocalTopology();

      // when a client trigger a message
      this.receive(client, 'trigger', function (syncTime, velocity, period, offset, markerIndex, resamplingIndex) {
        // walk through tree from trigerring client
        _this.tree.bfs(vertex, syncTime, velocity);

        // send detailled informations to each client
        _this.tree.vertices.forEach(function (vertex) {
          if (client === vertex.client) {
            return;
          }

          var data = vertex.serialize(true);
          data.sourceId = client.uid;
          // 'periodic' mode
          data.period = period;
          data.offsetPeriod = offset;

          // for 'granular' mode
          data.offsetTime = syncTime;
          data.velocity = velocity;
          data.markerIndex = markerIndex;
          data.resamplingIndex = resamplingIndex;

          _this.send(vertex.client, 'trigger', data);
        });

        // for the rest of the world (map)
        var path = _this.tree.serializeTriggerPath();
        _this.emit('trigger', path);
      });
    }
  }, {
    key: 'exit',
    value: function exit(client) {
      _get(Object.getPrototypeOf(PlayerPerformance.prototype), 'exit', this).call(this, client);
      // remove vertex from tree
      this.tree.removeVertex(client);
      // share with the map
      this.emit('remove:player', client.uid, this.tree.edges);
      // send updated informations to all clients
      this._sendLocalTopology();
    }

    // send local topology to all players
  }, {
    key: '_sendLocalTopology',
    value: function _sendLocalTopology() {
      var _this2 = this;

      this.tree.vertices.forEach(function (vertex) {
        var client = vertex.client;
        var data = vertex.serializeAdjacents();

        _this2.send(client, 'subgraph', data);
      });
    }
  }]);

  return PlayerPerformance;
})(_soundworksServer.ServerPerformance);

exports['default'] = PlayerPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvUGxheWVyUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztnQ0FBa0MsbUJBQW1COzs0QkFDcEMsaUJBQWlCOzs7O0lBRWIsaUJBQWlCO1lBQWpCLGlCQUFpQjs7QUFDekIsV0FEUSxpQkFBaUIsR0FDVjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLElBQUksR0FBRyw4QkFBUyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0dBQzdCOztlQVJrQixpQkFBaUI7O1dBVS9CLGVBQUMsTUFBTSxFQUFFOzs7QUFDWixpQ0FYaUIsaUJBQWlCLHVDQVd0QixNQUFNLEVBQUU7O0FBRXBCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQyxVQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7OztBQUcxQixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBSzs7QUFFcEcsY0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7OztBQUcxQyxjQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ3JDLGNBQUksTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUV6QyxjQUFNLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLGNBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7QUFFM0IsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7OztBQUczQixjQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUMzQixjQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixjQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUMvQixjQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQzs7QUFFdkMsZ0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNDLENBQUMsQ0FBQzs7O0FBR0gsWUFBTSxJQUFJLEdBQUcsTUFBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztBQUM5QyxjQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDNUIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVHLGNBQUMsTUFBTSxFQUFFO0FBQ1gsaUNBbERpQixpQkFBaUIsc0NBa0R2QixNQUFNLEVBQUU7O0FBRW5CLFVBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUvQixVQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhELFVBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzNCOzs7OztXQUdpQiw4QkFBRzs7O0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUNyQyxZQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzdCLFlBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDOztBQUV6QyxlQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3JDLENBQUMsQ0FBQztLQUNKOzs7U0FuRWtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL3NlcnZlci9QbGF5ZXJQZXJmb3JtYW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlcnZlclBlcmZvcm1hbmNlIH0gZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuaW1wb3J0IFRyZWUgZnJvbSAnLi90b3BvbG9neS9UcmVlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyUGVyZm9ybWFuY2UgZXh0ZW5kcyBTZXJ2ZXJQZXJmb3JtYW5jZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy50cmVlID0gbmV3IFRyZWUob3B0aW9ucy5zZXR1cCk7XG4gICAgdGhpcy5zeW5jID0gb3B0aW9ucy5zeW5jO1xuICAgIHRoaXMuX3ZlbG9jaXR5TWVhbiA9IG51bGw7XG4gICAgdGhpcy5fdmVsb2NpdHlTcHJlYWQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgc3VwZXIuZW50ZXIoY2xpZW50KTtcblxuICAgIGNvbnN0IHZlcnRleCA9IHRoaXMudHJlZS5hZGRWZXJ0ZXgoY2xpZW50KTtcbiAgICAvLyBmb3IgdGhlIG1hcCAoYW5kIHRoZSByZXN0IG9mIHRoZSB3b3JsZClcbiAgICB0aGlzLmVtaXQoJ2FkZDpwbGF5ZXInLCB2ZXJ0ZXgsIHRoaXMudHJlZS5lZGdlcyk7XG5cbiAgICB0aGlzLl9zZW5kTG9jYWxUb3BvbG9neSgpO1xuXG4gICAgLy8gd2hlbiBhIGNsaWVudCB0cmlnZ2VyIGEgbWVzc2FnZVxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICd0cmlnZ2VyJywgKHN5bmNUaW1lLCB2ZWxvY2l0eSwgcGVyaW9kLCBvZmZzZXQsIG1hcmtlckluZGV4LCByZXNhbXBsaW5nSW5kZXgpID0+IHtcbiAgICAgIC8vIHdhbGsgdGhyb3VnaCB0cmVlIGZyb20gdHJpZ2VycmluZyBjbGllbnRcbiAgICAgIHRoaXMudHJlZS5iZnModmVydGV4LCBzeW5jVGltZSwgdmVsb2NpdHkpO1xuXG4gICAgICAvLyBzZW5kIGRldGFpbGxlZCBpbmZvcm1hdGlvbnMgdG8gZWFjaCBjbGllbnRcbiAgICAgIHRoaXMudHJlZS52ZXJ0aWNlcy5mb3JFYWNoKCh2ZXJ0ZXgpID0+IHtcbiAgICAgICAgaWYgKGNsaWVudCA9PT0gdmVydGV4LmNsaWVudCkgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBkYXRhID0gdmVydGV4LnNlcmlhbGl6ZSh0cnVlKTtcbiAgICAgICAgZGF0YS5zb3VyY2VJZCA9IGNsaWVudC51aWQ7XG4gICAgICAgIC8vICdwZXJpb2RpYycgbW9kZVxuICAgICAgICBkYXRhLnBlcmlvZCA9IHBlcmlvZDtcbiAgICAgICAgZGF0YS5vZmZzZXRQZXJpb2QgPSBvZmZzZXQ7XG5cbiAgICAgICAgLy8gZm9yICdncmFudWxhcicgbW9kZVxuICAgICAgICBkYXRhLm9mZnNldFRpbWUgPSBzeW5jVGltZTtcbiAgICAgICAgZGF0YS52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgICAgICBkYXRhLm1hcmtlckluZGV4ID0gbWFya2VySW5kZXg7XG4gICAgICAgIGRhdGEucmVzYW1wbGluZ0luZGV4ID0gcmVzYW1wbGluZ0luZGV4O1xuXG4gICAgICAgIHRoaXMuc2VuZCh2ZXJ0ZXguY2xpZW50LCAndHJpZ2dlcicsIGRhdGEpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGZvciB0aGUgcmVzdCBvZiB0aGUgd29ybGQgKG1hcClcbiAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnRyZWUuc2VyaWFsaXplVHJpZ2dlclBhdGgoKTtcbiAgICAgIHRoaXMuZW1pdCgndHJpZ2dlcicsIHBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgZXhpdChjbGllbnQpIHtcbiAgICBzdXBlci5leGl0KGNsaWVudCk7XG4gICAgLy8gcmVtb3ZlIHZlcnRleCBmcm9tIHRyZWVcbiAgICB0aGlzLnRyZWUucmVtb3ZlVmVydGV4KGNsaWVudCk7XG4gICAgLy8gc2hhcmUgd2l0aCB0aGUgbWFwXG4gICAgdGhpcy5lbWl0KCdyZW1vdmU6cGxheWVyJywgY2xpZW50LnVpZCwgdGhpcy50cmVlLmVkZ2VzKTtcbiAgICAvLyBzZW5kIHVwZGF0ZWQgaW5mb3JtYXRpb25zIHRvIGFsbCBjbGllbnRzXG4gICAgdGhpcy5fc2VuZExvY2FsVG9wb2xvZ3koKTtcbiAgfVxuXG4gIC8vIHNlbmQgbG9jYWwgdG9wb2xvZ3kgdG8gYWxsIHBsYXllcnNcbiAgX3NlbmRMb2NhbFRvcG9sb2d5KCkge1xuICAgIHRoaXMudHJlZS52ZXJ0aWNlcy5mb3JFYWNoKCh2ZXJ0ZXgpID0+IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IHZlcnRleC5jbGllbnQ7XG4gICAgICBjb25zdCBkYXRhID0gdmVydGV4LnNlcmlhbGl6ZUFkamFjZW50cygpO1xuXG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc3ViZ3JhcGgnLCBkYXRhKTtcbiAgICB9KTtcbiAgfVxufVxuIl19