//全局 begin
//GetObj
function GetObj(a){if(document.getElementById){return eval('document.getElementById("'+a+'")')}else if(document.layers){return eval("document.layers['"+a+"']")}else{return eval('document.all.'+a)}}
//hiddenObj
function hiddenObj(a){GetObj(a).style.display="none"}
//showObj
function showObj(a){GetObj(a).style.display="block"}
//全局 end

document.domain = "sina.com.cn";

//try{document.domain = "sina.com.cn";
//}catch(e){}

//============== 090525 针对视频播放器的调整 start ===========
var FlvPlayerCode = new Object();
FlvPlayerCode.data = {
	playerCode : ""
};

var getFlvPlayerCode = function(){
	if(GetObj("myMovie")){
		if(GetObj("p_player").childNodes[0].tagName == "OBJECT"){
			var myMovieParam = new Array();
			var myMovieParamList = new Array();
			myMovieParamList[0] = sinaBokePlayerConfig_o.playerWidth;//swf的宽度
			myMovieParamList[1] = sinaBokePlayerConfig_o.playerHeight;//swf的高度
			myMovieParamList[4] = "";//flashvars
			for(var i=0;i<GetObj("myMovie").childNodes.length;i++){
				myMovieParam[i] = new Array();
				myMovieParam[i][0] = GetObj("myMovie").childNodes[i].name;
				myMovieParam[i][1] = GetObj("myMovie").childNodes[i].value;
				if(myMovieParam[i][0] == "movie"){
					myMovieParamList[2] = myMovieParam[i][1];//swf的url
				}else if(myMovieParam[i][0] == "flashvars"){
					myMovieParamList[3] = myMovieParam[i][1];//swf的参数
				}
			}
			GetObj("p_player").innerHTML = "";
			FlvPlayerCode.data.playerCode = "<embed width=\"" + myMovieParamList[0] + "\" height=\"" + myMovieParamList[1] + "\" flashvars=\"" + myMovieParamList[3] + "\" src=\"" + myMovieParamList[2] + "\" allowscriptaccess=\"always\" wmode=\"transparent\" allowfullscreen=\"true\" quality=\"high\" name=\"myMovie\" id=\"myMovie\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" \/>";
			//alert(FlvPlayerCode.data.playerCode);
			GetObj("p_player").innerHTML = FlvPlayerCode.data.playerCode;
		}else{
			FlvPlayerCode.data.playerCode = GetObj("p_player").innerHTML;
		}
	}
};
//============== 090525 针对视频播放器的调整 end ===========

//========================= 设置字体大中小 start =============
function doZoom(size){
	/*var artibody = document.getElementById("artibody");
	if(!artibody){
		return;
	}
	var artibodyChild = artibody.childNodes;
	artibody.style.fontSize = size + "px";
	//再对artibody div内的直接html节点设置fontSize属性
	for(var i = 0; i < artibodyChild.length; i++){
		if(artibodyChild[i].nodeType == 1){
			artibodyChild[i].style.fontSize = size + "px";
		}
	}*/
	var artibody = document.getElementById("artibody");
	artibody.className = "blkContainerSblkCon blkContainerSblkCon_" + size;
}
//========================= 设置字体大中小 end =============

//========================= 打印正文部分 start =============
//print js begin
function LoadPrintJsCallBack(){
  if(typeof forSPrint == "object" && forSPrint.Print){
    forSPrint.Print();
  }
}
function LoadPrintJs(){

	//090515001 ws begin
	getFlvPlayerCode();
	//090515001 ws end

  var jsFile = "http://news.sina.com.cn/js/ui/con08/print_11090203.js";  //打印主js文件url
  jsFile += "?t="+ (new Date()).getTime();
  var js = document.createElement("script");
  js.setAttribute("src",jsFile); 
  js.setAttribute("type","text\/javascript");
  js.setAttribute( "id", "sinaPrintJsUrl");
  //for ie
  js.onreadystatechange = function(){
  if(js.readyState=="loaded"){
     LoadPrintJsCallBack();
  }
};
//for ff
js.onload = LoadPrintJsCallBack;
  document.body.insertBefore(js,null); // null for ff
}

//print js end
//========================= 打印正文部分 end =============

//========================= 处理广告有效性 start =============
/**
 * 判断广告有效性
 * @return boolean
 */
//发布日期
var pagepubtime;
//需要检测的日期差
var difDay;

