var fps = document.getElementById("showFPS"),
	countCoin = document.getElementById("coins"),
	aCoinsapn = countCoin.getElementsByTagName("span"),
	countdown = document.getElementById("count"),
	clock = document.getElementById("clock"),
	aclockSpan = clock.getElementsByTagName("span"),
	countSapn = countdown.getElementsByTagName("span"),
	noChance = document.getElementById("noChance"),
	aButtons = noChance.getElementsByTagName("button"),
	score = document.getElementById("score"),
	ascoreButton = score.getElementsByTagName("button"),
	scratchCard = document.getElementById("card"),
	scoreShow = document.getElementById("scoreShow"),
	ascoreSpan = scoreShow.getElementsByTagName("span"),
	cardcanva = document.getElementById("cardarea");
var stage, C_W, C_H, loader , mmm;
var info,
	chances ,   //机会次数
    timer = null,    //5分数定时器
    banCount = 0;    //香蕉数
var man, ground, sky, wave, cloudArr = [];
var screenW = window.screen.width,
	screenH = window.screen.height,
	perWid = screenW / 10,
	perHei = screenH / 9,
	canvas = document.getElementById('cas');
canvas.width = screenW;
canvas.height = screenH;
console.log(scratchCard.offsetWidth , scratchCard.offsetHeight);
cardcanva.height = scratchCard.offsetHeight+2;
cardcanva.width = scratchCard.offsetWidth;
var midHeight = screenH * 0.48,
	midWidth = screenW * 0.12;


function init() {
	stage = new createjs.Stage("cas");
	C_W = stage.canvas.width;
	C_H = stage.canvas.height;
	// console.log(C_W);
	var manifest = [
		{ src: "image/monkey.png", id: "man" },
		{ src: "image/gf.png", id: "ground" },
		{ src: "image/bg.png", id: "bg" },
		{ src: "image/bbg.png", id: "wave" },
		{ src: "image/cloudy.png", id: "cloudy" },
		{ src: "image/mf.png", id: "high" },
		{ src: "image/banana.png", id: "banana" },

		"image/again.png",
		"image/share.png",
		"image/blings.png",
		"image/card-monkey.png",
		"image/clock.png",
		"image/countDown.png",
		"image/getCard.png",

		"image/homepage.png",
		"image/noChances.png",
		"image/num.png",
		"image/scan-qr.png",
		"image/score-num.png",
		"image/scratch.png",
		"image/scratch-bg.png",

		"image/success.png",
		"image/surface.png",
		"image/surface-ban.png",
		"image/tips.png",
		"image/title-lucky.png",
		"image/top.png",
		"image/top-num.png"
	]

	loader = new createjs.LoadQueue(true);
	loader.on("fileload", handleProgress);
	loader.on("complete", handleComplete);

	loader.loadManifest(manifest);
	drawLoading();
}

function drawLoading() {
	$('.loadding').show();
}

function handleProgress(){
	var wid = loader.progress*0.942/1 > 0.8 ? loader.progress*0.942/1 : 0.8;
	// console.log(loader.progress , wid , wid*100+"%" , typeof parseInt(wid*100+"%"));
	$('.loadding-inner>span').animate({
		width : wid*100+"%"
	})
}

