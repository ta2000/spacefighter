"use strict";

class Laser {
	constructor() {
		this.inUse = function() {
			return this.energy > 0;
		}
		this.x;
		this.y;
		this.angle;
		this.speed;
		this.ship;
		this.energy = 0;
		this.particlepool = game.particlepool;
	}

	draw(ctx) {
		ctx.globalAlpha = this.energy * 2;
		ctx.strokeStyle = "#CC0000";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + Math.cos(this.angle)*30, this.y + Math.sin(this.angle)*30);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	update(modifier) {
		this.x += Math.cos(this.angle) * this.speed * modifier; 
		this.y += Math.sin(this.angle) * this.speed * modifier;
		this.energy -= (modifier * this.speed / 1000);
	}
}
