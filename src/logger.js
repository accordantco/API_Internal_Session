// -------------------------------------------------------------------------------------------------------------------------------------//
// This is functionality related to logging
// -------------------------------------------------------------------------------------------------------------------------------------//

function Logger() {

    // Create array for new entries
    this.entries = new Array();

    // Create array for errors
    this.errors = new Array();

    // Line Separator
    this.lineSeparator = "--------------------------------------------------------------";
};

/**
 * Function returning boolean indicating if object has either entries or errors
 */
Logger.prototype.hasContent = function () { return this.errors.length > 0 || this.entries.length > 0 };

// Function returning boolean indicating if errors are present
Logger.prototype.hasErrors = function () { return this.errors.length > 0 };

// Function returning boolean indicating if entries are present
Logger.prototype.hasEntries = function () { return this.entries.length > 0 };

//  Function to add entry to errors array
Logger.prototype.addError = function (errorString) {
    if (this.errors.length != 0) { this.errors.push(this.lineSeparator + "\n"); }
    this.errors.push(errorString + "\n");
};

// Function to write to current line
Logger.prototype.write = function (line) {
    this.entries.push(line);
};

// Function to write normal entry line with a carriage return
Logger.prototype.writeEntry = function (line) {
    this.entries.push(line + "\n");
};

// Function to write error line with a carriage return
// Will also add error to 'errors' array
Logger.prototype.writeError = function (line) {
    this.entries.push("ERROR: " + line + "\n");
    this.addError(line);
};

// Clears existing log entries
Logger.prototype.reset = function () {
    this.entries = new Array();
    this.errors = new Array();
};

/**
 *  Function to write array to current line.
 * 
 * @param {any} array  Array to write
 * @param {any} separator Separator to use
 * @param {any} newLine Boolean indicating if this should include a carriage return
 */
Logger.prototype.writeArray = function (array, separator, newLine) {
    var line = array.join(separator)
    if (newLine) { line += "\n"; }
    this.entries.push(line);
};