//地图数据，mapData为下地板数据，coinCode为香蕉数据 ， mfloor为上地板数据
var mapData = [
		"AACAAACAAAACCAAAAAAAAAAACAAAAA",
		"AACAAACAAAACCAAAAAAAAAAACAAAAA",
		"AACAAACAAAACCAAAAAAAAAAACAAAAA"
	],
	mfloor = [
		"CCFFCCCCFCCCCFFFECCCCCFFCCCCCD",
		"CCFFCCCCFCCCCFFFECCCCCFFCCCCCD",
		"CCFFCCCCFCCCCFFFECCCCCFFCCCCCD"
	],
	coinCode = [
		"--33322---33--22222211--1122--",
		"--33322---33--22222211--1122--",
		"--33322---33--22222211--1122--"
	],
	shortObstacle = [
		"CCCDCCCCCCCCFCCCCFCCCCECCFCCCC",
		"CCCDCCCCCCCCFCCCCFCCCCECCFCCCC",
		"CCCDCCCCCCCCFCCCCFCCCCECCFCCCC"
	],
	longObstacle = [
		"CCCCCCCCCFCCCCCCCCCFCCCCCCCFCC",
		"CCCCCCCCCFCCCCCCCCCFCCCCCCCFCC",
		"CCCCCCCCCFCCCCCCCCCFCCCCCCCFCC"
	]

