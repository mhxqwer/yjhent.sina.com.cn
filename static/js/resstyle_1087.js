// JavaScript Document

var arrArg = new Array();
	arrArg['width']           = '298';
	arrArg['height']          = '252';
	arrArg['advwidth']        = '';
	arrArg['advheight']       = '';
	arrArg['mode']            = '';
	arrArg['id']              = '1087';
	arrArg['resid']           = '0';
	arrArg['rows']            = '8';
	arrArg['cols']            = '1';
	arrArg['border']          = '1';
	arrArg['advborder']       = '0';
	arrArg['advmargin']       = '0';
	arrArg['caption']         = 'N';
	arrArg['captionfontcolor']= '#000000';
	arrArg['captionbgcolor']  = '#CCCCCC';
	arrArg['titlefontcolor']  = '#0000FF';
	arrArg['titlebgcolor']    = '#FFFFFF';
	arrArg['titlealign']      = 'L';
	arrArg['detailfontcolor'] = '#000000';
	arrArg['detailbgcolor']   = '#FFFFFF';
	arrArg['detailalign']     = 'L';
	arrArg['advbordercolor']  = '#000000';
	arrArg['advmargincolor']  = '#000000';
	arrArg['displaymode']     = 'CD';
	arrArg['publishmode']     = 'JS';
	arrArg['picwidth']        = '1';
	arrArg['picheight']       = '4';

var arrDefault = new Array();
	arrDefault['id']	= '1';
	arrDefault['title'] 	= '我也要在这里发布';
	arrDefault['detail']	= '新浪智投-中小企业网络广告金算盘，助力中小企业网络营销';
	arrDefault['url']	= 'http://p4p.sina.com.cn';
	arrDefault['durl']	= 'p4p.sina.com.cn';
	arrDefault['picpath']	= 'http://d1.sina.com.cn/pfpghc/sina/1217235599_75506058_zhitou.jpg';
	
var arrAlign = new Array();
	arrAlign['L'] = 'left';
	arrAlign['R'] = 'right';
	arrAlign['C'] = 'center';

//---------------
// assign external data
try{
	var strArea = local_index;
}catch(e){
	var strArea = 1;
}
try{
        var arrWebEx = pfp_adv;
}catch(e){
        var arrWebEx = new Array();
}
//-------------

var arrWeb = new Array();
var targetID = 'divRes'+arrArg['id'];

//----------------

	//area
	var areaIndex = strArea;
	var webIndex = 0;
	for(var i=0;i<arrWebEx.length;i++) {
                if(arrWebEx[i]['area'].substr(areaIndex,1) == 1)
			arrWeb[webIndex++] = arrWebEx[i];
        }



//-----------------
	
	var webNum = arrArg['rows']*arrArg['cols'];
	diff = webNum - arrWeb.length;
	for(var i=0;i<diff;i++)
		arrWeb[arrWeb.length] = arrDefault;

//------------------

	var html = "<table width=\"300\" height=\"22\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"border:1px solid #F0C8C8; line-height:150%; font-size:12px;\">";
        html += "<tr style=\"background:url(http://i3.sinaimg.cn/dy/news/2008/0708/con_mj_001.gif) repeat-x 0 -100px;\"><td align=\"left\" width=\"240\" height=\"24\" style=\"font-size:14px;\"><span style=\"color:#FFFFFF;\">&nbsp;&nbsp;<strong><font color=\"#000000\">新浪智投</font></strong></span></td>";
        html += "<td align=\"right\" height=\"22\"><span style=\"color:#FFFFFF;\"><a href=\"http://hangye.sina.net\" class=\"w\" target=\"_blank\" style=\"text-decoration: none\"><font color=\"#000000\">行业专区</font></a>&nbsp;</span></td></tr>";


	html += '<table id="tableRes'+ arrArg['id'] +'">';

// head	
	if(arrArg['caption'] == 'Y')
		html += '<tr><td class="caption">新浪竞价</td></tr>';

