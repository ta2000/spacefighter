"use strict";

class ShipAI extends Ship {
	constructor(imgsrc, x, y, acceleration) {
		super(imgsrc, x, y, acceleration);
		this.target = {};
		this.exploreSpeed = 2;
	}

	draw(ctx) {
		Ship.prototype.draw.call(this, ctx);
	}

	update(modifier, ships) {
		Ship.prototype.update.call(this, modifier, ships, this.evaluate(ships));
	}

	evaluate(ships) {
		var keys = {};

		// Stop targetting
		if (this.target.hp < 1) {
			this.target = {};
		}
		// Find new target
		for (var i in ships) {
			if (ships[i] != this &&
				ships[i].hp >0 &&
				this.distance(ships[i]) < 1000
			) {
				this.target = ships[i];
				this.targetAngle = Math.atan2(this.y - ships[i].y, this.x - ships[i].x);
			}
		}

		var delta = this.targetAngle - this.angle;

		// If targetting a ship
		if (Object.keys(this.target).length != 0) {
			// Attack ship
			if (delta < 4 && delta > 3) {
				if (Math.random() > 0.8) {
					keys[32] = true;
				}
			}
			// Pursue ship
			if (this.distance(this.target) > 200) {
				keys[87] = true;
			}
			else {
				keys[83] = true;
			}
		}
		// If not targetting anything
		else {
			if (Math.random() > 0.6) {
				keys[87] = true;
			}
			if (Math.random() > 0.98) {
				this.targetAngle += Math.random()*3 - 1.5;
			}
		}

		// Rotate towards target angle
		if (delta <= Math.PI) {
			keys[65] = true;
		}
		else {
			keys[68] = true;
		}
	

		return keys;
	}
}
