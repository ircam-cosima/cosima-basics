export default class ActiveVertex {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.opacity = 1;
    this.radius = 0;
    // this.radius = 50;
    this.isDone = false;
  }

  update() {
    this.radius += 0.05;
    this.opacity -= 0.05;

    if (this.opacity < 0) {
      this.isDone = true;
    }

    // this.opacity = -1;
  }

  render(ctx, ratio, radiusRatio = 1) {
    const x = this.x * ratio;
    const y = this.y * ratio;
    const radius = this.radius * ratio;

    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.arc(x, y, radius * radiusRatio, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
