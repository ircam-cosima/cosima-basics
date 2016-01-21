import { ServerPerformance } from 'soundworks/server';

export default class MapPerformance extends ServerPerformance {
  constructor(options) {
    super(options);

    this.setup = options.setup;
    this.playerPerformance = options.playerPerformance;
  }

  enter(client) {
    super.enter(client);

    // initialize client
    this.receive(client, 'request:area', () => {
      this.send(client, 'init:area', {
        width: this.setup.width,
        height: this.setup.height,
      });
    });

    this.receive(client, 'request:map', () => {
      const vertices = this.playerPerformance.tree.vertices.map((vertex) => {
        return vertex.serialize();
      });

      const edges = this.playerPerformance.tree.edges.map((edge) => {
        return edge.serialize();
      });

      this.send(client, 'init:map', vertices, edges);
    });

    // listen player performance
    this.playerPerformance.on('add:player', (vertex, edges) => {
      edges = edges.map((edge) => edge.serialize());
      this.send(client, 'add:player', vertex.serialize(), edges);
    });

    this.playerPerformance.on('remove:player', (id, edges) => {
      edges = edges.map((edge) => edge.serialize());
      this.send(client, 'remove:player', id, edges);
    });

    this.playerPerformance.on('trigger', (pathInfos) => {
      this.send(client, 'trigger', pathInfos);
    });
  }

  exit(client) {
    super.exit(client);
  }
}