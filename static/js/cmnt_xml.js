// 评论V4 XML数据JS接口

////////////////////////////////////////////////////////////////////////////////
// path defines
var V4_HOST			= "http://comment4.news.sina.com.cn";
var CMNT_HOST		= "http://comment4.news.sina.com.cn";
var XML_CGI 		= "/cgi-bin/comment/page_xml.cgi?type=";
var VIEW_CGI		= "/comment/comment4.html";
var DEPOSIT_CGI		= "/comment/skin/deposit.html";
var POST_CGI		= "/cgi-bin/comment/post.cgi";
var PROXY_CGI		= "/cgi-bin/comment/xmlhttp_proxy.cgi?url=";
var XML_PROXY		= "";
var SKIN_PATH 		= "/comment/skin";
var XML_PATH 		= "/comment/xml";
var ERRPR_PAGE		= "/comment/error.html";
var PVLOG_PAGE		= "/comment/log.html";
var AD_CONFIG		= "/comment/adconfig.xml";
var REPLY_CONFIG	= "/comment/reply.xml";
// const values
var STRIP_RATE		= 0.8; // 20% qreply
var HASH_GENE_1		= 128;
var HASH_GENE_2		= 255;
var MSGS_PERPAGE	= 20;
var MSGS_HOTCMSG	= 20;
var DEFAULT_RETLEN	= 80;
var RETRY_DELAY		= 1000; // 1s
var DEFAULT_SKIN 	= "default";
var FLOOD_POST		= "cf_post";
var FLOOD_QREPLY	= "cf_qreply";
var POST_PREVIEW	= "ppv";
var JS_PREVIEW		= "jsppv";
var HISTORY_LIMIT	= 40;
var NOTIFIED_LIMIT	= 10;
var HISTORY_LIST	= "v4_history";
var FOCUS_LIST		= "v4_focus";
var TOP_FLAG		= "TOP_FLAG";
var HOT_FLAG		= "HOT_FLAG";
var REPLY_FLAG		= "REPLY_FLAG";
var ENABLE_CACHE	= "enable_cache";
// system defines
var	M_TEMP=2, M_HIDE=4, M_CHECK=8, M_WAIT=16, M_PASS=32, M_NICE=64;
var N_HIDE=1, N_NOTHOT=2, N_VALID=3, N_ATTENTION=4, N_IMPORTANT=5;
var LIST_STRIP=0, LIST_ALL=1, LIST_NICE=2, LIST_HOT=3, LIST_REPLY=4, LIST_VOTE=5;
var NEWS_MODE=0, GROUP_MODE=1;
var SORT_DESC="desc", SORT_ASCE="asce", SORT_DEFAULT="";
// page type defines
var TYPE_CHANNEL	= "P_TYPE_CHANNEL";
var TYPE_HOTNEWS	= "P_TYPE_HOTNEWS";
var TYPE_NEWS		= "P_TYPE_NEWS";
var TYPE_GLIST		= "P_TYPE_GLIST";
var TYPE_COUNT		= "P_TYPE_COUNT";
var TYPE_RATING		= "P_TYPE_RATING";
var TYPE_TOPCMSG	= "P_TYPE_TOPCMSG";
var TYPE_CMSGLIST	= "P_TYPE_CMSGLIST";
var TYPE_CMSG		= "P_TYPE_CMSG";
var TYPE_CMSG_JS	= "P_TYPE_CMSG_JS";
var TYPE_HOTPOST	= "P_TYPE_HOTPOST";
var TYPE_CMSG_PPV	= "P_TYPE_CMSGLIST_PPV";
var TYPE_USERPOST	= "P_TYPE_USERPOST";
// xmlhttp method
var XMLHTTP_EXIST	= "XMLHTTP_EXIST";
var XMLHTTP_TEXT	= "XMLHTTP_TEXT";
var XMLHTTP_XML		= "XMLHTTP_XML";
// for IE5
var undefined;