function handleComplete() {		//当图片素材load完后执行该方法
	$('.loadding').hide();
	var manImage = loader.getResult("man"),
		lowground = loader.getResult("ground"),
		highground = loader.getResult("high"),
		bgImage = loader.getResult("bg"),
		waveIamge = loader.getResult("wave"),
		cloudyImg = loader.getResult("cloudy"),		
		coins = loader.getResult("banana");

	//天空
	sky = new createjs.Shape();
	sky.graphics.bf(bgImage).drawRect(0, 0, C_W + bgImage.width, bgImage.height * 6.8); //bgImage.height
	sky.scaleY = (perHei * 6.8)/bgImage.height;
	sky.tileW = bgImage.width;
	stage.addChild(sky);

	// 波浪
	wave = new createjs.Shape();
	wave.graphics.beginBitmapFill(waveIamge).drawRect(0, 1, C_W + waveIamge.width, perHei * 3.2);
	wave.tileW = waveIamge.width;
	wave.y = C_H - perHei * 3.2;
	stage.addChild(wave);

	//云
	for (var i = 0; i < 3; i++) {
		cloudArr[i] = new createjs.Shape();
		cloudArr[i].graphics.bf(cloudyImg).drawRect(0, 1, cloudyImg.width, cloudyImg.height)
		cloudArr[i].setTransform(perWid * (i * 5 + 4), perHei * Math.floor(Math.random() * 3) + Math.random() * 25, 0.5, 0.5);
		// cloudArr[i].alpha = 0.7;
		stage.addChild(cloudArr[i]);
	}

	man = createMan(100, perHei * 5, manImage);


	//该框为判定角色的判定区域
	kuang = new createjs.Shape();
	kuang.graphics.beginStroke("rgba(255,0,0,0.5)").drawRect(0, 0, man.size().w, man.picsize().h);
	// stage.addChild(kuang);

	mapHandle(lowground, highground, coins);
	stage.update(event);

	// 点击事件
	stage.on("click" , function(e){
		e.preventDefault();
		e.stopPropagation();
		if (man.jumpNum < man.jumpMax) {
			man.jump(mmm);
		}
	})

	// 判断是否关注
	info = JSON.parse(untils.getQueryString("wxUserInfo"));
	chances = 0;   //机会次数
	var stime = 300;   //5分钟倒计时
	var countdownTime = 3,
	time = null;	

	console.log(info , typeof info);
	var subscribe = info.subscribe;
	if (subscribe) {
		if (chances) {
			//倒计时数字显示
			countdown.style.display = "block";
			time = setInterval(function(){
				if (countdownTime <= 1) {
					clearInterval(time);
					countdown.style.display = "none";
					createjs.Ticker.timingMode = createjs.Ticker.RAF;
					createjs.Ticker.setFPS(60);
					createjs.Ticker.addEventListener("tick", tick);

					//5分钟倒计时开始
					timer = setInterval(function(){					
						if (stime <= 0) {
							// callback;
							clearInterval(timer);
						}else{
							stime--;
							untils.changeForm(stime , aclockSpan);
							banCount++;
							untils.changeCountBan(banCount , aCoinsapn);
						}
					} , 1000)
				}else{
					countdownTime--;
					countSapn[0].style.backgroundPosition = (1-countdownTime)*100+"px 0px";
				}
			} , 1000)
		}else{
			console.log('机会用完啦');
			noChance.style.display = "block";
		}
	}else{
		// alert("您还没有关注我们的公众号哦！！快去关注吧");
		$('.follow').show();
	}

	
	

	//一键分享
	aButtons[1].addEventListener("click" , function(){
		console.log('share');
		$('.shareTips').show();
		$('.sharetip-bg').click(function(){
			// console.log('share');
			$(this).parent().hide();
		})
	})


	// 再玩一次        -----结果分数页上的按钮
	ascoreButton[2].addEventListener("click" , function(){
		window.location.href = window.location.href+"?num="+Math.random();
	})

	//刮奖
	var can = cardcanva.getContext("2d");
	var X = cardcanva.width;
	var Y = cardcanva.height;
	var oImg = new Image();
	oImg.src = "./image/scratch.png";
	oImg.onload = function(){
		can.beginPath();
		can.drawImage(oImg,0,0,X,Y);
		can.closePath();
	}
	var device = /android|iphone|ipad|ipod|webos|iemobile|opear mini|linux/i.test(navigator.userAgent.toLowerCase());
	var startEvtName = device?"touchstart":"mousedown";
	var moveEvtName = device?"touchmove":"mousemove";
	var endEvtName = device?"touchend":"mouseup";
	function draw(event){
		var x = device?event.touches[0].clientX - midWidth : event.clientX - midWidth;
		var y = device?event.touches[0].clientY - midHeight : event.clientY - midHeight;
		console.log(x,y);
		can.beginPath();
		can.globalCompositeOperation = "destination-out";
		can.arc(x,y,20,0,Math.PI*2,false);
		can.fill();
		can.closePath();
	}
	//true  捕获 false  冒泡
	cardcanva.addEventListener(startEvtName,function(){
		cardcanva.addEventListener(moveEvtName,draw,false);
	},false);
	cardcanva.addEventListener(endEvtName,function(){
		cardcanva.removeEventListener(moveEvtName,draw,false);
	},false);



	// var cardctx = cardcanva.getContext('2d');
	// var arr = untils.getOffset(cardcanva);
	// var oLeft = arr[0];
	// var oTop = arr[1];
	// console.log(arr , cardcanva.width , cardcanva.height);
	// /* 初始化画布*/
	// cardctx.beginPath();
	// // cardctx.fillStyle = 'transparent';
	// cardctx.fillRect(0, 0, cardcanva.width, cardcanva.height);
	// // cardctx.strokeStyle="#000";
	// // cardctx.strokeRect(0, 10, cardcanva.width , cardcanva.height - 20);
	// cardctx.closePath();
	// cardcanva.addEventListener("touchstart", function(event) {
	// 	console.log(event.touches[0].pageX,event.touches[0].pageY - cardcanva.height , oTop);
	//     cardctx.beginPath();
	//     cardctx.lineWidth = 30;
	//     // cardctx.strokeStyle="red";
	//     cardctx.globalCompositeOperation = 'destination-out';
	//     cardctx.moveTo(event.touches[0].pageX - oLeft, event.touches[0].pageY - oTop - cardcanva.height);
	// }, false)
	// cardcanva.addEventListener("touchmove", function(event) {
	// 	console.log("move");
	//     /* 根据手指移动画线，使之变透明*/
	//     cardctx.lineTo(event.touches[0].pageX - oLeft, event.touches[0].pageY - oTop - cardcanva.height);
	//     /* 填充*/
	//     cardctx.stroke();
	// })
}


