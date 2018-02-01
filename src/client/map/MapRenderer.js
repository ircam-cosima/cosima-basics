import * as soundworks from 'soundworks/client';
import getColor from '../shared/getColor';
import Boid from '../shared/Boid';
import ActiveVertex from '../shared/ActiveVertex';

class MapRenderer extends soundworks.Canvas2dRenderer {
  constructor() {
    super();

    this.boids = [];
    this.activeVertices = [];

    this.map = { vertices: [], edges: [] };
  }

  onResize(width, height, orientation) {
    super.onResize(width, height, orientation);

    if (this.area)
      this._updateRatio();
  }

  _updateRatio() {
    const area = this.area;
    const xRatio = this.canvasWidth / area.width;
    const yRatio = this.canvasHeight / area.height;

    this.ratio = Math.min(xRatio, yRatio);
  }

  setArea(area) {
    this.area = area;
    this._updateRatio();
  }

  updateMap(vertices, edges) {
    this.map.vertices = vertices;
    this.map.edges = edges;
  }

  triggerPath(node, velocity = null, color = null) {
    if (color === null)
      color = getColor(node.id);

    const activeVertex = new ActiveVertex(node.x, node.y, color);
    this.activeVertices.push(activeVertex);

    if (node.next) {
      node.next.forEach((dest) => {
        let nodeTriggerTime;

        if (node.currentSyncTime)
          nodeTriggerTime = node.currentSyncTime;
        else
          nodeTriggerTime = node.triggerTime;

        const velocity = dest.distance / (dest.triggerTime - nodeTriggerTime);
        const boid = new Boid(node, dest, dest.distance, velocity, color);

        this.boids.push(boid);
      });
    }
  }

  update(dt) {
    let index;
    // update boids
    index = this.boids.length;
    while (--index >= 0) {
      const boid = this.boids[index];
      boid.update(dt);

      if (boid.isDone) {
        this.triggerPath(boid.destination, boid.velocity, boid.color);
        this.boids.splice(index, 1);
      }
    }

    // update active vertices
    index = this.activeVertices.length;

    while (--index >= 0) {
      const vertex = this.activeVertices[index];
      vertex.update(dt);

      if (vertex.isDone) {
        this.activeVertices.splice(index, 1);
      }
    }
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const ratio = this.ratio;

    ctx.beginPath();
    ctx.strokeStyle = `#363636`;
    ctx.rect(0, 0, this.area.width * ratio, this.area.height * ratio);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = `#ffffff`;

    this.map.edges.forEach(edge => {
      // console.log(edge);
      const head = edge.head;
      const tail = edge.tail;
      // console.log(, tail.y * this.ratio);
      ctx.moveTo(head.x * this.ratio, head.y * this.ratio);
      ctx.lineTo(tail.x * this.ratio, tail.y * this.ratio);
    });

    ctx.stroke();
    ctx.closePath();

    this.map.vertices.forEach(vertice => {
      ctx.beginPath();
      ctx.fillStyle = `#ffffff`;

      ctx.arc(vertice.x * this.ratio, vertice.y * this.ratio, 3, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      // console.log(vertice);
      // // console.log(edge);
      // const head = edge.head;
      // const tail = edge.tail;
      // // console.log(, tail.y * this.ratio);
      // ctx.moveTo(head.x * this.ratio, head.y * this.ratio);
      // ctx.lineTo(tail.x * this.ratio, tail.y * this.ratio);
    });

    // ctx.closePath();
    ctx.globalAlpha = 1;

    this.boids.forEach((boid) => {
      boid.render(ctx, this.ratio, 5);
    });

    this.activeVertices.forEach((vertex) => {
      vertex.render(ctx, this.ratio);
    });
  }
}

export default MapRenderer;