//广告显示判断
function checkPubTime(){

	//分解年、月、日
	DateTime = new Array(); 
	DateTime = pagepubtime.split("-");
	var year = DateTime[0];
	var month = DateTime[1];
	var day = DateTime[2];

	//用得到的年、月、日生成日期对象
	var pubTime = new Date(year,month - 1,day);
	//得到当前日期
	var now = new Date();

	//计算出当前日期与发布日期之间的毫秒差值
	var dif = now.getTime() - pubTime.getTime();

	//一天24小时、一小时60分、一分60秒、一秒1000毫秒
	if(dif > difDay * 24 * 60 * 60 * 1000){
		return false;
	}
	return true;
}
/**
 * 处理广告图片 指定天数后不显示 广告图片初始使用css控制不显示
 * @param 多个广告容器的id
 */
function HandlerAd(){
	var curObj = null;
	for(var i = 0; i < arguments.length; i++){
		curObj = GetObj(arguments[i]);
		if(checkPubTime()){
			if(!curObj){ 
				continue;
			}
			curObj.style.display = "block";
		}
	}
}
//========================= 处理广告有效性 end =============

//统一登录 begin
var contentPageLogin = {
	status : '',
	_timeObj : null,
	init : function(){
		var tempThis = this;
		clearInterval(this._timeObj);
		this._timeObj = setInterval(function(){tempThis.chkStatus()},5000);
	},
	login : function(){
		var nick_name;
		if(typeof(sinaSSOManager) == 'object'){
			nick_name = sinaSSOManager.getSinaCookie();
			nick_name = nick_name.nick;
		};
		var c,a,d;
		if(nick_name!="" && nick_name != "undefined" && nick_name != null){
			a = nick_name;
		}else{
			a = getUserCookie("SU");
			var b = a.split(":");
			if (b.length > 1) {
				a = decodeURI(b[3])
			};
		}
		c = "";
		if (a != "" && a != "null" && a != null && a != "undefined") {
			if (a.length > 4) {
				c = a;
				d = a.substr2(0, 6);
				if(a!=d){
					a = d + "..";
				}
			}
			sina.$("content_mainNav_uq_username").innerHTML = a;
			sina.$("content_mainNav_uq_username").title = c
		}
		showObj("content_mainNav_uq_username");
		showObj("content_mainNav_uniproquit");
		hiddenObj("content_mainNav_uniprolink");
		sina.$("content_mainNav").className = "hd_nav hd_nav_log";

		this.init();
	},
	logout : function(){
		showObj("content_mainNav_uniprolink");
		hiddenObj("content_mainNav_uniproquit");
		hiddenObj("content_mainNav_uq_username");
		sina.$("content_mainNav").className = "hd_nav";

		this.init();
	},
	setStatus : function(status){
		if(status == this.status){
			return;
		};
		if(status=='login'){
			this.status = 'login';
			this.login();
		}else{
			this.status = 'logout';
			this.logout();
		};
	},
	chkStatus : function(){
		//debugger;
		var islogin = sinaSSOManager.getSinaCookie();
		if(islogin){
			this.setStatus('login');
		}else{
			this.setStatus('logout');
		};
	}
};
String.prototype.substr2 = function(a, b) {
	a = this.getStartPst(a);
	var c = this.substr(a, b);
	var d = c.replace(/[^\x00-\xff]/g, "aa").length;
	var e = d - b;
	var f;
	var g = b;
	var i = 0;
	while (e > 0) {
		c = this.substr(a, g);
		d = c.replace(/[^\x00-\xff]/g, "aa").length;
		e = d - b;
		if (e <= 0) {
			break
		}
		f = Math.floor(e / 2);
		if (f > 1) {
			g = b - f
		} else {
			i++;
			g = b - i
		}
	}
	return this.substr(a, g)
};
String.prototype.getStartPst = function(a) {
	var b = this.substr(0, a);
	var c = b.replace(/[^\x00-\xff]/g, "aa").length;
	var d = c - a;
	var e;
	var f = a;
	var i = 0;
	while (d > 0) {
		b = this.substr(0, f);
		c = b.replace(/[^\x00-\xff]/g, "aa").length;
		d = c - a;
		if (d <= 0) {
			break
		}
		e = Math.floor(d / 2);
		if (e > 1) {
			f = a - e
		} else {
			i++;
			f = a - i
		}
	}
	return f
};
function getUserCookie(name) {
  var search;
  search = name + "="
  offset = document.cookie.indexOf(search) 
  if (offset != -1) {
    offset += search.length ;
    end = document.cookie.indexOf(";", offset) ;
    if (end == -1)
      end = document.cookie.length;
    return document.cookie.substring(offset, end);
  }else{
  	return "";
  }
};
var getCookie = getUserCookie;
function unipro_clearCookie(name ) {
	document.cookie=name+"=; " + "domain=sina.com.cn; path=/; ";     
	//bites = document.cookie.split("; ");
}
function getMobileNum(ckName){
var userInfo = getUserCookie(ckName).split(":");
	return userInfo[2];
}
function unipro_UniProLogout() {
	unipro_clearCookie("SE");
	unipro_clearCookie("SCT");
	unipro_clearCookie("SU");
	unipro_clearCookie("SA");
	unipro_clearCookie("PS");
	if(getUserCookie("SINAPRO") != "" && getUserCookie("SINAPRO") != null){ //清查旧版Cookie
		unipro_clearCookie("SINAPRO");
		unipro_clearCookie("SINA-AVATAR");
		unipro_clearCookie("SINAPROC");
		unipro_clearCookie("nick");
		unipro_clearCookie("SINA_NU");
		unipro_clearCookie("SINA_OU");
		unipro_clearCookie("appmask");
		unipro_clearCookie("gender");
		unipro_clearCookie("UNIPROTM");
		unipro_clearCookie("UNIPROU");
		unipro_clearCookie("SINA_USER");
		unipro_clearCookie("SMS_COOKIE");
	}
	return true;
}
function getUniproUrl_stand(){
	window.location='http://unipro.sina.com.cn/';
	return false;
}
function getUniproUrl_welcome(){
	unipro_UniProLogout();
	window.location=location.href;
	return false;	
}
function print_stand_unipro_head() {
	contentPageLogin.logout();
}
function print_stand_unipro_welcome(nick_name) {
	contentPageLogin.login();
};
//统一登录 end