// adv
	html += '<tr><td><table id="tableContRes'+ arrArg['id'] +'" cellpadding="0" cellspacing="'+ arrArg['advmargin'] +'">';
	for(var i=0;i<webNum;i++) {
		// line start
		if(i % arrArg['cols'] == 0)
			html += '<tr>';
		
		// one cell 
		html += '<td onclick="javascript:openWeb(\''+arrWeb[i]['url']+'\',';
		if(arrWeb[i]['url'].indexOf("pfpclick.sina.com.cn") == -1)
			html += '\'get\'';
		else
			html += '\'post\'';
		html += ');">';
			var cell = '';
			if(arrArg['mode'] == 'PIC') {
				// pic
				cell = '<p class="pic" align="center"><img src="'+arrWeb[i]['picpath']+'" width="'+arrArg['picwidth']+'" height="'+arrArg['picheight']+'" /></p>'
			}else{
				// durl
				if(arrArg['displaymode'].indexOf('U') != -1)
					cell = '<p class="url">'+arrWeb[i]['durl']+'</p>'+cell;
				// detail
				if(arrArg['displaymode'].indexOf('D') != -1)
					cell = '<p class="detail">'+arrWeb[i]['detail']+'</p>'+cell;
				// title
				if(arrArg['displaymode'].indexOf('C') != -1)
					cell = '<p class="title">'+arrWeb[i]['title']+'</p>'+cell;	
			}//alert(cell);
			html += cell;
		html += '</td>';
		
		// line end
		if((i+1) % arrArg['cols'] == 0)// || (i+1) >= arrAdv.length )
			html += '</tr>';
	}
	html += '</table></td></tr>';
	
// foot
	html += '</table>';
	html += '<style>';
	
	html += '#tableRes'+ arrArg['id'] +' { margin:0px; padding:0px; font-size:12px; width: '+arrArg['width']+'px; height: '+arrArg['height']+'px; border: '+arrArg['border']+'px  #F0C8C8 solid; border-top:0px;}';
	html += '#tableRes'+ arrArg['id'] +' td { margin:0px; padding:0px; border: 0px}';
	html += '#tableRes'+ arrArg['id'] +' .caption { margin: 5px; padding:0px; height: 18px; color: '+arrArg['captionfontcolor']+';background-color:'+arrArg['captionbgcolor']+'}';
	html += '#tableRes'+ arrArg['id'] +' table{ margin:0px; padding:0px; font-size:12px; table-layout:fixed; width: '+(arrArg['width']-2)+'px; height:'+(arrArg['caption']=='Y'? arrArg['height']-18:arrArg['height'])+'px; background-color:'+arrArg['advmargincolor']+';}';
	html += '#tableRes'+ arrArg['id'] +' table td {vertical-align:top; cursor:pointer; margin:0px; padding:0px; background-color:'+arrArg['titlebgcolor']+';border: '+arrArg['advborder']+'px '+arrArg['advbordercolor']+' solid; overflow: hidden;}';
	html += '#tableRes'+ arrArg['id'] +' .title { margin: 5px 15px 2px 15px; overflow:hidden; height: 14px; color: '+arrArg['titlefontcolor']+'; text-align:'+arrAlign[arrArg['titlealign']]+'; overflow:hidden; text-overflow:ellipsis;}';
	html += '#tableRes'+ arrArg['id'] +' .detail { margin: 2px 15px 2px 15px; overflow:hidden; color: '+arrArg['detailfontcolor']+';text-align:'+arrAlign[arrArg['detailalign']]+';height: 14px; overflow:hidden; text-overflow:ellipsis;}';
	html += '#tableRes'+ arrArg['id'] +' .url { margin: 2px 15px 2px 15px; overflow:hidden; height: 14px; color: #008000; overflow:hidden; text-overflow:ellipsis;}';
	html += '#tableRes'+ arrArg['id'] +' .pic { margin: 5px; overflow:hidden; color: '+arrArg['titlefontcolor']+'; text-align:center }';

	html += '</style>';

	
