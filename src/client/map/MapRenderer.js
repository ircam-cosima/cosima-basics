import soundworks from 'soundworks/client';
import getColor from '../shared/getColor';
import Boid from '../shared/Boid';
import ActiveVertex from '../shared/ActiveVertex';

export default class MapRenderer extends soundworks.display.Renderer {
  constructor() {
    super();

    this.boids = [];
    this.activeVertices = [];
  }

  /**
   * @todo - rename to `resize` (same for renderers)
   */
  updateSize(width, height) {
    super.updateSize(width, height);

    if (this.area) {
      this._updateRatio();
    }
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

  addVertex(vertex) {
    this.vertices.push(vertex);
  }

  setEdges(edges) {
    this.edges = edges;
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
    ctx.stroke();
    ctx.closePath();

    this.boids.forEach((boid) => {
      boid.render(ctx, this.ratio);
    });

    this.activeVertices.forEach((vertex) => {
      vertex.render(ctx, this.ratio);
    });
  }
}