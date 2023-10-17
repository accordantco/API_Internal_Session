/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ API_Internal_Session)\n/* harmony export */ });\n/* harmony import */ var _xml2json_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xml2json.js */ \"./src/xml2json.js\");\n\r\n\r\n/**\r\n * AJAX API class\r\n */\r\nvar READY_STATE_COMPLETE = 4;\r\n\r\n/**\r\n * Constructor\r\n */\r\nfunction API_Internal_Session(ajaxURL, senderid, senderpwd, controlid, uniqueid, dtdversion) {\r\n\tthis.ajaxURL = ajaxURL;\r\n\tthis.senderid = senderid || 'null';\r\n\tthis.senderpwd = senderpwd || 'null';\r\n\tthis.controlid = controlid || \"controlid\";\r\n\tthis.uniqueid = uniqueid || \"false\";\r\n\tthis.dtdversion = dtdversion || \"3.0\";\r\n\tthis.lastRequest = '';\r\n\tthis.lastResponse = '';\r\n    // if the caller didn't specify a URL and we have a global session ID on the page\r\n    // we grab it and later on we could send the requests to the Ajax GW instead of XML GW\r\n    if ( ! ajaxURL && window.gSess ) {\r\n        this.sessionid = window.gSess;\r\n        this.ajaxURL = '../xml/ajaxgw.phtml?.sess=' + window.gSess;\r\n    }\r\n}\r\n\r\n/**\r\n * Set login credentials\r\n */\r\nAPI_Internal_Session.prototype.ip_setCredentials = function(companyid, userid, password, clientid, locationid) {\r\n\tthis.companyid = companyid;\r\n\tthis.userid = userid;\r\n\tthis.password = password;\r\n\tthis.clientid = clientid||'';\r\n\tthis.locationid = locationid||'';\r\n    // if the credentials are good, we null out the session so we'll use the credentials instead\r\n    if ( companyid && userid && password ) {\r\n        this.sessionid = null;\r\n    }\r\n}\r\n\r\n/**\r\n * Set session ID. Once set, it will be used for all authentications.\r\n */\r\nAPI_Internal_Session.prototype.ip_setSessionID = function(sessionid) {\r\n\tthis.sessionid = sessionid;\r\n    this.ajaxURL = '../xml/ajaxgw.phtml?.sess=' + sessionid;\r\n}\r\n\r\n/**\r\n * Get last XML request. Can be used for debugging.\r\n */\r\nAPI_Internal_Session.prototype.ip_getLastRequest = function() {\r\n\treturn this.lastRequest;\r\n}\r\n\r\n/**\r\n * Get last XML response. Can be used for debugging.\r\n */\r\n/*API_Internal_Session.prototype.ip_getLastResponse = function() {\r\n\treturn this.lastResponse;\r\n}*/\r\n\r\n/**\r\n * Set function to process API errors. By default alert(errorMessage) will be used.\r\n */\r\nAPI_Internal_Session.prototype.ip_setErrorProc = function(errorProc) {\r\n\tthis.errorProc = errorProc;\r\n}\r\n\r\n\r\n//----------------------------------\r\n//  Intacct 3.0 API wrappers\r\n//----------------------------------\r\n\r\n/**\r\n * read API\r\n */\r\nAPI_Internal_Session.prototype.ip_read = function(object, fields, keys, returnFormat, docparid, callback) {\r\n\r\n\tvar payload = \r\n\t'<read>'+\r\n\t\tthis.xmlNode('object', object)+\r\n\t\tthis.xmlNode('fields', fields)+\r\n\t\tthis.xmlNode('keys', keys)+\r\n\t\tthis.xmlNode('returnFormat', returnFormat)+\r\n\t\tthis.xmlNode('docparid', docparid)+\r\n\t'</read>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n/**\r\n * readByName API\r\n */\r\nAPI_Internal_Session.prototype.ip_readByName = function(object, fields, keys, returnFormat, callback) {\r\n\r\n\tvar payload = \r\n\t'<readByName>'+\r\n\t\tthis.xmlNode('object', object)+\r\n\t\tthis.xmlNode('fields', fields)+\r\n\t\tthis.xmlNode('keys', keys)+\r\n\t\tthis.xmlNode('returnFormat', returnFormat)+\r\n\t'</readByName>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n/**\r\n * readByQuery API\r\n * \r\n *  returnPromise : Function will optionally return a Promise.  In this event, any passed callback is ignored, and the user is not presented with any error message.\r\n */\r\nAPI_Internal_Session.prototype.ip_readByQuery = function (object, fields, query, pagesize, returnFormat, callback, returnPromise, docparid) {\r\n\r\n\ttry {\r\n\r\n\t\tvar payload =\r\n\t\t\t'<readByQuery>' +\r\n\t\t\tthis.xmlNode('object', object) +\r\n\t\t\tthis.xmlNode('fields', fields) +\r\n\t\t\tthis.xmlNode('query', query) +\r\n\t\t\tthis.xmlNode('pagesize', pagesize) +\r\n\t\t\tthis.xmlNode('returnFormat', returnFormat);\r\n\r\n\r\n\t\tif (docparid != undefined) {\r\n\t\t\tpayload += this.xmlNode('docparid', docparid);\r\n\t\t}\r\n\r\n\t\tpayload += '</readByQuery>';\r\n\r\n\t\tif (returnPromise) {\r\n\t\t\treturn this.sendRequestWithPromise(payload);\r\n\t\t}\r\n\t\telse {\r\n\t\t\tthis.sendRequest(payload, callback);\r\n\t\t}\r\n\t}\r\n\tcatch (ex) {\r\n\t\tif (returnPromise) { return jq.Deferred().reject(ex); } else { throw ex; }\r\n\t}\r\n};\r\n\r\n/**\r\n * readView API\r\n */\r\nAPI_Internal_Session.prototype.ip_readView = function(view, filters, pagesize, returnFormat, callback) {\r\n\r\n    var payload =\r\n        '<readView>'+\r\n            this.xmlNode('view', view)+\r\n            ( pagesize != null ? this.xmlNode('pagesize', pagesize) : '' ) +\r\n            ( returnFormat != null ? this.xmlNode('returnFormat', returnFormat) : '' ) +\r\n            ( filters != null ? this.processFields( { filters: filters} ) : '' ) +\r\n            '</readView>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n\r\n/**\r\n * readMore API\r\n */\r\nAPI_Internal_Session.prototype.ip_readMore = function(object, callback, type) {\r\n\r\n\tvar payload =\r\n\t'<readMore>'+\r\n\t\tthis.xmlNode(type == null ? 'object' : type, object)+\r\n\t'</readMore>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n/**\r\n * readMoreObject API\r\n */\r\nAPI_Internal_Session.prototype.ip_readMoreObject = function(object, callback)\r\n{\r\n    this.ip_readMore(object, callback, 'object');\r\n}\r\n\r\n/**\r\n * readMoreView API\r\n */\r\nAPI_Internal_Session.prototype.ip_readMoreView = function(view, callback)\r\n{\r\n    this.ip_readMore(view, callback, 'view');\r\n}\r\n\r\n/**\r\n * readRelated API\r\n */\r\nAPI_Internal_Session.prototype.ip_readRelated = function(object, keys, relation, fields, returnFormat, callback) {\r\n\r\n\tvar payload = \r\n\t'<readRelated>'+\r\n\t\tthis.xmlNode('object', object)+\r\n\t\tthis.xmlNode('keys', keys)+\r\n\t\tthis.xmlNode('relation', relation)+\r\n\t\tthis.xmlNode('fields', fields)+\r\n\t\tthis.xmlNode('returnFormat', returnFormat)+\r\n\t'</readRelated>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n\r\n/**\r\n * create API (uses object name and array of parameters)\r\n */\r\nAPI_Internal_Session.prototype.ip_create = function(object, fieldsArray, callback) {\r\n\r\n\tvar payload = '<create><'+object+'>';\r\n\tpayload += this.processFields(fieldsArray);\r\n\tpayload += '</'+object+'></create>';\r\n\r\n    this.sendRequest(payload, callback);\r\n};\r\n\r\n/**\r\n * create API (uses XML payload)\r\n */\r\nAPI_Internal_Session.prototype.ip_createXML = function(xmlPayload, callback) {\r\n\r\n\tvar payload = \r\n\t'<create>'+xmlPayload+'</create>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n\r\n/**\r\n * update API (uses object name and array of parameters)\r\n */\r\nAPI_Internal_Session.prototype.ip_update = function(object, fieldsArray, callback) {\r\n\r\n\tvar payload = '<update><'+object+'>';\r\n\tpayload += this.processFields(fieldsArray);\r\n\tpayload += '</'+object+'></update>';\r\n\r\n    this.sendRequest(payload, callback);\r\n};\r\n\r\n\r\n/**\r\n * update API (uses XML payload)\r\n */\r\nAPI_Internal_Session.prototype.ip_updateXML = function(xmlPayload, callback) {\r\n\r\n\tvar payload = \r\n\t'<update>'+xmlPayload+'</update>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n\r\n/**\r\n * delete API\r\n */\r\nAPI_Internal_Session.prototype.ip_delete = function(object, keys, callback) {\r\n\r\n\tvar payload = \r\n\t'<delete>'+\r\n\t\tthis.xmlNode('object', object)+\r\n\t\tthis.xmlNode('keys', keys)+\r\n\t'</delete>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n\r\n/**\r\n * inspect API\r\n */\r\nAPI_Internal_Session.prototype.ip_inspect = function(object, detail, callback) {\r\n\r\n\tvar payload = \r\n\t(detail ? '<inspect detail=\"1\">' : '<inspect>')+\r\n\t\tthis.xmlNode('object', object)+\r\n\t'</inspect>';\r\n\r\n    this.sendRequest(payload, callback);\r\n}\r\n\r\n\r\n//----------------------------------\r\n//  Internal implementation - do not expose to users\r\n//----------------------------------\r\n\r\n/**\r\n * Create XMLHttpRequest instance\r\n */\r\nAPI_Internal_Session.prototype.getXMLHTTPRequest = function() {\r\n\tvar xreq = false;\r\n\tif (window.XMLHttpRequest) {\r\n\t\txreq = new XMLHttpRequest();\r\n\t}\r\n\telse if (typeof ActiveXObject != \"undefined\") {\r\n\t\ttry {\r\n\t\t\txreq = new ActiveXObject(\"Msxml2.XMLHTTP\");\r\n\t      \t} catch(e) {\r\n\t\t\ttry {\r\n\t\t\t\txreq = new ActiveXObject(\"Microsoft.XMLHTTP\");\r\n\t\t\t} catch(e) {\r\n\t\t\t\txreq = false;\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\treturn xreq;\r\n}\r\n\r\n/**\r\n * XML encode string\r\n */\r\nAPI_Internal_Session.prototype.xmlEncode = function(str) {\r\n\tif (!str)\r\n\t\treturn '';\r\n\tstr = String(str);\r\n\treturn str.replace(/\\&/g,'&'+'amp;').replace(/</g,'&'+'lt;').replace(/>/g,'&'+'gt;').replace(/\\'/g,'&'+'apos;').replace(/\\\"/g,'&'+'quot;');\r\n}\r\n\r\n/**\r\n * XML node as string\r\n */\r\nAPI_Internal_Session.prototype.xmlNode = function(name, value) {\r\n\tif (!name)\r\n\t\treturn '';\r\n\treturn '<'+name+'>'+this.xmlEncode(value)+'</'+name+'>';\r\n}\r\n\r\n/**\r\n * Get header of XML request\r\n */\r\nAPI_Internal_Session.prototype.getRecHeader = function() {\r\n\tvar buff = '<?xml version=\"1.0\" encoding=\"UTF-8\"?><request>';\r\n\t\r\n\tbuff += '<control><senderid>'+this.xmlEncode(this.senderid)+\r\n\t\t'</senderid><password>'+this.xmlEncode(this.senderpwd)+'</password><controlid>'+this.xmlEncode(this.controlid)+'</controlid>'+\r\n\t\t'<uniqueid>'+this.xmlEncode(this.uniqueid)+'</uniqueid><dtdversion>'+this.xmlEncode(this.dtdversion)+'</dtdversion></control>';\r\n\r\n\tbuff += '<operation>';\r\n\t\r\n\tbuff += '<authentication>';\r\n\tif (this.sessionid) {\r\n\t\tbuff += this.xmlNode('sessionid', this.sessionid);\r\n\t}\r\n\telse {\r\n\t\tbuff += '<login>';\r\n\t\tbuff += this.xmlNode('userid', this.userid);\r\n\t\tbuff += this.xmlNode('companyid', this.companyid);\r\n\t\tbuff += this.xmlNode('password', this.password);\r\n\t\tif (this.clientid)\r\n\t\t\tbuff += this.xmlNode('clientid', this.clientid);\r\n\t\tif (this.locationid)\r\n\t\t\tbuff += this.xmlNode('locationid', this.locationid);\r\n\t\tbuff += '</login>';\r\n\t}\r\n\tbuff += '</authentication>';\r\n\r\n\tbuff += '<content><function controlid=\"'+this.xmlEncode(this.controlid)+'\">';\r\n\t\r\n\treturn buff;\r\n}\r\n\r\n/**\r\n * Get footer of XML request\r\n */\r\nAPI_Internal_Session.prototype.getRecFooter = function() {\r\n\tvar buff = '</function></content>';\r\n\tbuff += '</operation></request>';\r\n\r\n\treturn buff;\r\n}\r\n\r\n/**\r\n * Send AJAX request\r\n */\r\nAPI_Internal_Session.prototype.sendRequest = function(payload, callback) {\r\n\tvar xmlDoc = this.getRecHeader()+payload+this.getRecFooter();\r\n\tthis.lastRequest = xmlDoc;\r\n\r\n\tvar xRequest = this.getXMLHTTPRequest();\r\n\tif (!xRequest)\r\n\t\t// I18N: TODO\r\n\t\tthrow \"Cannot create XMLHTTPRequest\";\r\n\t\r\n\tvar errProc = this.checkError;\r\n\tvar errCallback = (this.errorProc ? this.errorProc :  function(errMessage) { alert(GT(\"IA.ERROR\")+\": \"+errMessage); } );\r\n\t\r\n\txRequest.onreadystatechange = function() {\r\n\t\tif (xRequest.readyState == READY_STATE_COMPLETE) {\r\n\t\t\tif (errProc(xRequest.responseText, errCallback))\r\n\t\t\t\treturn;\r\n\t\t\tif (callback)\r\n\t\t\t\tcallback(xRequest.responseText);\r\n\t\t}\r\n\t};\r\n\r\n\tvar url = this.ajaxURL;\r\n\txRequest.open('POST', url, false);\r\n\tvar encodedDoc = 'xmlrequest=' + encodeURIComponent(xmlDoc);\r\n\txRequest.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded\");\r\n\txRequest.setRequestHeader(\"Content-length\", encodedDoc.length);\r\n\txRequest.setRequestHeader(\"Connection\", \"close\");\r\n\txRequest.send(encodedDoc);\r\n}\r\n\r\n/**\r\n * Send AJAX request\r\n * This is the modified function which returns a Promise.\r\n * The promise will resolve with a Javascript object, or reject with an error message text string.\r\n * NOTE: This function expects that the request was sent with a returnFormat of 'json'\r\n * \r\n * NOTES USING MULTIPLE FUNCTIONS\r\n * There are different places to apply a function tag.  Where the function tag is applied determines which operations fail/succeed when an API call is *not* wrapped in a transaction.\r\n * The functionTagPlacement parameter is only valid when a payload array is passed.  If the payload object is not an array, the \"header\" value (see below) will be used.\r\n *\t\tfunctionTagPlacement ==> \r\n *\t\t\t\"header\" : This is the default setting in the absence of a value when an XML string is passed for the payload.  A function tag will be placed outside of the supplied payload.  This requires that the XML payload is wrapped in a single function type (i.e. create, update).  If the XML payload has multiple function types, the call will fail.\r\n *\t\t\t\"content\" : This is the default setting in the absence of a value when an array is passed as the payload. A function tag will be placed outside of each payload item in the supplied array.  The implications are that if one operation fails in a payload item, other payload items can still succeed (though only if useTransaction is set to false)\r\n *\t\t\t\"none\" : No function tags will be added.  It is expected that the payload will already have function tags supplied.\r\n */\r\nAPI_Internal_Session.prototype.sendRequestWithPromise = function (payload, useTransaction, functionTagPlacement, skipErrorChecking) {\r\n\r\n\t// 0. Define selfip_create\r\n\tvar self = this;\r\n\r\n\t// A. Create deferred object\r\n\t// var dfd = jq.Deferred();\r\n\r\n\t// B. Handle if multiple functions are being called\r\n\tif (Array.isArray(payload)) {\r\n\r\n\t\t// i. Determine function tag settings\r\n\t\tvar excludeHeaderFunctionTag = functionTagPlacement != \"header\"; // This will make it so that the only way to INCLUDE a header tag is to specifically request it.\r\n\t\tvar excludeContentFunctionTag = functionTagPlacement == \"header\" || functionTagPlacement == \"none\"; // This will make it such that the only way to EXCLUDE a fuction tag from the header is if either of these are specifically set.\r\n\r\n\t\tvar usingMultipleFunctions = true;\r\n\r\n\t\tvar xmlDoc = this.getRecHeader(useTransaction, excludeHeaderFunctionTag) + this.getRecContent(payload, excludeContentFunctionTag) + this.getRecFooter(excludeHeaderFunctionTag);\r\n\t}\r\n\telse {\r\n\r\n\t\t// i. Determine function tag settings\r\n\t\tvar excludeHeaderFunctionTag = functionTagPlacement == \"content\" || functionTagPlacement == \"none\"; // This will make it such that the only way to EXCLUDE a fuction tag from the header is if either of these are specifically set.\r\n\r\n\t\tvar xmlDoc = this.getRecHeader(useTransaction, excludeHeaderFunctionTag) + payload + this.getRecFooter(excludeHeaderFunctionTag);\r\n\t}\r\n\r\n\tthis.lastRequest = xmlDoc;\r\n\r\n\tvar xRequest = this.getXMLHTTPRequest();\r\n\tif (!xRequest)\r\n\t\tthrow \"Cannot create XMLHTTPRequest\";\r\n\r\n\t// xRequest.onreadystatechange = function () {\r\n\t\t\r\n\t// };\r\n\r\n\tvar url = this.ajaxURL;\r\n\txRequest.open('POST', url, false);\r\n\tvar encodedDoc = 'xmlrequest=' + encodeURIComponent(xmlDoc);\r\n\txRequest.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded\");\r\n\t//xRequest.setRequestHeader(\"Content-length\", encodedDoc.length);\r\n\t//xRequest.setRequestHeader(\"Connection\", \"close\");\r\n\txRequest.send(encodedDoc);\r\n\r\n\t// Z. Return Promise\r\n\t// return dfd.promise();\r\n\tif (xRequest.readyState == READY_STATE_COMPLETE) {\r\n\r\n\t\t// ===> TO-DO : FIGURE OUT BEST WAY TO HANDLE SUCCESS/FAILURE, SINCE THIS FUNCTION WILL ALSO RECEIVE JSON RESPONSES WITH DATA\r\n\r\n\t\t// a. Check if an error was returned\r\n\t\tvar err = null;\r\n\t\tif (skipErrorChecking == false || skipErrorChecking == undefined) {\r\n\t\t\terr = self.getErrorMessage(xRequest.responseText);\r\n\t\t}\r\n\r\n\t\t// b. Reject if error\r\n\t\tif (err != null) { return {type: \"error\", message: err }; }\r\n\r\n\t\t// c. Otherwise resolve\r\n\t\telse {\r\n\r\n\t\t\t// i. Try to parse XML to json\r\n\t\t\tvar json = _xml2json_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].parse(xRequest.responseText);\r\n\r\n\t\t\t// ii. If it can't be parsed, it means its not XML, and is presumably a JSON string.  Parse to JSON object.\r\n\t\t\tif (json == null) {\r\n\t\t\t\tjson = JSON.parse(xRequest.responseText);\r\n\t\t\t}\r\n\r\n\t\t\t// iii. Inspect for possible error response // as alternative to try/catch verify if '(json.response.operation.result.status)' exists?\r\n\t\t\tif (skipErrorChecking == false || skipErrorChecking == undefined) {\r\n\t\t\t\ttry {\r\n\t\t\t\t\tif (!Array.isArray(json.response.operation.result)) {\r\n\t\t\t\t\t\tif (json.response.operation.result.status == \"failure\") { return \"Unknown error occurred contacting Intacct on function\"; }\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t\tcatch (e) {\r\n\t\t\t\t\t// do nothing\r\n\t\t\t\t}\r\n\t\t\t}\r\n\r\n\t\t\t// iii. Resolve json response\r\n\t\t\treturn {type: \"success\", message: json };\r\n\t\t}\r\n\t}\r\n};\r\n\r\nAPI_Internal_Session.prototype.getErrorMessage = function (responseText) {\r\n\r\n\tthis.lastResponse = new String(responseText);\t// Store for future use.\r\n\r\n\tvar errNode = util_getXmlNodeText(responseText, 'errormessage');\r\n\tif (!errNode)\r\n\t\treturn null;\r\n\r\n\t// If this point is reached, there is an error\r\n\r\n\t// b. Define error variables\r\n\tvar desc1; var desc2; var corr; var errorNo;\r\n\r\n\t// a. Parse XML\r\n\tparser = new DOMParser();\r\n\txmlDoc = parser.parseFromString(responseText, \"text/xml\");\r\n\r\n\t// b. Get nodes with \"error\" (this will return an HTML Collection)\r\n\tvar errorNodes = xmlDoc.getElementsByTagName(\"error\");\r\n\r\n\t// c. Convert HTML Collection to an error\r\n\tvar errors = Array.from(errorNodes);\r\n\r\n\t// d. If there are multiple errors, alert user\r\n\tvar multipleErrors = errors.length > 1 ? \"Multiple errors exist - the first one is being presented\\n\" : \"\";\r\n\r\n\t// e. Parse error to Json Array\r\n\tvar jsonErrorArray = new Array();\r\n\r\n\t// i. Loop through each error element\r\n\terrors.forEach((errorElement, index) => {\r\n\r\n\t\t// ii. If the error element has children (which it should), loop through to create the error object\r\n\t\tif (errorElement.children != undefined) {\r\n\r\n\t\t\t// iii. Fill error object\r\n\t\t\tvar errorObject = {};\r\n\t\t\tfor (var i = 0; i < errorElement.children.length; i++) {\r\n\t\t\t\terrorObject[errorElement.children[i].tagName] = errorElement.children[i].textContent;\r\n\t\t\t}\r\n\r\n\t\t\t// iv. Add error object to jsonErrorArray\r\n\t\t\tjsonErrorArray.push(errorObject);\r\n\t\t}\r\n\r\n\t\t// Important : The property names 'description', 'description2', 'correction', and 'errorno' are expected to be returned in the Intacct XML error response.\r\n\t\t//\t\t\t   If Intacct changes these names, you will need to modify this code.\r\n\t\tdesc1 = jsonErrorArray[0].description; desc2 = jsonErrorArray[0].description2; corr = jsonErrorArray[0].correction; errorNo = jsonErrorArray[0].errorno;\r\n\t});\r\n\r\n\t// ==> Logger\r\n\tif (this.logger != null) {\r\n\r\n\t\t// NOTE: FOR INTACCT ERRORS, YOU ARE LOGGING AS A NORMAL ENTRY AND HANDLING FORMATTING HERE\r\n\t\tthis.logger.writeEntry(\"ERROR => Intacct API Errors Occurred (\" + jsonErrorArray.length + \" Total) :\");\r\n\t\tjsonErrorArray.forEach((element, index) => {\r\n\t\t\tvar errorCount = index + 1;\r\n\t\t\tthis.logger.writeEntry(\"-- Intacct Error #\" + errorCount + \" --\");\r\n\t\t\tthis.logger.writeEntry(\"desc: \" + element.description); this.logger.writeEntry(\"desc2: \" + element.description2); this.logger.writeEntry(\"corr: \" + element.correction); this.logger.writeEntry(\"errno: \" + element.errorno);\r\n\t\t\tthis.logger.addError(\"desc: \" + element.description + \" | \" + \"desc2: \" + element.description2 + \" | \" + \"corr: \" + element.correction + \" | \" + \"errno: \" + element.errorno);\r\n\t\t});\r\n\t}\r\n\r\n\t// var desc1 = util_getXmlNodeText(errNode, 'description');\r\n\t// var desc2 = util_getXmlNodeText(errNode, 'description2');\r\n\t// var corr = util_getXmlNodeText(errNode, 'correction');\r\n\r\n\tif (!desc1 && !desc2 && !corr) {\r\n\t\tmessage = errNode;\r\n\t} else {\r\n\t\tmessage = \"\";\r\n\t\tif (multipleErrors) message = message + multipleErrors + \"\\n\";\r\n\t\tif (desc1) message = message + desc1 + \"\\n\\n\";\r\n\t\tif (desc2) message = message + desc2 + \"\\n\\n\";\r\n\t\tif (corr) message = message + corr + \"\\n\\n\";\r\n\t}\r\n\r\n\tvar txt = document.createElement(\"textarea\");\r\n\ttxt.innerHTML = message;\r\n\r\n\treturn txt.value.trim();\r\n};\r\n\r\n\r\n/**\r\n * Process error returned by API call.\r\n * Cannot use instance variables.\r\n */\r\nAPI_Internal_Session.prototype.checkError = function(responseText, errCallback) {\r\n\tthis.lastResponse = new String(responseText);\t// Store for future use\r\n\t\r\n\tvar errNode = util_getXmlNodeText(responseText, 'errormessage');\r\n\tif (!errNode)\r\n\t\treturn false;\r\n\r\n    var desc1 = util_getXmlNodeText(errNode, 'description');\r\n    var desc2 = util_getXmlNodeText(errNode, 'description2');\r\n    var corr = util_getXmlNodeText(errNode, 'correction');\r\n\r\n    if (!desc1 && !desc2 && !corr) {\r\n        message = errNode;\r\n    } else {\r\n        message = \"\";\r\n        if (desc1) message = message + desc1 + \"\\n\\n\";\r\n        if (desc2) message = message + desc2 + \"\\n\\n\";\r\n        if (corr) message = message + corr + \"\\n\\n\";\r\n\t}\r\n\r\n    var txt = document.createElement(\"textarea\");\r\n    txt.innerHTML = message;\r\n\r\n\tif (errCallback)\r\n\t\terrCallback(txt.value.trim());\r\n\treturn true;\r\n}\r\n\r\n\r\n/**\r\n * Recursively add fields to XML (fields can be nested)\r\n */\r\nAPI_Internal_Session.prototype.processFields = function(fieldsArray)\r\n{\r\n    var buff = '';\r\n    if ( fieldsArray instanceof Array ) {\r\n        for( var key = 0 ; key < fieldsArray.length; key++ ) {\r\n            buff += this.processOneField(fieldsArray, key);\r\n        }\r\n    } else {\r\n        for(var key in fieldsArray) {\r\n            buff += this.processOneField(fieldsArray, key);\r\n        }\r\n    }\r\n\r\n    return buff;\r\n}\r\n\r\n/**\r\n * Recursively add one field to XML (fields can be nested)\r\n */\r\nAPI_Internal_Session.prototype.processOneField = function(fieldsArray, key)\r\n{\r\n    var buff = '';\r\n    var fieldName = key;\r\n    var isArray = fieldsArray instanceof Array;\r\n    var fieldValue = fieldsArray[key];\r\n    var fieldType = typeof fieldValue;\r\n    if (fieldValue==null) {\r\n        return buff;\r\n    }\r\n    if (fieldType=='object' || fieldType=='array') {\r\n        if ( isArray ) {\r\n            buff += this.processFields(fieldValue);\r\n        } else {\r\n            buff += '<'+fieldName+'>'+this.processFields(fieldValue)+'</'+fieldName+'>';\r\n        }\r\n    }\r\n    else {\r\n        buff += this.xmlNode(fieldName, fieldValue);\r\n    }\r\n\r\n    return buff;\r\n}\r\n\r\n\r\n/**\r\n * Extract content of XML node as text.\r\n * Static function, not a class member.\r\n */\r\nfunction util_getXmlNodeText(xmlText, nodeName) {\r\n\tif (!xmlText)\r\n\t\treturn null;\r\n\tvar ind1 = xmlText.indexOf('<'+nodeName+'>');\r\n\tif (ind1 < 0)\r\n\t\treturn null;\r\n\tind1 += 2+nodeName.length;\r\n\tvar ind2 = xmlText.indexOf('</'+nodeName+'>', ind1);\r\n\tif (ind2 < 0)\r\n\t\treturn null;\r\n\treturn xmlText.substring(ind1, ind2);\r\n}\r\n\r\n// Make this function accessible after minification\r\nwindow.API_Internal_Session = API_Internal_Session;\r\n\n\n//# sourceURL=webpack://api_internal_session/./src/index.js?");

