"use strict";

class ParticlePool {
	constructor() {
		this.poolSize = 100;
		this.particles = [];
		this.initialized = false;
	}

	init() {
		for (var i=0; i<this.poolSize; i++) {
			this.particles[i] = new Particle(-Infinity,-Infinity,0,0,0,0);
			this.initialized = true;
		}
	}

	anyInUse() {
		for (var i=0; i<this.poolSize; i++) {
			if (this.particles[i].inUse())
				return true;
		}
		return false;
	}

	create(x, y, size, color, angle, speed, lifespan = 1) {
		for (const particle of this.particles) {
			if (!particle.inUse()) {
				particle.x = x;
				particle.y = y;
				particle.size = size;
				particle.color = color;
				particle.angle = angle;
				particle.speed = speed;
				particle.opacity = 1;
				particle.lifespan = lifespan;
				return;
			}
		}
	}

	draw(ctx) {
		for (const particle of this.particles) {
			if (particle.inUse()) {
				particle.draw(ctx);
			}
		}
	}

	update(modifier) {
		if (!this.initialized) {
			this.init();
		}
		for (const particle of this.particles) {
			if (particle.inUse()) {
				particle.update(modifier);
			}
			// Particle reproduction
			if (Math.random() > 0.98 &&
				particle.size > 2 &&
				particle.opacity >= 0.8) {
					this.create(
						particle.x,
						particle.y,
						particle.size/2,
						particle.color,
						particle.angle + Math.random()/2,
						particle.speed/2
					);
			}
		}
	}

	getRandomColor(hMin, hMax, sMin, sMax, lMin, lMax) {
		var h = rand(hMin, hMax);
		var s = rand(sMin, sMax);
		var l = rand(lMin, lMax);
		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}
}

function rand(min, max) {
	return parseInt(Math.random() * (max-min+1), 10) + min;
}