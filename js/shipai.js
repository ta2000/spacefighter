"use strict";

class ShipAI extends Ship {
	constructor(imgsrc, x, y, acceleration) {
		super(imgsrc, x, y, acceleration);
		this.target = null;
		this.targetAngle = 0;
	}

	draw(ctx) {
		Ship.prototype.draw.call(this, ctx);
	}

	update(modifier, ships) {
		Ship.prototype.update.call(this, modifier, ships, this.evaluate(ships));
	}

	evaluate(ships) {
		var keys = {};
		var delta = this.targetAngle - this.angle;

		// Target attacker if being attacked
		if (this.attacker != null) {
			this.target = this.attacker;
		}

		// If not targetting anything
		if (this.target == null) {
			// Wander aimlessly
			if (Math.random() > 0.6) {
				keys[87] = true;
			}
			if (Math.random() > 0.98) {
				this.targetAngle += Math.random()*3 - 1.5;
			}
			// Find new target
			for (var i in ships) {
				if (ships[i] != this &&
					ships[i].team != this.team &&
					ships[i].hp > 0 &&
					this.distance(ships[i]) < 1000
				) {
					this.target = ships[i];
				}
			}
		}
		// If targetting a ship
		else {
			// Adjust targetAngle towards target
			this.targetAngle = Math.atan2(this.y - this.target.y, this.x - this.target.x);
			// Attack ship
			if (Math.round(this.toDegrees(delta)) == 180) {
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
			// Stop targetting
			if (this.target.hp <= 0) {
				this.target = null;
			}
		}

		// Rotate towards target angle
		delta = this.toDegrees(delta);
		if (delta <= 180) {
			keys[65] = true;
		}
		else {
			keys[68] = true;
		}	

		return keys;
	}

	toDegrees(num) {
		var degrees = num*180/Math.PI;
		if (degrees >= 0) {
			var tempAngle = degrees % 360;
			if (tempAngle == 360) {
				return 0;
			} else {
				return tempAngle;
			}
		} else {
			return (360 - (-1 * degrees) % 360);
		}
	}
}
