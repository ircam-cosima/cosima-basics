let id = 0;

class Edge {
  constructor(tail, head, length) {
    this.id = id++;
    this.tail = tail;
    this.head = head;
    this.length = length;

    this.tail.addEdge(this);
    this.head.addEdge(this);
  }

  serialize() {
    return {
      id: this.id,
      tail: { x: this.tail.x, y: this.tail.y },
      head: { x: this.head.x, y: this.head.y },
      length: this.length,
    };
  }
}

export default Edge;
