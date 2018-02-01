import Vertex from './Vertex';
import Edge from './edge';

class Tree {
  constructor() {
    this.vertices = [];
    this.edges = [];
    this.edgesPool = []; // pool of all possible edges
  }

  addVertex(client) {
    const [ x, y ] = client.coordinates;
    const vertex = new Vertex(client, x, y);

    this.vertices.push(vertex);

    this.updatePool(vertex);
    this.updateEdges();

    return vertex;
  }


  removeVertex(client) {
    let vertex;
    // find the vertex
    this.vertices.forEach((v) => {
      if (v.client === client) { vertex = v; }
    });

    // reset and remove from vertices
    vertex.resetEdges();
    this.vertices.splice(this.vertices.indexOf(vertex), 1);

    // remove all edges pointing to the vertex in the pool
    let index = this.edgesPool.length;
    while (--index >= 0) {
      const edge = this.edgesPool[index];
      if (edge.head === vertex || edge.tail === vertex) {
        this.edgesPool.splice(index, 1);
      }
    }

    // update edges according to remaining vertices
    this.updateEdges();
  }

  updatePool(vertex) {
    this.vertices.forEach((sibling) => {
      const a = vertex.x - sibling.x;
      const b = vertex.y - sibling.y;
      const dist = Math.sqrt(a * a + b * b);
      const edge = new Edge(vertex, sibling, dist);
      this.edgesPool.push(edge);
    });

    this.edgesPool.sort((a, b) => {
      return (a.length < b.length) ? -1 : 1;
    });
  }

  // https://en.wikipedia.org/wiki/Disjoint-set_data_structure
  // @todo - understand how this works...
  _makeSet(vertex) {
    vertex._parent = vertex;
  }

  _find(x) {
    if (x._parent == x) {
      return x;
    } else {
      return this._find(x._parent);
    }
  }

  _union(x, y) {
    const xRoot = this._find(x);
    const yRoot = this._find(y);
    xRoot._parent = yRoot;
  }

  updateEdges() {
    this.vertices.forEach(vertex => vertex.resetEdges());
    this.edges = [];

    // https://en.wikipedia.org/wiki/Kruskal%27s_algorithm
    this.vertices.forEach((vertice) => {
      this._makeSet(vertice);
    });

    this.edgesPool.forEach((edge) => {
      if (this._find(edge.tail) !== this._find(edge.head)) {
        this.edges.push(edge);
        this._union(edge.tail, edge.head);

        edge.tail.addEdge(edge);
        edge.head.addEdge(edge);
      }
    });
  }

  // @todo - finish
  bfs(root, syncTime, velocity) {
    // reset all vertices
    this.vertices.forEach(vertex => vertex.reset());

    // start bfs
    const q = [];
    root.visit(syncTime, velocity);
    q.push(root);

    while (q.length !== 0) {
      const node = q.shift();
      // find childs
      node.edges.forEach((edge) => {
        const child = edge.tail !== node ? edge.tail : edge.head;
        if (child.visited) { return; }

        child.visit(syncTime, velocity, node, edge);
        q.push(child);
      });
    }

    this.vertices.sort((a, b) => { return a.depth < b.depth ? -1 : 1 });
  }

  // for map visualization
  serializeTriggerPath() {
    const root = this.vertices[0];
    const data = root.serialize();

    function walkThrough(node, data) {
      node.edges.forEach((edge) => {
        const sibling = edge.tail === node ? edge.head : edge.tail;

        if (sibling !== node.parent) {
          const json = sibling.serialize();
          json.distance = edge.length;

          data.next = data.next || [];
          data.next.push(json);

          walkThrough(sibling, json);
        }
      });
    }

    walkThrough(root, data);
    return data;
  }
}

export default Tree;
