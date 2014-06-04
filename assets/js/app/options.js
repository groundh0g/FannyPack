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
	
	this.spritePacker = copy.spritePacker || "Joe";
	this.sortBy = copy.sortBy || "AREA_DESC";
	
	this.width = copy.width || 1024;
	this.height = copy.height || 1024;
	this.sizeMode = copy.sizeMode || "Max Size";
	this.constraint = copy.constraint || "Power of Two";
	this.forceSquare = copy.forceSquare || "No";
	this.includeAt2x = copy.includeAt2x || "No";
	
	this.doFixedSize   = function() { return this.sizeMode === "Fixed Size"; };
	this.doForcePowOf2 = function() { return this.constraint === "Power of Two"; };
	this.doForceSquare = function() { return this.forceSquare === "Yes"; };
	this.doIncludeAt2x = function() { return this.doIncludeAt2x === "Yes"; };

	this.borderPadding = copy.borderPadding || 2;
	this.shapePadding = copy.shapePadding || 2;
	this.innerPadding = copy.innerPadding || 0;
	
	this.trimMode = copy.trimMode || "None";
	this.trimThreshold = copy.trimThreshold || 1;

	this.doTrim = function() { return this.trimMode === "Trim" && this.trimThreshold > 0; };
	
	this.animatedGif = copy.animatedGif || "Use First Frame";
	this.compressProject = copy.compressProject || "No";
	this.debugMode = copy.debugMode || "No";
	
	this.doAnimatedGifExpand = function() { return this.animatedGif === "Extract Frames"; };
	this.doCompressProject = function() { return this.compressProject === "Yes"; };
	this.doDebug = function() { return this.debugMode === "Yes"; };
	
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

			opts["spritePacker"]  = $("#ddlSpritePacker").text();
			opts["sortBy"]  = $("#ddlSortBy").text();
	
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

			opts["animatedGif"]  = $("#ddlAnimatedGif").text();
			opts["compressProject"]  = $("#ddlCompressProject").text();
			opts["debugMode"]  = $("#ddlDebugMode").text();
		}
	
		this.name = $.trim(opts.name || this.name);
		this.dataFormat = $.trim(opts.dataFormat || this.dataFormat);
		this.imageFormat = $.trim(opts.imageFormat || this.imageFormat);

		this.spritePacker = $.trim(opts.spritePacker || this.spritePacker);
		this.sortBy = $.trim(opts.sortBy || this.sortBy);

		this.width = $.isNumeric(opts.width) ? opts.width : this.width;
		this.height = $.isNumeric(opts.height) ? opts.height : this.width;
		this.sizeMode = $.trim(opts.sizeMode || this.sizeMode);
		this.constraint = $.trim(opts.constraint || this.constraint);
		this.forceSquare = $.trim(opts.forceSquare || this.forceSquare);
		this.includeAt2x = $.trim(opts.includeAt2x || this.includeAt2x);

		this.borderPadding = $.isNumeric(opts.borderPadding) ? opts.borderPadding : this.borderPadding;
		this.shapePadding  = $.isNumeric(opts.shapePadding) ? opts.shapePadding : this.shapePadding;
		this.innerPadding  = $.isNumeric(opts.innerPadding) ? opts.innerPadding : this.innerPadding;

		this.trimMode = $.trim(opts.trimMode || this.trimMode);
		this.trimThreshold = $.isNumeric(opts.trimThreshold) ? opts.trimThreshold : this.trimThreshold;
		
		this.animatedGif = $.trim(opts.animatedGif || this.animatedGif);
		this.compressProject = $.trim(opts.compressProject || this.compressProject);
		this.debugMode = $.trim(opts.debugMode || this.debugMode);
	};
	
	this.write = function() {
		return JSON.stringify(this, null, 2);
	};

	this.updateUI = function() {
		// refresh UI
		$("#txtName").val(this["name"]);
		$("#ddlDataFormat").text(this["dataFormat"]);
		$("#ddlImageFormat").text(this["imageFormat"]);

		$("#ddlSpritePacker").text(this["spritePacker"]);
		$("#ddlSortBy").text(this["sortBy"]);
		
		$("#txtWidth").val(this["width"]);
		$("#txtHeight").val(this["height"]);
		$("#ddlSizeMode").text(this["sizeMode"]);
		$("#ddlConstraint").text(this["constraint"]);
		$("#ddlForceSquare").text(this["forceSquare"]);
		$("#ddlIncludeAt2x").text(this["includeAt2x"]);
	
		$("#txtBorderPadding").val(this["borderPadding"]);
		$("#txtShapePadding").val(this["shapePadding"]);
		$("#txtInnerPadding").val(this["innerPadding"]);

		$("#ddlTrimMode").text(this["trimMode"]);
		$("#txtTrimThreshold").val(this["trimThreshold"]);

		$("#ddlAnimatedGif").text(this["animatedGif"]);
		$("#ddlCompressProject").text(this["compressProject"]);
		$("#ddlDebugMode").text(this["debugMode"]);
	};
	
	this.equals = function(obj1, obj2) {
		var result = false;

		if(obj1 == null && obj2 == null) {
			// compare self values to UI values
			var opts = new Options();
			opts.read();
			result = this.equals(this, opts);
		} else if(obj1 && obj1.name && obj2 == null) {
			// compare self values to obj1 values
			result = this.equals(this, obj1);
		} else if(obj1 && obj1.name && obj2 && obj2.name) {
			// compare obj1 values to obj2 values
			result = 
				$.trim(obj1.name) === $.trim(obj2.name) &&
				$.trim(obj1.dataFormat) === $.trim(obj2.dataFormat) &&
				$.trim(obj1.imageFormat) === $.trim(obj2.imageFormat) &&

				$.trim(obj1.spritePacker) === $.trim(obj2.spritePacker) &&
				$.trim(obj1.sortBy) === $.trim(obj2.sortBy) &&

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
				$.trim(obj1.trimThreshold) === $.trim(obj2.trimThreshold) &&

				$.trim(obj1.animatedGif) === $.trim(obj2.animatedGif) &&
				$.trim(obj1.compressProject) === $.trim(obj2.compressProject) &&
				$.trim(obj1.debugMode) === $.trim(obj2.debugMode);
		}

		return result;
	};
}
