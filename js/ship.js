"use strict";

class Ship extends Sprite {
	constructor(imgsrc, x, y, acceleration) {
		super(imgsrc, x, y);
		this.xVel = 0;
		this.yVel = 0;
		this.hp = 100;
		this.score = 0;
		this.attacker = null;
		this.maxSpeed = 5;
		this.acceleration = acceleration;
		this.cooldown = 0;
		this.laserpool = new LaserPool;
		this.particlepool = new ParticlePool;
	}

	draw(ctx) {
		// Lasers
		this.laserpool.draw(ctx);
		// Particles
		this.particlepool.draw(ctx);

		ctx.font = "24px Arial";
		ctx.fillStyle = "#00FF00";
		ctx.fillText("HP: " + this.hp, this.x-12, this.y-30);
		ctx.fillText("SCORE: " + this.score, this.x-24, this.y-12);

		Sprite.prototype.draw.call(this, ctx);
	}

	update(modifier, ships, keysPressed) {
		// Lasers
		this.laserpool.update(modifier);
		this.particlepool.update(modifier);
	
		// Attacker dead
		if (this.attacker != null && this.attacker.hp <= 0) {
			this.attacker = null;
		}

		// Check for laser hit
		for (var i=0; i<ships.length; i++) {
			if (ships[i] != this && ships[i].laserpool.initialized) {
				for (var j=0; j<ships[i].laserpool.poolSize; j++) {
					if (
						ships[i].laserpool.lasers[j].inUse() &&
						this.distanceToPoint(
							ships[i].laserpool.lasers[j].x,
							ships[i].laserpool.lasers[j].y
						) < 64
					) {
						this.hp -= Math.floor(Math.random()*2)+3;
						this.attacker = ships[i];
						ships[i].laserpool.lasers[j].remove();
						
						// If killed add to killer's score
						if (this.hp <= 0) {
							ships[i].score++;
						}
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
		if (this.x + this.image.width >= window.innerWidth || this.x <= 0)
			this.xVel = -this.xVel;
		if (this.y + this.image.height >= window.innerHeight || this.y <= 0)
			this.yVel = -this.yVel;

		// Movement
		this.x += this.xVel; 
		this.y += this.yVel; 

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
			this.xVel += Math.cos(this.angle - Math.PI/2)*this.acceleration*modifier; 
			this.yVel += Math.sin(this.angle - Math.PI/2)*this.acceleration*modifier; 
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
			this.xVel += Math.cos(this.angle + Math.PI/2)*this.acceleration*modifier; 
			this.yVel += Math.sin(this.angle + Math.PI/2)*this.acceleration*modifier; 
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
			this.xVel += Math.cos(this.angle)*this.acceleration*modifier; 
			this.yVel += Math.sin(this.angle)*this.acceleration*modifier; 
			// Engine particles (based on acceleration)
			if (Math.random() > (0.80 - this.acceleration/1000)) {
				this.particlepool.create(
					this.x + this.image.width/2,
					this.y + this.image.height/2,
					8, "#FF8000",
					this.angle - 3.14 + Math.random()-0.4,
					120
				);
			}
		}
		// S - Reverse
		else if (83 in keysPressed) {
			// Change velocity
			this.xVel -= Math.cos(this.angle)*this.acceleration*modifier; 
			this.yVel -= Math.sin(this.angle)*this.acceleration*modifier; 
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

		// Firing
		if (32 in keysPressed && this.cooldown == 0) {
			this.laserpool.create(
				this.x+this.image.width/2,
				this.y+this.image.height/2,
				this.angle,
				this.acceleration+700
			);
			this.cooldown = 20;
		} else if (this.cooldown > 0) {
			this.cooldown--;
		}
	}
}
