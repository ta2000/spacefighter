"use strict";

class Player extends Ship {
	constructor(imgsrc, x, y, acceleration) {
		super(imgsrc, x, y, acceleration);
	}

	draw(ctx) {
		Ship.prototype.draw.call(this, ctx);
	}

	update(modifier, ships, keysPressed) {
		Ship.prototype.update.call(this, modifier, ships, keysPressed);
	}
}
