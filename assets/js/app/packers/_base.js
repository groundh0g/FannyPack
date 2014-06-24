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

function BasePacker(name, isDefault) {
	var self = this;
	this.name = name || "Null";
	this.defaultSortBy = "NAME";
	this.isDefault = isDefault || false;
	this.version = "0.1.0";
	this.msgErrors = [];
	this.msgWarnings = [];
	this.msgInfos = [];
  
	// likely unused, but called for all packers before pack()
	// sets warnings and error messages, if any
	// this might be useful for checking browser compatibility?
	var init = function() { 
		self.msgErrors = [];
		self.msgWarnings = [];
		self.msgInfos = [];
		if(self.DoInit) { self.DoInit(); }
	};
	
	var doNothing = function () { }

	// task variables rather than passing as params N times per second
	this.DoPack_FrameCount = 0;
	this.DoPack_ImageKeys = [];
	this.DoPack_Images = {};
	this.DoPack_Options = {};
	this.DoPack_AllOptions = {};
	this.DoPack_CompleteCallback = this.doNothing;
	this.DoPack_StatusCallback = this.doNothing;
	this.DoPack_FramesProcessed = 0;
	this.DoPack_MaxFramesProcessed = 0;
	
	// Accepts an array of imagePool entities, and set of options from the left 
	// sidebar. Builds collection of imagePool keys, with their location & rotation, 
	// within the sheet, along with a "success" boolean property. 
	// This is an asynchronous call.
	this.pack = function(images, options, completeCallback, statusCallback) { 
		var fnComplete = completeCallback || doNothing;
		var fnStatus = statusCallback || doNothing;

		self.DoPack_FrameCount = 0;
		self.DoPack_ImageKeys = [];
		self.DoPack_Images = {};
		self.DoPack_Options = {};
		self.DoPack_AllOptions = {};
		self.DoPack_CompleteCallback = fnComplete;
		self.DoPack_StatusCallback = fnStatus;
		self.DoPack_FramesProcessed = 0;
		self.DoPack_MaxFramesProcessed = 0;

		init();
		var opts = trimOptions(options);
		
		self.DoPack_FrameCount = 0;
		var extractGifFrames = 
			options &&
			options.doAnimatedGifExpand &&
			options.doAnimatedGifExpand();

		var imageKeys = Object.keys(imagePool);

		for(var i = 0; i < imageKeys.length; i++) {
			if(extractGifFrames) {
				self.DoPack_FrameCount += images[imageKeys[i]].frameCount;
			} else {
				self.DoPack_FrameCount++;
			}
		}
		
		if(self.DoPack_FrameCount < 1) {
			self.addInfo("No sprites have been loaded. Nothing to do.");
			fnComplete( { success: true } );
			return;
		}
		
		this.addInfo("Discovered " + self.DoPack_FrameCount + " frame(s) to process.");

		if(self.msgErrors.length === 0) {
			if(self.DoPack && typeof self.DoPack === "function") { 
				self.DoPack_ImageKeys = BasePacker.SortBy[options["sortBy"]](images);
				self.DoPack_Images = images;
				self.DoPack_Options = opts;
				self.DoPack_AllOptions = options;
				setTimeout(doPackTask, 0);
			} else {
				self.addError("DoPack() not yet implemented in this packer.");
				fnComplete( { success: false } );
			}
		} else {
			fnComplete( { success: false } );
		}
	};

	var doPackTask = function() {
		if(self.DoPack_MaxFramesProcessed < self.DoPack_FramesProcessed) {
			self.DoPack_MaxFramesProcessed = self.DoPack_FramesProcessed;
		}
		
		self.DoPack_StatusCallback(self.DoPack_MaxFramesProcessed);

		if(self.DoPack_MaxFramesProcessed === self.DoPack_FrameCount) {
			self.DoPack_CompleteCallback({ success: true });
			return;
		}
		
		self.DoPack();
		setTimeout(doPackTask, 100);
	};
		
	var trimOptions = function(options) {
		var opts = {};
		var keys = Object.keys(options);
		for(var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if(typeof options[key] === "function") {
				// ignore functions, only interested in values
			} else {
				switch(key) {
					// ignore these, they're handled by main app
					case "name":
					case "imageFormat":
					case "dataFormat":
					case "nameInSheet":
					case "includeAt2x":
					case "cleanAlpha":
					case "colorMask":
					case "debugMode":
					case "trimMode":
					case "trimThreshold":
					case "animatedGif":
					case "compressProject":
					case "aliasSprites":
						if(key === "aliasSprites" && options.doAliasSprites()) { 
							self.addWarning("Alias Sprites not yet implemented.");
						}
						break;
					
					// these are the packer-specific settings
					case "spritePacker":
					case "sortBy":
					case "allowRotate":
					case "width":
					case "height":
					case "sizeMode":
					case "constraint":
					case "forceSquare":
					case "borderPadding":
					case "shapePadding":
					case "innerPadding":
					case "spritePacker":
					case "sortBy":
					case "allowRotate":
						// are we using the right packer?
						if(key === "spritePacker" && self.name !== options[key]) {
							self.addError("Sprite packer mismatch. Expected '" + options[key] + "', found '" + self.name + "'.");
						}
						// is the selected sortBy valid?
						if(key === "sortBy" && typeof BasePacker.SortBy[options[key]] !== "function") {
							self.addError("Unknown sort method, '" + options[key] + "'.");
						}
						// was rotate requested?
						if(key === "allowRotate" && options.doAllowRotate()) { 
							self.addWarning("Allow Rotate not yet implemented.");
						}
						opts[key] = options[key];
						break;

					// include future options that we can't know about today
					default:
						// if unused in packer, throw warning message? Maybe? Maybe not?
						self.addWarning("Unknown option, '" + options[key] + "'. Passing to packer, but it may not be used.");
						opts[key] = options[key];
						break;
				}
			}
		}
		return opts;
	};

	this.addWarning = function(msg) {
		self.msgWarnings.push(msg);
	};

	this.addError = function(msg) {
		self.msgErrors.push(msg);
	};

	this.addInfo = function(msg) {
		self.msgInfos.push(msg);
	};

	// add this packer to the list of available packers
	this.register = function() {
		packers[this.name] = this;
	};
}

