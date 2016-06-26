"use strict";

class ParticlePool {
	constructor() {
		this.poolSize = 100;
		this.particles = [];
		this.initialized = false;
	}

	init() {
		for (var i=0; i<this.poolSize; i++) {
			this.particles[i] = new Particle(-1,-1,-1,-1,-1,-1);
			this.initialized = true;
		}
	}

	create(x, y, size, color, angle, speed) {
		for (var i=0; i<this.poolSize; i++) {
			if (!this.particles[i].inUse()) {
				this.particles[i].x = x;
				this.particles[i].y = y;
				this.particles[i].size = size;
				this.particles[i].color = color;
				this.particles[i].angle = angle;
				this.particles[i].speed = speed;
				return;
			}
		}
	}

	draw(ctx) {
		for (var i=0; i<this.poolSize; i++) {
			if (this.particles[i].inUse()) {
				this.particles[i].draw(ctx);
			}
		}
	}

	update(modifier) {
		if (!this.initialized) {
			this.init();
		}
		for (var i=0; i<this.poolSize; i++) {
			if (this.particles[i].inUse()) {
				this.particles[i].update(modifier);
			}
			// Particle reproduction
			if (Math.random() > 0.98 &&
				this.particles[i].size > 2 &&
				this.particles[i].opacity >= 0.8) {
					this.create(
						this.particles[i].x,
						this.particles[i].y,
						this.particles[i].size/2,
						this.particles[i].color,
						this.particles[i].angle + Math.random()/2,
						this.particles[i].speed/2
					);
			}
		}
	}
}
