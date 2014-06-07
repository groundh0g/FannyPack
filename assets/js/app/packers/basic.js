/*
Copyright (c) 2014 Joseph B. Hall [@groundh0g]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var packers = packers || {};

function BasicPacker() {
	BasePacker.call(this, "Basic");
	var self = this;
	this.defaultSortBy = "HEIGHT_DESC";
	this.version = "0.1.0";

	// likely unused, but called for all packers before pack()
	// returns error message, or empty array on success
	// this might be useful for checking browser compatibility?
	this.init = function() { return []; };
	
	// accepts array of imagePool entities, and set of options from left sidebar
	// returns collection of imagePool keys with their location & rotation) within the sheet
	this.pack = function(images, options) { 
		return BasicPacker.doPack(images, options); 
	};
	
	// add this packer to the list of available packers
	this.register = function() {
		packers[self.name] = self;
	};
}

(new BasicPacker()).register();

BasicPacker.doPack = function(images, options) { 
	return {}; 
};
