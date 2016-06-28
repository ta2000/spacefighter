"use strict";

class Game {
	constructor() {
		this.canvas;
		this.then;
		this.keysPressed;
		this.ships = [];
	}

	start() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');
		
		this.then = Date.now();

		this.keysPressed = {};
		window.onkeydown = this.keyDown.bind(this);
		window.onkeyup = this.keyUp.bind(this);

		// Create player
		this.ships.push(new Player("sprites/ship.png", 100, 100, 4));

		// Begin game loop
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
		// Remove dead ships once all particles are cleared
		this.ships = this.ships.filter(function(ship) {
			if (ship.hp > 0) {
				return true;
			} else {
				if (ship.laserpool.anyInUse())
					return true;
				else if (ship.particlepool.anyInUse())
					return true;
			}
			return false;
		});
		for (var i=0; i<this.ships.length; i++) {
			if (this.ships[i].hp > 0) {
				this.ships[i].update(modifier, this.ships, this.keysPressed)
			} else {
				// Only update particles once ship is dead
				this.ships[i].laserpool.update(modifier);
				this.ships[i].particlepool.update(modifier);
			}
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i=0; i<this.ships.length; i++) {
			if (this.ships[i].hp > 0) {
				this.ships[i].draw(this.ctx);
			} else {
				this.ships[i].laserpool.draw(this.ctx);
				this.ships[i].particlepool.draw(this.ctx);
			}
		}
	}
}
