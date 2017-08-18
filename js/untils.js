var untils = {

	//获取游戏机会
	getTicket : function(){
		$.ajax({
	        type: "GET",
	        contentType: "application/json",
	        async: false,
	        data:{
	        	channel : "weixin"
	        },
	        url: "http://activity.test.com.cn/game/getTicket/",
	        success: function (data) {
	        	console.log(data);
	        	
	        },
	        error: function (data) {
	           
	        	console.log(data);
	        }
	    });
	}

	//微信分享
	weChatConfig : function(url , txt){
		$.ajax({
	        type: "GET",
	        contentType: "application/json",
	        async: false,
	        data:{url:window.location.href},
	        url: "http://weixin.gzl.cn/jssdkconfig/getConfig.json",
	        success: function (data) {
	        	console.log(data);
	        	wx.config({
				    debug: false, 
				    appId: data.appId, // 必填，公众号的唯一标识
				    timestamp: data.timestamp, // 必填，生成签名的时间戳
				    nonceStr: data.noncestr, // 必填，生成签名的随机串
				    signature: data.signature,// 必填，签名，见附录1
				    jsApiList: ['checkJsApi','onMenuShareAppMessage','onMenuShareTimeline'] 
				})
	        },
	        error: function (data) {
	           if (XMLHttpRequest.status == 500) {
	               var result = eval("(" + XMLHttpRequest.responseText + ")");
	               $.weui.alert(result.jsonError.errorText);
	           }
	        	console.log(data);
	        }
	    });
			
		wx.ready(function(){

			var commonParams ={
				link:window.location.href
			}
			//获取微信分享到朋友
			wx.onMenuShareAppMessage({
			    desc: txt, // 分享描述
			    link: url, // 分享链接
			    imgUrl: document.images[0].src, // 分享图标
			    type: '', 
			    dataUrl: '', 
			    success: function () { 
			    	// alert('用户分享给朋友成功');
			    },
			    cancel: function () { 

			    }
			});
			
			//分享朋友圈
			wx.onMenuShareTimeline({
			    title: txt, // 分享标题
			    link: url, // 分享链接
			    imgUrl: document.images[0].src, // 分享图标
			    success: function () { ;
			        // alert('用户分享至朋友圈成功');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});		
			
		});

		wx.error(function(res){
			console.log("验证失败："+res);
		});
	},

	//获取url参数
	getQueryString : function(name) { 
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	    var r = window.location.search.substr(1).match(reg);   //返回要匹配的参数
	    return r?decodeURIComponent(r[2]):null;
	},

	// 将秒数转为分秒的形式
	changeForm : function(num , aobj){
		var min = Math.floor(num/60);
		var n = parseInt(num%60);
		var second = n < 10 ? "0" + n : n;
		second = second.toString();
		aobj[1].style.backgroundPosition = -min*20+"px 0px";
		// console.log(second ,typeof second ,  second.toString().length);
		for (var i = 0; i < second.length; i++) {
			// console.log(i , second[i]);
			aobj[2+i].style.backgroundPosition = -second[i]*20+"px 0px"; 
		}
	},
	
	//将香蕉数量转化为图片显示
	changeCountBan : function(num , aobj){
		var wid;
		if (num < 10) {
			num = "00" + num;
		}else if (num < 100) {
			num = "0" + num;
		}
		// console.log(aobj);
		if (aobj == aCoinsapn) {
			wid = 20;
		}else if (aobj == ascoreSpan) {
			wid = 50;
		}
		var str = num.toString();
		// console.log(num , str , wid);
		for (var i = 0; i < str.length; i++) {	
			// console.log(str[i]);		
			aobj[i].style.backgroundPosition = -str[i] * wid + "px 0px"; 
		}
	},

	/* 获取该元素到可视窗口的距离*/
	getOffset : function (obj) {
	    var valLeft = 0,
	        valTop = 0;

	    function get(obj) {
	        valLeft += obj.offsetLeft;
	        valTop += obj.offsetTop;
	        console.log('offset',obj,obj.offsetTop,obj.offsetLeft);
	        // console.log(obj.offsetParent.id);
	        /* 不到最外层就一直调用，直到offsetParent为body*/
	        // if (obj.offsetParent.tagName != 'BODY') {
	        //     get(obj.offsetParent);
	        // }
	        if (obj.offsetParent.id == "card") {
	        	get(obj.offsetParent);
	        }
	        return [valLeft, valTop];
	    }
	    return get(obj);
	},

	// 是否是微信打开
	isWeiXin : function (){ 
		var ua = window.navigator.userAgent.toLowerCase(); 
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
			return true; 
		}else{ 
			return false; 
		} 
	},

	//
	getTicket : function (activityId, channel, callback) {
	    var lucky_url = url + activityId;
	    var check_token = JSON.parse(localStorage.check_token);
	    $.ajax({
	        type:'GET',
	        url:lucky_url,
	        dataType:'json',
	        data: {
	            channel: channel,
	            usr_sign: check_token.usr_sign,
	            usr_nonce: check_token.usr_nonce,
	            usr_ts: check_token.usr_ts
	        },
	        contentType: false,
	        beforeSend: function(request) {
                 request.setRequestHeader("key", "test");
                 request.setRequestHeader("key2", "test2");
            },
	        success:function(data){
	            if(data.message == "不能参与此抽奖活动"){
	               
	            }else if(data.message == "抽奖时发生系统异常"){
	                
	            }else{
	                
	            }
	        },
	        error:function(){

	        }
	    });
	}
}