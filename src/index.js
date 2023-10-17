import xmlToJson from './xml2json.js';

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
 * 
 *  returnPromise : Function will optionally return a Promise.  In this event, any passed callback is ignored, and the user is not presented with any error message.
 */
API_Internal_Session.prototype.ip_readByQuery = function (object, fields, query, pagesize, returnFormat, callback, returnPromise, docparid) {

	try {

		var payload =
			'<readByQuery>' +
			this.xmlNode('object', object) +
			this.xmlNode('fields', fields) +
			this.xmlNode('query', query) +
			this.xmlNode('pagesize', pagesize) +
			this.xmlNode('returnFormat', returnFormat);


		if (docparid != undefined) {
			payload += this.xmlNode('docparid', docparid);
		}

		payload += '</readByQuery>';

		if (returnPromise) {
			return this.sendRequestWithPromise(payload);
		}
		else {
			this.sendRequest(payload, callback);
		}
	}
	catch (ex) {
		if (returnPromise) { return jq.Deferred().reject(ex); } else { throw ex; }
	}
};

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
	xRequest.open('POST', url, false);
	var encodedDoc = 'xmlrequest=' + encodeURIComponent(xmlDoc);
	xRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xRequest.setRequestHeader("Content-length", encodedDoc.length);
	xRequest.setRequestHeader("Connection", "close");
	xRequest.send(encodedDoc);
}

/**
 * Send AJAX request
 * This is the modified function which returns a Promise.
 * The promise will resolve with a Javascript object, or reject with an error message text string.
 * NOTE: This function expects that the request was sent with a returnFormat of 'json'
 * 
 * NOTES USING MULTIPLE FUNCTIONS
 * There are different places to apply a function tag.  Where the function tag is applied determines which operations fail/succeed when an API call is *not* wrapped in a transaction.
 * The functionTagPlacement parameter is only valid when a payload array is passed.  If the payload object is not an array, the "header" value (see below) will be used.
 *		functionTagPlacement ==> 
 *			"header" : This is the default setting in the absence of a value when an XML string is passed for the payload.  A function tag will be placed outside of the supplied payload.  This requires that the XML payload is wrapped in a single function type (i.e. create, update).  If the XML payload has multiple function types, the call will fail.
 *			"content" : This is the default setting in the absence of a value when an array is passed as the payload. A function tag will be placed outside of each payload item in the supplied array.  The implications are that if one operation fails in a payload item, other payload items can still succeed (though only if useTransaction is set to false)
 *			"none" : No function tags will be added.  It is expected that the payload will already have function tags supplied.
 */
API_Internal_Session.prototype.sendRequestWithPromise = function (payload, useTransaction, functionTagPlacement, skipErrorChecking) {

	// 0. Define selfip_create
	var self = this;

	// A. Create deferred object
	// var dfd = jq.Deferred();

	// B. Handle if multiple functions are being called
	if (Array.isArray(payload)) {

		// i. Determine function tag settings
		var excludeHeaderFunctionTag = functionTagPlacement != "header"; // This will make it so that the only way to INCLUDE a header tag is to specifically request it.
		var excludeContentFunctionTag = functionTagPlacement == "header" || functionTagPlacement == "none"; // This will make it such that the only way to EXCLUDE a fuction tag from the header is if either of these are specifically set.

		var usingMultipleFunctions = true;

		var xmlDoc = this.getRecHeader(useTransaction, excludeHeaderFunctionTag) + this.getRecContent(payload, excludeContentFunctionTag) + this.getRecFooter(excludeHeaderFunctionTag);
	}
	else {

		// i. Determine function tag settings
		var excludeHeaderFunctionTag = functionTagPlacement == "content" || functionTagPlacement == "none"; // This will make it such that the only way to EXCLUDE a fuction tag from the header is if either of these are specifically set.

		var xmlDoc = this.getRecHeader(useTransaction, excludeHeaderFunctionTag) + payload + this.getRecFooter(excludeHeaderFunctionTag);
	}

	this.lastRequest = xmlDoc;

	var xRequest = this.getXMLHTTPRequest();
	if (!xRequest)
		throw "Cannot create XMLHTTPRequest";

	// xRequest.onreadystatechange = function () {
		
	// };

	var url = this.ajaxURL;
	xRequest.open('POST', url, false);
	var encodedDoc = 'xmlrequest=' + encodeURIComponent(xmlDoc);
	xRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//xRequest.setRequestHeader("Content-length", encodedDoc.length);
	//xRequest.setRequestHeader("Connection", "close");
	xRequest.send(encodedDoc);

	// Z. Return Promise
	// return dfd.promise();
	if (xRequest.readyState == READY_STATE_COMPLETE) {

		// ===> TO-DO : FIGURE OUT BEST WAY TO HANDLE SUCCESS/FAILURE, SINCE THIS FUNCTION WILL ALSO RECEIVE JSON RESPONSES WITH DATA

		// a. Check if an error was returned
		var err = null;
		if (skipErrorChecking == false || skipErrorChecking == undefined) {
			err = self.getErrorMessage(xRequest.responseText);
		}

		// b. Reject if error
		if (err != null) { return {type: "error", message: err }; }

		// c. Otherwise resolve
		else {

			// i. Try to parse XML to json
			var json = xmlToJson.parse(xRequest.responseText);

			// ii. If it can't be parsed, it means its not XML, and is presumably a JSON string.  Parse to JSON object.
			if (json == null) {
				json = JSON.parse(xRequest.responseText);
			}

			// iii. Inspect for possible error response // as alternative to try/catch verify if '(json.response.operation.result.status)' exists?
			if (skipErrorChecking == false || skipErrorChecking == undefined) {
				try {
					if (!Array.isArray(json.response.operation.result)) {
						if (json.response.operation.result.status == "failure") { return "Unknown error occurred contacting Intacct on function"; }
					}
				}
				catch (e) {
					// do nothing
				}
			}

			// iii. Resolve json response
			return {type: "success", message: json };
		}
	}
};

