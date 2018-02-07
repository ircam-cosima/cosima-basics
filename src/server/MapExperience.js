import * as soundworks from 'soundworks/server';

class MapExperience extends soundworks.Experience {
  constructor(clientType, comm, tree) {
    super(clientType);

    this.comm = comm;
    this.tree = tree;

    this.sharedConfig = this.require('shared-config');
    this.sync = this.require('sync');
  }

  start() {
    this.area = this.sharedConfig.get('setup.area');
  }

  enter(client) {
    super.enter(client);

    // initialize client
    this.receive(client, 'request:area', () => {
      this.send(client, 'init:area', {
        width: this.area.width,
        height: this.area.height,
      });
    });

    this.receive(client, 'request:map', () => {
      const vertices = this.tree.vertices.map(vertex => vertex.serialize());
      const edges = this.tree.edges.map(edge => edge.serialize());

      this.send(client, 'update:map', vertices, edges);
    });

    // listen player performance
    this.comm.on('map:add:player', () => {
      // edges = edges.map((edge) => edge.serialize());
      // this.send(client, 'add:player', vertex.serialize(), edges);
      const vertices = this.tree.vertices.map(vertex => vertex.serialize());
      const edges = this.tree.edges.map(edge => edge.serialize());

      this.send(client, 'update:map', vertices, edges);
    });

    this.comm.on('map:remove:player', () => {
      // edges = edges.map((edge) => edge.serialize());
      // this.send(client, 'remove:player', id, edges);
      const vertices = this.tree.vertices.map(vertex => vertex.serialize());
      const edges = this.tree.edges.map(edge => edge.serialize());

      this.send(client, 'update:map', vertices, edges);
    });

    this.comm.on('map:trigger', (pathInfos) => {
      this.send(client, 'trigger', pathInfos);
    });
  }

  // exit(client) {
  //   super.exit(client);
  // }
}

export default MapExperience;
