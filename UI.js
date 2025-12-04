export default class UI {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.roundStartImage = null;
        this.starsImage = null;
        this.loadRoundStartImage();
    }
    
    sin_off = 0;

    loadRoundStartImage() {
        this.roundStartImage = new Image();
        this.roundStartImage.src = "./imgs/vs_logo.png";
        this.starsImage = new Image();
        this.starsImage.src = "./imgs/stars.png";
    }
    
    drawRoundStart(score) {
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(0, 10, this.canvas.width, 100);
        this.ctx.globalAlpha = 1.0;
        if (this.roundStartImage && this.roundStartImage.complete) {
            this.ctx.drawImage(this.roundStartImage, this.canvas.width / 2 - 50, 10, 100, 100);
        }
        for (let i = 0; i < score[0]; i++) {
            if (this.starsImage && this.starsImage.complete) {
                this.ctx.drawImage(this.starsImage, 10 + i * 21, 30 + 3 * Math.sin(this.sin_off), 40, 40);
            }
        this.sin_off += 0.05;
        }
        for (let i = 0; i < score[1]; i++) {
            if (this.starsImage && this.starsImage.complete) {
                this.ctx.drawImage(this.starsImage, this.canvas.width - 20 - (i + 1) * 21, 30 + 3 * Math.sin(this.sin_off), 40, 40);
            }
    }
    this.ctx.restore();
}
}