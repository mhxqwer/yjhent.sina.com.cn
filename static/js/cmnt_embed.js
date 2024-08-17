// 评论V4 XML数据EMBEDDED应用接口

// 声明所需变量
var Count = new Object();
Count.c_total 	= 0;
Count.c_show 	= 0;
Count.c_strip 	= 0;
Count.c_nice 	= 0;
Count.c_count	= 0;
Count.c_pages 	= 0;
var Rating 		= new Object();
var CmsgList 	= new Array();
var TopList 	= new Array();
var NiceList 	= new Array();
var PageSize 	= MSGS_PERPAGE;
var ActualPage	= 1;
var PostJump	= "";
var PostForm	= null;
var MB_UNCHK ="mbunchk";

// 缺页自动重建
function cmnt_rebuild() {
				
	News = new Object();
	News.n_title = pagedata.result.news.title;
	News.n_url		= pagedata.result.news.url;
	News.n_status = pagedata.result.news.status
	Rating = new Object();
	// count
	this.Count = new Object();
	Count.c_total = pagedata.result.count.total - 0;
	Count.c_show = pagedata.result.count.show - 0;
	Count.c_strip	= pagedata.result.count.show -0;
	//alert(Count.c_total);
	//Count.c_nice 	= "0"-0;
	//Count.c_pages 	= "25"-0;
	Count.c_count	= this.Count.c_total;
	// quick vote
	QuickVote = new Object();
	////////////////////////////////////////////////////////////////////////////////
	// top list
	TopList = new Array();
	////////////////////////////////////////////////////////////////////////////////
	// cmsg list
	this.CmsgList = new Array();
	var len_cmntlist = pagedata.result.cmntlist.length;

	for(var i = 0;i<len_cmntlist ; i++)
	{
		
		var Cmsg = {};
		/**/
		Cmsg["m_channel"] 	= pagedata.result.cmntlist[i].channel;
		Cmsg["m_newsid"] 	= pagedata.result.cmntlist[i].newsid;
		
		Cmsg["m_id"]=pagedata.result.cmntlist[i].mid;
	
		//Cmsg["m_id"] = pagedata.result.cmntlist[i].mid;
		Cmsg["m_rid"] = pagedata.result.cmntlist[i].parent;
		Cmsg["m_rank"] = pagedata.result.cmntlist[i].rank;
		Cmsg["m_status"] = pagedata.result.cmntlist[i].status;
		Cmsg["m_user"] 		= pagedata.result.cmntlist[i].nick;
		Cmsg["m_uid"] 		= pagedata.result.cmntlist[i].uid;
		Cmsg["m_ip"] 		= pagedata.result.cmntlist[i].ip;
		Cmsg["m_agree"] 		= pagedata.result.cmntlist[i].agree;
		Cmsg["m_area"] 		= pagedata.result.cmntlist[i].area;
		Cmsg["m_datetime"]	= pagedata.result.cmntlist[i].time;
		Cmsg["m_content"]	= pagedata.result.cmntlist[i].content;
		Cmsg["m_vote"] 		= pagedata.result.cmntlist[i].vote;
		Cmsg["m_config"]	= pagedata.result.cmntlist[i].config;
		Cmsg["m_usertype"]	= pagedata.result.cmntlist[i].usertype;
		Cmsg.Rating			= {};
		
		CmsgList.push(Cmsg);
	}
	if ( typeof(cmnt_preview) != "undefined" ) {
		CmsgList = cmnt_preview( cmnt_channel, cmnt_newsid, CmsgList ); // js post preview
	}

	if ( typeof(cmnt_callback) != "undefined" ) {
	   cmnt_callback(); // loaded callback
	}
}
// 读取数据
function cmnt_reload( channel, newsid, group ) {
	if ( channel=="" || newsid=="" ) return;
	// adjust page number
	if ( typeof(cmnt_pagesize)!="undefined" && 
		 (cmnt_pagesize==5 || cmnt_pagesize==10 || cmnt_pagesize==20) ) {
		PageSize = cmnt_pagesize;
	}
	if ( typeof(cmnt_page) != "undefined" ) {
		ActualPage = Math.ceil( cmnt_page/(MSGS_PERPAGE/PageSize) );
	}
	// select host
	var host = "";
	if ( typeof(cmnt_host)!="undefined" && cmnt_host!="" ) {
		host = cmnt_host;
	}
	//var cmnt_embed_url = cmsglist_embed( channel, newsid, group, ActualPage, host );
	var cmnt_embed_url = "http://comment5.news.sina.com.cn/page/info?format=js&jsvar=pagedata&channel=" + cmnt_channel + "&newsid=" + cmnt_newsid+"&group="+cmnt_group
	alert(cmnt_embed_url)
	if ( typeof(cmnt_print) == "function" )
		load_js( cmnt_embed_url, cmnt_rebuild );
	else
		load_js_old( cmnt_embed_url, cmnt_rebuild );
}

