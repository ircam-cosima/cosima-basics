import * as soundworks from 'soundworks/server';

class PlayerExperience extends soundworks.Experience {
  constructor(clientType, comm, tree) {
    super(clientType);

    this.comm = comm;
    this.tree = tree;

    this.sync = this.require('sync');
    this.checkin = this.require('checkin');
    // this.locator = this.require('locator');
    this.placer = this.require('placer');
    this.audioBufferManager = this.require('audio-buffer-manager');
    this.syncScheduler = this.require('sync-scheduler');
    this.sharedParams = this.require('shared-params');
  }

  enter(client) {
    super.enter(client);

    const vertex = this.tree.addVertex(client);
    // for the map (and the rest of the world)
    this.comm.emit('map:add:player', vertex, this.tree.edges);
    this.comm.emit('soloist:add:player', client);

    // when a client trigger a message
    this.receive(client, 'trigger', (syncTime, velocity, period, offset, markerIndex, resamplingIndex) => {
      // walk through tree from trigerring client
      this.tree.bfs(vertex, syncTime, velocity);

      // send detailled informations to each client
      this.tree.vertices.forEach(vertex => {
        if (client === vertex.client) { return; }

        const data = vertex.serialize(true);
        data.sourceId = client.index;
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
      this.comm.emit('map:trigger', path);
    });

    this.receive(client, 'subgraph:request', () => this._sendLocalTopology());
  }

  exit(client) {
    // remove vertex from tree
    this.tree.removeVertex(client);
    // share with the map
    this.comm.emit('map:remove:player', client.index, this.tree.edges);
    this.comm.emit('soloist:remove:player', client);
    // send updated informations to all clients
    this._sendLocalTopology();

    super.exit(client);
  }

  // send local topology to all players
  _sendLocalTopology() {
    this.tree.vertices.forEach(vertex => {
      const client = vertex.client;
      const data = vertex.serializeAdjacents();

      this.send(client, 'subgraph', data);
    });
  }
}

export default PlayerExperience;
