class Ship extends Sprite {
	constructor(imgsrc, x, y, acceleration) {
		super(imgsrc, x, y);
		this.xVel = 0;
		this.yVel = 0;
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

		Sprite.prototype.draw.call(this, ctx);
	}

	update(modifier, keysPressed) {
		// Lasers
		this.laserpool.update(modifier);
		this.particlepool.update(modifier);

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
				this.acceleration+400
			);
			this.cooldown = 20;
		} else if (this.cooldown > 0) {
			this.cooldown--;
		}
	}
}