// data loaded callback
function cmnt_callback() {
	// 定义了cmsg_page参数或者cmnt_print()函数时才使用回调模式
	if ( typeof(cmnt_page)=="undefined" && typeof(cmnt_print)=="undefined" ) {
		return;
	}
	// adjust pages
	Count.c_pages = Math.floor( (Count.c_strip+PageSize-1)/PageSize );
	// adjust cmsg array by page number
	if ( typeof(cmnt_page) != "undefined" ) {
		var need_skip = 0;
		var offset = (PageSize*(cmnt_page-1)) % MSGS_PERPAGE;
		var residue = Count.c_strip % MSGS_PERPAGE;
		if ( ActualPage>1 && residue>0 ) need_skip = MSGS_PERPAGE - residue;
		if ( cmnt_page > 1 ) need_skip += offset;
		if ( need_skip>0 && CmsgList.length>need_skip ) {
			CmsgList.reverse();
			CmsgList.length -= need_skip;
			CmsgList.reverse();
		}
		if ( cmnt_page>1 && CmsgList.length>PageSize )
			CmsgList.length = PageSize;
	}
	// invoke callback renderer
	if ( typeof(cmnt_print) != "undefined" ) {
		cmnt_print(); // must defined by outside html page
	}
}
// 显示投票选项列表函数，供显示留言提交FORM用
function show_vote( vote_list ) {
	if ( vote_list==undefined || vote_list==null ) return;
	for ( vote in vote_list )
		document.writeln( "<input type=radio name=vote value="+vote_list[vote]+">"+vote+"&nbsp;" );
}
// 显示页码列表范例
function cmnt_pages() {
	// show pages
	var formated_pages = "当前页码" + cmnt_page;
	if ( Count.c_pages <= 1 ) return; // less than one page
	if ( cmnt_page > 1 ) 
		formated_pages += ( "&nbsp;<a href=# onclick='javascript:cmnt_show(" + parseInt(cmnt_page-1) + ");return false;'>上一页</a>" );
	if ( cmnt_page < Count.c_pages ) 
		formated_pages += ( "&nbsp;<a href=# onclick='javascript:cmnt_show(" + parseInt(cmnt_page+1) + ");return false;'>下一页</a>" );
	return formated_pages;
}
// 翻页函数
function cmnt_show( page ) {
	if ( page < 1 ) page = 1;
	if ( page > Count.c_pages ) page = Count.c_pages;
	// reload js interface
	cmnt_page = page;
	cmnt_reload( cmnt_channel, cmnt_newsid, cmnt_group );
}

// 读取统一注册cookie用户名
function cmnt_ssouser() {
	if ( typeof(sinaSSOManager) == "object" ) {
		var cookiearr = sinaSSOManager.getSinaCookie();
		if ( cookiearr && parse_str(cookiearr.user) != "" ) {
			return cookiearr.user;
		}
	}
	return "";
}

// 读取统一注册cookie 用户uid
function cmnt_ssouid() {
	if ( typeof(sinaSSOManager) == "object" ) {
		var cookiearr = sinaSSOManager.getSinaCookie();
		if ( cookiearr && parse_str(cookiearr.uid) != "" ) {
			return cookiearr.uid;
		}
	}
	return "";
}

// 读取统一注册cookie用户昵称
function cmnt_ssonickname() {
	if ( typeof(sinaSSOManager) == "object" ) {
		var cookiearr = sinaSSOManager.getSinaCookie();
		if ( cookiearr && parse_str(cookiearr.nick) != "" )
			return cookiearr.nick;
	}
	return "";
}

