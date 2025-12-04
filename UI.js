export default class UI {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.roundStartImage = null;
        this.loadRoundStartImage();
    }
    
    loadRoundStartImage() {
        this.roundStartImage = new Image();
        this.roundStartImage.src = "./imgs/vs_logo.png";
    }
    
    drawRoundStart() {
        if (this.roundStartImage && this.roundStartImage.complete) {
            this.roundStartImage.opacity = 0.5;
            this.ctx.drawImage(this.roundStartImage, this.canvas.width / 2 - 100, 50, 200, 100);
        }
    }
}