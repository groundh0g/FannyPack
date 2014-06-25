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

function JoePacker() {
	BasePacker.call(this, "Joe", true); // Default Packer
	var self = this;
	this.defaultSortBy = "AREA_DESC";
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
		}
		
		// TODO: real work
		self.DoPack_FramesProcessed++;
	};
}

(new JoePacker()).register();