// 检查统一注册cookie
function cmnt_checksso() {
	var nickname = cmnt_ssonickname();
	if ( nickname!="" && typeof(cmnt_showsso)=="function" ) {
		cmnt_showsso( nickname );
		return true;
	}
	else if ( nickname=="" && typeof(cmnt_hidesso)=="function" ) {
		cmnt_hidesso();
	}
	return false;
}

// 退出sso
function cmnt_logoutsso() {
	if ( typeof(sinaSSOManager) == "object" && typeof(sinaSSOManager.logout) == "function" ) {
		sinaSSOManager.logout( cmnt_checksso );
	}
}

// 发帖后跳转
function cmnt_postjump() {
	if ( PostJump == "_blank" ) {
		_o( view_url(cmnt_channel,cmnt_newsid,cmnt_group) );
	} else if ( PostJump == "_self" ) {
		_j( view_url(cmnt_channel,cmnt_newsid,cmnt_group) );
	} else {
		cmnt_postsucc( PostForm );
	}
}

//在发表框中显示发表成功提示
var showCommStatus = {
    clear : true, //是否清空(可选true|false)
    showTimeLimit : 2, //显示时间(秒)
    _divObj : null,
    _timeObj : null,
    absPosition :  function(obj,parentObj,noScroll){
    	var left = obj.offsetLeft;
    	var top = obj.offsetTop - (noScroll?obj.offsetParent.scrollTop:0);
    	var tempObj = obj;
    	var sss = "";
    	try{
    		while(tempObj!=document.body && tempObj!=document.documentElement && tempObj != parentObj && tempObj!= null){
    			sss += tempObj.tagName + " , ";
    			tempObj = tempObj.offsetParent;
    			left += tempObj.offsetLeft;
    			top += tempObj.offsetTop - (noScroll?tempObj.offsetParent.scrollTop:0);
    		};
    	}catch(e){};
    	return {left:left,top:top};
    },
    show : function(element,text,fontsize){ //element：表单对象 ，text：提示文字（可选）
    	if(!text) {
		text = "感谢您发表评论，您发表的评论将在管理员审核后发布";
	}
	if (!fontsize) {
		fontsize="16px/19px";
	}
    	var thisTemp = this;
    	try{
    		
    		var pos = this.absPosition(element,document.body);
    		if(this._divObj == null){
    			this._divObj = document.createElement("div");
    			this._divObj.style.position = "absolute";
    			this._divObj.style.font = fontsize+' 微软雅黑,黑体';
    			this._divObj.style.color = '#999';
    			document.body.appendChild(this._divObj);
    		};
    		this._divObj.innerHTML = text;
    		this._divObj.style.display = 'block';
    		this._divObj.style.top = Math.ceil(pos.top + (element.offsetHeight - this._divObj.offsetHeight)*0.45) + 'px';
    		this._divObj.style.left = Math.ceil(pos.left + (element.offsetWidth - this._divObj.offsetWidth)*0.5) + 'px';
    		
    		if(this.clear){
    			element.value = '';
    		};
    		
    		clearTimeout(this._timeObj);
    		if(this.showTimeLimit){
    			this._timeObj = setTimeout(function(){thisTemp.hide()},this.showTimeLimit * 1000);
    		};
    	}catch(e){};
    },
    hide : function(){
    	try{
    		this._divObj.style.display = "none";
    	}catch(e){}
    }
};

//发表评论后的提示函数
function cmnt_postsucc( post_form ) {
	if ( post_form != null ) {
		showCommStatus.show( post_form.content );
	}
}