var mapIndex = 0,		  //地图序列
	Mix = 0,			  //地图数组的索引
	allStones = [],		  //存放所有的石头
	lastStone = null;	  //存放最后一个石头
	allCoins = [],		  //所有金币
	lastCoin = null,      //存放最后一根香蕉
	allMfloor = [],       //存放底图所有上地板
	lastmfloor = null,    //存放最后一个上地板
	allsBuilding = [],    //存放所有矮建筑
	lastsBuilding = null, //存放最后一个矮建筑
	allLbuilding = [],    //存放所有高建筑
	lastLBuilding = null, //存放最后一个高建筑
	tmpMfloor = [];

function mapHandle(lowground, highground, coins) {		//初始化地图
	allStones.length = 0;
	allMfloor.length = 0;
	allCoins.length = 0;
	// allsBuilding.length = 0;
	// allLbuilding.length = 0;

	// 下地板
	var stoneImage = { "A": lowground, "B": highground }, kind = null;
	for (var i = 0; i < 30; i++) {			//把需要用到的石头预先放入容器中准备好
		switch (i) {
			case 0: kind = "A"; break;
			case 20: kind = "C"; break;
		}
		var st = createStone(perWid*i, kind, stoneImage);
		allStones.push(st)
	}

	// 上地板
	var mfImage = { "D": highground, "E": highground, "F": highground }, mkind = null;
	for (var i = 0; i < 20; i++) {
		switch (i) {
			case 0: mkind = "C"; break;
			case 5: mkind = "D"; break;
			case 10: mkind = "E"; break;
			case 15: mkind = "F"; break;
		}
		// console.log('mkind:',mkind);
		var mf = createStone(perWid*i, mkind, mfImage);
		allMfloor.push(mf);
	}

	// 香蕉
	var bankind = null;
	for (var i = 0; i <= 30; i++) {			//把需要用到的金币预先放入容器中
		switch (i) {
			case 0: bankind = "1"; break;
			case 10: bankind = "2"; break;
			case 20: bankind = "3"; break;
			case 30: bankind = "5"; break;
		}
		// console.log('bankind:',bankind);
		var coin = createCoin(i*perWid , coins, bankind);
		allCoins.push(coin);
	}

	// 矮建筑
	// var shortImage = {"D": jzj, "E": jzt, "F": tt },
	// 	shortKind = null;
	// for (var i = 0; i <= 30; i++) {
	// 	switch (i) {
	// 		case 0: shortKind = "C"; break;
	// 		case 7: shortKind = "D"; break;
	// 		case 14: shortKind = "E"; break;
	// 		case 21: shortKind = "F"; break;
	// 	}
	// 	// console.log(shortKind);
	// 	var shortBuild = createObstale(C_W , shortKind , shortImage);
	// 	allsBuilding.push(shortBuild);
	// }
	// console.log(allsBuilding);


	Mix = Math.floor(Math.random() * mapData.length);			//随机地图序列
	for (var i = 0; i < 8; i++) {
		setStone(false)
	}
}

