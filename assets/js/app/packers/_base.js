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

	// collections of messages, cleared again in init()
 	this.msgErrors = [];
 	this.msgWarnings = [];
 	this.msgInfos = [];

	// a valid, do-nothing placeholder method
	var doNothing = function () { };
	
	// likely unused, but called for all packers at start of pack()
	// sets warnings and error messages, if any. inits DoPack params
	// this might be useful for checking browser compatibility?
	var init = function(completeCallback, statusCallback) { 
		// clear messages
		self.msgErrors = [];
		self.msgWarnings = [];
		self.msgInfos = [];
		
		// task variables rather than passing as params N times per pack frame
		self.DoPack_FrameCount = 0;
		self.DoPack_ImageKeys = [];
		self.DoPack_Images = {};
		self.DoPack_Options = {};
		self.DoPack_AllOptions = {};
		self.DoPack_CompleteCallback = completeCallback || self.DoPack_CompleteCallback || doNothing;
		self.DoPack_StatusCallback   = statusCallback   || self.DoPack_StatusCallback   || doNothing;
		self.DoPack_FramesProcessed = 0;
		self.DoPack_MaxFramesProcessed = 0;
		
		if(self.DoInit && typeof self.DoInit === "function") { self.DoInit(); }
	};
	
	// Accepts an array of image pool entities (a collection of zero or more ImageItem 
	// objects), as well as a trimmed and full ser of options from the left sidebar. 
	// Marks each image pool entity with their location & rotation within the sheet. 
	// Return value to callbackComplete includes a "success" boolean property. 
	// This is an asynchronous call.
	this.pack = function(images, options, completeCallback, statusCallback) { 

		init(completeCallback, statusCallback); // all the self.DoPack_XXX variables are initialized here

		// if callbacks were specified, use them
		var fnComplete = completeCallback || self.DoPack_CompleteCallback || doNothing;
		var fnStatus   = statusCallback   || self.DoPack_StatusCallback   || doNothing;
		
		// hand self.DoPack() the subset of options that it cares about
		var opts = trimOptions(options);
		
		// count frames of animated GIFs, or just use first frame?
		var extractGifFrames = 
			options &&
			options.doAnimatedGifExpand &&
			options.doAnimatedGifExpand();

		// count frames to process, order of ImageItem keys is irrelevant
		var imageKeys = Object.keys(imagePool);
		for(var i = 0; i < imageKeys.length; i++) {
			if(extractGifFrames) {
				self.DoPack_FrameCount += images[imageKeys[i]].frameCount;
			} else {
				self.DoPack_FrameCount++;
			}
		}
		
		// sanity check total frame count
		if(self.DoPack_FrameCount < 1) {
			// if there aren't any frames, ignore call to pack()
			self.addInfo("No sprites have been loaded. Nothing to do.");
			fnComplete( { success: true } );
			return;
		} else {
			// report frame count, which may be greater than image count
			this.addInfo("Discovered " + self.DoPack_FrameCount + " frame(s) in " + imageKeys.length + " image(s).");
		}

		// no errors were set in self.DoInit() or trimOptions(); start processing frames
		if(self.msgErrors.length === 0) {
			if(self.DoPack && typeof self.DoPack === "function") {
				// start packing!
				self.DoPack_ImageKeys = BasePacker.SortBy[options["sortBy"]](images);
				self.DoPack_Images = images;
				self.DoPack_Options = opts;
				self.DoPack_AllOptions = options;
				setTimeout(doPackTask, 0);
			} else {
				// oops. not sure what to do. packer isn't implemented.
				self.addError("DoPack() not yet implemented in this packer.");
				fnComplete( { success: false } );
			}
		// errors were set in self.DoInit() or trimOptions(); don't process frames
		} else {
			fnComplete( { success: false } );
		}
	};

	// handle the pseudo-threading tasks for self.DoPack()
	var doPackTask = function() {
		// have we made forward progress? previous frames may be revisited!
		if(self.DoPack_MaxFramesProcessed < self.DoPack_FramesProcessed) {
			self.DoPack_MaxFramesProcessed = self.DoPack_FramesProcessed;
		}
		
		// let UI know what we're up to
		// report how far we've progressed, ignoring revisited frames
		// (I don't want the progress bar jumping back and forth, so use max frame count)
		self.DoPack_StatusCallback(self.DoPack_MaxFramesProcessed);

		// holy bat crap - we're done!
		if(self.DoPack_MaxFramesProcessed === self.DoPack_FrameCount) {
			self.DoPack_CompleteCallback({ success: true });
			return;
		}
		
		// repeatedly call self.DoPack() until all sprite frames have been placed
		self.DoPack();
		setTimeout(doPackTask, 100); // TODO: drop timeout to zero or one; I just want to see it working for now
	};

	// some options are handled globally, some are handled by the packer implementation
	var trimOptions = function(options) {
		var opts = {}; // the packer-specific options
		
		// sift options into global or packer-specific collections
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
						switch(key) {
							case "aliasSprites": 
								// was sprite aliasing requested?
								if(options.doAliasSprites()) {
									self.addWarning("Alias Sprites not yet implemented.");
								}
								break;
							case "includeAt2x":
								// was @2x requested?
								if(options.doIncludeAt2x()) {
									self.addWarning("Include @2x not yet implemented.");
								}
								break;
							case "cleanAlpha":
								// was clean alpha requested?
								if(options.doCleanAlpha()) {
									self.addWarning("Clean alpha not yet implemented.");
								}
								break;
							case "colorMask":
								// was color masking requested?
								if(options.doColorMask()) {
									self.addWarning("Color mask not yet implemented.");
								}
								break;
							case "debugMode":
								// was debug mode requested?
								if(options.doDebug()) {
									self.addWarning("Debug mode not yet implemented.");
								}
								break;
							case "trimMode":
								// was sprite trimming requested?
								if(options.doTrim()) {
									self.addWarning("Trim sprites not yet implemented.");
								}
								break;
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
						switch(key) {
							case "spritePacker":
								// are we using the right packer?
								if(self.name != options[key]) {
									self.addError("Sprite packer mismatch. Expected '" + options[key] + "', found '" + self.name + "'.");
								}
								break;
							case "sortBy":
								// does sort method exist?
								if(typeof BasePacker.SortBy[options[key]] !== "function") {
									self.addError("Unknown sort method, '" + options[key] + "'.");
								}
								break;
							case "allowRotate":
								// was rotation requested?
								if(options.doAllowRotate()) {
									self.addWarning("Allow Rotate not yet implemented.");
								}
								break;
							case "borderPadding":
								if(options[key] > 0) {
									self.addWarning("Sprite border padding not yet implemented.");
								}
								break;
							case "shapePadding":
								if(options[key] > 0) {
									self.addWarning("Sprite shape padding not yet implemented.");
								}
								break;
							case "innerPadding":
								if(options[key] > 0) {
									self.addWarning("Sprite inner padding not yet implemented.");
								}
								break;
						}
						opts[key] = options[key];
						break;

					// include future options that we can't know about today
					default:
						// if unused in packer, throw warning message? Maybe? Maybe not?
						self.addInfo("Unknown option, '" + options[key] + "'. Passing to packer, but it may not be used.");
						opts[key] = options[key];
						break;
				}
			}
		}
		return opts;
	};

	// manage the various types of messages
	this.addWarning = function(msg) { self.msgWarnings.push(msg); };
	this.addError   = function(msg) { self.msgErrors.push(msg); };
	this.addInfo    = function(msg) { self.msgInfos.push(msg); };

	// add this packer instance to the list of available packers
	this.register = function() { packers[this.name] = this; };
}

// http://stackoverflow.com/questions/109023/how-to-count-the-number-of-set-bits-in-a-32-bit-integer#109025
// ----------------------------------------------------------------------------------
// This implementation is taken from a C/C++ example. Javascript supports integers in 
// the range +/-2^53. The >> operator in Javascript operates on 32-bit numbers, so
// this should be fine. I don't think the canvas would support sizes as large as 
// 1 << 31 anyway. =) 
// -- @groundh0g
// ----------------------------------------------------------------------------------
BasePacker.CountBits = function (i) {
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
};

// ----------------------------------
// [VERY] simple helper -- @groundh0g
// ----------------------------------
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

BasePacker.SortBy["WIDTH_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].width < images[b].width) ? 1 : (images[a].width > images[b].width) ? -1 :
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

BasePacker.SortBy["HEIGHT_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].height < images[b].height) ? 1 : (images[a].height > images[b].height) ? -1 :
			// if height is same, use key to sort
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

BasePacker.SortBy["AREA_DESC"] = function(images) {
	return Object.keys(images).sort(function(a,b) {
		var area_a = images[a].width * images[a].height;
		var area_b = images[b].width * images[b].height;
		return (area_a < area_b) ? 1 : (area_a > area_b) ? -1 :
			// if area is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};