// 新闻页发表评论函数
function cmnt_submit( form ) {
	// 检查参数
	var Cmsg = new Object();
	Cmsg.m_channel 	= parse_str( form.channel.value );
	Cmsg.m_newsid 	= parse_str( form.newsid.value );
	Cmsg.m_content 	= parse_str( form.content.value );
	Cmsg.m_user 	= parse_str( form.user.value );
	Cmsg.m_pass 	= parse_str( form.pass.value );
	if ( typeof(form.rid) == "object" ) {
		Cmsg.m_rid = parse_int( form.rid.value );
	}
	if ( typeof(form.vote) == "object" ) {
		Cmsg.m_vote = parse_int( form.vote.value );
	}
	if ( typeof(form.config) == "object" ) {
		Cmsg.m_config = parse_str( form.config.value );
	}
	if ( typeof(form.charset) == "object" ) {
		Cmsg.charset = parse_str( form.charset.value );
	}
	if ( typeof(form.to_mb) == "object" && form.to_mb.checked) {
		Cmsg.to_mb = parse_str( form.to_mb.value );
	}
	Cmsg.format	= "js";
	PostForm		= form;
	PostJump	= form.jump.value;
	
	if ( Cmsg.m_channel=="" || Cmsg.m_newsid=="" ) {
		alert( "评论参数错误" );
		return;
	}
	if ( Cmsg.m_content == "" ) {
		alert( "请填写您的评论内容" );
		return;
	}

	if ( cmnt_ssouser()=="" ) {
		if ( (typeof(PostForm.anonymous) == "object"  
			&& (PostForm.anonymous.value||PostForm.anonymous.checked)) 
			|| !isneedlogin(Cmsg.m_channel ) ) {
			if (cmnt_post( Cmsg ))
				PostForm.content.value = "";
		}
		else {
			if ( Cmsg.m_user=="" || Cmsg.m_user=="会员名/手机/UC号"|| Cmsg.m_pass=="" ) {
				alert( "需要在登录后发表评论，请填写您的用户名和密码" );
				return;
			}
			if ( typeof(sinaSSOManager) == "object" && typeof(sinaSSOManager.login) == "function" ) {
				var savestate=30;
				if ( typeof(PostForm.savestate) == "object"  && PostForm.savestate.checked ) {
					savestate = "30";
				}
				sinaSSOManager.login(
					function (result) {
						if (result["retcode"]==0 || result["retcode"]=="0" ) {
							Cmsg.m_user = cmnt_ssonickname();
							if (cmnt_post( Cmsg ))
								PostForm.content.value = "";
						}
						else {
							PostForm.user.focus();
							PostForm.user.select();
							alert("您输入的用户名不存在或密码错误，请重新输入");
						}
					},
					Cmsg.m_user, Cmsg.m_pass, savestate );
			}
		}
	}
	else
	{
		if ( typeof(sinaSSOManager) == "object" && typeof(sinaSSOManager.autoLogin) == "function" ) {
			//提交评论前检查并更新ilogin cookie
			sinaSSOManager.autoLogin(function(cookiearr) {
				if ( cmnt_checksso()==true )  {
					Cmsg.m_user = cmnt_ssonickname();
					if (cmnt_post( Cmsg ))
						PostForm.content.value = "";
				}
			});
		}			
	}
	
}

