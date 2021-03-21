"use strict";

class Particle {
	constructor(x, y, size, color, angle, speed) {
		this.inUse = function() {
			return this.opacity > 0;
		}
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.angle = angle;
		this.speed = speed;
		this.opacity = 0;
		this.lifespan = 1;
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
		this.opacity -= 0.01 / this.lifespan;
		if (this.opacity < 0.01) {
			this.x = -1;
			this.y = -1;
			this.opacity = 0;
		}
	}
}
