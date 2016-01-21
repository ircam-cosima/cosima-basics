import soundworks from 'soundworks/client';
import getColor from '../shared/getColor';

export default class PlayerRenderer extends soundworks.display.Renderer {
  constructor() {
    super(0); // update bounded to frame rate

    this.graphData = null;
    this.graphRatio = null;

    this.activeVertices = [];
    this.boids = [];
  }

  setGraph(data, ratio) {
    this.graphData = data;
    this.graphRatio = ratio;
  }

  setAngle(angle) {
    this.angle = angle;
  }

  addBoid(boid) {
    this.boids.push(boid);
  }

  addActiveVertex(vertex) {
    this.activeVertices.push(vertex);
  }

  update(dt) {
    let index;
    // update boids
    index = this.boids.length;
    while (--index >= 0) {
      const boid = this.boids[index];
      boid.update(dt);

      if (boid.isDone) {
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
    const ratio = this.graphRatio;
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.angle);

    // render the graph
    if (this.graphData) {
      ctx.save();

      this.graphData.adjacentVertices.forEach((vertex) => {
        const x = vertex.x * ratio;
        const y = vertex.y * ratio;

        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.4;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#000000'; // getColor(vertex.id);

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.fillStyle = getColor(this.graphData.id);

      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // render boids and active vertices
    this.boids.forEach((boid) => {
      boid.render(ctx, ratio);
    });

    this.activeVertices.forEach((vertex) => {
      vertex.render(ctx, ratio);
    });

    ctx.restore();
  }
}