// 围脖提示
function cmnt_mbprompt() {
	cmnt_MB.showprompt();
}
var cmnt_MB = {
	_divObj : null,
	absPosition: showCommStatus.absPosition,
	showprompt : function(){
		try{
			if ( this._divObj == null ) {
				var css_cont = ".mb_prompt_cmnt {width:498px; border:1px #e9e9e9 solid; background:#fff; position:absolute;font-size:12px;lineHeight:1.67;}\
					.mb_prompt_cmnt h2{margin:0px;padding:0px;}\
					.mb_prompt_cmnt h2.title{height:29px; border-bottom:1px #e9e9e9 solid; background:#eee; font-family:\"microsoft yahei\",\"微软雅黑\",\"simsun\",\"宋体\"; font-weight:normal; font-size:14px; line-height:29px;}\
					.mb_prompt_cmnt h2.title .txt{float:left; padding:0 0 0 10px;}\
					.mb_prompt_cmnt h2.title .close{float:right; font-family: Verdana, Geneva, sans-serif; padding:0 10px 0 0;}\
					.mb_prompt_cmnt h2.title .close a{text-decoration:none;}\
					.mb_prompt_cmnt h2.title .close a:hover{text-decoration:underline;}\
					.mb_prompt_cmnt .popupCon{padding:1em;}\
					.mb_prompt_cmnt .popupBtn{padding:0 1em 1em; text-align:center;}\
					.mb_prompt_cmnt h2.title{border-color:#c4d8f2; background:url(http://www.sinaimg.cn/dy/pl/deco/style_01/bg_01.png) no-repeat 0 -550px; cursor:move}\
					.mb_prompt_cmnt .popupBtn input{width:90px; height:25px; background:url(http://www.sinaimg.cn/dy/pl/deco/style_01/bg_01.png) no-repeat 0 -450px; border:none; color:#fff; line-height:25px; cursor:pointer;}\
					.mb_prompt_cmnt a:link{color:#226395;}\
					.mb_prompt_cmnt a:visited{color:#226395;}";
				var styleTag = document.createElement('style');
				styleTag.type = "text/css";
				document.getElementsByTagName('head')[0].appendChild(styleTag);
				if ( styleTag.styleSheet ) {
					styleTag.styleSheet.cssText = css_cont;
				}
				else {
					styleTag.textContent = css_cont;
				};
				this._divObj = document.createElement("div");
				this._divObj.className = 'mb_prompt_cmnt';
				document.body.appendChild(this._divObj);
			};
			var cont = "<h2 class='title clearfix'><span class='txt'>评论成功，是否开通微博？</span>";
			cont += "<span class='close'><a href='#' onclick=\"javascript:this.parentNode.parentNode.parentNode.style.display='none';return false;\">x</a></span>";
			cont += "</h2><div class='popupCon clearfix'>";
			cont += "<p style='text-align:center;'>您还没有开通新浪微博，点“确认”进入开通微博页面，暂不开通请点“取消”。<br />";
			cont += "评论同时发往微博，可以向更多人分享您的评论，还能汇集您的所有精彩点评。</p>";
			cont += "</div><div class='popupBtn clearfix' id='mb_confirm'>";
			cont += "<a href='http://t.sina.com.cn' target='blank' onclick=\"javascript:this.parentNode.parentNode.style.display='none';\" />确 认</a>&nbsp;&nbsp;&nbsp;&nbsp;";
			cont += "<a href='#'  onclick=\"javascript:this.parentNode.parentNode.style.display='none';cmnt_MB.mb_check_state();return false;\" />取 消</a>";
			cont += "</div>";
			this._divObj.innerHTML = cont;
			this._divObj.style.display = 'block';
			var scrolltop =  document.documentElement.scrollTop;
			if ( scrolltop==0 ) {
				scrolltop =  document.body.scrollTop;
			}
			var div_top = typeof(PostForm)=="object"?this.absPosition(PostForm).top:(scrolltop+250);
			this._divObj.style.top = div_top +"px";
			this._divObj.style.left = ((screen.width-950)/2+71) +"px";
		}catch(e){};
	},
	mb_check_state: function() {
		var now_time = new Date();
		if (get_cookie( MB_UNCHK)==cmnt_ssouid() ) {
			now_time.setTime(now_time.getTime() - 10*60*1000); 
			set_cookie( MB_UNCHK, "",now_time.toGMTString(),"/","sina.com.cn" );
		}
		else {
			now_time.setTime(now_time.getTime() + 3*24*3600*1000);
			set_cookie( MB_UNCHK, cmnt_ssouid(), now_time.toGMTString(),"/","sina.com.cn");
		}
		var tomb_objs = tag_objs("input", "to_mb");
		for ( var i=0; i<tomb_objs.length; i++ ) {
			if ( get_cookie( "mbunchk")==cmnt_ssouid() )
				tomb_objs[i].checked = false;
			else
				tomb_objs[i].checked = true;
		}
	},
	init: function() {
		this._divObj = null;
		var tomb_objs = tag_objs("input", "to_mb");
		for ( var i=0; i<tomb_objs.length; i++ ) {
			tomb_objs[i].onclick = this.mb_check_state;
			if ( get_cookie( "mbunchk")==cmnt_ssouid() )
				tomb_objs[i].checked = false;
			else
				tomb_objs[i].checked = true;
		}
	}
};

// 默认初始第cmnt_page页数据
if ( typeof(_CMNT_EMBED_DISABLE_)=="undefined" || _CMNT_EMBED_DISABLE_==false ) { // DEBUG
	cmnt_reload( cmnt_channel, cmnt_newsid, cmnt_group );
	if ( typeof(sinaSSOManager) == "object" &&  typeof(sinaSSOManager.config) == "object" ) {
		sinaSSOManager.config.service = "comment";
	}
	if ( typeof(sinaSSOManager) == "object" &&  typeof(sinaSSOManager.regStatusChangeCallBack) == "function" ) {
		//sinaSSOManager.regStatusChangeCallBack(cmnt_checksso);
	}
	
	cmnt_MB.init();
	window.setInterval( cmnt_checksso, 5000 );
}


