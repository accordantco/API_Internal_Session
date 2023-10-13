/**
 * AJAX API class
 */
var READY_STATE_COMPLETE = 4;

/**
 * Constructor
 */
function API_Internal_Session(ajaxURL, senderid, senderpwd, controlid, uniqueid, dtdversion) {
	this.ajaxURL = ajaxURL;
	this.senderid = senderid || 'null';
	this.senderpwd = senderpwd || 'null';
	this.controlid = controlid || "controlid";
	this.uniqueid = uniqueid || "false";
	this.dtdversion = dtdversion || "3.0";
	this.lastRequest = '';
	this.lastResponse = '';
    // if the caller didn't specify a URL and we have a global session ID on the page
    // we grab it and later on we could send the requests to the Ajax GW instead of XML GW
    if ( ! ajaxURL && window.gSess ) {
        this.sessionid = window.gSess;
        this.ajaxURL = '../xml/ajaxgw.phtml?.sess=' + window.gSess;
    }
}

/**
 * Set login credentials
 */
API_Internal_Session.prototype.ip_setCredentials = function(companyid, userid, password, clientid, locationid) {
	this.companyid = companyid;
	this.userid = userid;
	this.password = password;
	this.clientid = clientid||'';
	this.locationid = locationid||'';
    // if the credentials are good, we null out the session so we'll use the credentials instead
    if ( companyid && userid && password ) {
        this.sessionid = null;
    }
}

/**
 * Set session ID. Once set, it will be used for all authentications.
 */
API_Internal_Session.prototype.ip_setSessionID = function(sessionid) {
	this.sessionid = sessionid;
    this.ajaxURL = '../xml/ajaxgw.phtml?.sess=' + sessionid;
}

/**
 * Get last XML request. Can be used for debugging.
 */
API_Internal_Session.prototype.ip_getLastRequest = function() {
	return this.lastRequest;
}

/**
 * Get last XML response. Can be used for debugging.
 */
/*API_Internal_Session.prototype.ip_getLastResponse = function() {
	return this.lastResponse;
}*/

/**
 * Set function to process API errors. By default alert(errorMessage) will be used.
 */
API_Internal_Session.prototype.ip_setErrorProc = function(errorProc) {
	this.errorProc = errorProc;
}


//----------------------------------
//  Intacct 3.0 API wrappers
//----------------------------------

/**
 * read API
 */
API_Internal_Session.prototype.ip_read = function(object, fields, keys, returnFormat, docparid, callback) {

	var payload = 
	'<read>'+
		this.xmlNode('object', object)+
		this.xmlNode('fields', fields)+
		this.xmlNode('keys', keys)+
		this.xmlNode('returnFormat', returnFormat)+
		this.xmlNode('docparid', docparid)+
	'</read>';

    this.sendRequest(payload, callback);
}

/**
 * readByName API
 */
API_Internal_Session.prototype.ip_readByName = function(object, fields, keys, returnFormat, callback) {

	var payload = 
	'<readByName>'+
		this.xmlNode('object', object)+
		this.xmlNode('fields', fields)+
		this.xmlNode('keys', keys)+
		this.xmlNode('returnFormat', returnFormat)+
	'</readByName>';

    this.sendRequest(payload, callback);
}

/**
 * readByQuery API
 */
API_Internal_Session.prototype.ip_readByQuery = function(object, fields, query, pagesize, returnFormat, callback) {

	var payload = 
	'<readByQuery>'+
		this.xmlNode('object', object)+
		this.xmlNode('fields', fields)+
		this.xmlNode('query', query)+
		this.xmlNode('pagesize', pagesize)+
		this.xmlNode('returnFormat', returnFormat)+
	'</readByQuery>';

    this.sendRequest(payload, callback);
}

/**
 * readView API
 */
API_Internal_Session.prototype.ip_readView = function(view, filters, pagesize, returnFormat, callback) {

    var payload =
        '<readView>'+
            this.xmlNode('view', view)+
            ( pagesize != null ? this.xmlNode('pagesize', pagesize) : '' ) +
            ( returnFormat != null ? this.xmlNode('returnFormat', returnFormat) : '' ) +
            ( filters != null ? this.processFields( { filters: filters} ) : '' ) +
            '</readView>';

    this.sendRequest(payload, callback);
}


/**
 * readMore API
 */
API_Internal_Session.prototype.ip_readMore = function(object, callback, type) {

	var payload =
	'<readMore>'+
		this.xmlNode(type == null ? 'object' : type, object)+
	'</readMore>';

    this.sendRequest(payload, callback);
}

