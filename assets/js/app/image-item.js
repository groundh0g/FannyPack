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

function ImageItem(copy, filename, filetype, width, height, src, guid, frameCount) {
	var self = this;
	
	copy = copy || {};

	this.filename = copy.filename || filename || "UNKNOWN";
	this.filetype = copy.filetype || filetype || "UNKNOWN";
	this.width  = parseInt(copy.width  || width  || "0");
	this.height = parseInt(copy.height || height || "0");
	this.src  = copy.src  || src  || "";
	this.guid = copy.guid || guid || "00000000-0000-0000-0000-000000000000";
	this.frameCount = parseInt(copy.frameCount  || frameCount  || "1");
	this.frames = [];

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
		this.width  = parseInt($.isNumeric(img.width)  ? img.width  : this.width);
		this.height = parseInt($.isNumeric(img.height) ? img.height : this.height);
		this.src  = img.src || "";
		this.guid = $.trim(img.guid || "00000000-0000-0000-0000-000000000000");
		this.frameCount = parseInt($.isNumeric(img.frameCount) ? img.frameCount : this.frameCount);
	};
	
	this.write = function() {
		var framesCopy = this.frames;
		this.frames = [];
		var result = JSON.stringify(this, null, 2);
		this.frames = framesCopy;
		return result;
	};

	this.equals = function(obj1, obj2) {
		var result = false;

		obj1 = obj1 || null;
		obj2 = obj2 || null;

		if(obj1 == null && obj2 == null) {
			// treat two nulls as not equal
		} else if(obj1 && obj1.filename && obj2 == null) {
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

				// TODO: should we even check frame count?
				$.trim(obj1.frameCount) === $.trim(obj2.frameCount); // &&

				// TODO: consider whether this is needed - lots of data!
				//$.trim(obj1.src) === $.trim(obj2.src);
		}

		return result;
	};

	this.populateFrameDataComplete = true;
	
	this.populateFrameData = function(callbackCompleted) {
		this.clearFrameData();
		var loadMultiFrame =
			this.filename.toLowerCase().endsWith(".gif") &&
			$("#ddlAnimatedGif").text() === "Extract Frames";
		if(loadMultiFrame) {
			// fill frame data using libgif.js
			self.populateFrameDataComplete = false;
			var parser = new GifParser({}, function() {
				var parsedFrames = parser.getFrames();
				for(var i = 0; i < parsedFrames.length; i++) {
					self.frames.push(parsedFrames[i]);
				}
				while(parsedFrames.length > 0) {
					parsedFrames.pop();
				}
				self.populateFrameDataComplete = true;
				if(callbackCompleted && typeof callbackCompleted === "function") { 
					callbackCompleted(); 
				}
			});
			try {
				parser.loadFromDataUri(this.src);
			} catch(e) {
				self.populateFrameDataComplete = true;
				if(callbackCompleted && typeof callbackCompleted === "function") { 
					callbackCompleted(); 
				}
			}
		} else {
			var $img = $("<img/>");
			// load single frame
			$img.load(function() {
				var w = this.width;
				var h = this.height;
				var canvas = document.createElement("canvas");
				canvas.width = w;
				canvas.height = h;
				var context = canvas.getContext("2d");
				context.drawImage(this, 0, 0, w, h);
				self.frames.push(context.getImageData(0,0,w,h));
				self.populateFrameDataComplete = true;
				if(callbackCompleted && typeof callbackCompleted === "function") { 
					callbackCompleted(); 
				}
			});
			self.populateFrameDataComplete = false;
			$img.attr("src", self.src);
		}
	};
	
	this.clearFrameData = function(callbackCompleted) {
		self.populateFrameDataComplete = false;
		if(this.frames) {
			while(this.frames.length > 0) {
				this.frames.pop();
			}
		} else {
			this.frames = [];
		}
		self.populateFrameDataComplete = true;
		if(callbackCompleted && typeof callbackCompleted === "function") { 
			callbackCompleted(); 
		}
	};
}

ImageItem.compareImages = function(obj1, obj2) {
	result = false;
	if(obj1 && obj2 && obj1.equals) {
		result = obj1.equals(obj2);
	}
	return result;
}

ImageItem.compareImagePools = function(obj1, obj2) {
	result = false;
	if(obj1 && obj2) {
		var keys1 = Object.keys(obj1).sort(function(a,b){ return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; });
		var keys2 = Object.keys(obj2).sort(function(a,b){ return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; });
		if(keys1.length == keys2.length) {
			result = true;
			for(var i=0; i<keys1.length; i++) {
				var same = 
					keys1[i] && (keys1[i] == keys2[i]) &&
					ImageItem.compareImages(obj1[keys1[i]], obj2[keys2[i]]);
				result &= (same) ? true : false;
			}
		}
	}
	return result;
}

ImageItem.copyImagePool = function(pool, deep) {
	result = {};
	if(pool) {
		var keys = Object.keys(pool);
		for(var i=0; i<keys.length; i++) {
			var img = pool[keys[i]];
			result[img.filename] = new ImageItem(
				null, 
				img.filename, 
				img.filetype, 
				img.width, 
				img.height, 
				deep ? img.src : "",
				img.guid,
				img.frameCount
			);
		}
	}
	return result;
}