////////////////////////////////////////////////////////////////////////////////
// convert a single digit (0 - 16) into hex
function _hex( i ) {
	return ( "0123456789ABCDEF".substring(i,i+1) );
}
// Convert a 8bit number to hex
function to_hex( i ) {
	var c1 = _hex( (0x0000f0&i)>>4 );
	var c2 = _hex( (0x00000f&i)>>0 );
    if ( c1 != "0" ) {
		return (c1+c2);
	} else {
		return c2;
	}
}
// signed int to unsigned int
function to_unsigned( i ) {
	if ( i < 0 ) {
		return ( i + 4294967296 );
	} else if ( i >= 4294967296 ) {
		return ( i - 4294967296 );
	} else {
		return i;
	}
}
// parse to integer
function parse_int( i, default_value ) {
	i = parseInt( i );
	if ( !isNaN(i) ) {
		return i;
	}
	if ( default_value!=undefined && !isNaN(default_value) ) {
		return default_value;
	}
	return 0;
}
// return safe string
function parse_str( str ) {
	if ( str == undefined ) {
		return "";
	} else {
		return str;
	}
}
////////////////////////////////////////////////////////////////////////////////
// string length
function strlen( str ) {
	if ( str==null || str=="" ) {
		return 0;
	}
	var newstr = new String( str );
	return newstr.length;
}
// trim string
function trim( s ) {
	if ( s==null || s=="" ) {
		return "";
	}
	var Str = new String( s );
	var newstr = Str.replace( /^\s*/, "" );
	return ( newstr.replace(/\s*$/,"") );
}
// substring
function substr( str, len ) {
	if ( str==null || str=="" ) {
		return "";
	}
	var buf = new String( str );
	return ( str.substr(0,len) );
}
// uri encode
function uri_encode( str ) {
	if ( str==null || str=="" ) {
		return "";
	}
	var toescape = ";/?:@&=+ \"#%<>'`[],~!$^(){}|\\";
	var newstr="", chr="";
	for ( var i=0; i<str.length; i++ ) {
		chr = str.charAt(i);
		if ( toescape.indexOf(chr) == -1 ) {
			newstr += chr;
		} else {
			newstr += escape( chr );
		}
	}
	return newstr;
}
// push elements to array, replace Array.push() in IE5
function push_array( array, item ) {
	array[array.length] = item;
}
// remove beginning element from array, replace Array.shift() in IE5
function shift_array( array ) {
	if ( array.length < 2 ) {
		array.length = 0;
		return;
	}
	for ( var i=0; i<array.length-1; ++i ) {
		array[i] = array[i+1];
	}
	--array.length;
}
// force return long string
function force_return( str, ret_len ) {
	if ( ret_len <=0 ) {
		return str;
	}
	var pos = 0;
	var truncated = "";
	for ( var i=0; i<str.length; i++ ) {
		var c = str.charAt( i );
		truncated += c;
		pos++;
		if ( c==" " || c=="\n" ) {
			pos = 0;
		} else if ( pos >= ret_len ) {
			pos = 0;
			if ( c=="，" || c=="!" ) {
				truncated += "\n"; // for IE
			} else {
				truncated += " ";
			}
		}
	}
	return truncated;
}
// strip repeated <br>s
function strip_enter( str ) {
	var strip_str = "";
	while( strip_str != str ) {
		strip_str = str;
		str = strip_str.replace( /<br><br>/ig, "<br>" );
	}
	return str;
}
// escape xml string
function escape_xml( str, ret_len ) {
	if ( str==undefined || str=="" ) {
		return "";
	}
	if ( ret_len==undefined || ret_len==null ) {
		ret_len = DEFAULT_RETLEN;
	}
	// strip repeated <br>
	str = strip_enter( str );
	// force return
	str = str.replace( /<br>/ig, "\n" ); // hide <br>
	str = force_return( str, ret_len );
	// escape xml
	str = str.replace( /&/g, "&amp;" );
	str = str.replace( /</g, "&lt;" );
	str = str.replace( />/g, "&gt;" );
	str = str.replace( /'/g, "&#39;" );
	str = str.replace( /"/g, "&quot;" );
	str = str.replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" );
	str = str.replace( /\n/g, "<br>" ); // restore <br>
	return str;
}
// escape news title
function escape_title( title ) {
	if ( title==undefined || title=="" ) {
		return "";
	}
	var escaped_tiele = title.replace( /\'/g, "＇" );
	escaped_tiele = escaped_tiele.replace( /\"/g, "＂" );
	escaped_tiele = escaped_tiele.replace( /[<]([^>]*)[>]/g, "" ); // strip html
	return escaped_tiele;
}
// set cookie
function set_cookie( name, value, expires, path, domain ) {
	var cookie_temp;
	if ( expires!=undefined && expires!="" ) {
		cookie_temp = ( name+"="+value+";expires="+expires );
	} else {
		cookie_temp = ( name+"="+value );
	}
	if ( path!=undefined && path!="" ) {
		cookie_temp =  cookie_temp + ( ";path="+path );
	}
	if ( domain!=undefined && domain!="" ) {
		cookie_temp =  cookie_temp + ( ";domain="+domain );
	}
	document.cookie = cookie_temp;
}
// get cookie by name
function get_cookie( cookie ){
	var cookies = document.cookie;
	var clist = cookies.split(";");
	for ( var i=0; i<clist.length; ++i ) {
		var cpair = clist[i].split("=");	
		if ( trim(cpair[0]) == cookie ) {
			return unescape( trim(cpair[1]) );
		}
	}
	return "";
}
// check is IE
function is_ie() {
	if ( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) {
		return true;
	} else {
		return false;
	}
}
// check is Mozilla/FireFox
function is_mozilla() {
	if ( navigator.userAgent.toLowerCase().indexOf('gecko') >= 0 ) {
		return true;
	} else {
		return false;
	}
}
// check is Opera
function is_opera() {
	if ( navigator.userAgent.toLowerCase().indexOf('opera') >= 0 ) {
		return true;
	} else {
		return false;
	}
}
// check is Safari
function is_safari() {
	if ( navigator.userAgent.toLowerCase().indexOf('safari') >= 0 ) {
		return true;
	} else {
		return false;
	}
}
// doc.getElementById
function obj( id, doc ) {
	if ( id == "" ) {
		return null;
	}
	if ( doc==undefined || doc=="" ) {
		return document.getElementById( id );
	} else {
		return doc.getElementById( id );
	}
}
// get objects list by tage name
function tag_objs( tag, name ) {
	if ( tag=="" || name=="" ) {
		return null;
	}
	var elem = document.getElementsByTagName( tag );
	var list = new Array();
	for( i=0,iarr=0; i<elem.length; ++i ) {
		var att = elem[i].getAttribute( "name" );
		if( att == name ) {
			list[iarr] = elem[i];
			++iarr;
		}
	}
	return list;
}
// get object's attribute value
function obj_attr( obj, attr ) {
	if ( obj == null ) { return ""; }
	return obj.getAttribute( attr );
}
// get object's attributes number
function obj_attrs( obj ) {
	if ( obj == null ) { return 0; }
	var c = 0;
	for ( attr in obj ) {
		if ( obj[attr] != "" ) {
			++c;
		}
	}
	return c;
}
// show object
function show_obj( obj, style ) {
	if ( obj == null ) { return; }
	if ( style != undefined ) {
		obj.style.display = style;
	} else {
		obj.style.display = "";
	}
}
// hide object
function hide_obj( obj ) {
	if ( obj == null ) { return; }
	obj.style.display = "none";
}
// is object shown
function is_show( obj ) {
	if ( obj == null ) { return false; }
	if ( obj.style.display != "none" ) {
		return true;
	} else {
		return false;
	}
}
// append row to table
function append_row( table, row ) {
	if ( table==null || row=="" ) {
		return;
	}
	var row_pos = table.rows.length;
	if ( is_safari() ) {
		row_pos = -1;
	}
	table.insertRow( row_pos ).insertCell(0).innerHTML = row;
}
// append option to select
function append_select( selection, text, value ) {
	var new_opt = new Option( text, value, false, false );
	selection.options.add( new_opt );
}
// read radio selected value
function read_radio( radio ){
	for( var i=0; i<radio.length; i++ ) {
		if ( radio[i].checked ) {
			return radio[i].value;
		}
	}
	return "";
}
// set radio selected value
function set_radio( radio, value ){
	for( var i=0; i<radio.length; i++ ) {
		if ( radio[i].value == value ) {
			radio[i].checked = true;
		}
	}
}
// replace HTT variable "([$name])" in str
function replace_var( str, name, value ) {
	if ( str=="" || name=="" ) {
		return str;
	}
	if ( value==undefined || value==null ) {
		value = "";
	}
	var re = new RegExp( "\\(\\[\\$"+name+"\\]\\)", "g" );
	return ( str.replace(re,value) );
}
// string replace
function replace( str, from, to ) {
	var re = new RegExp( from, "g" );
	return ( str.replace(re,to) );
}

////////////////////////////////////////////////////////////////////////////////
// string hash
function str_hash( str ) {
	var ch;	var hash = 5381;
	var len = str.length;
	for ( var i=0; i<len; i++ ) {
		ch = str.charCodeAt(i) - 65; // 65:'A'
		if ( ch < 0 ) {
			ch += 256; // unsigned
		}
		if ( ch <= 25 ) {// 25:'Z'-'A'
			ch += 32; // 32:'a'-'A'
		}
		var tmp = hash<<5;	tmp = to_unsigned( tmp );
		hash += tmp;		hash = to_unsigned( hash );
		hash = (hash^ch);	hash = to_unsigned( hash );
	}
	return hash;
}
// xml file hash path
function hash_path( docid ) {
	var hash = str_hash( docid );
	return ( to_hex(hash%HASH_GENE_1) +"/"+ to_hex(hash%HASH_GENE_2) );
}
// HHHH-MM-DD HH:MM:SS
function datetime_now() {
	/*
	var now = new Date();
	var datetime_string = now.getFullYear() + "-" + parse_int(now.getMonth()+1) 
						 + "-" + now.getDate() + " " + now.getHours() + ":" 
						 + now.getMinutes() + ":" + now.getSeconds();
	return datetime_string;
	*/
	var now = new Date();
	var month = parse_int( now.getMonth() + 1 );	
	if ( month < 10 ) {
		month = "0" + month;
	}
	var date_val = now.getDate();
	if ( date_val < 10 ) {
		date_val = "0" + date_val;
	}
	var datetime_string = now.getFullYear() + "-" + month + "-" + date_val + " " + now.toLocaleTimeString();
	return datetime_string;	
}

////////////////////////////////////////////////////////////////////////////////
// append random param suffix
function random_tag( url ) {
	var now = new Date();
	var seconds = Math.floor( now.getTime()/1000 );
	if ( url.indexOf("?") == -1 ) {
		return url + "?random=" + seconds;
	} else {
		return url + "&random=" + seconds;
	}
}
// xmlhttp get request
function xmlhttp_request( url, type ) {
	if ( url==null || url=="" ) {
		return "";
	}
	// init
	var xmlhttp;
	if ( window.ActiveXObject && !window.XMLHttpRequest ) {
		xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" ); // IE
	} else {
		xmlhttp = new XMLHttpRequest(); // Mozilla, Opera
	}
	var method = "GET";
	if ( type == XMLHTTP_EXIST ) {
		method = "HEAD";
	}
	// send
	xmlhttp.open( method, random_tag(url), false );
	xmlhttp.send( null );
	if( xmlhttp.status==200 || xmlhttp.status==304 ) {
		if ( type == XMLHTTP_EXIST ) { // 304 for Opera
			return true;
		} else if ( type == XMLHTTP_XML ) {
			return xmlhttp.responseXML;
		} else if ( type == XMLHTTP_TEXT ) {
			return xmlhttp.responseText;
		}
	} else {
		if ( type == XMLHTTP_EXIST ) {
			return false;
		} else {
			return null;
		}
	}
}
// asynchronous xmlhttp request
function xmlhttp_async( url, onready_callback, onerror_url, enable_cache ) {
	if ( url==null || url=="" ) {
		return false;
	}
	// xmlhttp proxy
	if ( XML_PROXY!="" && substr(url,7)!="http://" ) {
		url = XML_PROXY + CMNT_HOST + uri_encode( url );
	}
	// init
	var xmlhttp;
	if ( window.ActiveXObject && !window.XMLHttpRequest ) {
		xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" ); // IE
	} else {
		xmlhttp = new XMLHttpRequest(); // Mozilla, Opera
	}
	if ( onready_callback!=undefined && onready_callback!="" ) {
		xmlhttp.onreadystatechange = function() {
			if ( xmlhttp.readyState == 4 ) {
				// invoke callback
				onready_callback( xmlhttp.responseXML );
				if ( xmlhttp.status==404 && onerror_url!=undefined && onerror_url!="" ) {
					xmlhttp_async( onerror_url ); // not found
				}
			}
		};
	}
	// send
	if ( enable_cache != undefined ) {
		xmlhttp.open( "GET", url, true ); // no random tag, cache first
	} else {
		xmlhttp.open( "GET", random_tag(url), true ); // append random tag, force reload
	}
	xmlhttp.send( null );
	return true;
}
// request through local xmlhttp proxy
function xmlhttp_proxy( url, onready_callback, onerror_url ) {
	return xmlhttp_async( PROXY_CGI+uri_encode(url), onready_callback, onerror_url );
}
// check url exist
function url_exist( url ) {
	return xmlhttp_request( url, XMLHTTP_EXIST );
}

// load JS , to compate the old code...non callback mode...
function load_js_old( url, callback ) {
	if ( url == "" ) {
		return;
	}
	// load
	var js_doc = document.createElement( "script" ); 
	js_doc.setAttribute( "type", "text/javascript" );
	js_doc.setAttribute( "charset", "GBK" );
	var head = document.getElementsByTagName("head")[0];
	if ( head == undefined ) {
		return;
	}
	head.insertBefore( js_doc, null );
	js_doc.src = url;
	// callback
	if ( callback == undefined ) {
		return;
	}	
	if ( is_ie() ) {
		js_doc.onreadystatechange = function() {
			//if ( js_doc.readyState=="loaded" || js_doc.readyState=="complete" ) {
			if ( js_doc.readyState == "loaded" ) {
				callback();
			}
		};
	} else {
		js_doc.onerror = function() {
			callback();
		};
		js_doc.onload = function() {
			callback();
		};
	}
}

// load JS 
function load_js( url, callback ) {
	if ( url == "" ) {
		return;
	}
	// load
	var js_doc = document.createElement( "script" );
	js_doc.setAttribute( "type", "text/javascript" );
	js_doc.setAttribute( "charset", "GBK" );
	var head = document.getElementsByTagName("head")[0] || document.documentElement;
	js_doc.src = url;
	if ( typeof(callback) == "function"  ) {
		if ( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) {
			var done = false;
			js_doc.onreadystatechange = function() {
				if ( !done && (js_doc.readyState=="loaded" || js_doc.readyState=="complete") ) {
					done = true;
					callback();
					js_doc.onreadystatechange = null;
				}
			};
		}
		else {
			js_doc.onerror = function() {
				callback();
			};
			js_doc.onload = function() {
				callback();
			};
		}
	}
	head.insertBefore( js_doc, null );
}

////////////////////////////////////////////////////////////////////////////////
// get xml node list
function xml_node_list( node, name ) {
	if ( node!=null && name!="" ) {
		return node.getElementsByTagName( name );
	} else {
		return null;
	}
}
// get xml node
function xml_node( node, name ) {
	if ( node!=null && name!="" ) {
		return ( xml_node_list(node,name)[0] );
	} else {
		return null;
	}
}
// get xml nodes count
function xml_node_count( node, name ) {
	if ( node!=null && name!="" ) {
		return ( xml_node_list(node,name).length );
	} else {
		return 0;
	}
}
// get xml node attr
function xml_node_attr( node, name ) {
	if ( node!=null && name!="" ) {
		return node.getAttribute( name );
	} else {
		return "";
	}
}
// get xml node data
function xml_node_data( node, name ) {
	if ( xml_node(node,name)!=null && (xml_node(node,name).firstChild)!=null ) {
		return ( xml_node(node,name).firstChild.data );
	} else {
		return "";
	}
}

////////////////////////////////////////////////////////////////////////////////
// channel xml url
function channel_xml( channel ) {
	return ( XML_PATH + "/" + uri_encode(channel) +
			 "/" + uri_encode(channel) + "_channel.xml" );
}
// channel cgi url, if channel xml non-existent
function channel_cgi( channel ) {
	return ( XML_CGI + TYPE_CHANNEL +
			 "&channel=" + uri_encode(channel) +
			 "&newsid=" + uri_encode(channel) );
}
// parse xml to Channel object
function parse_channel( xml ) {
	if ( xml == null ) { return null; }
	var node = xml_node( xml, "channel" );
	var Channel = new Object();
	Channel.ch_id 		= xml_node_attr( node, "id" );
	Channel.ch_name		= xml_node_data( node, "name" );
	Channel.ch_skin		= xml_node_data( node, "skin" );
	Channel.ch_url		= xml_node_data( node, "url" );
	Channel.ch_hotnews	= xml_node_data( node, "hotnews" );
	// extend config
	Channel.ch_vote		= xml_node_data( node, "vote" );
	Channel.ch_qreply	= xml_node_data( node, "qreply" );
	return Channel;
}
// locat channel xml, output by renderer()
function load_channel( channel, renderer ) {
	var callback = function( xml ) {
		renderer( parse_channel(xml) );
	};
	return xmlhttp_async( channel_xml(channel), callback, 
						  channel_cgi(channel), ENABLE_CACHE );
}

////////////////////////////////////////////////////////////////////////////////
// news xml url
function news_xml( channel, newsid ) {
	return ( XML_PATH + "/" + uri_encode(channel) + "/" + hash_path(newsid) +
			 "/" + uri_encode(newsid) + "_news.xml" );
}
// news cgi url, if news xml non-existent
function news_cgi( channel, newsid ) {
	return ( XML_CGI + TYPE_NEWS + "&channel=" + uri_encode(channel) +
			 "&newsid=" + uri_encode(newsid) );
}
// group list xml url
function glist_xml( channel, newsid ) {
	return ( XML_PATH + "/" + uri_encode(channel) + "/" + hash_path(newsid) +
			 "/" + uri_encode(newsid) + "_glist.xml" );
}
// group list cgi url, if glist xml non-existent
function glist_cgi( channel, newsid ) {
	return ( XML_CGI + TYPE_GLIST + "&channel=" + uri_encode(channel) +
			 "&newsid=" + uri_encode(newsid) );
}
// parse xml node to News object
function parse_news_item( node ) {
	var News = new Object();
	News.n_channel 	= xml_node_attr( node, "channel" );
	News.n_newsid 	= xml_node_attr( node, "newsid" );
	News.n_pub_pid	= xml_node_attr( node, "n_pub_pid" );
	News.n_pub_tid 	= xml_node_attr( node, "n_pub_tid" );
	News.n_pub_did 	= xml_node_attr( node, "n_pub_did" );
	News.n_title 	= xml_node_data( node, "title" );
	News.n_url		= xml_node_data( node, "url" );
	News.n_datetime	= xml_node_data( node, "datetime" );
	News.n_column 	= xml_node_data( node, "column" );
	News.n_valid 	= parse_int( xml_node_attr(node,"valid"), N_VALID );
	// extend config
	News.n_isgroup	= parse_int( xml_node_data(node,"ig") );
	News.n_vote		= xml_node_data( node, "vote" );
	News.n_qreply	= xml_node_data( node, "qreply" );
	News.n_split	= xml_node_data( node, "split" );
	News.n_format	= xml_node_data( node, "format" );
	News.n_faq		= xml_node_data( node, "faq" );	// for feedback.html
	News.n_fields	= parse_int( xml_node_data(node,"fields") );
	News.n_bcount	= parse_int( xml_node_data(node,"bcount") );
	News.n_nanonym	= parse_int( xml_node_data(node,"nanonym") );
	return News;
}
// parse xml to News object
function parse_news( xml ) {
	if ( xml == null ) { return null; }
	return ( parse_news_item(xml_node(xml,"news")) );
}
// parse xml to News object list
function parse_news_list( xml ) {
	if ( xml == null ) { return null; }
	var node_list = xml_node_list( xml, "news" );
	var NewsList = new Array();
	for ( var i=0; i<node_list.length; i++ ) {
		push_array( NewsList, parse_news_item(node_list[i]) );
	}
	return NewsList;

}
// load news xml, output by renderer()
function load_news( channel, newsid, renderer ) {
	var callback = function( xml ) {
		renderer( parse_news(xml) );
	};
	return xmlhttp_async( news_xml(channel,newsid), callback, 
						  news_cgi(channel,newsid), ENABLE_CACHE );
}
// load group list xml, output by renderer()
function load_glist( channel, newsid, renderer ) {
	var callback = function( xml ) {
		renderer( parse_news_list(xml) );
	};
	return xmlhttp_async( glist_xml(channel,newsid), callback, 
						  glist_cgi(channel,newsid) );
}

////////////////////////////////////////////////////////////////////////////////
// hotnews xml url
function hotnews_xml( channel, hotid ) {
	return ( XML_PATH + "/" + uri_encode(channel) +
			 "/" + uri_encode(hotid) + "_hotlist.xml" );
}
// hotnews cgi url, if hotnews xml non-existent
function hotnews_cgi( channel, hotid ) {
	return ( XML_CGI + TYPE_HOTNEWS + "&channel=" + uri_encode(channel) +
			 "&hotid=" + uri_encode(hotid) );
}
// hotnews js url
function hotnews_embed( channel, hotid, host ) {
	var cmnt_host = V4_HOST;
	if ( host!=undefined && host!="" ) {
		cmnt_host = host;
	}
	return ( cmnt_host + XML_PATH + "/" + uri_encode(channel) +
			 "/" + uri_encode(hotid) + "_hotlist.js" );
}
// load hotnews xml, output by renderer()
function load_hotnews( channel, hotid, renderer ) {
	if ( hotid == "" ) {
		hotid = ( channel + "_default" ); // default hot list
	}
	return load_hotnews_xml( hotnews_xml(channel,hotid), renderer, 
							 hotnews_cgi(channel,hotid) );
}
// load hotnews xml url, output by renderer()
function load_hotnews_xml( url, renderer, onerror ) {
	var callback = function( xml ) {
		renderer( parse_news_list(xml) );
	};
	return xmlhttp_async( url, callback, onerror, ENABLE_CACHE );
}

////////////////////////////////////////////////////////////////////////////////
// hotpost xml url
function hotpost_xml( channel ) {
	return ( XML_PATH + "/" + uri_encode(channel) +
			 "/" + uri_encode(channel) + "_hotpost.xml" );
}
// hotpost cgi url, if hotpost xml non-existent
function hotpost_cgi( channel ) {
	return ( XML_CGI + TYPE_HOTPOST + "&channel=" + uri_encode(channel) );
}
// hotpost js url
function hotpost_embed( channel, host ) {
	var cmnt_host = V4_HOST;
	if ( host!=undefined && host!="" ) {
		cmnt_host = host;
	}
	return ( cmnt_host + XML_PATH + "/" + uri_encode(channel) +
			 "/" + uri_encode(channel) + "_hotpost.js" );
}
// load hotpost xml, output by renderer()
function load_hotpost( channel, renderer ) {
	var callback = function( xml ) {
		renderer( parse_cmsg_list(xml) );
	};
	return xmlhttp_async( hotpost_xml(channel), callback, 
						  hotpost_cgi(channel), ENABLE_CACHE );
}
// hotpost page entry
function hotpost_url( channel ) {
	return V4_HOST + DEPOSIT_CGI + "?channel=" + channel;
}
// hotpost rss entry
function hotpost_rss( channel ) {
	return ( XML_PATH + "/" + uri_encode(channel) +
			 "/" + uri_encode(channel) + "_hotpost.rss" );
}

////////////////////////////////////////////////////////////////////////////////
// userpost cgi url
function userpost_cgi( userid, page ) {
	return ( XML_CGI + TYPE_USERPOST + 
			 "&userid=" + userid +  // keep uri encode for chinese
			 "&page=" + page +
			 "&channel=userpost&newsid=userpost" );
}
// load hotpost xml, output by renderer()
function load_userpost( userid, page, renderer ) {
	var callback = function( xml ) {
		renderer( parse_cmsg_list(xml) );
	};
	return xmlhttp_async( userpost_cgi(userid,page), callback );
}
// userpost page entry
function userpost_url( userid ) {
	_o( V4_HOST + DEPOSIT_CGI + "?userid=" + uri_encode(userid) ); // uri encode for chinese
}

////////////////////////////////////////////////////////////////////////////////
// convert cmsglist page number to serial
function locate_serial( pages, page, sort ) {
	if ( sort == SORT_ASCE ) {
		// SORT_ASCE 从旧到新
		if ( page >= pages ) {
			return 0; //serial:0, copy of the first page
		}
		return page; // page == serial
	} else {
		// SORT_DESC 从新到旧 
		if ( pages<1 || page<=1 ) {
			return 0; //serial:0, copy of the first page
		}
		return ( pages - page + 1 );
	}
}
// create cmsglist/count filter
function create_filter( channel, newsid, group, list, rid, vote, page, sort ) {
	var Filter = new Object();
	Filter.channel	= trim(channel);
	Filter.newsid 	= trim(newsid);
	if ( group!=undefined && group>0 ) {
		Filter.group = group;
	} else {
		Filter.group = NEWS_MODE;
	}
	if ( list!=undefined && list!=LIST_STRIP ) {
		Filter.list = list;
	} else {
		Filter.list = LIST_STRIP;
	}
	if ( rid!=undefined && rid>0 ) {
		Filter.rid = rid;
	} else {
		Filter.rid = 0;
	}
	if ( vote!=undefined && vote>0 ) {
		Filter.vote = vote;
	} else {
		Filter.vote = 0;
	}
	if ( page!=undefined && page>1 ) {
		Filter.page = page;
	} else {
		Filter.page = 1;
	}
	if ( sort!=undefined && sort==SORT_ASCE ) {
		Filter.sort = SORT_ASCE;
	} else {
		Filter.sort = SORT_DEFAULT;
	}	
	return Filter;
}
// cmsglist xml url
function cmsglist_xml( Filter, pages ) {
	if ( Filter.rid>0 || Filter.vote>0 ) { return null; }
	if ( Filter.page < 1 ) { Filter.page = 1; }
	var serial = locate_serial( pages, Filter.page, Filter.sort );
	return ( XML_PATH + "/" + uri_encode(Filter.channel) +
			 "/" + hash_path(Filter.newsid) + "/" + uri_encode(Filter.newsid) +
			 "_cmsg_" + Filter.group + "_" + Filter.list + "_" + serial + ".xml" );
}
// cmsglist cgi url, if cmsglist xml non-existent
function cmsglist_cgi( Filter, count ) {
	return ( XML_CGI + TYPE_CMSGLIST +
			 "&channel=" + uri_encode(Filter.channel) +
			 "&newsid=" + uri_encode(Filter.newsid) +
			 "&group=" + Filter.group +
			 "&list=" + Filter.list +
			 "&rid=" + Filter.rid +
			 "&vote=" + Filter.vote +
			 "&page=" + Filter.page +
			 "&sort=" + Filter.sort +
			 "&count" + count );
}
// cmsglist js url
function cmsglist_embed( channel, newsid, group, page, host ) {
	if ( page==undefined || page==null ) {
		page = 1;
	}
	var cmnt_host = V4_HOST;
	if ( host!=undefined && host!="" ) {
		cmnt_host = host;
	}
	if ( page <= 1 ) { // read from js
		return random_tag( cmnt_host + XML_PATH + "/" + uri_encode(channel) +
				 		   "/" + hash_path(newsid) + "/" + uri_encode(newsid) +
						   "_embed_" + group + ".js" );
	} else { // read from cgi
		return random_tag( cmnt_host + XML_CGI + TYPE_CMSG_JS +
				 		   "&channel=" + uri_encode(channel) +
				 		   "&newsid=" + uri_encode(newsid) +
				 		   "&group=" + group +
				 		   "&page=" + page );
	}
}
// topcmsg list xml url
function topcmsg_xml( channel, newsid, group ) {
	return ( XML_PATH + "/" + uri_encode(channel) + "/" + hash_path(newsid) + "/" +
			 uri_encode(newsid) + "_topcmsg_" + group + ".xml" );
}
// topcmsg list cgi url, if topcmsg xml non-existent
function topcmsg_cgi( channel, newsid, group ) {
	return ( XML_CGI + TYPE_TOPCMSG + "&channel=" + uri_encode(channel) +
			 "&newsid=" + uri_encode(newsid) + "&group=" + group );
}

// parse xml node to ReplyList array
function parse_reply_loop( xml ) {
	if ( xml == null ) { return null; }
	var node_list	= xml_node_list( xml, "reply" );
	var ReplyList = new Array();
	for ( var i=0; i<node_list.length; i++ ) {
		var node = node_list[i];
		var Reply = new Object();
		Reply.m_id 			= parse_int( xml_node_attr(node,"id") );
		Reply.m_rid 		= parse_int( xml_node_attr(node,"rid") );
		Reply.m_level 		= parse_int( xml_node_attr(node,"level") );
		Reply.m_status 		= parse_int( xml_node_attr(node,"status"), M_WAIT );
		Reply.m_channel 	= xml_node_data( node, "channel" );
		Reply.m_newsid 		= xml_node_data( node, "newsid" );		
		Reply.m_user 		= xml_node_data( node, "user" );
		Reply.m_ip			= xml_node_data( node, "ip" );
		Reply.m_area		= xml_node_data( node, "area" );
		Reply.m_datetime	= xml_node_data( node, "time" );
		Reply.m_content 	= trim( xml_node_data( node, "content" ) );
		Reply.m_vote 		= xml_node_data( node, "vote" );
		Reply.m_config 		= trim( xml_node_data( node, "config" ) );

		Reply.m_content 	= trim( Reply.m_content );
		Reply.m_user 		= trim( Reply.m_user );
		push_array( ReplyList, Reply );
	}
	return ReplyList;
}	
// parse xml node to CmsgItem object
function parse_cmsg_item( node ) {
	var Cmsg = new Object();
	// content
	Cmsg.m_id 		= parse_int( xml_node_attr(node,"id") );
	Cmsg.m_rid 		= parse_int( xml_node_attr(node,"rid") );
	Cmsg.m_rank 	= parse_int( xml_node_attr(node,"rank") );
	Cmsg.m_status 	= parse_int( xml_node_attr(node,"status"), M_WAIT );
	Cmsg.m_channel 	= xml_node_data( node, "channel" );
	Cmsg.m_newsid 	= xml_node_data( node, "newsid" );
	Cmsg.m_user 	= xml_node_data( node, "user" );
	Cmsg.m_ip		= xml_node_data( node, "ip" );
	Cmsg.m_area		= xml_node_data( node, "area" );
	Cmsg.m_datetime	= xml_node_data( node, "time" );
	Cmsg.m_content 	= trim( xml_node_data( node, "content" ) );
	Cmsg.m_vote 	= xml_node_data( node, "vote" );
	Cmsg.m_config 	= trim( xml_node_data( node, "config" ) );
	// rating
	Cmsg.Rating		= parse_rating( node );
	// news
	Cmsg.n_title 	= xml_node_data( node, "title" );
	Cmsg.n_url 		= xml_node_data( node, "url" );
	// reply
	Cmsg.s_user 	= xml_node_data( node, "s_user" );
	Cmsg.s_ip		= xml_node_data( node, "s_ip" );
	Cmsg.s_area		= xml_node_data( node, "s_area" );
	Cmsg.s_datetime	= xml_node_data( node, "s_time" );
	Cmsg.s_content 	= trim( xml_node_data( node, "s_content" ) );
	Cmsg.s_vote 	= xml_node_data( node, "s_vote" );
	Cmsg.s_config 	= trim( xml_node_data( node, "s_config" ) );
	// reply list
	Cmsg.ReplyList	= parse_reply_loop( node );
	return Cmsg;
}
// parse xml to CmsgItem object
function parse_cmsg( xml ) {
	if ( xml == null ) { return null; }
	return ( parse_cmsg_item(xml_node_list(xml,"cmsg")[0]) );
}
// parse xml to CmsgItem object list
function parse_cmsg_list( xml ) {
	if ( xml == null ) { return null; }
	var node_list = xml_node_list( xml, "cmsg" );
	var CmsgList = new Array();
	for ( var i=0; i<node_list.length; i++ ) {
		push_array( CmsgList, parse_cmsg_item(node_list[i]) );
	}
	return CmsgList;
}
// load cmsglist xml, output by renderer()
function load_cmsglist( Filter, renderer, pages, count ) {
	var callback = function( xml ) {
		renderer( parse_cmsg_list(xml) );
	};
	if ( Filter.rid>0 || Filter.vote>0 ) {
		return xmlhttp_async( cmsglist_cgi(Filter,count), callback );
	} else {
		return xmlhttp_async( cmsglist_xml(Filter,pages), callback, cmsglist_cgi(Filter,count) );
	}
}
// load topcmsg list xml, output by renderer()
function load_topcmsg( channel, newsid, group, renderer ) {
	var callback = function( xml ) {
		renderer( parse_cmsg_list(xml) );
	};
	return xmlhttp_async( topcmsg_xml(channel,newsid,group), callback,
						  topcmsg_cgi(channel,newsid,group) );
}

// post preview cgi url
function ppv_cgi( Filter, ppv ) {
	return ( XML_CGI + TYPE_CMSG_PPV +
			 "&channel=" + uri_encode(Filter.channel) +
			 "&newsid=" + uri_encode(Filter.newsid) +
			 "&" + POST_PREVIEW + "=" + ppv );
}
// load post preview cmsglist xml, parse by renderer()
function load_ppv( Filter, ppv, renderer ) {
	var callback = function( xml ) {
		renderer( parse_cmsg_list(xml) );
	};
	return xmlhttp_async( ppv_cgi(Filter,ppv), callback );
}
// cmsgitem format mask
function cmsg_mask( text, News ) {
	if ( News.n_newsid==undefined || News.n_split=="" || News.n_format=="" ) {
		return text; // keep
	}
	if ( News.n_fields <= 0 ) {
		return text; // keep
	}
	// mask
	var fields_list = text.split( News.n_split );
	if ( fields_list.length < News.n_fields ) {
		return text; // keep
	}
	var new_cmsg = News.n_format;
	for ( var i=1; i<=News.n_fields; ++i ) {
		new_cmsg = replace_var( new_cmsg, i, fields_list[i-1] );
	}
	return new_cmsg;
}

////////////////////////////////////////////////////////////////////////////////
// cmsgitem cgi url
function cmsgitem_cgi( channel, newsid, rid ) {
	return ( XML_CGI + TYPE_CMSG +  "&channel=" + uri_encode(channel) +
			 "&newsid=" + uri_encode(newsid) + "&rid=" + rid );
}
// load cmsgitem xml, output by renderer()
function load_cmsgitem( channel, newsid, rid, renderer ) {
	var callback = function( xml ) {
		renderer( parse_cmsg(xml) );
	};
	return xmlhttp_async( cmsgitem_cgi(channel,newsid,rid), callback );
}

////////////////////////////////////////////////////////////////////////////////
// cmsg count xml
function count_xml( Filter ) {
	if ( Filter.rid>0 || Filter.vote>0 ) {
		return null;
	}
	return ( XML_PATH + "/" + uri_encode(Filter.channel) + "/" +
			 hash_path(Filter.newsid) + "/" + uri_encode(Filter.newsid) +
			 "_count_" + Filter.group + ".xml" );
}
// cmsg count cgi url, if count xml non-existent
function count_cgi( Filter ) {
	return ( XML_CGI + TYPE_COUNT +
			 "&channel=" + uri_encode(Filter.channel) +
			 "&newsid=" + uri_encode(Filter.newsid) +
			 "&group=" + Filter.group +
			 "&rid=" + Filter.rid +
			 "&vote=" + Filter.vote );
}
// parse xml to Count object
function parse_count( xml ) {
	if ( xml == null ) { return null; }
	var node = xml_node( xml, "count" );
	var Count = new Object();
	Count.c_total 	= parse_int( xml_node_attr(node,"total"), -1 );
	Count.c_show 	= parse_int( xml_node_attr(node,"show"), -1 );
	Count.c_strip 	= parse_int( xml_node_attr(node,"strip"), -1 );
	Count.c_nice 	= parse_int( xml_node_attr(node,"nice"), -1 );
	Count.c_count	= parse_int( xml_node_attr(node,"count"), -1 );
	// old format data
	if ( Count.c_total<0 || Count.c_show<0 ) {
		Count.c_total = Count.c_show = parse_int( xml_node_attr(node,"all"), -1 );
	}
	return Count;
}
// load count xml, output by renderer()
function load_count( Filter, renderer ) {
	var callback = function( xml ) {
		renderer( parse_count(xml) );
	};
	if ( Filter.rid>0 || Filter.vote>0 ) {
		return xmlhttp_async( count_cgi(Filter), callback );
	} else {
		return xmlhttp_async( count_xml(Filter), callback, count_cgi(Filter) );
	}
}

////////////////////////////////////////////////////////////////////////////////
// rating xml url
function rating_xml( channel, newsid, mid ) {
	if ( mid > 0 ) { return null; }
	return ( XML_PATH + "/" + uri_encode(channel) + "/" + hash_path(newsid) +
			 "/" + uri_encode(newsid) + "_rating.xml" );
}
// rating cgi url, if rating xml non-existent, or cmsgitem's rating
function rating_cgi( channel, newsid, mid ) {
	return ( XML_CGI + TYPE_RATING +
			 "&channel=" + uri_encode(channel) +
			 "&newsid=" + uri_encode(newsid) +
			 "&mid=" + mid );
}
// parse xml to Rating object
function parse_rating( xml ) {
	if ( xml == null ) { return null; }
	var Rating = new Object();
	var node_list = xml_node_list( xml, "vote" );
	for ( var i=0; i<node_list.length; i++ ) {
		var option = parse_int( xml_node_attr(node_list[i],"option") );
		var count = parse_int( xml_node_attr(node_list[i],"count") );
		Rating[ option ] = count;
	}
	return Rating;
}
// load rating xml, output by renderer()
function load_rating( channel, newsid, mid, renderer ) {
	var callback = function( xml ) {
		renderer( parse_rating(xml) );
	};
	if ( mid > 0 ) {
		return xmlhttp_async( rating_cgi(channel,newsid,mid), callback );
	} else {
		return xmlhttp_async( rating_xml(channel,newsid,mid), callback, 
							  rating_cgi(channel,newsid,mid) );
	}
}
// read qreply option name by score
function qreply_option( qreply, score ) {
	if ( parse_int(score) <= 0 ) {
		return "";
	}
	var name = qreply[score];
	if ( name == undefined ) {
		return "";
	} else {
		return name;
	}
}

////////////////////////////////////////////////////////////////////////////////
// parse xml node to AdItem object
function parse_ad_item( node ) {
	var AdItem = new Object();
	AdItem.channel 	= xml_node_attr( node, "channel" );
	AdItem.newsid 	= xml_node_attr( node, "newsid" );
	AdItem.position	= xml_node_data( node, "position" );
	AdItem.type		= xml_node_data( node, "type" );
	AdItem.browser	= xml_node_data( node, "browser" );
	AdItem.from		= xml_node_data( node, "from" );
	AdItem.to		= xml_node_data( node, "to" );
	AdItem.content	= xml_node_data( node, "content" );
	return AdItem;
}
// parse xml to AdItem object list
function parse_ad_list( xml ) {
	if ( xml == null ) { return null; }
	var node_list = xml_node_list( xml, "aditem" );
	var AdList = new Array();
	for ( var i=0; i<node_list.length; i++ ) {
		push_array( AdList, parse_ad_item(node_list[i]) );
	}
	return AdList;
}
// load ad xml, output by renderer()
function load_ad( channel, newsid, renderer ) {
	var callback = function( xml ) {
		renderer( channel, newsid, parse_ad_list(xml) );
	};		   
	xmlhttp_async( AD_CONFIG, callback, ""/*onerror*/, ENABLE_CACHE );
}
// default AdItem list renderer
function adlist_renderer( channel, newsid, AdList ) {
	for ( var i=0; i<AdList.length; ++i ) {
		var ad = AdList[i];
		// check channel
		if ( ad.channel!="" && ad.channel!=channel ) {
			continue;
		}
		// check newsid
		if ( ad.newsid != "" ) {
			var re = new RegExp( ad.newsid );
			if ( re.exec(newsid) == null ) {
				continue;
			}
		}
		// check position
		if ( obj(ad.position) == null ) {
			continue;
		}
		// check browser
		if ( (is_mozilla() && ad.browser.toLowerCase().indexOf("mozilla")==-1) ||
			 (is_opera() && ad.browser.toLowerCase().indexOf("opera")==-1) ) {
			continue;
		}
		// check datetime
		var now = new Date();
		if ( ad.from != "" ) {
			var f = ad.from.split( "," );
			var from = new Date( f[0], parse_int(f[1])-1, f[2], f[3], f[4], f[5] );
			if ( now.getTime() < from.getTime() ) {
				continue;
			}
		}
		if ( ad.to != "" ) {
			var t = ad.to.split( "," );
			var to = new Date( t[0], parse_int(t[1])-1, t[2], t[3], t[4], t[5] );
			if ( now.getTime() > to.getTime() ) {
				continue;
			}
		}
		obj(ad.position).innerHTML = ad.content;
		show_obj( obj(ad.position) );
	}
}
////////////////////////////////////////////////////////////////////////////////
// parse xml node to Reply object
function parse_reply_item( node ) {
	var Reply = new Object();
	Reply.suite = xml_node_attr( node, "suite" );
	var node_list = xml_node_list( node, "reply_item" );
	for ( var i=0; i<node_list.length; i++ ) {
		var score = parse_int( xml_node_attr(node_list[i],"score") );
		var option = xml_node_attr( node_list[i], "option" );
		if ( score>0 && option!=null ) {
			Reply[ score ] = option;
		}
	}
	return Reply;
}
// parse xml to Reply object list
function parse_reply_list( xml ) {
	if ( xml == null ) { return null; }
	var node_list = xml_node_list( xml, "reply" );
	var ReplyList = new Array();
	for ( var i=0; i<node_list.length; i++ ) {
		push_array( ReplyList, parse_reply_item(node_list[i]) );
	}
	return ReplyList;
}
// load qreply/vote config, process by renderer()
function load_reply( renderer ) {
	var callback = function( xml ) {
		renderer( parse_reply_list(xml) );
	};	   
	return xmlhttp_async( REPLY_CONFIG, callback, ""/*onerror*/, ENABLE_CACHE );
}
////////////////////////////////////////////////////////////////////////////////
// get host domain
function hostname() {
	return window.location.hostname;
}
// get request params string
function params( location ) {
	var url = new String(location);
	var pos1 = url.indexOf("?");
	if ( pos1 == -1 ) {
		return "";
	}              
	var pos2 = url.lastIndexOf("#");
	if ( pos2 != -1 ) {
		url = url.substr( 0, pos2 );
	}
	return url.substr(pos1+1);
}
// read request value by name
function cgi_param( params, name ) {
	if ( params=="" || name=="" ) {
		return "";
	}
	var pos1 = params.indexOf( name+"=" );
	if( pos1 == -1 ) {
		return "";
	}
	var pos2 = params.indexOf( "&", pos1 );
	if( pos2 == -1 ) {
		pos2 = params.length;
	}
	if ( is_ie() ) {
		return unescape( params.substring(pos1+name.length+1,pos2) );
	} else {
		return ( params.substring(pos1+name.length+1,pos2) ); // keep uriencode for chinese
	}
}
// show string by document.write
function _s( str ) {
	if ( str==null || str==undefined ) {
		str = "";
	}
	document.write( str );
}
// open window
function _o( url, target ) {
	if ( target == undefined ) {
		target = "_blank";
	}
	window.open( url, target );
}
// jump location
function _j( url ) {
	// document.location = url;
	location.replace( url );
}

// show error message window
function error_page( msg, auto_refresh ) {
	if ( auto_refresh==null || auto_refresh==undefined ) {
		auto_refresh = "0";
	}
	_j( ERRPR_PAGE+"?auto_refresh="+auto_refresh+"&msg="+escape(msg) );
}
// skin file url
function skin_url( skin ) {
	return ( SKIN_PATH + "/" + skin + ".html" );
}
// comment entry url
function cmnt_url( Filter, skin ) {
	var url = V4_HOST + VIEW_CGI +
			  "?channel=" + Filter.channel +
			  "&newsid=" + Filter.newsid;
	if ( Filter.group!=undefined && Filter.group>0 ) {
		url += "&style=" + Filter.group;
	}
	if ( Filter.list!=undefined && Filter.list>0 ) {
		url += "&list=" + Filter.list;
	}
	if ( Filter.rid!=undefined && Filter.rid>0 ) {
		url += "&rid=" + Filter.rid;
	}
	if ( Filter.vote!=undefined && Filter.vote>0 ) {
		url += "&vote=" + Filter.vote;
	}
	if ( Filter.page!=undefined && Filter.page>1 ) {
		url += "&page=" + Filter.page;
	}
	if ( skin!=undefined && skin!="" ) {
		url += "&face=" + skin;
	}
	return url;
}
// auto fill user name & pass
function auto_fill( post_form ){
	var nickname = get_cookie( "nick" );
	if ( nickname!=undefined && nickname!=null && nickname!="" ) {
		var pos = nickname.indexOf( "(" );
		if ( pos != -1 ) {
			nickname = nickname.substr( 0, pos );
		}
		post_form.user.value = nickname;
	}
}
// show user name by type,channel
function show_username( user, ip, area, disable_search ) {
	var name = trim( user );
	var show = "";
	var suffix = ( area!="" ) ? "("+area+")" : "("+ip+")";
	
	// // anonymous user
	// if ( name == "" ) {
	// 	show = ( "新浪网友 IP:" + ip + suffix );
	// // mobile user
	// } else if ( name=="手机用户" || name.search(/wap:.*/i)!=-1 ) {
	// 	//show = "<a href='http://3g.sina.com.cn' target='_blank' title='通过手机看新闻'>" + area + "手机用户</a>";
	// 	show = area + "手机用户 <a href='http://3g.sina.com.cn' title='通过手机看新闻' target=_blank>手机看新闻</a>";
	// // woocall chat user
	// } else if ( name.search(/Woocall用户:.*/i) != -1 ) {
	// 	show = ( "Woocall用户 <b>" + name.substr(10) + "</b>" + suffix );
	// } else if ( name.search(/wc:.*/i) != -1 ) {
	// 	show = ( "Woocall用户 <b>" + name.substr(3) + "</b>" + suffix );
	// // uc messenger user
	// } else if ( name.search(/UC用户:.*/i) != -1 ) {
	// 	show = ( "UC用户 <b>" + name.substr(5) + "</b>" + suffix );
	// } else if ( name.search(/um:.*/i) != -1 ) {
	// 	show = ( "UC用户 <b>" + name.substr(3) + "</b>" + suffix );
	// // sina user
	// } else {
	// 	if ( disable_search!=undefined && disable_search!="" ) {
	// 		show = ( "新浪网友 <b>" + name + "</b>" + suffix );
	// 	} else {
	// 		show = ( "新浪网友 <a href=# title='查阅新浪网友“" + name + "”的留言记录' onclick=\"javascript:userpost_url('" +
	// 				 name + "');return false;\"><b>" + name + "</b></a>" );
	// 	}
	// }
	// return show;
	
	// anonymous user
	if ( name == "" ) {
		show = ( "新浪网友" + suffix );
	// mobile user
	} else if ( name=="手机用户" || name.search(/wap:.*/i)!=-1 ) {
		show = area + "手机用户 <a href='http://3g.sina.com.cn' title='通过手机看新闻' target=_blank>手机看新闻</a>";
	// woocall chat user
	} else if ( name.search(/Woocall用户:.*/i) != -1 ) {
		show = ( "Woocall用户 <b>" + name.substr(10) + "</b>" + suffix );
	} else if ( name.search(/wc:.*/i) != -1 ) {
		show = ( "Woocall用户 <b>" + name.substr(3) + "</b>" + suffix );
	// sina user
	} else {
		if ( disable_search!=undefined && disable_search!="" ) {
			show = ( "新浪网友 <b>" + name + "</b>" + suffix );
		} else {
			show = ( "新浪网友 <a href=# title='查阅新浪网友“" + name + "”的留言记录' onclick=\"javascript:userpost_url('" +
					 name + "');return false;\"><b>" + name + "</b></a>" );
		}
	}
	return show;	
}

////////////////////////////////////////////////////////////////////////////////
// check post flood
function check_post( content ) {
	var c = content.substr( 0, 100 );
	if ( get_cookie(FLOOD_POST) == c ) {
		return false;
	} else {
		set_cookie( FLOOD_POST, c );
		return true;
	}
}
// check quick reply flood
function check_qreply( rid ) {
	if ( get_cookie(FLOOD_QREPLY) == rid.toString() ) {
		return false;
	} else {
		set_cookie( FLOOD_QREPLY, rid.toString() );
		return true;
	}
}

////////////////////////////////////////////////////////////////////////////////
// load history from cookie
function history_cookie( cookie ) {
	// Entry = channel:newsid:group:count:focus:notified|...
	var history = new Array();
	var list = get_cookie(cookie).split( "|" );
	for ( var i=0; i<list.length; ++i ) {
		var fields = list[i].split( ":" );
		if ( fields.length != 6 ) {
			continue;
		}
		var Entry = new Object();
		Entry["channel"] 	= fields[0];
		Entry["newsid"]  	= fields[1];
		Entry["group"] 	 	= parse_int( fields[2] );
		Entry["count"] 	 	= parse_int( fields[3] );
		Entry["focus"] 	 	= parse_int( fields[4] );
		Entry["notified"]	= parse_int( fields[5] );
		history[ history.length ] = Entry;
	}
	return history;
}
// save history to cookie
function save_history( name, Entry ) {
	// Entry = channel:newsid:group:count:focus:notified|...
	var cookie = "";
	if ( Entry.focus<1 || Entry.notified<NOTIFIED_LIMIT ) {
		cookie += Entry.channel + ":" + Entry.newsid + ":" + Entry.group + ":" +
				  Entry.count + ":" + Entry.focus + ":" + Entry.notified + "|";
	}
	var list = history_cookie( name );
	for ( var i=0; i<list.length; ++i ) {
		if ( i >= HISTORY_LIMIT ) {
			break;
		}
		if ( list[i].focus>=1 && list[i].notified >= NOTIFIED_LIMIT ) {
			continue;
		}
		if ( list[i].channel!=Entry.channel || list[i].newsid!=Entry.newsid ) {
			cookie += list[i].channel + ":" + list[i].newsid + ":" + list[i].group + ":" +
				 	  list[i].count + ":" + list[i].focus + ":" + list[i].notified+ "|";
		}
	}
	set_cookie( name, cookie, "Saturday,30-December-2017 16:00:00 GMT" );
}
// append focus entry
function append_focus( Filter, Count ) {
	var Entry = new Object();
	Entry["channel"] 	= Filter.channel;
	Entry["newsid"]  	= Filter.newsid;
	Entry["group"] 	 	= Filter.group;
	Entry["count"] 	 	= Count.c_strip;
	Entry["focus"] 	 	= 1;
	Entry["notified"]	= 0;
	save_history( FOCUS_LIST, Entry );
}
// append history entry
function append_history( Filter, Count ) {
	var Entry = new Object();
	Entry["channel"] 	= Filter.channel;
	Entry["newsid"]  	= Filter.newsid;
	Entry["group"] 	 	= Filter.group;
	Entry["count"] 	 	= Count.c_strip;
	Entry["focus"] 	 	= 0;
	Entry["notified"]	= 0;
	save_history( HISTORY_LIST, Entry );
	// check focus list
	var list = history_cookie( FOCUS_LIST );
	for ( var i=0; i<list.length; ++i ) {
		if ( list[i].channel==Entry.channel && list[i].newsid==Entry.newsid &&
		 	 list[i].group==Entry.group && list[i].count<Entry.count ) {
			Entry.focus = 1;
			save_history( FOCUS_LIST, Entry );
			break;
		}
	}
}
// check focus notified times
function focus_notified( Entry ) {
	if ( Entry.channel=="" || Entry.newsid=="" ) {
		return;
	}
	var list = history_cookie( FOCUS_LIST );
	for ( var i=0; i<list.length; ++i ) {
		if ( list[i].channel==Entry.channel && list[i].newsid==Entry.newsid && 
			 list[i].group==Entry.group ) {
			Entry = list[i];
			++Entry.notified;
			save_history( FOCUS_LIST, Entry );
			break;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
// post 
function cmnt_post( Cmsg ) {
	if ( Cmsg.m_channel=="" || Cmsg.m_newsid=="" || Cmsg.m_content=="" ) {
		return false;
	}
	//评论内容的最大字符数为3000
	if (Cmsg.m_content.length > 3000) {
		if (!confirm("评论最多可以输入3000个汉字，您输入的内容超长。您可以点击\"取消\"按钮，删减部分内容后再重新提交。或者点击\"确定\"按钮，只发表前3000汉字的内容。"))
			return false;
	}
	// post div
	if ( obj("cmnt_post_span") == null ) {
		var cmnt_post_span = document.createElement( "span" );
		cmnt_post_span.setAttribute( "id", "cmnt_post_span" );
		cmnt_post_span.setAttribute( "style", "display:none" );
		document.body.insertBefore( cmnt_post_span, null );
	}
	// post code
	obj("cmnt_post_span").innerHTML = 
	"<iframe name='cmnt_post_frame' style='display:none' width=0 height=0></iframe>"+
	"<form name='cmnt_post_form' action='"+V4_HOST+POST_CGI+"' method=post target='cmnt_post_frame'>"+
	"<input type=hidden name=anonymous value=1>"+
	"<input type=hidden name=channel>"+
	"<input type=hidden name=newsid>"+
	"<input type=hidden name=content>"+
	"<input type=hidden name=vote>"+
	"<input type=hidden name=qvote>"+
	"<input type=hidden name=rid>"+
	"<input type=hidden name=user>"+
	"<input type=hidden name=pass>"+
	"<input type=hidden name=config>"+
	"<input type=hidden name=title>"+
	"<input type=hidden name=url>"+
	"<input type=hidden name=format>"+
	"<input type=hidden name=charset>"+
	"<input type=hidden name=to_mb>"+
	"</form>";
	// post
	document.cmnt_post_form.channel.value 	= Cmsg.m_channel;
	document.cmnt_post_form.newsid.value 	= Cmsg.m_newsid;
	document.cmnt_post_form.content.value 	= Cmsg.m_content;
	document.cmnt_post_form.vote.value 		= parse_int( Cmsg.m_vote );
	document.cmnt_post_form.qvote.value 	= parse_int( Cmsg.m_qvote );
	document.cmnt_post_form.rid.value 		= parse_int( Cmsg.m_rid );
	document.cmnt_post_form.user.value 		= parse_str( Cmsg.m_user );
	document.cmnt_post_form.pass.value 		= parse_str( Cmsg.m_pass );
	document.cmnt_post_form.config.value 	= parse_str( Cmsg.m_config );
	document.cmnt_post_form.title.value		= parse_str( Cmsg.n_title );
	document.cmnt_post_form.url.value 		= parse_str( Cmsg.n_url );
	document.cmnt_post_form.format.value 		= parse_str( Cmsg.format );
	document.cmnt_post_form.charset.value 	= parse_str( Cmsg.charset );
	document.cmnt_post_form.to_mb.value 	= parse_str( Cmsg.to_mb );
	document.cmnt_post_form.submit();
	// update js post preview cookie
	// cookie format: channel|newsid|user|datetime|content
	var cmsg_datetime = datetime_now();
	var preview_cookie = new Array();
	preview_cookie[0] = Cmsg.m_channel;
	preview_cookie[1] = Cmsg.m_newsid;
	preview_cookie[2] = escape( Cmsg.m_user );
	preview_cookie[3] = cmsg_datetime;
	preview_cookie[4] = escape( Cmsg.m_content );
	var now_time = new Date();
	now_time.setTime(now_time.getTime() + 5*60*1000); 
	set_cookie( JS_PREVIEW, preview_cookie.join("|"), now_time.toGMTString());
	return true;
}
// up
function cmnt_postup( channel, newsid, id, vote ) {
	var Cmsg = new Object();
	Cmsg.m_channel 	= trim( channel );
	Cmsg.m_newsid 	= trim( newsid );
	Cmsg.m_rid 		= id;
	Cmsg.m_vote 	= parse_int( vote, 1 );
	if ( Cmsg.m_vote == 2 ) {
		Cmsg.m_content 	= "反对";
	} else {
		Cmsg.m_content 	= "支持";
	}
	cmnt_post( Cmsg );
}
// js post preview
function cmnt_preview( channel, newsid, CmsgList ) {
	var post_preview = get_cookie( JS_PREVIEW );
	if ( post_preview == "" ) {
		return CmsgList;
	}
	// cookie format: channel|newsid|user|datetime|content
	var preview = post_preview.split( "|", 5 );
	if ( preview.length < 5 ) {
		return CmsgList;
	}
	if ( channel!=preview[0] || newsid!=preview[1] ) {
		return CmsgList;
	}
	var PreviewCmsg = new Object();
	// read
	PreviewCmsg["m_channel"] 	= preview[0];
	PreviewCmsg["m_newsid"] 	= preview[1];
	PreviewCmsg["m_user"] 		= unescape( preview[2] );
	PreviewCmsg["m_datetime"]	= preview[3];
	PreviewCmsg["m_content"]	= unescape( preview[4] );
	// blank
	PreviewCmsg["m_ip"] 		= "";
	PreviewCmsg["m_area"] 		= "";
	PreviewCmsg["m_vote"] 		= 0;
	PreviewCmsg["m_config"]		= "";
	PreviewCmsg["m_id"] 		= 0;
	PreviewCmsg["m_rid"] 		= 0;
	PreviewCmsg["m_rank"] 		= 0;
	PreviewCmsg["m_status"] 	= M_PASS;
	PreviewCmsg.Rating			= new Object();
	// return
	if ( CmsgList.length<=0 || trim(CmsgList[0].m_content) != trim(PreviewCmsg.m_content) ) {
		CmsgList.splice( 0, 0, PreviewCmsg );
	}
	delete PreviewCmsg;
	return CmsgList;
}

////////////////////////////////////////////////////////////////////////////////
// load cmsglist xml, old version
function load_cmsglist_v3( channel, newsid, group, nice, rid, page, pages, renderer ) {
	var list = 0;
	if ( nice > 0 ) {
		list = LIST_NICE;
	} else {
		list = LIST_ALL;
	}
	var Filter = create_filter( channel, newsid, group, list, rid, 0, page );
	return load_cmsglist( Filter, renderer, pages, 0/*count*/ );
}
// load news xml, old version
function read_news( channel, newsid ) {
	var url = news_xml( channel, newsid );
	if ( !url_exist(url) ) { url = news_cgi( channel, newsid ); }
	var xml = xmlhttp_request( url, XMLHTTP_XML );
	if ( xml == null ) { return null; }
	return parse_news( xml );
}
// load count xml, old version
function load_count_v3( channel, newsid, group, nice, rid, renderer ) {
	var list = 0;
	if ( nice > 0 ) {
		list = LIST_NICE;
	} else {
		list = LIST_ALL;
	}
	var Filter = create_filter( channel, newsid, group, list, rid );
	return load_count( Filter, renderer );
}
// load count xml, old version
function read_count( channel, newsid, group, nice, rid ) {
	var list = 0;
	if ( nice > 0 ) {
		list = LIST_NICE;
	} else {
		list = LIST_ALL;
	}
	var Filter = create_filter( channel, newsid, group, list, rid );
	// load
	var url = count_xml( Filter );
	if ( !url_exist(url) ) { url = count_cgi( Filter ); }
	var xml = xmlhttp_request( url, XMLHTTP_XML );
	if ( xml == null ) { return null; }
	return parse_count( xml );
}
// comment entry url, old version
function view_url( channel, newsid, style, nice, rid, page, face, hot ) {
	var list = 0;
	if ( nice > 0 ) {
		list = LIST_NICE;
	} else {
		list = LIST_ALL;
	}
	var Filter = create_filter( channel, newsid, style, list, rid, 0, page );
	return cmnt_url( Filter, face );
}

function isneedlogin( channel ) {
	var channels = "gn,gj,cj,sh,jc,pl,ty,kj,yl,dushu,wj,fdc,qc,bn,jk,gg,gd,hn,dl,shh,sic,xz,nx,qz,ds,tn,sr,dm,yx,v4test";
	var channel_list = new Array();
	channel_list = channels.split(",");
	for (var i=0; i<channel_list.length; i++ )
		if ( channel == channel_list[i] )
			return true;
	return false;
}