/**
 * readMoreObject API
 */
API_Internal_Session.prototype.ip_readMoreObject = function(object, callback)
{
    this.ip_readMore(object, callback, 'object');
}

/**
 * readMoreView API
 */
API_Internal_Session.prototype.ip_readMoreView = function(view, callback)
{
    this.ip_readMore(view, callback, 'view');
}

/**
 * readRelated API
 */
API_Internal_Session.prototype.ip_readRelated = function(object, keys, relation, fields, returnFormat, callback) {

	var payload = 
	'<readRelated>'+
		this.xmlNode('object', object)+
		this.xmlNode('keys', keys)+
		this.xmlNode('relation', relation)+
		this.xmlNode('fields', fields)+
		this.xmlNode('returnFormat', returnFormat)+
	'</readRelated>';

    this.sendRequest(payload, callback);
}


/**
 * create API (uses object name and array of parameters)
 */
API_Internal_Session.prototype.ip_create = function(object, fieldsArray, callback) {

	var payload = '<create><'+object+'>';
	payload += this.processFields(fieldsArray);
	payload += '</'+object+'></create>';

    this.sendRequest(payload, callback);
};

/**
 * create API (uses XML payload)
 */
API_Internal_Session.prototype.ip_createXML = function(xmlPayload, callback) {

	var payload = 
	'<create>'+xmlPayload+'</create>';

    this.sendRequest(payload, callback);
}


/**
 * update API (uses object name and array of parameters)
 */
API_Internal_Session.prototype.ip_update = function(object, fieldsArray, callback) {

	var payload = '<update><'+object+'>';
	payload += this.processFields(fieldsArray);
	payload += '</'+object+'></update>';

    this.sendRequest(payload, callback);
};


/**
 * update API (uses XML payload)
 */
API_Internal_Session.prototype.ip_updateXML = function(xmlPayload, callback) {

	var payload = 
	'<update>'+xmlPayload+'</update>';

    this.sendRequest(payload, callback);
}


/**
 * delete API
 */
API_Internal_Session.prototype.ip_delete = function(object, keys, callback) {

	var payload = 
	'<delete>'+
		this.xmlNode('object', object)+
		this.xmlNode('keys', keys)+
	'</delete>';

    this.sendRequest(payload, callback);
}


/**
 * inspect API
 */
API_Internal_Session.prototype.ip_inspect = function(object, detail, callback) {

	var payload = 
	(detail ? '<inspect detail="1">' : '<inspect>')+
		this.xmlNode('object', object)+
	'</inspect>';

    this.sendRequest(payload, callback);
}


//----------------------------------
//  Internal implementation - do not expose to users
//----------------------------------

/**
 * Create XMLHttpRequest instance
 */
API_Internal_Session.prototype.getXMLHTTPRequest = function() {
	var xreq = false;
	if (window.XMLHttpRequest) {
		xreq = new XMLHttpRequest();
	}
	else if (typeof ActiveXObject != "undefined") {
		try {
			xreq = new ActiveXObject("Msxml2.XMLHTTP");
	      	} catch(e) {
			try {
				xreq = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				xreq = false;
			}
		}
	}
	return xreq;
}

/**
 * XML encode string
 */
