class Vertex {
  constructor(client, x, y) {
    this.id = client.index;
    this.client = client;
    this.x = x;
    this.y = y;

    this.edges = [];

    this.visited = false;
    this.depth = 0;
    this.distance = 0;
    this.parent = null;
  }

  addEdge(edge) {
    this.edges.push(edge);
  }

  visit(syncTime, velocity, parent = null, edge = null) {
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

  reset() {
    this.visited = false;
    this.depth = 0;
    this.distance = 0;
  }

  resetEdges() {
    this.edges.length = 0;
  }

  // @todo - rationnalize serialization
  // Serialize informations with adjacents nodes relatively positionned to `this`
  serializeAdjacents() {
    const data = {
      id: this.id,
      x: 0,
      y: 0,
      adjacentVertices: [],
    }

    this.edges.forEach((edge) => {
      const next = edge.tail === this ? edge.head : edge.tail;

      data.adjacentVertices.push({
        id: next.id,
        x: next.x - this.x,
        y: next.y - this.y,
        distance: edge.length,
      });
    });

    return data;
  }

  serialize(detailled = false) {
    const data = {
      id: this.id,
      x: this.x,
      y: this.y,
      depth: this.depth,
      // distanceFromRoot: this.distance,
      triggerTime: this.triggerTime,
      radius: 0.05, // remove from here
    };

    if (this.visited && detailled) {
      data.next = [];

      if (this.parent) {
        data.prev = {
          x: this.parent.x,
          y: this.parent.y,
          distance: this.distance - this.parent.distance,
          triggerTime: this.parent.triggerTime,
        };
      }

      this.edges.forEach((edge) => {
        const sibling = edge.tail === this ? edge.head : edge.tail;

        if (sibling === this.parent) {
          data.prev.distance = edge.length;
        } else {
          data.next.push({
            x: sibling.x,
            y: sibling.y,
            distance: edge.length,
            triggerTime: sibling.triggerTime,
          });
        }
      });
    }

    return data;
  }
}

export default Vertex;
