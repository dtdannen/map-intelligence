window.onload = function() {
	var canvas = document.getElementById("supercanvas");
	var surface = canvas.getContext("2d");
	var width = surface.canvas.width = window.innerWidth *2;
	var height = surface.canvas.height = window.innerHeight*2;
	var cx = 0;
	var cy = 0;
	var p = newPlayer();
	var allPlayers = [p];

	var drawScreen = function() {
		surface.clearRect(cx,cy, width, height);
		surface.fillStyle = "black";
		surface.fillRect(cx, cy, width, height);
		each(allPlayers, function(player) {
			player.draw();
			each(player.bullets, function(b) {
				b.draw();
			})
		})
	}
	var addKeyListener = function() {
		window.addEventListener("keypress", function(k) {
			if (k.charCode == 32) {
				console.log("shooting ahora");
				p.shoot();
			}
			console.log("key pressed");
		});
		canvas.addEventListener("mousemove", function(mouse) {

			var xDistance = mouse.clientX - p.x;
			var yDistance = mouse.clientY - p.y;
			var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
			var easingAmount = 0.05;

			console.log("mouse moved");
			var distanceForX = xDistance * easingAmount;
			var distanceForY = yDistance * easingAmount;

			/*console.log("mousex: " + mouse.clientX);
			console.log("mousey: " + mouse.clientY);
			console.log("xdistance: " + distanceForX);
			console.log("yDistance: " + distanceForY);*/
			p.xDistance = distanceForX;
			p.yDistance = distanceForY;


		
		});
	}

	function newPlayer() {
		var player = {
			w: 20,
			h: 20,
			x: width/4,
			y: height/4,
			speed: 0.1,       
			outlineColor: "white",
			xDistance: undefined,
			yDistance: undefined,
			bullets: [],
			draw: function() {
				if (this.xDistance != undefined && this.yDistance != undefined) {
					this.x += (this.xDistance * this.speed);
					this.y += (this.yDistance * this.speed);
					surface.strokeStyle = this.outlineColor;
					surface.strokeRect(this.x, this.y, this.w, this.h);
				}
				else {
					surface.strokeStyle = this.outlineColor;
					surface.strokeRect(this.x, this.y, this.w, this.h);
				}
				
			},
			shoot: function() {
				var bullet = newBullet(this.x, this.y,this.xDistance * this.speed,this.yDistance * this.speed);
				console.log(bullet);
				this.bullets.push(bullet);
			},
			clear: function() {
			},
			incSpeed: function(speed) {this.speed += speed;},
			movX: function(x) {this.x += x;},
			movY: function(y) {this.y += y;}


		}
		return player;
	}
	function newBullet(x, y, xIncrementor, yIncrementor) {
		var bullet = {
			x: x,
			y: y,
			w: 5,
			h: 10,
			xInc: xIncrementor,
			yInc: yIncrementor,
			fillColor: "blue",
			draw: function() {
				this.x += this.xInc;
				this.y += this.yInc;
				surface.strokeStyle = this.fillColor;
				surface.strokeRect(this.x, this.y, this.w, this.h);
			}
		}
		return bullet;
	}
	var each = function(args, funkyArg) {
		for (var i = 0; i < args.length; i++)
			funkyArg(args[i]);
	} 
	var gameLoop = function() {
		window.setTimeout(gameLoop, 10);
		drawScreen();
	}
	
	addKeyListener();
	gameLoop();

}
var log = function(e) {console.log(e);}