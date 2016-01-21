import { ServerPerformance } from 'soundworks/server';
import Tree from './topology/Tree';

export default class PlayerPerformance extends ServerPerformance {
  constructor(options = {}) {
    super(options);

    this.tree = new Tree(options.setup);
    this.sync = options.sync;
    this._velocityMean = null;
    this._velocitySpread = null;
  }

  enter(client) {
    super.enter(client);

    const vertex = this.tree.addVertex(client);
    // for the map (and the rest of the world)
    this.emit('add:player', vertex, this.tree.edges);

    this._sendLocalTopology();

    // when a client trigger a message
    this.receive(client, 'trigger', (syncTime, velocity, period, offset, markerIndex, resamplingIndex) => {
      // walk through tree from trigerring client
      this.tree.bfs(vertex, syncTime, velocity);

      // send detailled informations to each client
      this.tree.vertices.forEach((vertex) => {
        if (client === vertex.client) { return; }

        const data = vertex.serialize(true);
        data.sourceId = client.uid;
        // 'periodic' mode
        data.period = period;
        data.offsetPeriod = offset;

        // for 'granular' mode
        data.offsetTime = syncTime;
        data.velocity = velocity;
        data.markerIndex = markerIndex;
        data.resamplingIndex = resamplingIndex;

        this.send(vertex.client, 'trigger', data);
      });

      // for the rest of the world (map)
      const path = this.tree.serializeTriggerPath();
      this.emit('trigger', path);
    });
  }

  exit(client) {
    super.exit(client);
    // remove vertex from tree
    this.tree.removeVertex(client);
    // share with the map
    this.emit('remove:player', client.uid, this.tree.edges);
    // send updated informations to all clients
    this._sendLocalTopology();
  }

  // send local topology to all players
  _sendLocalTopology() {
    this.tree.vertices.forEach((vertex) => {
      const client = vertex.client;
      const data = vertex.serializeAdjacents();

      this.send(client, 'subgraph', data);
    });
  }
}
