"use strict";

class Sprite {
	constructor(imgsrc, x, y) {
		this.image = new Image();
		this.imageLoaded = false;
		this.image.onload = function() {
			this.imageLoaded = true;
		}.bind(this);
		this.image.src = imgsrc;
		this.x = x;
		this.y = y;
		this.angle = 0;
	}

	draw(ctx) {
		if (this.imageLoaded) {
			ctx.save();
			ctx.translate(this.x + this.image.width/2, this.y + this.image.height/2);
			ctx.rotate(this.angle);
			ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2);
			ctx.restore();
		}
	}

	update(modifier, keysPressed) {
	}

	distance(obj) {
		if (!this.imageLoaded || !obj.imageLoaded)
			return Infinity;

		return Math.hypot(
			(this.x + this.image.width) - (obj.x + obj.image.width),
			(this.y + this.image.height) - (obj.y + obj.image.height)
		);
	}

	distanceToPoint(x, y) {
		return Math.hypot(
			(this.x + this.image.width) - (x + this.image.width),
			(this.y + this.image.height) - (y + this.image.height)
		);
	}
}