// put html code
	document.getElementById(targetID).innerHTML = html;

//---------------------
	
	function openWeb(url,method){
		var frm = document.getElementById("frmOpenWeb");
		frm.action = url;
		if(method == "get")
			frm.method = "get";
		else
			frm.method = "post";
		frm.submit();
	}

// ---------------------
/*
function pfpLoad() {

var loca = window.location;

//var srcurl = "http://sinaad.pmc-adtech.com/kmad/?location="+local_index+"&adcount="+webNum+"&rft=js&mediatype=channel&url="+encodeURIComponent(loca);
var srcurl = "http://sinaa1.cookie4you.com/kmad/?location="+local_index+"&adcount=5&cpcadcount=2&rft=js&mediatype=channel&default=true&first=cpc&url="+encodeURIComponent(loca);

// content padding
var script = document.createElement("script");
script.type = "text/javascript";
script.src = srcurl;
document.body.appendChild(script);

script.onload = script.onreadystatechange = function () {
	if(this.readyState == null || this.readyState == "loaded" || this.readyState == "complete") {
		try {
			html = '';
			if(typeof KM_AD_SOURCE == "object") {
				for(var i = 0; i < KM_AD_SOURCE.length; i++) {
					if(KM_AD_SOURCE[i].title != null && KM_AD_SOURCE[i].title != "" && KM_AD_SOURCE[i].description != null && KM_AD_SOURCE[i].description != "") {
						var ADITEM = KM_AD_SOURCE[i];
					}else{
						var ADITEM = arrDefault;
						ADITEM.description = arrDefault.detail;
						ADITEM.tag = '';
						ADITEM.info = '';
					}
					cell = '';
					html += '<tr><td onclick="javascript:openWeb(\''+ADITEM.url;
					if(ADITEM.url.indexOf("pfpclick.sina.com.cn") != -1)	
						html += '&tag=' + ADITEM.catid + '&info=' + encodeURIComponent(ADITEM.info);
					html += '\',';
					if(ADITEM.url.indexOf("pfpclick.sina.com.cn") == -1)
						html += '\'get\'';
					else
						html += '\'post\'';
					
					html += ');">';
					// url
					if(arrArg['displaymode'].indexOf('U') != -1)
						cell = '<p class="url">'+ADITEM.url+'</p>'+cell;
					// detail
					if(arrArg['displaymode'].indexOf('D') != -1)
						cell = '<p class="detail">'+ADITEM.description+'</p>'+cell;
					// title
					if(arrArg['displaymode'].indexOf('C') != -1)
						cell = '<p class="title">'+ADITEM.title+'</p>'+cell;
					
					html += cell;
					html += '</td></tr>';
				}
				
				document.getElementById("tableContRes"+arrArg['id']).parentNode.innerHTML = '<table id="tableContRes'+ arrArg['id'] +'" cellpadding="0" cellspacing="'+ arrArg['advmargin'] +'">' + html + '</table>';
			} 
		}catch(e) {
		
		}
		//document.getElementById(advpos).style.display = "block";
	}
}

}

if(navigator.appName == 'Microsoft Internet Explorer') {
	IEContentLoaded(window, pfpLoad);
}else{
	pfpLoad();
}
*/
/**
	Author: Diego Perini (diego.perini at gmail.com) NWBOX S.r.l.
	License: GPL/CC
*/
function IEContentLoaded (w, fn) {
	var d = w.document, done = false,
	// only fire once
	init = function () {
		if (!done) {
			done = true;
			fn();
		}
	};
	// polling for no errors
	(function () {
		try {
			// throws errors until after ondocumentready
			d.documentElement.doScroll('left');
		} catch (e) {
			setTimeout(arguments.callee, 50);
			return;
		}
		// no errors, fire
		init();
	})();
	// trying to always fire before onload
	d.onreadystatechange = function() {
		if (d.readyState == 'complete') {
			d.onreadystatechange = null;
			init();
		}
	};
}
