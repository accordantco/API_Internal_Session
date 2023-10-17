/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 993:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
﻿/**
* Object assign is required, so ensure that browsers know how to execute this method
*
* @method Object.assign
* @returns {Function}
*/
if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}


/**
* Object to convert XML into a structured JSON object
*
* @method xmlToJson
* @returns {Object}
*/
var xmlToJson = (function () {
    var self = this;


    /**
    * Adds an object value to a parent object
    *
    * @method addToParent
    * @param {Object} parent
    * @param {String} nodeName
    * @param {Mixed} obj
    * @returns none
    */
    self.addToParent = function (parent, nodeName, obj) {
        // If this is the first or only instance of the node name, assign it as
        // an object on the parent.
        if (!parent[nodeName]) {

            parent[nodeName] = obj;
        }
        // Else the parent knows about other nodes of the same name
        else {
            // If the parent has a property with the node name, but it is not an array,
            // store the contents of that property, convert the property to an array, and
            // assign what was formerly an object on the parent to the first member of the
            // array
            if (!Array.isArray(parent[nodeName])) {
                var tmp = parent[nodeName];
                parent[nodeName] = [];
                parent[nodeName].push(tmp);
            }

            // Push the current object to the collection
            parent[nodeName].push(obj);
        }
    };




    self.convertXMLStringToDoc = function (str) {
        var xmlDoc = null;

        if (str && typeof str === 'string') {

            // Create a DOMParser
            var parser = new DOMParser();

            xmlDoc = parser.parseFromString(str, 'application/xml');

        }

        return xmlDoc;
    }


    /**
    * Validates if an data is an XMLDocument
    *
    * @method isXML
    * @param {Mixed} data
    * @returns {Boolean}
    */
    self.isXML = function (data) {
        var documentElement = (data ? data.ownerDocument || data : 0).documentElement;

        return documentElement ? documentElement.nodeName.toLowerCase() !== 'html' : false;
    };


    /**
    * Reads through a node's attributes and assigns the values to a new object
    *
    * @method parseAttributes
    * @param {XMLNode} node
    * @returns {Object}
    */
    self.parseAttributes = function (node) {
        var attributes = node.attributes,
            obj = {};

        // If the node has attributes, assign the new object properties
        // corresponding to each attribute
        if (node.hasAttributes()) {
            for (var i = 0; i < attributes.length; i++) {
                obj[attributes[i].name] = self.parseValue(attributes[i].value);
            }
        }

        // return the new object
        return obj;
    };


    /**
    * Rips through child nodes and parses them
    *
    * @method parseChildren
    * @param {Object} parent
    * @param {XMLNodeMap} childNodes
    * @returns none
    */
    self.parseChildren = function (parent, childNodes) {
        // If there are child nodes...
        if (childNodes.length > 0) {
            // Loop over all the child nodes
            for (var i = 0; i < childNodes.length; i++) {
                // If the child node is a XMLNode, parse the node
                if (childNodes[i].nodeType == 1) {
                    self.parseNode(parent, childNodes[i]);
                }
            }
        }
    };


    /**
    * Converts a node into an object with properties
    *
    * @method parseNode
    * @param {Object} parent
    * @param {XMLNode} node
    * @returns {Object}
    */
    self.parseNode = function (parent, node) {
        var nodeName = node.nodeName,
            obj = Object.assign({}, self.parseAttributes(node)),
            tmp = null;

        // If there is only one text child node, there is no need to process the children
        if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
            // If the node has attributes, then the object will already have properties.
            // Add a new property 'text' with the value of the text content
            if (node.hasAttributes()) {
                obj['text'] = self.parseValue(node.childNodes[0].nodeValue);
            }
            // If there are no attributes, then the parent[nodeName] property value is
            // simply the interpreted textual content
            else {
                obj = self.parseValue(node.childNodes[0].nodeValue);
            }
        }
        // Otherwise, there are child XMLNode elements, so process them
        else {
            self.parseChildren(obj, node.childNodes);
        }

        // Once the object has been processed, add it to the parent
        self.addToParent(parent, nodeName, obj)

        // Return the parent
        return parent;
    };


    /**
    * Interprets a value and converts it to Boolean, Number or String based on content
    *
    * @method parseValue
    * @param {Mixed} val
    * @returns {Mixed}
    */
    this.parseValue = function (val) {

        // Justin's notes:
        // A string with a leading zero (such as a zip code) will be converted to a number with the leading zero stripped.
        // Any non-zero length string that starts with a zero is always treated to be not-a-number.
        if (val.charAt(0) == "0") {
            var num = NaN;
        }
        else {
            // Create a numeric value from the passed parameter
            var num = Number(val);
        }


        // If the value is 'true' or 'false', parse it as a Boolean and return it
        if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
            return (val.toLowerCase() == 'true');
        }

        // If the num parsed to a Number, return the numeric value
        // Else if the value passed has no length (an attribute without value) return null,
        // Else return the param as is
        return (isNaN(num)) ? val.trim() : (val.length == 0) ? null : num;
    };

    // Expose the API
    return {
        parse: function (xml) {
            // Justin's Note: Firefox crashed when trying to run this function using a json string (rather than returning null as it should have)
            // This function should only proceed when an error is thrown trying to parse.
            var isJson = true;
            try { JSON.parse(xml) }
            catch (ex) {
                isJson = false;
            }
            if (isJson) { return null; }

            if (xml && typeof xml === 'string') {
                xml = self.convertXMLStringToDoc(xml);
            }

            // ==> Added by Justin : 4/19/2022
            //     The original version of this library will return an empty object for all empty xml tags.  This is not preferrable.
            //     This function will remove all object properties for empty xml tags.  You could alternately set default values rather than delete the property.
            var remove_empty = function (target) {
                Object.keys(target).map(function (key) {
                    if (target[key] instanceof Object) {
                        if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {
                            delete target[key];
                        } else {
                            remove_empty(target[key]);
                        }
                    } else if (target[key] === null) {
                        delete target[key];
                    }
                });
                return target;
            };

            return (xml && self.isXML(xml)) ? remove_empty(self.parseNode({}, xml.firstChild)) : null;
        }
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (xmlToJson);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var xmlToJson = __webpack_require__(993);

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
})();

/******/ })()
;