function setStone(remove) {		//添加陆地的石头
	var arg = mapData[Mix].charAt(mapIndex),
		coarg = coinCode[Mix].charAt(mapIndex),
		mfarg = mfloor[Mix].charAt(mapIndex),
		shortarg = shortObstacle[Mix].charAt(mapIndex),
		longarg = longObstacle[Mix].charAt(mapIndex),
		shortcc = null,
		longcc = null,
		coincc = null,
		cc = null,
		mfcc = null;


	//香蕉
	for (var i = 0; i < allCoins.length; i++) {
		// console.log(allCoins[i].kind , coarg);
		// debugger;
		if (coarg !== "-") {			
			var ckind = allCoins[i].kind;
			if (!allCoins[i].shape.visible && allCoins[i].kind === coarg) {
				var coinst = allCoins[i];
				coinst.shape.visible = true;
				coinst.shape.x = lastCoin === null ? perWid*5 : lastStone.shape.x  * 0.35  + C_W;
				coinst.shape.y = lastCoin === null ? perHei*5 : perHei * parseInt(ckind);
				lastCoin = coinst;
				break;
			}
		}
	}

	//下地板
	for (var z = 0; z < allStones.length; z++) {
		if (!allStones[z].shape.visible && allStones[z].kind === arg) {
			var st = allStones[z];
			st.shape.visible = true;
			st.shape.x = lastStone === null ? 0 : lastStone.shape.x + lastStone.w;
			// console.log(st);
			if (cc) {
				cc.shape.x = lastStone === null ? allStones[z].w / 2 - cc.size().w / 2 : lastStone.shape.x + lastStone.w + allStones[z].w / 2 - cc.size().w / 2;
				cc.shape.y = arg === "C" ? C_H - loader.getResult("high").height - 50 : allStones[z].shape.y - cc.size().h / 2 - 50;
			}

			lastStone = st;
			break;
		}
	}


	// 上地板
	for (var k = 0; k < allMfloor.length; k++) {
		if (!allMfloor[k].shape.visible && allMfloor[k].kind === mfarg) {
			var mfkind = allMfloor[k].kind , disy = 0;
			if (mfkind == "D") {
				disy = 2;
			}else if (mfkind == "E") {
				disy = 3;
			}else if (mfkind == "F") {
				disy = 4;
			}else{
				disy = -1000;
			}
			var mf = allMfloor[k];
			mf.shape.visible = true;
			mf.shape.x = lastmfloor === null ? 0 : lastmfloor.shape.x + lastmfloor.w;
			mf.shape.y = lastmfloor === null ? 0 : perHei *disy;
			// console.log(mf);
			tmpMfloor.push({
				shape: {
					x: mf.shape.x
				},
				w: mf.w,
				x: mf.x,
				kind: mf.kind
			});
			if (mfcc) {
				mfcc.shape.x = lastmfloor === null ? allMfloor[k].w / 2 - mfcc.size().w / 2 : lastmfloor.shape.x + lastmfloor.w + allMfloor[k].w / 2 - mfcc.size().w / 2;
				mfcc.shape.y = mfarg === "C" ? C_H - loader.getResult("high").height - 50 : allMfloor[k].shape.y - mfcc.size().h / 2 - 50;
			}

			lastmfloor = mf;
			break;
		}
	}




	mapIndex++;
	if (mapIndex >= mapData[Mix].length) {
		Mix = Math.floor(Math.random() * mapData.length)
		mapIndex = 0;
	}
}


function stoneHandle() {
	//石头的逐帧处理  cg为判断当前角色的位置是否被阻挡，overStone是保存离开stage的石头块
	var cg = false, overStone = null;
	allStones.forEach(function (s) {   //遍历石头，确定玩家落点
		// console.log(s.shape.visible);
		if (s.shape.visible) {
			s.update();

			if (s.shape.visible && s.shape.x <= -s.w) {
				overStone = s;
			}

			var juli = Math.abs((kuang.x + man.size().w / 2) - (s.shape.x + s.w / 2));
			// console.log(s.shape.x);
			if (juli <= (man.size().w + s.w) / 2 && man.ground.indexOf(s) === -1) {
				man.ground.push(s);

				if ((s.shape.x + s.w / 2) > (kuang.x + man.size().w / 2) && s.y < (kuang.y + man.size().h - 10)) {
					man.sprite.x = s.shape.x - man.picsize().w - 8;
					cg = true;
				}
			}
		}
	});
	if (overStone) {
		setStone(true);
		overStone.shape.visible = false;
	}
	return cg;
}

