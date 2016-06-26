class Laser {
	constructor(x, y, angle, speed) {
		this.inUse = function() {
			return (this.x < window.innerWidth &&
					this.x > 0 &&
					this.y < window.innerHeight &&
					this.y > 0);
		}
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
	}

	draw(ctx) {
		ctx.strokeStyle = "#CC0000";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + Math.cos(this.angle)*30, this.y + Math.sin(this.angle)*30);
		ctx.stroke();
	}

	update(modifier) {
		this.x += Math.cos(this.angle)*this.speed*modifier; 
		this.y += Math.sin(this.angle)*this.speed*modifier; 
	}
}
