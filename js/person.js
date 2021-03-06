(function (w) {
	var screenW = window.screen.width,
		screenH = window.screen.height;
	var FRAME_RATE = 13,	//精灵表播放速度
		SCALE_X = 0.5,	//X轴缩放
		SCALE_Y = 0.5,	//Y轴缩放
		GRAVITY = 15,	//重力加速度
		JUMP_SPEED = 5.7,		//垂直速度
		PROPORTION = 150 / 1,  //游戏与实际的距离比例
		PER_HEIGHT = screenH / 9;
	PER_WIDTH = screenW / 10;
	console.log(PER_HEIGHT, PER_WIDTH);
	var Man = function (x, y, img) {
		this.x = x;
		this.y = y;
		this.endy = y;
		this.vx = 0.5;
		this.vy = 0;
		this.ground = [];
		this.state = "run";
		this.jumpNum = 0;
		this.jumpMax = 1;
		this.init(img);
		this.mapFloor = [];
	}

	Man.prototype = {
		constructors: Man,

		init: function (img) {
			var manSpriteSheet = new createjs.SpriteSheet({
				"images": [img],
				"frames": { "regX": 0, "height": 113, "count": 45, "regY": 1, "width": 130 },
				"animations": {
					"run": {
						frames: [0, 3],
						next: "run",
						speed: 0.5,
					},
					"jump": {
						frames: [3],
						next: "jump",
						speed: 0.5,
					},
					"die": {
						frames: [4],
						next: "die",
						speed: 0.5,
					}
				}
			});
			this.sprite = new createjs.Sprite(manSpriteSheet, this.state);
			this.sprite.framerate = FRAME_RATE;
			this.sprite.setTransform(this.x, this.y, (PER_WIDTH * 2) / 130, (PER_HEIGHT * 1) / 113);
			stage.addChild(this.sprite);
		},

		update: function () {
			var sprite = this.sprite;
			var time = createjs.Ticker.getInterval() / 1000;
			if (this.state === "run") {
				if (sprite.x < (this.x)) {
					sprite.x += this.vx;
				} else {
					sprite.x = this.x;
				}
			}

			if (this.endy > sprite.y || this.state === "jump") {				
				var nexty = sprite.y + time * this.vy * PROPORTION;
				this.vy += time * GRAVITY;
				sprite.y += time * this.vy * PROPORTION;
				if (Math.abs(sprite.y - this.endy) < 10 && this.vy > 0) {
					this.state = "run";
					this.run()
					sprite.y = this.endy;
					this.vy = 0;
				}

			}

				// console.log(score);
			if (sprite.x + (PER_HEIGHT - PER_HEIGHT * SCALE_X) / 2 < 0 || sprite.y > C_H + 200) {
				this.die();
				createjs.Ticker.reset();
				console.log("you are die");
				// console.log(banCount);
				//判断最后总分多少，决定是否抽奖
				if (banCount >= 4) {
					score.style.backgroundImage = "url(./image/success.png)"; 
					scoreShow.style.marginTop = "26%";
					ascoreButton[0].style.display = "block";
					ascoreButton[0].style.marginTop = "65%";
					ascoreButton[1].style.display = "none";
					ascoreButton[2].style.display = "none";
					
					// scratchCard.style.visibility = "visible";
				}else{
					score.style.backgroundImage = "url(./image/fail.png)"; 
					scoreShow.style.marginTop = "32%";
					ascoreButton[0].style.display = "none";
					ascoreButton[1].style.display = "inline-block";
					ascoreButton[2].style.display = "inline-block";
					ascoreButton[1].style.marginTop = "76%";
					ascoreButton[2].style.marginTop = "76%";
					// scratchCard.style.visibility = "hidden";
				}
				untils.changeCountBan(banCount , ascoreSpan);
				score.style.display = "block";
				clearInterval(timer);
			}

			switch (this.state) {
				case "run":
					this.jumpNum = 0;
					break;
				case "die":
					if (sprite.currentFrame === 0) {
						sprite.paused = true;
					}
					break;
			}
		},

		run: function () {
			this.sprite.gotoAndPlay("run")
		},

		jump: function (isjump) {
			if (PER_HEIGHT >= 80) {
				JUMP_SPEED = 6.2;
			}else if (PER_HEIGHT >= 75) {
				JUMP_SPEED = 6.0
			}else if (PER_HEIGHT >= 65) {
				JUMP_SPEED = 5.6
			}else if (PER_HEIGHT >= 55){
				JUMP_SPEED = 5;
			}
			this.vy = -JUMP_SPEED;
			this.state = "jump";
			this.sprite.gotoAndPlay("jump");
			this.jumpNum++;
			var that = this;
			var flag = false;
			if (isjump) {
				this.vy = 0;
			}

		},

		die: function () {
			this.state = "die";
			this.sprite.gotoAndPlay("die")
		},

		size: function () {
			return {
				w: PER_WIDTH,
				h: PER_HEIGHT
			}
		},

		picsize: function () {
			return {
				w: PER_WIDTH,
				h: PER_HEIGHT
			}
		}
	}

	w.createMan = function (x, y, img) {
		return new Man(x, y, img)
	};
})(window)