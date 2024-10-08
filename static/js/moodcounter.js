
var P = "http://counter.sina.com.cn/moodq";
var Q1 = "http://counter.sina.com.cn/querylist?format=js&entry=moodarray&callback=moodCallback";
var N = 8;
var pid, key, url, expara, num;
var moodObject, cookieKey, moodKey;
var moodV = new Array();

function fixCookieDate(date) {
	var base = new Date(0);
	var skew = base.getTime();
	if (skew > 0) date.setTime(date.getTime() - skew);
}
function setCookie(name, value, expires, path, domain, secure) {
	document.cookie = name + "=" + escape(value) + ((expires)?"; expires="+expires.toGMTString():"") + ((path)?"; path="+path:"") + ((domain)?"; domain="+domain:"") + ((secure)?"; secure":"");
}
function getCookieVal(offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if (endstr == -1) endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}
function getCookie(name) {
	var arg = name + '=';
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	var flag = '';
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i,j) == arg)
			flag = getCookieVal(j);
		i = document.cookie.indexOf(" ",i) + 1;
		if (i == 0) break;
	}
	return flag;
}
function requestMoodCounter() {
	var elem = document.getElementsByTagName("span");
	for(i=0; i<elem.length; i++) {
		var att = elem[i].getAttribute("name");
		if (att == "moodcounter") {
			moodObject = elem[i];
			pid = elem[i].getAttribute("pid");
			key = elem[i].getAttribute("key");
			url = elem[i].getAttribute("url");
			expara = elem[i].getAttribute("expara");
			if (pid == null || pid == "" || key == null || key == "" || url == null || url == "")
				return false;

			moodKey = pid + "#" + key + "#" + url + "#" + ((expara == null || expara == "")?"NULL":expara);
			moodKey = encodeURIComponent(moodKey);
			cookieKey = pid + "#" + key + "#" + ((expara == null || expara == "")?"NULL":expara);
			cookieKey = encodeURIComponent(cookieKey);

			if ( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) {
				document.createStyleSheet(cssUrl);
			} else {
				var style = document.createElement('link');
				style.type = 'text/css';
				style.rel = 'stylesheet';
				style.href = cssUrl;
				document.body.insertBefore(style, null);
			}

			var cookieValue = getCookie(cookieKey);
			if (cookieValue == "") {
				moodObject.innerHTML = counterPage;
				moodObject.style.display = "";
			} else {
				var requestUrl = Q1 + "&id=" + encodeURIComponent(pid) + "&key=" + moodKey;
				if ( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) {
					document.getElementById("MOODCOUNTER_FORIE").src = requestUrl; 
				} else {
					var js = document.createElement("script"); 
					js.setAttribute("type", "text/javascript");
					js.setAttribute("src", requestUrl);
					document.body.insertBefore(js, null);
				}
			}
			break;
		}
	}
}
function moodClick(moodradio) {
	var moodValue = "";

	for (var i=0; i<moodradio.length; i++) {
		if (moodradio[i].checked == true) {
			moodValue = moodradio[i].value;
			break;
		}
	}

	if (moodValue == "") return false;

	var expdate = new Date();
	fixCookieDate(expdate);
	expdate.setTime(expdate.getTime() + (1000*60*60*24));
	setCookie(cookieKey, moodValue, expdate, "/", "sina.com.cn");

	moodValue = encodeURIComponent(moodValue);
	var requestUrl = P + "?" + "pid=" + pid + "&key=" + key + "&url=" + url + "&expara=";
	requestUrl += ((expara == null || expara == "")?"NULL":expara);
	requestUrl += "&num=" + moodValue;
	if ( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) {
		document.getElementById("MOODCOUNTER_FORIE").src = requestUrl; 
	} else {
		var js = document.createElement("script"); 
		js.setAttribute("type", "text/javascript");
		js.setAttribute("src", requestUrl);
		document.body.insertBefore(js, null);
	}

	requestUrl = Q1 + "&id=" + encodeURIComponent(pid) + "&key=" + moodKey;
	if ( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) {
		document.getElementById("MOODCOUNTER_FORIE").src = requestUrl; 
	} else {
		var js = document.createElement("script"); 
		js.setAttribute("type", "text/javascript");
		js.setAttribute("src", requestUrl);
		document.body.insertBefore(js, null);
	}

	return false;
}
function moodCallback() {
	var moodTotal = 0;
	var maxIndex = -1, tmp = 0;

	if (moodarray.length <= 0) {
		for (i=0; i<N; i++) {
			moodV[i] = 0;
		}
	}
	else {
		moodV = moodarray[0][1].split(",");
		for (i=0; i<N; i++) {
			moodV[i] = parseInt(moodV[i]);
			moodTotal += moodV[i];
		}
	}
	var cookieValue = getCookie(cookieKey);
	if (cookieValue != "") {
		moodV[parseInt(cookieValue)] += 1;
		moodTotal += 1;
	}

	for (i=0; i<moodV.length; i++) {
		if (moodV[i] > tmp) {
			tmp = moodV[i];
			maxIndex = i;
		}
	}
	var realResult = resultPage;
	for (i=0; i<moodV.length; i++) {
		var reg1 = new RegExp("_MOOD" + i + "_", "g");
		realResult = realResult.replace(reg1, (moodTotal == 0)?0:parseInt(moodV[i]*maxColumnHeight/moodTotal));
		var reg2 = new RegExp("_MOOD" + i + "PIC_", "g");
		realResult = realResult.replace(reg2, (maxIndex == i)?redPicUrl:greenPicUrl);
		var reg3 = new RegExp("_MOOD" + i + "RATE_", "g");
		//realResult = realResult.replace(reg3, (moodTotal == 0)?0:parseInt(moodV[i]*100/moodTotal));
                  realResult = realResult.replace(reg3, parseInt(moodV[i]));
	}

	var reg = new RegExp("_MOODTOTAL_", "g");
	realResult = realResult.replace(reg, moodTotal);

	moodObject.innerHTML = realResult;
	moodObject.style.display = "";
}

requestMoodCounter();
