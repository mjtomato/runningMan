(function (w) {
	var screenW = window.screen.width,
		screenH = window.screen.height;
	var FRAME_RATE = 13,	//精灵表播放速度
		SCALE_X = 0.5,	//X轴缩放
		SCALE_Y = 0.5,	//Y轴缩放
		GRAVITY = 15,	//重力加速度
		JUMP_SPEED = 5.8,		//垂直速度
		PROPORTION = 150 / 1,  //游戏与实际的距离比例
		PER_HEIGHT = screenH / 9,
		kk = 0;
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
			// this.sprite.scaleX = (PER_WIDTH*2)/130;
			// this.sprite.scaleY = (PER_HEIGHT*1)/113;
			// console.log(this.sprite.scaleX,this.sprite.scaleY)
			stage.addChild(this.sprite);
		},

		update: function () {
			var sprite = this.sprite;
			var time = createjs.Ticker.getInterval() / 1000;
			// debugger;
			// console.log(sprite.x , this.x)
			if (this.state === "run") {
				if (sprite.x < (this.x)) {
					sprite.x += this.vx;
				} else {
					sprite.x = this.x;
				}
				// debugger;
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
				// if (this.ground[0] && this.ground[0].x >= sprite.x && this.ground[0].y + this.ground[0].h >= sprite.y) {
				// 	console.log('this.ground:',this.ground);
				// 	this.vy = 0;
				// 	// sprite.y
				// }
			}else if (this.endy >= sprite.y && this.jump === "jump") {
				var that = this;
				var tmp = true;
				this.ground.forEach(function(ele,i) {
					if(ele.y + ele.h >= sprite.y && ele.x <= sprite.x + sprite.width){
						console.log('enter true');
						tmp = false;
						// that.vy = 0;
						console.log(tmp);
					}
					//  && ele.x <= sprite.x + sprite.width
					// console.log(ele,ele.y , i , sprite.y , ele.y>sprite.y);
				});
				if (!tmp) {
					this.vy = 0;
				}
				console.log('-------------');
				
			}
			
			// if (sprite.y <= this.ground) {

			// }

			if (sprite.x + (PER_HEIGHT - PER_HEIGHT * SCALE_X) / 2 < 0 || sprite.y > C_H + 200) {
				this.die();
				createjs.Ticker.reset();
				// alert("you Die!");
				console.log("you are die");
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
			this.vy = -JUMP_SPEED;
			this.state = "jump";
			this.sprite.gotoAndPlay("jump");
			this.jumpNum++;
			var that = this;
			var flag = false;
			this.mapFloor.forEach(function(m,i) {
				var kuang = that.sprite.x + (that.picsize().w * 1.5 - that.size().w) / 2;
				// var juli = Math.abs((kuang + that.size().w / 2) - (m.shape.x + m.w / 2));
				// if (juli <= (that.size().w + m.w) / 2) {
				// 	console.log(juli);
				// }
				// if (m.shape.x + m.w >= that.sprite.x + that.size().w && m.shape.x <= that.sprite.x) {
					// 非地板非空白
					// 找出对应人物x的地板 可能不同Y属性的地板
					// if(m.kind !== 'C' && juli <= (that.size().w + m.w) / 2){
					// 	if ( m.y + m.h <= that.sprite.y){
					// 		// console.log('enter true');
					// 		flag = true;
					// 	}
					// 	// that.vy = 0;
					// }
				// }
				// y判断
				
				//  && m.x <= sprite.x + sprite.width
				// console.log(m,m.y , i , sprite.y , m.y>sprite.y);
			});
			// if (flag) {
			// 	this.vy = 0;
			// }
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