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

function Options(copy) {
	copy = copy || {};

	this.name = copy.name || "Untitled";
	this.dataFormat = copy.dataFormat || "JSON";
	this.imageFormat = copy.imageFormat || "PNG";
	
	this.width = copy.width || 1024;
	this.height = copy.height || 1024;
	this.sizeMode = copy.sizeMode || "Max Size";
	this.constraint = copy.constraint || "Power of Two";
	this.forceSquare = copy.forceSquare || "No";
	this.includeAt2x = copy.includeAt2x || "No";
	
	this.doFixedSize = function() { return self.sizeMode === "Fixed Size"; };
	this.doForcePowOf2 = function() { return self.constraint === "Power of Two"; };
	this.doForceSquare = function() { return self.forceSquare === "Yes"; };
	this.doIncludeAt2x = function() { return self.doIncludeAt2x === "Yes"; };

	this.borderPadding = copy.borderPadding || 2;
	this.shapePadding = copy.shapePadding || 2;
	this.innerPadding = copy.innerPadding || 0;
	
	this.trimMode = copy.trimMode || "None";
	this.trimThreshold = copy.trimThreshold || 1;
	
	this.doTrim = function() { return self.trimMode === "Trim" && self.trimThreshold > 0; };
	
	this.read = function(obj) {
		var opts = {};
		if(obj && Object.prototype.toString.call(obj) === "[object String]") {
			// read from JSON
			var opts = $.parseJSON(obj);
		} else if(obj && obj.name) {
			// copy from another Options instance
			opts = obj;
		} else {
			// read from UI
			opts["name"] = $("#txtName").val();
			opts["dataFormat"]  = $("#ddlDataFormat").text();
			opts["imageFormat"] = $("#ddlImageFormat").text();

			opts["width"]  = parseInt($("#txtWidth").val(),10);
			opts["height"] = parseInt($("#txtHeight").val(),10);
			opts["sizeMode"]  = $("#ddlSizeMode").text();
			opts["constraint"]  = $("#ddlConstraint").text();
			opts["forceSquare"]  = $("#ddlForceSquare").text();
			opts["includeAt2x"]  = $("#ddlIncludeAt2x").text();
		
			opts["borderPadding"] = parseInt($("#txtBorderPadding").val(),10);
			opts["shapePadding"] = parseInt($("#txtShapePadding").val(),10);
			opts["innerPadding"] = parseInt($("#txtInnerPadding").val(),10);

			opts["trimMode"]  = $("#ddlTrimMode").text();
			opts["trimThreshold"] = parseInt($("#txtTrimThreshold").val(),10);
		}
	
		self.name = $.trim(opts.name || self.name);
		self.dataFormat = $.trim(opts.dataFormat || self.dataFormat);
		self.imageFormat = $.trim(opts.imageFormat || self.imageFormat);

		self.width = $.isNumeric(opts.width) ? opts.width : self.width;
		self.height = $.isNumeric(opts.height) ? opts.height : self.width;
		self.sizeMode = $.trim(opts.sizeMode || self.sizeMode);
		self.constraint = $.trim(opts.constraint || self.constraint);
		self.forceSquare = $.trim(opts.forceSquare || self.forceSquare);
		self.includeAt2x = $.trim(opts.includeAt2x || self.includeAt2x);

		self.borderPadding = $.isNumeric(opts.borderPadding) ? opts.borderPadding : self.borderPadding;
		self.shapePadding = $.isNumeric(opts.shapePadding) ? opts.shapePadding : self.shapePadding;
		self.innerPadding = $.isNumeric(opts.innerPadding) ? opts.innerPadding : self.innerPadding;

		self.trimMode = $.trim(opts.trimMode || self.trimMode);
		self.trimThreshold = $.isNumeric(opts.trimThreshold) ? opts.trimThreshold : self.trimThreshold;
	};
	
	this.write = function() {
		return JSON.stringify(self, null, 2);
	};

	this.updateUI = function() {
		// refresh UI
		$("#txtName").val(self["name"]);
		$("#ddlDataFormat").text(self["dataFormat"]);
		$("#ddlImageFormat").text(self["imageFormat"]);

		$("#txtWidth").val(self["width"]);
		$("#txtHeight").val(self["height"]);
		$("#ddlSizeMode").text(self["sizeMode"]);
		$("#ddlConstraint").text(self["constraint"]);
		$("#ddlForceSquare").text(self["forceSquare"]);
		$("#ddlIncludeAt2x").text(self["includeAt2x"]);
	
		$("#txtBorderPadding").val(self["borderPadding"]);
		$("#txtShapePadding").val(self["shapePadding"]);
		$("#txtInnerPadding").val(self["innerPadding"]);

		$("#ddlTrimMode").text(self["trimMode"]);
		$("#txtTrimThreshold").val(self["trimThreshold"]);
	};
	
	this.equals = function(obj1, obj2) {
		var result = false;

		if(obj1 == null && obj2 == null) {
			// compare self values to UI values
			var opts = new Options();
			opts.read();
			result = self.equals(self, opts);
		} else if(obj1 && obj1.name && obj2 == null) {
			// compare self values to obj1 values
			result = self.equals(self, obj1);
		} else if(obj1 && obj1.name && obj2 && obj2.name) {
			// compare obj1 values to obj2 values
			result = 
				$.trim(obj1.name) === $.trim(obj2.name) &&
				$.trim(obj1.dataFormat) === $.trim(obj2.dataFormat) &&
				$.trim(obj1.imageFormat) === $.trim(obj2.imageFormat) &&

				$.trim(obj1.width) === $.trim(obj2.width) &&
				$.trim(obj1.height) === $.trim(obj2.height) &&
				$.trim(obj1.sizeMode) === $.trim(obj2.sizeMode) &&
				$.trim(obj1.constraint) === $.trim(obj2.constraint) &&
				$.trim(obj1.forceSquare) === $.trim(obj2.forceSquare) &&
				$.trim(obj1.includeAt2x) === $.trim(obj2.includeAt2x) &&

				$.trim(obj1.borderPadding) === $.trim(obj2.borderPadding) &&
				$.trim(obj1.shapePadding) === $.trim(obj2.shapePadding) &&
				$.trim(obj1.innerPadding) === $.trim(obj2.innerPadding) &&

				$.trim(obj1.trimMode) === $.trim(obj2.trimMode) &&
				$.trim(obj1.trimThreshold) === $.trim(obj2.trimThreshold);
		}

		return result;
	};
}
