"use strict";

class Ship extends Sprite {
	constructor(imgsrc, x, y, acceleration) {
		super(imgsrc, x, y);
		this.xVel = 0;
		this.yVel = 0;
		this.velocity;
		this.hp = 100;
		this.score = 0;
		this.attacker = null;
		this.maxSpeed = 1000;
		this.acceleration = acceleration;
		this.cooldown = 0;
		this.laserpool = game.laserpool;
		this.particlepool = game.particlepool;
	}

	draw(ctx) {
		ctx.font = "24px Arial";
		ctx.fillStyle = "#00FF00";
		ctx.fillText("HP: " + this.hp, this.x-12, this.y-30);
		ctx.fillText("SCORE: " + this.score, this.x-24, this.y-12);

		Sprite.prototype.draw.call(this, ctx);
	}

	update(modifier, game, keysPressed) {
		this.velocity = Math.sqrt(this.xVel*this.xVel + this.yVel*this.yVel);
		
		// Attacker dead
		if (this.attacker != null && this.attacker.hp <= 0) {
			this.attacker = null;
		}

		// Check for laser hit
		for (const laser of game.laserpool.lasers) {
			if (laser.inUse() && laser.creator != this) {
				console.log(this, laser.creator);
				if (this.distanceToPoint(laser.x, laser.y) < 64) {
					this.hp -= Math.floor(Math.random()*2)+3;
					this.attacker = laser.creator;
					laser.energy = 0;

					// If killed add to killer's score
					if (this.hp <= 0) {
						laser.creator.score++;
					}
				}
			}
		}

		// Prevent going over maxSpeed
		// in either direction
		if (this.xVel > this.maxSpeed)
			this.xVel = this.maxSpeed;
		if (this.yVel > this.maxSpeed)
			this.yVel = this.maxSpeed;
		if (this.xVel < -this.maxSpeed)
			this.xVel = -this.maxSpeed;
		if (this.yVel < -this.maxSpeed)
			this.yVel = -this.maxSpeed;

		// Bounce off screen border (temporary)
		if (this.x + this.image.width >= game.world.width || this.x <= 0)
			this.xVel = -this.xVel;
		if (this.y + this.image.height >= game.world.height || this.y <= 0)
			this.yVel = -this.yVel;

		// Movement
		this.x += this.xVel * modifier;
		this.y += this.yVel * modifier;

		// D - Rotate right
		if (68 in keysPressed) {
			this.angle += 2 * Math.PI/180;
		}
		// A - Rotate left
		else if (65 in keysPressed) {
			this.angle -= 2 * Math.PI/180;
		}
		// Q - Move left
		if (81 in keysPressed) {
			this.xVel += Math.cos(this.angle - Math.PI/2)*this.acceleration;
			this.yVel += Math.sin(this.angle - Math.PI/2)*this.acceleration;
			// RCS Particles
			if (Math.random() > 0.60) {
				this.particlepool.create(
					this.x + this.image.width/2,
					this.y + this.image.height/2,
					4, "#DDDDDD",
					this.angle + Math.PI/2 + Math.random()/2 - 0.2,
					250
				);
			}
		}
		// E - Move right
		else if (69 in keysPressed) {
			this.xVel += Math.cos(this.angle + Math.PI/2)*this.acceleration;
			this.yVel += Math.sin(this.angle + Math.PI/2)*this.acceleration;
			// RCS Particles
			if (Math.random() > 0.60) {
				this.particlepool.create(
					this.x + this.image.width/2,
					this.y + this.image.height/2,
					4, "#DDDDDD",
					this.angle - Math.PI/2 + Math.random()/2 - 0.2,
					250
				);
			}
		}
		// W - Forward
		if (87 in keysPressed) {
			// Change velocity
			this.xVel += Math.cos(this.angle)*this.acceleration;
			this.yVel += Math.sin(this.angle)*this.acceleration;
			// Engine particles (based on acceleration)
			if (Math.random() > 0.7) {
				this.particlepool.create(
					this.x + this.image.width/2,
					this.y + this.image.height/2,
					8, this.particlepool.getRandomColor(15, 30, 70, 90, 35, 50),
					this.angle - 3.14 + Math.random()-0.4,
					150
				);
			}
		}
		// S - Reverse
		else if (83 in keysPressed) {
			// Change velocity
			this.xVel -= Math.cos(this.angle)*this.acceleration;
			this.yVel -= Math.sin(this.angle)*this.acceleration;
			// RCS Particles
			if (Math.random() > 0.60) {
				this.particlepool.create(
					this.x + this.image.width/2,
					this.y + this.image.height/2,
					4, "#DDDDDD",
					this.angle + Math.random()/4 - 0.1,
					210
				);
			}
		}
		// CTRL - Dampers
		else if (17 in keysPressed) {
			// Change velocity
			this.xVel *= 0.96;
			this.yVel *= 0.96;
			// RCS Particles
			if (Math.random() > 0.60 && this.velocity > 2) {
				this.particlepool.create(
					this.x + this.image.width/2,
					this.y + this.image.height/2,
					4, "#DDDDDD",
					Math.atan(this.yVel/this.xVel) + Math.random()/4 - 0.1,
					400, 0.3
				);
			}
		}

		// Firing
		if (32 in keysPressed && this.cooldown == 0) {
			this.laserpool.create(
				this.x+this.image.width/2,
				this.y+this.image.height/2,
				this.angle,
				this.velocity + 1000,
				this
			);
			this.cooldown = 8;
		} else if (this.cooldown > 0) {
			this.cooldown--;
		}
	}
}
