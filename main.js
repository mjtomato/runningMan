var fps = document.getElementById("showFPS"),
		countCoin = document.getElementById("coins");
	var stage , C_W , C_H , loader;
	var man , ground , sky , wave ,  cloudArr = [];
	var screenW = window.screen.width,
    	screenH = window.screen.height, 
    	perWid = screenW/10,
    	perHei = screenH/9,
		canvas = document.getElementById('cas');
	canvas.width = screenW;
	canvas.height = screenH;



	function init(){
		stage = new createjs.Stage("cas");
		C_W = stage.canvas.width;
		C_H = stage.canvas.height;
		// console.log(C_W);
		var manifest = [
			{src:"image/monkey.png" , id:"man"},
			{src:"image/gf.png" , id:"ground"},
			{src:"image/bg.png" , id:"bg"},
			{src:"image/bbg.png" , id:"wave"},
			{src:"image/cloudy.png" , id:"cloudy"},
			{src:"image/mf.png" , id:"high"},
			{src:"image/banana.png" , id:"coin"}
		]

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete" , handleComplete);

		loader.loadManifest(manifest);
		// console.log(manifest);
		drawLoading();
	}

	function drawLoading(){
		var ctx = stage.canvas.getContext("2d");
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,C_W,C_H);
		ctx.fillStyle = "#FFF";
		ctx.font = "25px 微软雅黑";
		ctx.fillText("Loading...",C_W/2,C_H/2)
	}

	//地图数据，mapData为下地板数据，coinCode为香蕉数据 ， mfloor为上地板数据
	var mapData = [
		"AACAAACAAAACCAAAAAAAAAAACAAAAA",
		"AACAAACAAAACCAAAAAAAAAAACAAAAA",
		"AACAAACAAAACCAAAAAAAAAAACAAAAA"
	],
	coinCode = [
		"---1111---33--33222233--1122--",
		"---1111---33--33222233--1122--",
		"---1111---33--33222233--1122--"
	],
	mfloor = [
		"CCFFCCCCFCCCCFFFECCCCCFFCCCCCE",
		"CCFFCCCCFCCCCFFFECCCCCFFCCCCCE",
		"CCFFCCCCFCCCCFFFECCCCCFFCCCCCE"
	]

	function handleComplete(){		//当图片素材load完后执行该方法
		var manImage = loader.getResult("man"),
			lowground = loader.getResult("ground"),
			highground = loader.getResult("high"),
			bgImage = loader.getResult("bg"),
			waveIamge = loader.getResult("wave"),
			cloudyImg = loader.getResult("cloudy")
			coins = loader.getResult("coin");

		sky = new createjs.Shape();
		sky.graphics.bf(bgImage).drawRect(0,0,C_W + bgImage.width,bgImage.height);
		sky.tileW = bgImage.width;
		stage.addChild(sky);

		// 波浪
		wave = new createjs.Shape();
		wave.graphics.beginBitmapFill(waveIamge).drawRect(0, 1, C_W + waveIamge.width, perHei*3.2);
		wave.tileW = waveIamge.width;
		wave.y = C_H - perHei*3.2;
		stage.addChild(wave);

		//云
		for(var i =0 ; i < 3; i++){
			cloudArr[i] = new createjs.Shape();
			cloudArr[i].graphics.bf(cloudyImg).drawRect(0 , 0 , cloudyImg.width , cloudyImg.height)
			cloudArr[i].setTransform(perWid * (i*5+4), perHei*Math.floor(Math.random()*3)+Math.random()*25, 0.5, 0.5);
			// cloudArr[i].alpha = 0.7;
			stage.addChild(cloudArr[i]);
		}

		man = createMan(100,perHei*5,manImage);


		//该框为判定角色的判定区域
		kuang = new createjs.Shape();
		kuang.graphics.beginStroke("rgba(255,0,0,0.5)").drawRect(0 , 0 , man.size().w , man.picsize().h);
		stage.addChild(kuang);

		mapHandle(lowground , highground , coins);

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", tick);

		window.addEventListener("keydown" , function(event){
			event = event||window.event;
			if(event.keyCode===32&&man.jumpNum<man.jumpMax){
				man.jump();
			}
		})

		window.addEventListener("touchstart" , function(e){
			e.preventDefault();
			e.stopPropagation();
			if(man.jumpNum<man.jumpMax){
				man.jump();
			}
		})
	}


	var mapIndex = 0,		//地图序列
		Mix = 0,			//地图数组的索引
		allStones = [],		//存放所有的石头
		allCoins = [],		//所有金币
		lastStone = null;	//存放最后一个石头
		allMfloor = [],     //存放底图所以上地板
		lastmfloor = null    //存放最后一个上地板

	function mapHandle(lowground , highground , coins){		//初始化地图
		allStones.length = 0;
		allMfloor.length = 0;
		var stoneImage = {"A":lowground , "B":highground},kind = null;
		for(var i=0;i<30;i++){			//把需要用到的石头预先放入容器中准备好
			switch(i){
				case 0:kind="A";break;
				// case 10:kind="B";break;
				case 20:kind="C";break;
			}
			var st = createStone(perWid , kind , stoneImage);
			allStones.push(st)
		}

		var mfImage = {"D":highground , "E":highground , "F":highground},mkind = null;
		for (var i = 0; i < 20; i++) {
			switch(i){
				case  0:mkind="C";break;
				case 5:mkind="D";break;
				case 10:mkind="E";break;
				case 15:mkind="F";break;
			}
			var mf = createStone(perWid , mkind , mfImage);
			allMfloor.push(mf);
		}

		var bankind = null;
		var coinarr = coinCode[0].split("");
		for(var i=0;i<30;i++){			//把需要用到的金币预先放入容器中
			
			var k = coinarr[i];
			// console.log(i , k);
			switch(k){
				case "1":bankind="1";break;
				case "2":bankind="2";break;
				case "3":bankind="3";break;
				case "5":bankind="5";break;
			}
			var coin = createCoin(i*perWid , coins , bankind);
			// debugger;
			allCoins.push(coin);
		}
		
		Mix = Math.floor(Math.random()*mapData.length);			//随机地图序列
		for(var i=0;i<8;i++){
			setStone(false)
		}
	}

	function setStone(remove){		//添加陆地的石头
		var arg = mapData[Mix].charAt(mapIndex),
			coarg = coinCode[Mix].charAt(mapIndex),
			mfarg = mfloor[Mix].charAt(mapIndex),
			coincc = null,
			cc = null,
			mfcc = null;

		if(coarg !== "-"){
			for(var i=0;i<allCoins.length;i++){
				if(!allCoins[i].shape.visible){
					cc = allCoins[i];
					cc.shape.visible = true;
					break;
				}
			}
		}


		// for (var i = 0; i < allCoins.length; i++) {
		// 	// allCoins[i]
		// 	if (allCoins[i].kind === coarg) {
		// 		var coinst = allCoins[i];
		// 		// coincc = allCoins[i];
		// 		coinst.shape.visible = true;
				
		// 		break;
		// 	}
		// }

		for(var z=0;z<allStones.length;z++){
			if(!allStones[z].shape.visible&&allStones[z].kind===arg){
				var st = allStones[z];
				st.shape.visible = true;
				st.shape.x = lastStone===null?0:lastStone.shape.x+lastStone.w;

				if(cc){
					cc.shape.x = lastStone===null?allStones[z].w/2-cc.size().w/2:lastStone.shape.x+lastStone.w+allStones[z].w/2-cc.size().w/2;
					cc.shape.y = arg==="C"? C_H-loader.getResult("high").height-50 : allStones[z].shape.y-cc.size().h/2-50;
				}

				lastStone = st;
				break;
			}
		}


		for(var k=0;k<allMfloor.length;k++){
			if(!allMfloor[k].shape.visible&&allMfloor[k].kind===mfarg){
				var mf = allMfloor[k];
				mf.shape.visible = true;
				mf.shape.x = lastmfloor===null?0:lastmfloor.shape.x+lastmfloor.w;

				if(mfcc){
					mfcc.shape.x = lastmfloor===null?allMfloor[k].w/2-mfcc.size().w/2:lastmfloor.shape.x+lastmfloor.w+allMfloor[k].w/2-mfcc.size().w/2;
					mfcc.shape.y = mfarg==="C"? C_H-loader.getResult("high").height-50 : allMfloor[k].shape.y-mfcc.size().h/2-50;
				}

				lastmfloor = mf;
				break;
			}
		}

		mapIndex++;
		if(mapIndex>=mapData[Mix].length){
			Mix = Math.floor(Math.random()*mapData.length)
			mapIndex=0;
		}
	}


	function stoneHandle(){		
		//石头的逐帧处理  cg为判断当前角色的位置是否被阻挡，overStone是保存离开stage的石头块
		var cg = false , overStone = null;
		allStones.forEach(function(s){   //遍历石头，确定玩家落点
			// console.log(s.shape.visible);
			if(s.shape.visible){
				s.update();

				if(s.shape.visible&&s.shape.x<=-s.w){
					overStone = s;
				}

				var juli = Math.abs((kuang.x+man.size().w/2)-(s.shape.x+s.w/2));
				if(juli<=(man.size().w+s.w)/2 && man.ground.indexOf(s)===-1){
					man.ground.push(s);

					if((s.shape.x+s.w/2)>(kuang.x+man.size().w/2)&&s.y<(kuang.y+man.size().h-10)){
						man.sprite.x = s.shape.x-man.picsize().w-8;
						cg = true;
					}
				}
			}
		});
		if(overStone) {
			setStone(true);
			overStone.shape.visible = false;
		}
		return cg;
	}

	function mdfloorHandle(){		
		var mfcg = false , overmdfloor = null;
		allMfloor.forEach(function(m){   //遍历石头，确定玩家落点
			// console.log(m.shape.visible);
			if(m.shape.visible){
				m.update();

				if(m.shape.visible&&m.shape.x<=-m.w){
					overmdfloor = m;
				}

				var juli = Math.abs((kuang.x+man.size().w/2)-(m.shape.x+m.w/2));
				if(juli<=(man.size().w+m.w)/2 && man.ground.indexOf(m)===-1){
					man.ground.push(m);

					if((m.shape.x+m.w/2)>(kuang.x+man.size().w/2)&&m.y<(kuang.y+man.size().h-10)){
						console.log('mf true');
						mfcg = true;
						// debugger;
					}
				}
			}
		});
		if(overmdfloor) {
			setStone(true);
			overmdfloor.shape.visible = false;
		}
		return mfcg;
	}

	function tick(event){		//舞台逐帧逻辑处理函数
		var deltaS = event.delta / 1000;
		sky.x = (sky.x - deltaS * 100) % sky.tileW;
		wave.x = (wave.x - deltaS * 100) % wave.tileW;
		//云
		for (var i = 0; i < 3; i++) {
			cloudArr[i].x = (cloudArr[i].x - deltaS * 50);
			if (cloudArr[i].x + cloudArr[i].width * cloudArr[i].scaleX <= 0) {
				cloudArr[i].x = C_W;
				cloudArr[i].y = perHei*Math.floor(Math.random()*3) + Math.random()*25;
			}
		}

		man.update();
		// console.log('tick');
		kuang.x = man.sprite.x+(man.picsize().w*1.5-man.size().w)/2;	//参考框
		kuang.y = man.sprite.y;

		man.ground.length=0;
		var cg = stoneHandle();
		var mfcg = mdfloorHandle();

		if(man.ground[0]&&!cg&&!mfcg) {
			man.ground.sort(function(a,b){
				return a.y-b.y;
			});
			man.endy = man.ground[0].y-man.picsize().h*1;
		}

		allCoins.forEach(function(cc , index){
			// console.log(cc);
			if(cc.shape.visible){
				if( 
					Math.abs((kuang.x+man.size().w/2) - (cc.shape.x+cc.size().w/2)) <= (man.size().w+cc.size().w)/2&&
					Math.abs((kuang.y+man.size().h/2) - (cc.shape.y+cc.size().h/2)) <= (man.size().h+cc.size().h)/2&&
					!cc.isget
				){
					cc.isget = true;
					countCoin.innerHTML = parseInt(countCoin.innerHTML)+1
				}
				cc.update();
			}
		})

		document.getElementById("showFPS").innerHTML = man.endy
		stage.update(event);
	}

	init();