function mdfloorHandle() {
	var mfcg = false, overmdfloor = null;
	var flag = false;
	var tempM = '';
	allMfloor.forEach(function (m) {   //遍历石头，确定玩家落点
		if (m.shape.visible) {
			m.update();

			if (m.shape.visible && m.shape.x <= -m.w) {
				overmdfloor = m;
			}

			var juli = Math.abs((kuang.x + man.size().w / 2) - (m.shape.x + m.w / 2));
			if (juli <= (man.size().w + m.w) / 2 && man.ground.indexOf(m) === -1) {
				// console.log(m.shape.x);
				if (m.shape.y >= (kuang.y + man.size().h)) {
					man.ground.push(m);

				}
				// console.group("碰头");
				//碰头
				if ( (m.shape.y + m.h <= (kuang.y) ) && m.kind !== "C" && m.kind !== "E" && m.kind !== "D") {
					mmm = true;
					// console.log(mmm , m.kind);
				}else{
					mmm = false;
					// console.log('可以跳');
				}

				if ((m.shape.x + m.w / 2) > (kuang.x + man.size().w / 2)) {
					// 碰脚
					if (m.y < (kuang.y + man.size().h - 10)) {
						mfcg = true;
					}					
				}
				var yjuli = Math.abs((kuang.y + man.size().h / 2) - (m.shape.y + m.h / 2));
				if (m.kind !== "C") {
					if (yjuli < (man.size().h + m.h)/3 )  {
						// flag = false;
						// tempM = m;
						if ( (m.shape.y + m.h*3 <= kuang.y) || (m.shape.y + m.h*3 <= kuang.y) ) {
							mmm = false;
							flag = true;
							tempM = null;
							// console.log('tempM =null');
						}else{
							flag = false;
							tempM = m;
							// console.log('tempM =' , m);
						}
					} else {
						// console.log(yjuli, man.size().h + m.h, kuang.y, 'false');
						flag = true;					
					}
					// console.groupEnd();

				}
				// console.groupEnd();
			}
			if (!flag && tempM) {
				man.sprite.x = tempM.shape.x - man.picsize().w - 8;	
				console.log('enter tempM');				
			}
		}

	});
	if (overmdfloor) {
		setStone(true);
		overmdfloor.shape.visible = false;
	}
	return mfcg;
}

function tick(event) {		//舞台逐帧逻辑处理函数
	// debugger;
	var deltaS = event.delta / 1000;
	sky.x = (sky.x - deltaS * 100) % sky.tileW;
	wave.x = (wave.x - deltaS * 100) % wave.tileW;
	//云
	for (var i = 0; i < 3; i++) {
		cloudArr[i].x = (cloudArr[i].x - deltaS * 50);
		if (cloudArr[i].x + cloudArr[i].width * cloudArr[i].scaleX <= 0) {
			cloudArr[i].x = C_W;
			cloudArr[i].y = perHei * Math.floor(Math.random() * 3) + Math.random() * 25;
		}
	}

	man.update();
	// console.log('tick');
	kuang.x = man.sprite.x + (man.picsize().w * 1.5 - man.size().w) / 2;	//参考框
	kuang.y = man.sprite.y;

	man.ground.length = 0;
	man.mapFloor.length = 0;
	man.mapFloor = allMfloor.slice(0);
	var cg = stoneHandle();
	var mfcg = mdfloorHandle();

	if (man.ground[0] && !cg && !mfcg) {
		man.ground.sort(function (a, b) {
			return a.y - b.y;
		});
		man.endy = man.ground[0].y - man.picsize().h * 1;
	}

	allCoins.forEach(function (cc, index) {
		// console.log(cc);
		if (cc.shape.visible) {
			if (
				Math.abs((kuang.x + man.size().w / 2) - (cc.shape.x + cc.size().w / 2)) <= (man.size().w + cc.size().w) / 2 &&
				Math.abs((kuang.y + man.size().h / 2) - (cc.shape.y + cc.size().h / 2)) <= (man.size().h + cc.size().h) / 2 &&
				!cc.isget
			) {
				cc.isget = true;
				banCount++;
				// countCoin.innerHTML = parseInt(countCoin.innerHTML) + 1;
				untils.changeCountBan(banCount , aCoinsapn);
			}
			cc.update();
		}
	})


	document.getElementById("showFPS").innerHTML = man.endy
	stage.update(event);
}

init();