"use strict";

class Game {
	constructor() {
		this.canvas;
		this.then;
		this.keysPressed;
		this.ships = [];
		this.camera = {
			x: 0,
			y: 0
		};
		this.world = {
			width: 4000,
			height:2000
		};
		this.player;
		this.laserpool = new LaserPool;
		this.particlepool = new ParticlePool;
	}

	start() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');

		this.keysPressed = {};
		window.onkeydown = this.keyDown.bind(this);
		window.onkeyup = this.keyUp.bind(this);

		// Create player
		this.player = new Player("sprites/ship.png", 100, 100, 8);
		this.ships.push(this.player);
		console.log(this.particlepool);

		// Begin game loop
		this.then = Date.now();
		this.main();
	}

	keyDown(e) {
		this.keysPressed[e.keyCode] = true;
	}

	keyUp(e) {
		delete this.keysPressed[e.keyCode];
	}

	main() {
		var now = Date.now();
		var delta = now - this.then;
		var modifier = delta/1000;

		this.update(modifier);
		this.draw(this.ctx);

		this.then = now;
		window.requestAnimationFrame(this.main.bind(this));
	}

	update(modifier) {
		this.laserpool.update(modifier);
		this.particlepool.update(modifier);

		// Remove dead ships once all particles are cleared
		this.ships = this.ships.filter(function(ship) {
			if (ship.hp > 0) {
				return true;
			}

			return false;
		});
		for (var i=0; i<this.ships.length; i++) {
			this.ships[i].update(modifier, this, this.keysPressed)
		}
	}

	draw() {
        this.ctx.setTransform(1,0,0,1,0,0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Center camera on player
		this.camera.x = (-this.player.x + this.canvas.width/2);
		this.camera.y = (-this.player.y + this.canvas.height/2);

		// Clamp to world boundary
		this.camera.x = clamp(this.camera.x, 0, this.world.width - this.canvas.width);
		this.camera.y = clamp(this.camera.y, 0, this.world.height - this.canvas.height);

		this.ctx.translate(this.camera.x, this.camera.y);

		this.laserpool.draw(this.ctx);
		this.particlepool.draw(this.ctx);

		for (var i=0; i<this.ships.length; i++) {
			if (this.ships[i].hp > 0) {
				this.ships[i].draw(this.ctx);
			}
		}
	}
}

function clamp(num, min, max) {
	if (num > min)
		return min;
	else if (num < -max)
		return -max;

	return num;
}