API_Internal_Session.prototype.xmlEncode = function(str) {
	if (!str)
		return '';
	str = String(str);
	return str.replace(/\&/g,'&'+'amp;').replace(/</g,'&'+'lt;').replace(/>/g,'&'+'gt;').replace(/\'/g,'&'+'apos;').replace(/\"/g,'&'+'quot;');
}

/**
 * XML node as string
 */
API_Internal_Session.prototype.xmlNode = function(name, value) {
	if (!name)
		return '';
	return '<'+name+'>'+this.xmlEncode(value)+'</'+name+'>';
}

/**
 * Get header of XML request
 */
API_Internal_Session.prototype.getRecHeader = function() {
	var buff = '<?xml version="1.0" encoding="UTF-8"?><request>';
	
	buff += '<control><senderid>'+this.xmlEncode(this.senderid)+
		'</senderid><password>'+this.xmlEncode(this.senderpwd)+'</password><controlid>'+this.xmlEncode(this.controlid)+'</controlid>'+
		'<uniqueid>'+this.xmlEncode(this.uniqueid)+'</uniqueid><dtdversion>'+this.xmlEncode(this.dtdversion)+'</dtdversion></control>';

	buff += '<operation>';
	
	buff += '<authentication>';
	if (this.sessionid) {
		buff += this.xmlNode('sessionid', this.sessionid);
	}
	else {
		buff += '<login>';
		buff += this.xmlNode('userid', this.userid);
		buff += this.xmlNode('companyid', this.companyid);
		buff += this.xmlNode('password', this.password);
		if (this.clientid)
			buff += this.xmlNode('clientid', this.clientid);
		if (this.locationid)
			buff += this.xmlNode('locationid', this.locationid);
		buff += '</login>';
	}
	buff += '</authentication>';

	buff += '<content><function controlid="'+this.xmlEncode(this.controlid)+'">';
	
	return buff;
}

/**
 * Get footer of XML request
 */
API_Internal_Session.prototype.getRecFooter = function() {
	var buff = '</function></content>';
	buff += '</operation></request>';

	return buff;
}

/**
 * Send AJAX request
 */
API_Internal_Session.prototype.sendRequest = function(payload, callback) {
	var xmlDoc = this.getRecHeader()+payload+this.getRecFooter();
	this.lastRequest = xmlDoc;

	var xRequest = this.getXMLHTTPRequest();
	if (!xRequest)
		// I18N: TODO
		throw "Cannot create XMLHTTPRequest";
	
	var errProc = this.checkError;
	var errCallback = (this.errorProc ? this.errorProc :  function(errMessage) { alert(GT("IA.ERROR")+": "+errMessage); } );
	
	xRequest.onreadystatechange = function() {
		if (xRequest.readyState == READY_STATE_COMPLETE) {
			if (errProc(xRequest.responseText, errCallback))
				return;
			if (callback)
				callback(xRequest.responseText);
		}
	};

	var url = this.ajaxURL;
	xRequest.open('POST', url, true);
	var encodedDoc = 'xmlrequest=' + encodeURIComponent(xmlDoc);
	xRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xRequest.setRequestHeader("Content-length", encodedDoc.length);
	xRequest.setRequestHeader("Connection", "close");
	xRequest.send(encodedDoc);
}


/**
 * Process error returned by API call.
 * Cannot use instance variables.
 */
API_Internal_Session.prototype.checkError = function(responseText, errCallback) {
	this.lastResponse = new String(responseText);	// Store for future use
	
	var errNode = util_getXmlNodeText(responseText, 'errormessage');
	if (!errNode)
		return false;

    var desc1 = util_getXmlNodeText(errNode, 'description');
    var desc2 = util_getXmlNodeText(errNode, 'description2');
    var corr = util_getXmlNodeText(errNode, 'correction');

    if (!desc1 && !desc2 && !corr) {
        message = errNode;
    } else {
        message = "";
        if (desc1) message = message + desc1 + "\n\n";
        if (desc2) message = message + desc2 + "\n\n";
        if (corr) message = message + corr + "\n\n";
	}

    var txt = document.createElement("textarea");
    txt.innerHTML = message;

	if (errCallback)
		errCallback(txt.value.trim());
	return true;
}


/**
 * Recursively add fields to XML (fields can be nested)
 */
API_Internal_Session.prototype.processFields = function(fieldsArray)
{
    var buff = '';
    if ( fieldsArray instanceof Array ) {
        for( var key = 0 ; key < fieldsArray.length; key++ ) {
            buff += this.processOneField(fieldsArray, key);
        }
    } else {
        for(var key in fieldsArray) {
            buff += this.processOneField(fieldsArray, key);
        }
    }

    return buff;
}

/**
 * Recursively add one field to XML (fields can be nested)
 */
API_Internal_Session.prototype.processOneField = function(fieldsArray, key)
{
    var buff = '';
    var fieldName = key;
    var isArray = fieldsArray instanceof Array;
    var fieldValue = fieldsArray[key];
    var fieldType = typeof fieldValue;
    if (fieldValue==null) {
        return buff;
    }
    if (fieldType=='object' || fieldType=='array') {
        if ( isArray ) {
            buff += this.processFields(fieldValue);
        } else {
            buff += '<'+fieldName+'>'+this.processFields(fieldValue)+'</'+fieldName+'>';
        }
    }
    else {
        buff += this.xmlNode(fieldName, fieldValue);
    }

    return buff;
}


/**
 * Extract content of XML node as text.
 * Static function, not a class member.
 */
function util_getXmlNodeText(xmlText, nodeName) {
	if (!xmlText)
		return null;
	var ind1 = xmlText.indexOf('<'+nodeName+'>');
	if (ind1 < 0)
		return null;
	ind1 += 2+nodeName.length;
	var ind2 = xmlText.indexOf('</'+nodeName+'>', ind1);
	if (ind2 < 0)
		return null;
	return xmlText.substring(ind1, ind2);
}