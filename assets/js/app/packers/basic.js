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

	this.DoInit = function() { };
	
// 	self.width           = widthInit;
// 	self.MAX_WIDTH       = widthMax;
// 	self.height          = heightInit;
// 	self.MAX_HEIGHT      = heightMax;
// 	self.forcePowerOfTwo = options.doForcePowOf2();
// 	self.forceSquare     = options.doForceSquare();
// 	self.paddingShape    = parseInt(options.shapePadding  || 0);
// 	self.paddingBorder   = parseInt(options.borderPadding || 0);
// 	self.paddingInner    = parseInt(options.innerPadding  || 0);
// 	
// 	self.DoPack_ImageKeys = BasePacker.SortBy[options["sortBy"]](images);
// 	self.DoPack_Images = images;
// 	self.DoPack_Options = opts;
// 	self.DoPack_AllOptions = options;

	this.DoPack = function () {
		if(self.DoPack_MaxFramesProcessed === 0) {
			// TODO: first call
			self.ImageIndex = 0;
			self.FrameIndex = 0;
			self.CurrentX = 0;
			self.CurrentY = 0;
			self.MaxY = 0;
		}
		
		// place sprite
		var image = self.DoPack_Images[self.DoPack_ImageKeys[self.ImageIndex]];
		var frameCount = self.DoPack_AllOptions.doAnimatedGifExpand() ? image.frameCount : 1;
		for(var i = 0; i < frameCount; i++) {
		
			// won't fit width? grow if possible.
			while(self.CurrentX + image.width > self.width && self.width < self.MAX_WIDTH) {
				if(self.forcePowerOfTwo) {
					self.width = Math.min(self.MAX_WIDTH, roundUpToPowerOfTwo(self.width + 1));
				} else {
					self.width = Math.min(self.MAX_WIDTH, self.CurrentX + image.width);
				}
				
				if(self.forceSquare) {
					self.height = Math.min(self.MAX_HEIGHT, self.width);
				}
			}
			
			// still won't fit? move to next row.
			if(self.CurrentX + image.width > self.width) {
				self.CurrentX = 0;
				self.CurrentY = self.MaxY;
			}

			// still won't fit? we have a problem.
			if(self.CurrentX + image.width > self.width) {
				self.addError("Image [" + self.ImageIndex + "] at Frame [" + self.FrameIndex + "] with Name [" + image.filename + "] won't fit specified width constraints.");
			} else {
				// won't fit height? grow if possible.
				while(self.CurrentY + image.height > self.height && self.height < self.MAX_HEIGHT) {
					if(self.forcePowerOfTwo) {
						self.height = Math.min(self.MAX_HEIGHT, roundUpToPowerOfTwo(self.height + 1));
					} else {
						self.height = Math.min(self.MAX_HEIGHT, self.CurrentY + image.height);
					}
				
					if(self.forceSquare) {
						self.width = Math.min(self.MAX_WIDTH, self.height);
					}
				}
			
				// still won't fit? we have a problem.
				if(self.CurrentY + image.height > self.height) {
					self.addError("Image [" + self.ImageIndex + "] at Frame [" + self.FrameIndex + "] with Name [" + image.filename + "] won't fit specified height constraints.");
				}
			}

			if(self.msgErrors.length > 0) {
				self.DoPack_FramesProcessed = self.DoPack_FrameCount;
			} else {
				self.MaxY = Math.max(self.MaxY, self.CurrentY + image.height);
				image.frames[i].rectSprite = {
					x: self.CurrentX,
					y: self.CurrentY,
					w: image.width,
					h: image.height,
					r: false
				};
			
				self.CurrentX += image.width;
			}
			
			self.DoPack_FramesProcessed++;
		}
		self.ImageIndex++;
		self.FrameIndex = 0;
	};
}

(new BasicPacker()).register();
