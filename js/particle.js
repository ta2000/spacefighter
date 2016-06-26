"use strict";

class Particle {
	constructor(x, y, size, color, angle, speed) {
		this.inUse = function() {
			return (this.x < window.innerWidth &&
					this.x > 0 &&
					this.y < window.innerHeight &&
					this.y > 0);
		}
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.angle = angle;
		this.speed = speed;
		this.opacity = Math.random()+1;
	}

	draw(ctx) {
		ctx.globalAlpha = this.opacity;
		ctx.fillStyle = this.color;
		ctx.fillRect(
			this.x, this.y,
			this.size, this.size
		);
		ctx.globalAlpha = 1;
	}

	update(modifier) {
		this.x += Math.cos(this.angle)*this.speed*modifier; 
		this.y += Math.sin(this.angle)*this.speed*modifier; 
		this.speed -= 0.25;
		this.opacity -= 0.01;
		if (this.opacity < 0.01) {
			this.x = -1;
			this.y = -1;
			this.opacity = 1;
		}
	}
}