// http://stackoverflow.com/questions/109023/how-to-count-the-number-of-set-bits-in-a-32-bit-integer#109025
// This implementation is taken from a C/C++ example. Javascript supports integers in 
// the range +/-2^53. The >> operator in Javascript operates on 32-bit numbers, so
// this should be fine. I don't think the canvas would support sizes as large as 
// 1 << 31 anyway. =) -- @groundh0g
BasePacker.CountBits = function (i) {
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
};

// [VERY] simple helper -- @groundh0g
BasePacker.IsPowerOfTwo = function (i) { 
    return BasePacker.CountBits(i) === 1; 
};

// http://www.hackersdelight.org/hdcodetxt/clp2.c.txt
BasePacker.RoundUpToPowerOfTwo = function (x) { 
    x = x - 1;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >>16);
    return x + 1;
};

BasePacker.SortBy = {};
BasePacker.SortByDefault = "NAME";

BasePacker.SortBy["NAME"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0;
	});
};

BasePacker.SortBy["NAME_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (a.toUpperCase() < b.toUpperCase()) ? 1 : (a.toUpperCase() > b.toUpperCase()) ? -1 : 0;
	});
};

BasePacker.SortBy["WIDTH"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].width < images[b].width) ? -1 : (images[a].width > images[b].width) ? 1 :
			// if width is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};

BasePacker.SortBy["HEIGHT"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].height < images[b].height) ? -1 : (images[a].height > images[b].height) ? 1 : 
			// if height is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};

BasePacker.SortBy["WIDTH_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].width < images[b].width) ? 1 : (images[a].width > images[b].width) ? -1 :
			// if width is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};

BasePacker.SortBy["HEIGHT_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].height < images[b].height) ? 1 : (images[a].height > images[b].height) ? -1 :
			// if height is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};

BasePacker.SortBy["AREA_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		var area_a = images[a].width * images[a].height;
		var area_b = images[b].width * images[b].height;
		return (area_a < area_b) ? 1 : (area_a > area_b) ? -1 :
			// if area is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};

BasePacker.SortBy["AREA"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		var area_a = images[a].width * images[a].height;
		var area_b = images[b].width * images[b].height;
		return (area_a < area_b) ? -1 : (area_a > area_b) ? 1 :
			// if area is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
