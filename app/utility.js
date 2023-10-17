// -------------------------------------------------------------------------------------------------------------------------------------//
// JAVASCRIPT FILE PROVIDING GENERAL UTILITY FUNCTIONS
// -------------------------------------------------------------------------------------------------------------------------------------//

export var utility = {

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Formats a javascript date to YYYY-MM-DD
	// -------------------------------------------------------------------------------------------------------------------------------------//
	formatSQLDate: function (theDate) {
		var r = theDate.toISOString().slice(0, 10);
		return r;
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Formats a javascript date to MM-DD-YYYY
	// ==> This format is required in an api query string; note that Intacct queries require dates to be enclosed in single-quotes.
	// -------------------------------------------------------------------------------------------------------------------------------------//
	formatIntacctDate: function (theDate) {
		var r = theDate.getMonth() + 1 + '-' + theDate.getDate() + '-' + theDate.getFullYear();
		return r;
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Formats a javascript date to MM/DD/YYYY
	// ==> This format is required when creating a field on a record in a custom object
	// -------------------------------------------------------------------------------------------------------------------------------------//
	formatIntacctDateForApi: function (theDate) {
		var r = theDate.getMonth() + 1 + '/' + theDate.getDate() + '/' + theDate.getFullYear();
		return r;
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Returns an object with properties 'year', 'month', and 'day' for use with the Intacct JS Gateway
	// -------------------------------------------------------------------------------------------------------------------------------------//
	getApiDateObject: function (theDate) {
		var dateObject = { 'year': theDate.getFullYear(), 'month': theDate.getMonth() + 1, 'day': theDate.getDate() };
		return dateObject;
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Takes a value and returns it as its native format.
	// Note: This function has not been fully tested by me.
	// -------------------------------------------------------------------------------------------------------------------------------------//
	getValueFormatByType: function (value) {
		if (value === undefined || value === '') {
			return String();
		}
		//is Number
		let isNumber = !isNaN(value);
		if (isNumber) {
			return Number(value);
		}
		// is Boolean
		if (value === "true" || value === "false") {
			return JSON.parse(value.toLowerCase());
		}
		return String(value);
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Takes an Intacct response object and parses it to an object represent the submission results
	// -------------------------------------------------------------------------------------------------------------------------------------//
	parseIntacctResponseToArray: function (intacctResponse) {

		var x = [];

		// If array is returned, then two types of functions were executed (create / update)
		if (Array.isArray(intacctResponse.operation.result)) {
			$.each(intacctResponse.operation.result, function (index, value) {
				x.push(value);
			})
		}
		else {
			x.push(intacctResponse.operation.result);
		}

		return x;
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Creates a GUID
	// -------------------------------------------------------------------------------------------------------------------------------------//
	CreateGUID: function () {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Gets takes a Kendo Model and returns a csv string of the fields
	// -------------------------------------------------------------------------------------------------------------------------------------//
	getFieldsFromModel: function (kendoModel) {
		var x = kendoModel.fields;
		var y = Object.keys(x);
		var x = y.join(",");
		return y;
	},

	// -------------------------------------------------------------------------------------------------------------------------------------//
	// Takes an object in format {"justin.was.here":"andthere"} and returns {justin:{was:{here:there}}}
	// obj : The object to expand
	// caseConversion : Javascript variables are case-sensitive.  If a key value is not in the same casing, unique properties would
	//					expanded based on the case of the text.  If you convert to the same case, this problem is avoided.
	//				    Values: "lowercase" => lowercase; "uppercase" => Uppercase; anything else => do nothing
	// -------------------------------------------------------------------------------------------------------------------------------------//
	expandKeyDotNotation: function (obj, caseConversion) {

		parseDotNotation = function (str, val, obj) {

			var originalStr = str; // needed for delete operation

			if (caseConversion.toLowerCase() == "lowercase") {
				str = str.toLowerCase();
			}
			else if (caseConversion.toLowerCase() == "uppercase") {
				str = str.toUpperCase();
			}

			var currentObj = obj,
				keys = str.split("."),
				i, l = Math.max(1, keys.length - 1),
				key;

			for (i = 0; i < l; ++i) {
				key = keys[i];
				currentObj[key] = currentObj[key] || {};
				currentObj = currentObj[key];
			}

			currentObj[keys[i]] = val;
			delete obj[originalStr];
		};
		for (var key in obj) {
			if (key.indexOf(".") !== -1) {
				parseDotNotation(key, obj[key], obj);
			}
		}
		return obj;
	},

	extend: function (base, sub) {

		// approach from MDN
		sub.prototype = Object.create(base.prototype);
		sub.prototype.constructor = sub;

	},

	/**
	 * Returns letter corresponding to number
	 * 
	 * @param {any} i  Zero-based index into alphabet
	 */
	getAlphabet: function (i) {
		return (i >= 26 ? utility.getAlphabet(Math.floor(i / 26) - 1) : '') + 'abcdefghijklmnopqrstuvwxyz'[i % 26];
	},


	/**
	 * Replaces a text string in a property names for an object
	 * @param {any} object  The object whose properties to search
	 * @param {any} findText  The find text
	 * @param {any} replaceText  The replace text
	 */
	replaceCharacterInProperty: function (object, findText, replaceText) {

		for (var key in object) {
			if (key.indexOf(findText) !== -1) {

				let newProperty = key.replaceAll(findText, replaceText);
				let originalValue = object[key];

				delete object[key];
				object[newProperty] = originalValue;
			}
		}
	},

	/**
	 * Takes an array of values and returns a string representing values to be used in an IN query.
	 * If an empty array is passed, an empty IN fields value will be returned.  i.e. ('') in the case of a string.
	 * Typically the calling function will have logic to handle an empty array however.
	 * 
	 * @param {any} valueArray The array of values
	 * @param {any} isString Boolean indicating if the database being queried expects these to be strings
	 */
	getInFieldValues: function (valueArray, isString) {

		// i. Get join operator
		var joinOperator = isString ? "','" : ",";

		// ii. Join values
		var joinedValues = valueArray.join(joinOperator);
		if (isString) {
			joinedValues = "'" + joinedValues + "'";
		}

		// iii. Build final response
		var response = "(" + joinedValues + ")";

		// iv. Return
		return response;

	},
}