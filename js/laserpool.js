class LaserPool {
	constructor() {
		this.poolSize = 20;
		this.lasers = [];
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
		for (var i=0; i<this.poolSize; i++) {
			if (this.lasers[i] == undefined)
			{
				this.lasers[i] = new Laser(-1,-1,-1,-1);
			}
			if (this.lasers[i].inUse()) {
				this.lasers[i].update(modifier);
			}
		}
	}
}
