"use strict";

class LaserPool {
	constructor() {
		this.poolSize = 20;
		this.lasers = [];
		this.initialized = false;
	}

	init() {
		for (var i=0; i<this.poolSize; i++) {
			this.lasers[i] = new Laser(-1,-1,-1,-1);
			this.initialized = true;
		}
	}

	create(x, y, angle, speed) {
		for (var i=0; i<this.poolSize; i++) {
			if (!this.lasers[i].inUse()) {
				this.lasers[i].x = x;
				this.lasers[i].y = y;
				this.lasers[i].angle = angle;
				this.lasers[i].speed = speed;
				return;
			}
		}
	}

	draw(ctx) {
		for (var i=0; i<this.poolSize; i++) {
			if (this.lasers[i].inUse()) {
				this.lasers[i].draw(ctx);
			}
		}
	}

	update(modifier) {
		if (!this.initialized) {
			this.init();
		}
		for (var i=0; i<this.poolSize; i++) {
			if (this.lasers[i].inUse()) {
				this.lasers[i].update(modifier);
			}
		}
	}
}