API_Internal_Session.prototype.getErrorMessage = function (responseText) {

	this.lastResponse = new String(responseText);	// Store for future use.

	var errNode = util_getXmlNodeText(responseText, 'errormessage');
	if (!errNode)
		return null;

	// If this point is reached, there is an error

	// b. Define error variables
	var desc1; var desc2; var corr; var errorNo;

	// a. Parse XML
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(responseText, "text/xml");

	// b. Get nodes with "error" (this will return an HTML Collection)
	var errorNodes = xmlDoc.getElementsByTagName("error");

	// c. Convert HTML Collection to an error
	var errors = Array.from(errorNodes);

	// d. If there are multiple errors, alert user
	var multipleErrors = errors.length > 1 ? "Multiple errors exist - the first one is being presented\n" : "";

	// e. Parse error to Json Array
	var jsonErrorArray = new Array();

	// i. Loop through each error element
	errors.forEach((errorElement, index) => {

		// ii. If the error element has children (which it should), loop through to create the error object
		if (errorElement.children != undefined) {

			// iii. Fill error object
			var errorObject = {};
			for (var i = 0; i < errorElement.children.length; i++) {
				errorObject[errorElement.children[i].tagName] = errorElement.children[i].textContent;
			}

			// iv. Add error object to jsonErrorArray
			jsonErrorArray.push(errorObject);
		}

		// Important : The property names 'description', 'description2', 'correction', and 'errorno' are expected to be returned in the Intacct XML error response.
		//			   If Intacct changes these names, you will need to modify this code.
		desc1 = jsonErrorArray[0].description; desc2 = jsonErrorArray[0].description2; corr = jsonErrorArray[0].correction; errorNo = jsonErrorArray[0].errorno;
	});

	// ==> Logger
	if (this.logger != null) {

		// NOTE: FOR INTACCT ERRORS, YOU ARE LOGGING AS A NORMAL ENTRY AND HANDLING FORMATTING HERE
		this.logger.writeEntry("ERROR => Intacct API Errors Occurred (" + jsonErrorArray.length + " Total) :");
		jsonErrorArray.forEach((element, index) => {
			var errorCount = index + 1;
			this.logger.writeEntry("-- Intacct Error #" + errorCount + " --");
			this.logger.writeEntry("desc: " + element.description); this.logger.writeEntry("desc2: " + element.description2); this.logger.writeEntry("corr: " + element.correction); this.logger.writeEntry("errno: " + element.errorno);
			this.logger.addError("desc: " + element.description + " | " + "desc2: " + element.description2 + " | " + "corr: " + element.correction + " | " + "errno: " + element.errorno);
		});
	}

	// var desc1 = util_getXmlNodeText(errNode, 'description');
	// var desc2 = util_getXmlNodeText(errNode, 'description2');
	// var corr = util_getXmlNodeText(errNode, 'correction');

	if (!desc1 && !desc2 && !corr) {
		message = errNode;
	} else {
		message = "";
		if (multipleErrors) message = message + multipleErrors + "\n";
		if (desc1) message = message + desc1 + "\n\n";
		if (desc2) message = message + desc2 + "\n\n";
		if (corr) message = message + corr + "\n\n";
	}

	var txt = document.createElement("textarea");
	txt.innerHTML = message;

	return txt.value.trim();
};


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

export default API_Internal_Session;