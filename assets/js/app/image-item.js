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

function ImageItem(copy, filename, filetype, width, height, src, guid) {
	copy = copy || {};

	this.filename = copy.filename || filename || "UNKNOWN";
	this.filetype = copy.filetype || filetype || "UNKNOWN";
	this.width  = parseInt(copy.width  || width  || "0");
	this.height = parseInt(copy.height || height || "0");
	this.src  = copy.src  || src  || "";
	this.guid = copy.guid || guid || "00000000-0000-0000-0000-000000000000";

	this.read = function(obj) {
		var img = {};
		if(obj && Object.prototype.toString.call(obj) === "[object String]") {
			// read from JSON
			var img = $.parseJSON(obj);
		} else if(obj && obj.name) {
			// copy from another Options instance
			img = obj;
		}
	
		this.filename = $.trim(img.filename || this.filename);
		this.filetype = $.trim(img.filetype || this.filetype);
		this.width  = $.isNumeric(img.width)  ? img.width  : this.width;
		this.height = $.isNumeric(img.height) ? img.height : this.height;
		this.src  = img.src || "";
		this.guid = $.trim(img.guid || "00000000-0000-0000-0000-000000000000");
	};
	
	this.write = function() {
		return JSON.stringify(this, null, 2);
	};

	this.equals = function(obj1, obj2) {
		var result = false;

		if(obj1 == null && obj2 == null) {
			// treat two nulls as not equal
		} else if(obj1 && obj1.filenamename && obj2 == null) {
			// compare self values to obj1 values
			result = this.equals(this, obj1);
		} else if(obj1 && obj1.filename && obj2 && obj2.filename) {
			// compare obj1 values to obj2 values
			result = 
				$.trim(obj1.filename) === $.trim(obj2.filename) &&
				$.trim(obj1.filetype) === $.trim(obj2.filetype) &&
				$.trim(obj1.width) === $.trim(obj2.width) &&
				$.trim(obj1.height) === $.trim(obj2.height) &&
				$.trim(obj1.guid) === $.trim(obj2.guid) &&

				// TODO: consider whether this is needed - lots of data!
				$.trim(obj1.src) === $.trim(obj2.src);
		}

		return result;
	};
}
