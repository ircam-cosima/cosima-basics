export default class Boid {
  constructor(origin, destination, distance, velocity, color) {
    this.origin = origin;
    this.destination = destination;

    this.color = color;
    this.velocity = velocity;

    this._position = { x: origin.x, y: origin.y };
    // assume 1 meter per second
    this._velocity = {
      x: ((destination.x - origin.x) / distance) * velocity,
      y: ((destination.y - origin.y) / distance) * velocity,
    }

    this.isDone = false;
  }

  update(dt) {
    if (this.isDone) { return; }

    this._position.x += (this._velocity.x * dt);
    this._position.y += (this._velocity.y * dt);

    if (this._velocity.x > 0 && this._position.x > this.destination.x) {
      this.isDone = true;
    }

    if (this._velocity.x < 0 && this._position.x < this.destination.x) {
      this.isDone = true;
    }

    if (this._velocity.y > 0 && this._position.y > this.destination.y) {
      this.isDone = true;
    }

    if (this._velocity.y < 0 && this._position.y < this.destination.y) {
      this.isDone = true;
    }
  }

  render(ctx, ratio) {
    const x = this._position.x * ratio;
    const y = this._position.y * ratio;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}