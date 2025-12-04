export default class EffectBresenhamCircle {
    constructor(x, y, radius, color, ctx, width) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.ctx = ctx;
        this.width = width;
    }
    bresenhamCircle = (xc, yc, r) =>{
      let x = 0, y = r;
      let d = 3 - 2 * r;
      
      while (x <= y) {
            this.drawPoints(xc, yc, x, y);
        if (d < 0)
            d = d + 4 * x + 6
        else {
            d = d + 4 * (x - y) + 10
            y--
        }
        x++
      }
    }
    
    drawSpan(start, end) {
        ctx.fillRect(start.x, start.y, end.x - start.x, 10)
    }
    drawPoints(xc, yc, x, y, draw_size = this.width) {
    this.ctx.fillRect(xc+x, yc+y, draw_size, draw_size);
    this.ctx.fillRect(xc-x, yc+y, draw_size, draw_size);
    this.ctx.fillRect(xc+x, yc-y, draw_size, draw_size);
    this.ctx.fillRect(xc-x, yc-y, draw_size, draw_size);
    this.ctx.fillRect(xc+y, yc+x, draw_size, draw_size);
    this.ctx.fillRect(xc-y, yc+x, draw_size, draw_size);
    this.ctx.fillRect(xc+y, yc-x, draw_size, draw_size);
    this.ctx.fillRect(xc-y, yc-x, draw_size, draw_size);
}
    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = this.color;
        this.bresenhamCircle(this.x, this.y, this.radius);
        this.radius += 30;
    }

}