/***/ }),

/***/ "./src/xml2json.js":
/*!*************************!*\
  !*** ./src/xml2json.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n﻿/**\r\n* Object to convert XML into a structured JSON object\r\n*\r\n* @method xmlToJson\r\n* @returns {Object}\r\n*/\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function() {\r\n\r\n    /**\r\n    * Object assign is required, so ensure that browsers know how to execute this method\r\n    *\r\n    * @method Object.assign\r\n    * @returns {Function}\r\n    */\r\n    if (typeof Object.assign != 'function') {\r\n        // Must be writable: true, enumerable: false, configurable: true\r\n        Object.defineProperty(Object, \"assign\", {\r\n            value: function assign(target, varArgs) { // .length of function is 2\r\n                'use strict';\r\n                if (target == null) { // TypeError if undefined or null\r\n                    throw new TypeError('Cannot convert undefined or null to object');\r\n                }\r\n\r\n                var to = Object(target);\r\n\r\n                for (var index = 1; index < arguments.length; index++) {\r\n                    var nextSource = arguments[index];\r\n\r\n                    if (nextSource != null) { // Skip over if undefined or null\r\n                        for (var nextKey in nextSource) {\r\n                            // Avoid bugs when hasOwnProperty is shadowed\r\n                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {\r\n                                to[nextKey] = nextSource[nextKey];\r\n                            }\r\n                        }\r\n                    }\r\n                }\r\n                return to;\r\n            },\r\n            writable: true,\r\n            configurable: true\r\n        });\r\n    }\r\n\r\n    var api = {};  // Use an object to store methods\r\n\r\n\r\n    /**\r\n    * Adds an object value to a parent object\r\n    *\r\n    * @method addToParent\r\n    * @param {Object} parent\r\n    * @param {String} nodeName\r\n    * @param {Mixed} obj\r\n    * @returns none\r\n    */\r\n    api.addToParent = function (parent, nodeName, obj) {\r\n        // If this is the first or only instance of the node name, assign it as\r\n        // an object on the parent.\r\n        if (!parent[nodeName]) {\r\n\r\n            parent[nodeName] = obj;\r\n        }\r\n        // Else the parent knows about other nodes of the same name\r\n        else {\r\n            // If the parent has a property with the node name, but it is not an array,\r\n            // store the contents of that property, convert the property to an array, and\r\n            // assign what was formerly an object on the parent to the first member of the\r\n            // array\r\n            if (!Array.isArray(parent[nodeName])) {\r\n                var tmp = parent[nodeName];\r\n                parent[nodeName] = [];\r\n                parent[nodeName].push(tmp);\r\n            }\r\n\r\n            // Push the current object to the collection\r\n            parent[nodeName].push(obj);\r\n        }\r\n    };\r\n\r\n\r\n\r\n\r\n    api.convertXMLStringToDoc = function (str) {\r\n        var xmlDoc = null;\r\n\r\n        if (str && typeof str === 'string') {\r\n\r\n            // Create a DOMParser\r\n            var parser = new DOMParser();\r\n\r\n            xmlDoc = parser.parseFromString(str, 'application/xml');\r\n\r\n        }\r\n\r\n        return xmlDoc;\r\n    }\r\n\r\n\r\n    /**\r\n    * Validates if an data is an XMLDocument\r\n    *\r\n    * @method isXML\r\n    * @param {Mixed} data\r\n    * @returns {Boolean}\r\n    */\r\n    api.isXML = function (data) {\r\n        var documentElement = (data ? data.ownerDocument || data : 0).documentElement;\r\n\r\n        return documentElement ? documentElement.nodeName.toLowerCase() !== 'html' : false;\r\n    };\r\n\r\n\r\n    /**\r\n    * Reads through a node's attributes and assigns the values to a new object\r\n    *\r\n    * @method parseAttributes\r\n    * @param {XMLNode} node\r\n    * @returns {Object}\r\n    */\r\n    api.parseAttributes = function (node) {\r\n        var attributes = node.attributes,\r\n            obj = {};\r\n\r\n        // If the node has attributes, assign the new object properties\r\n        // corresponding to each attribute\r\n        if (node.hasAttributes()) {\r\n            for (var i = 0; i < attributes.length; i++) {\r\n                obj[attributes[i].name] = api.parseValue(attributes[i].value);\r\n            }\r\n        }\r\n\r\n        // return the new object\r\n        return obj;\r\n    };\r\n\r\n\r\n    /**\r\n    * Rips through child nodes and parses them\r\n    *\r\n    * @method parseChildren\r\n    * @param {Object} parent\r\n    * @param {XMLNodeMap} childNodes\r\n    * @returns none\r\n    */\r\n    api.parseChildren = function (parent, childNodes) {\r\n        // If there are child nodes...\r\n        if (childNodes.length > 0) {\r\n            // Loop over all the child nodes\r\n            for (var i = 0; i < childNodes.length; i++) {\r\n                // If the child node is a XMLNode, parse the node\r\n                if (childNodes[i].nodeType == 1) {\r\n                    api.parseNode(parent, childNodes[i]);\r\n                }\r\n            }\r\n        }\r\n    };\r\n\r\n\r\n    /**\r\n    * Converts a node into an object with properties\r\n    *\r\n    * @method parseNode\r\n    * @param {Object} parent\r\n    * @param {XMLNode} node\r\n    * @returns {Object}\r\n    */\r\n    api.parseNode = function (parent, node) {\r\n        var nodeName = node.nodeName,\r\n            obj = Object.assign({}, api.parseAttributes(node)),\r\n            tmp = null;\r\n\r\n        // If there is only one text child node, there is no need to process the children\r\n        if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {\r\n            // If the node has attributes, then the object will already have properties.\r\n            // Add a new property 'text' with the value of the text content\r\n            if (node.hasAttributes()) {\r\n                obj['text'] = api.parseValue(node.childNodes[0].nodeValue);\r\n            }\r\n            // If there are no attributes, then the parent[nodeName] property value is\r\n            // simply the interpreted textual content\r\n            else {\r\n                obj = api.parseValue(node.childNodes[0].nodeValue);\r\n            }\r\n        }\r\n        // Otherwise, there are child XMLNode elements, so process them\r\n        else {\r\n            api.parseChildren(obj, node.childNodes);\r\n        }\r\n\r\n        // Once the object has been processed, add it to the parent\r\n        api.addToParent(parent, nodeName, obj)\r\n\r\n        // Return the parent\r\n        return parent;\r\n    };\r\n\r\n\r\n    /**\r\n    * Interprets a value and converts it to Boolean, Number or String based on content\r\n    *\r\n    * @method parseValue\r\n    * @param {Mixed} val\r\n    * @returns {Mixed}\r\n    */\r\n    api.parseValue = function (val) {\r\n\r\n        // Justin's notes:\r\n        // A string with a leading zero (such as a zip code) will be converted to a number with the leading zero stripped.\r\n        // Any non-zero length string that starts with a zero is always treated to be not-a-number.\r\n        if (val.charAt(0) == \"0\") {\r\n            var num = NaN;\r\n        }\r\n        else {\r\n            // Create a numeric value from the passed parameter\r\n            var num = Number(val);\r\n        }\r\n\r\n\r\n        // If the value is 'true' or 'false', parse it as a Boolean and return it\r\n        if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {\r\n            return (val.toLowerCase() == 'true');\r\n        }\r\n\r\n        // If the num parsed to a Number, return the numeric value\r\n        // Else if the value passed has no length (an attribute without value) return null,\r\n        // Else return the param as is\r\n        return (isNaN(num)) ? val.trim() : (val.length == 0) ? null : num;\r\n    };\r\n\r\n    // Expose the API\r\n    return {\r\n        parse: function (xml) {\r\n            // Justin's Note: Firefox crashed when trying to run this function using a json string (rather than returning null as it should have)\r\n            // This function should only proceed when an error is thrown trying to parse.\r\n            var isJson = true;\r\n            try { JSON.parse(xml) }\r\n            catch (ex) {\r\n                isJson = false;\r\n            }\r\n            if (isJson) { return null; }\r\n\r\n            if (xml && typeof xml === 'string') {\r\n                xml = api.convertXMLStringToDoc(xml);\r\n            }\r\n\r\n            // ==> Added by Justin : 4/19/2022\r\n            //     The original version of this library will return an empty object for all empty xml tags.  This is not preferrable.\r\n            //     This function will remove all object properties for empty xml tags.  You could alternately set default values rather than delete the property.\r\n            var remove_empty = function (target) {\r\n                Object.keys(target).map(function (key) {\r\n                    if (target[key] instanceof Object) {\r\n                        if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {\r\n                            delete target[key];\r\n                        } else {\r\n                            remove_empty(target[key]);\r\n                        }\r\n                    } else if (target[key] === null) {\r\n                        delete target[key];\r\n                    }\r\n                });\r\n                return target;\r\n            };\r\n\r\n            return (xml && api.isXML(xml)) ? remove_empty(api.parseNode({}, xml.firstChild)) : null;\r\n        }\r\n    }\r\n}());\n\n//# sourceURL=webpack://api_internal_session/./src/xml2json.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;