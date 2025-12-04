import HitBox from "./Hitbox.js"

export default class Player {
    constructor(x, y, color, controls, canvas) 
    {
        this.x = x
        this.y = y
        this.width = 50
        this.height = 100
        this.color = color
        this.controls = controls
        this.hitbox = new HitBox(this.x, this.y, this.width, this.height)
        this.canvas = canvas
        this.sprite = new Image ()
        this.sprite.src = "./spr/sprite_0.png"
    }
    

    // Atributes
    velocity = [0, 0]
    state = "idle"
    isFacingRight = true
    isOnFloor = true
    jumpStrength = -15
    oponent = null // Debería apuntar a otro objeto Player que se asignara despues de su creacion
    hitsound = new Audio("./sfx/hurt.wav");
    atksound = new Audio("./sfx/happy.wav");
    walkTogglenum = 0;
    walkToggle = false;

    // Methods
    /*
        move
        jump
        receiveDamage
        attack
        spawn
    */
    moveLeft = () => 
    {
        if (this.state === "kicking" || this.state === "dead") return
        this.velocity[0] = -5
        this.state = "walking"
        this.isFacingRight = false
    }

    moveRight = () => 
    {
        if (this.state === "kicking" || this.state === "dead") return
        this.velocity[0] = 5;
        this.state = "walking";
        this.isFacingRight = true;
    }

    jump = () => 
    {
        if (this.state === "kicking" || this.state === "dead") return
        if (!this.isOnFloor) return;
        this.velocity[1] = this.jumpStrength;
        this.isOnFloor = false;
    }

    kick = () =>
    {
        this.atksound.play();
        if (this.isOnFloor || this.state === "kicking" || this.state === "dead") return
        this.state = "kicking";
        this.velocity[1] = 5
        if (this.isFacingRight)
            this.velocity[0] = 12
        else
            this.velocity[0] = -12
    }
    dir = 0

animcheck() {
    // PRIORITY 1: Dead / Knockback animation
    if (this.state === "dead") {
        this.sprite.src = "./spr/sprite_4.png"; 
        return;
    }

    // PRIORITY 2: Jumping (when not on floor)
    if (!this.isOnFloor && this.state !== "kicking") {
        this.sprite.src = "./spr/sprite_2.png";
        return;
    }

    // Movement / idle / kicking
    switch (this.state) {
        case "idle":
            this.sprite.src = "./spr/sprite_0.png";
            break;

        case "walking":
            // Simple animation toggle
            if (this.walkTogglenum % 20 === 0)
            {
                this.walkToggle = !this.walkToggle;
                this.sprite.src = this.walkToggle 
                    ? "./spr/sprite_1.png" 
                    : "./spr/sprite_0.png";
                this.walkTogglenum++
                
            }
            if (this.velocity[0] !== 0) this.walkTogglenum++;
            break;

        case "kicking":
            this.sprite.src = "./spr/sprite_3.png";
            break;
    }
}

    
    move() 
    {
        if (this.isFacingRight) this.dir = 1
        else this.dir = -1
        let canvas = this.canvas
        let ctx = canvas.getContext("2d");
        //check if kicking
        if (this.state === "kicking" && this.hitbox.checkCollision(this.oponent)) {
            this.oponent.dead();
        }
        
        //clamp values for velocity
        this.velocity[0] = Math.max(Math.min(this.velocity[0], 25), -25);
        this.velocity[1] = Math.max(Math.min(this.velocity[1], 10), this.jumpStrength);
        
        //clamp position to floor and walls
        if (this.y + this.height + this.velocity[1] + 200 > canvas.height) {
            this.y = canvas.height - this.height - 200;
            this.velocity[1] = 0;
            this.isOnFloor = true;
            if (this.state === "kicking") {
                this.state = "idle";
                this.velocity[0] = 0;
            }
            //Una vez muerto el jugador toca el suelo
            if(this.state === "dead")
            {
                this.velocity[0] = 0;
                this.canvas.changeSpeed(60);
                this.canvas.reset();
            }
        }
        if (this.x + this.velocity[0] < 0) {
            this.x = 0;
            this.velocity[0] = 0;
        }
        if (this.x + this.width + this.velocity[0] > canvas.width) {
            this.x = canvas.width - this.width;
            this.velocity[0] = 0;
        }
        this.x += this.velocity[0];
        this.velocity[1] += 0.5; // gravity
        this.y += this.velocity[1];

        //update hitbox position
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

                this.animcheck();
        if (this.sprite.complete)
        {
            this.drawSprite(ctx);
        }
    }

    dead() 
    {
        this.state = "dead";
        this.color = "gray";
        this.knockback(this.oponent.isFacingRight);
    }

knockback(towardsRight) {
    this.hitsound.play();
    this.state = "dead";       // important for animcheck priority
    this.sprite.src = "./spr/sprite_4.png";

    if (towardsRight) {
        this.velocity[0] = 10;
        this.velocity[1] = -5;
    } else {
        this.velocity[0] = -10;
        this.velocity[1] = -5;
    }

    this.canvas.changeSpeed(55);
}
drawSprite(ctx) {
    if (!this.sprite.complete) return;

    if (this.isFacingRight) {
        ctx.drawImage(this.sprite, this.x, this.y, 256, 256);
    } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.sprite, -this.x - 256, this.y, 256, 256);
        ctx.restore();
    }
}

}