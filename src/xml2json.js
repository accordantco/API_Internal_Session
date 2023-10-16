/**
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
module.exports = {
    xmlToJson: xmlToJson,
};