//medialogo resize begin
var flag=false;function DrawImage(a){var b=new Image();var c=999;var d=21;b.src=a.src;if(b.width>0&&b.height>0){flag=true;if(b.width/b.height>=c/d){if(b.width>c){a.width=c;a.height=(b.height*c)/b.width}else{a.width=b.width;a.height=b.height}}else{if(b.height>d){a.height=d;a.width=(b.width*d)/b.height}else{a.width=b.width;a.height=b.height}}}}
//medialogo resize end

/*
舌签构造函数
SubShowClass(ID[,eventType][,defaultID][,openClassName][,closeClassName])
version 1.21
*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('s 7(h,j,k,l,m){5.1i="1.1j";5.1k="1l";5.t=7.$(h);6(5.t==p&&h!="9"){L M N("7(w)参数错误:w 对像存在!(V:"+h+")")};6(!7.u){7.u=[]};5.w=7.u.q;7.u.1b(5);5.1m=r;5.8=[];5.W=k==p?0:k;5.B=5.W;5.X=l==p?"1n":l;5.Y=m==p?"":m;5.O=r;x n=Z("7.u["+5.w+"].O = z"),G=Z("7.u["+5.w+"].O = r");6(h!="9"){6(5.t.v){5.t.v("10",n)}y{5.t.H("11",n,r)}};6(h!="9"){6(5.t.v){5.t.v("12",G)}y{5.t.H("13",G,r)}};6(14(j)!="1o"){j="1p"};j=j.1q();1r(j){P"10":5.A="11";I;P"12":5.A="13";I;P"1s":5.A="1t";I;P"1u":5.A="1v";I;1w:5.A="1x"};5.1c=s(a,b,c,d,e){6(7.$(a)==p&&a!="9"){L M N("1c(1d)参数错误:1d 对像存在!(V:"+a+")")};x f=5.8.q;6(c==""){c=p};5.8.1b([a,b,c,d,e]);x g=Z(\'7.u[\'+5.w+\'].C(\'+f+\')\');6(a!="9"){6(7.$(a).v){7.$(a).v("1y"+5.A,g)}y{7.$(a).H(5.A,g,r)}};6(f==5.W){6(a!="9"){7.$(a).Q=5.X};6(7.$(b)){7.$(b).D.R=""};6(h!="9"){6(c!=p){5.t.D.1e=c}};6(d!=p){J(d)}}y{6(a!="9"){7.$(a).Q=5.Y};6(7.$(b)){7.$(b).D.R="9"}};6(7.$(b)){6(7.$(b).v){7.$(b).v("10",n)}y{7.$(b).H("11",n,r)};6(7.$(b).v){7.$(b).v("12",G)}y{7.$(b).H("13",G,r)}}};5.C=s(a,b){6(14(a)!="15"){L M N("C(1f)参数错误:1f 不是 15 类型!(V:"+a+")")};6(b!=z&&5.B==a){S};x i;16(i=0;i<5.8.q;i++){6(i==a){6(5.8[i][0]!="9"){7.$(5.8[i][0]).Q=5.X};6(7.$(5.8[i][1])){7.$(5.8[i][1]).D.R=""};6(h!="9"){6(5.8[i][2]!=p){5.t.D.1e=5.8[i][2]}};6(5.8[i][3]!=p){J(5.8[i][3])}}y 6(5.B==i||b==z){6(5.8[i][0]!="9"){7.$(5.8[i][0]).Q=5.Y};6(7.$(5.8[i][1])){7.$(5.8[i][1]).D.R="9"};6(5.8[i][4]!=p){J(5.8[i][4])}}};5.B=a};5.17=s(){6(E.q!=5.8.q){L M N("17()参数错误:参数数量与标签数量不符!(q:"+E.q+")")};x a=0,i;16(i=0;i<E.q;i++){a+=E[i]};x b=1z.17(),18=0;16(i=0;i<E.q;i++){18+=E[i]/a;6(b<18){5.C(i);I}}};5.F=r;x o=p;5.K=1A;5.1B=s(a){6(14(a)=="15"){5.K=a};T(o);o=19("7.u["+5.w+"].U()",5.K);5.F=z};5.U=s(){6(5.F==r||5.O==z){S};5.1g()};5.1g=s(){x a=5.B;a++;6(a>=5.8.q){a=0};5.C(a);6(5.F==z){T(o);o=19("7.u["+5.w+"].U()",5.K)}};5.1C=s(){x a=5.B;a--;6(a<0){a=5.8.q-1};5.C(a);6(5.F==z){T(o);o=19("7.u["+5.w+"].U()",5.K)}};5.1D=s(){T(o);5.F=r}};7.$=s(a){6(1a.1h){S J(\'1a.1h("\'+a+\'")\')}y{S J(\'1a.1E.\'+a)}}',62,103,'|||||this|if|SubShowClass|label|none||||||||||||||||null|length|false|function|parentObj|childs|attachEvent|ID|var|else|true|eventType|selectedIndex|select|style|arguments|autoPlay|mouseOutFunc|addEventListener|break|eval|spaceTime|throw|new|Error|mouseIn|case|className|display|return|clearInterval|autoPlayFunc|value|defaultID|openClassName|closeClassName|Function|onmouseover|mouseover|onmouseout|mouseout|typeof|number|for|random|percent|setInterval|document|push|addLabel|labelID|background|num|nextLabel|getElementById|version|21|author|mengjia|lock|selected|string|onmousedown|toLowerCase|switch|onclick|click|onmouseup|mouseup|default|mousedown|on|Math|5000|play|previousLabel|stop|all'.split('|'),0,{}))

//===========================
//全文浏览
function LoadFullViewJsCallBack(){
  if(typeof forSFullView == "object" && forSFullView.FullView){
    forSFullView.FullView();
  }
}
function LoadFullViewJs(){

	//090515001 ws begin
	getFlvPlayerCode();
	//090515001 ws end

  var jsFile = "http://news.sina.com.cn/js/ui/con08/fullscreenview_11090203.js";  //全文浏览主js文件url
  jsFile += "?t="+ (new Date()).getTime();
  var js = document.createElement("script");
  js.setAttribute("src",jsFile); 
  js.setAttribute("type","text\/javascript");
  js.setAttribute( "id", "sinaFullViewJsUrl");
  //for ie
  js.onreadystatechange = function(){
  if(js.readyState=="loaded"){
     LoadFullViewJsCallBack();
  }
};
//for ff
js.onload = LoadFullViewJsCallBack;
  document.body.insertBefore(js,null); // null for ff
}
//===========================

//===========================
//为了美观，不要报错
function killerr(){return true;}
window.onerror = killerr;
//===========================

//path
(function(){
if(window.frameElement){return};
var script = document.createElement('script');
script.src = 'http://news.sina.com.cn/js/87/2012/path.js';
document.getElementsByTagName('head')[0].appendChild(script);
})();