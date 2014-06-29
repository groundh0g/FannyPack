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
	BasePacker.call(this, "Basic", true); // Default Packer
	var self = this;
	this.defaultSortBy = "HEIGHT_DESC";
	this.version = "0.1.0";

	this.DoInit = function() { };

	this.DoPack = function () {
		if(self.DoPack_MaxFramesProcessed === 0) {
			// TODO: first call
			self.DoPack_FramesProcessed = 0;
			self.ImageIndex = 0;
			self.FrameIndex = 0;
			self.CurrentX = 0;
			self.CurrentY = 0;
			self.MaxY = 0;
		}
		
		// place sprite
		var image = self.DoPack_Images[self.DoPack_ImageKeys[self.ImageIndex]];
		var fitsWidth  = ((self.CurrentX + image.width)  <= self.width);
		var fitsHeight = ((self.CurrentY + image.height) <= self.height);
		var fitsOnNextRow = 
			(self.MaxY + image.height <= self.height) &&
			(image.width <= self.width);
		
		if(fitsWidth && fitsHeight) {
			// place at current loc
			// nothing to do, that's the default behavior
		} else if(!fitsWidth && fitsOnNextRow) {
			// place on next row
			self.CurrentX = 0;
			self.CurrentY = self.MaxY;
		} else { // if(!fitsWidth && !fitsOnNextRow) {
			if(self.Resize(self.CurrentX + image.width, self.MaxY + image.height)) {
				// exit loop and start over
				self.DoPack_MaxFramesProcessed = 0;
				self.DoPack_FramesProcessed = 0;
				return; 
			} else {
				// we have a problem; won't fit; stop trying
				self.addError("Image '" + image.filename + "' with index [" + self.ImageIndex + "][" + self.FrameIndex + "] won't fit specified constraints. [" + self.MAX_WIDTH + ", " + self.MAX_HEIGHT + "]");
				self.DoPack_FramesProcessed = self.DoPack_FrameCount;
				return;
			}
		}
		
		self.MaxY = Math.max(self.MaxY, self.CurrentY + image.height);
		image.frames[self.FrameIndex].rectSprite = {
			x: self.CurrentX,
			y: self.CurrentY,
			w: image.width,
			h: image.height,
			r: false
		};
	
		self.CurrentX += image.width;
		self.DoPack_FramesProcessed++;

		self.FrameIndex++;
		if(self.FrameIndex >= (self.DoPack_AllOptions.doAnimatedGifExpand() ? image.frameCount : 1)) {
			self.ImageIndex++;
			self.FrameIndex = 0;
		}
	};
}

(new BasicPacker()).register();
