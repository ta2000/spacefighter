"use strict";

class Game {
	constructor() {
		this.canvas;
		this.then;
		this.keysPressed;
		this.entities = {};
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
		for (var i in this.entities) {
			this.entities[i].update(modifier, this.keysPressed)
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i in this.entities) {
			this.entities[i].draw(this.ctx);
		}
	}
}
