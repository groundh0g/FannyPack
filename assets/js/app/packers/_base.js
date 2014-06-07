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
  
	// likely unused, but called for all packers before pack()
	// returns error messages, or empty array on success
	// this might be useful for checking browser compatibility?
	this.init = function() { return []; };
	
	// accepts array of imagePool entities, and set of options from left sidebar
	// returns collection of imagePool keys with their location & rotation) within the sheet
	this.pack = function(images, options) { 
		return {}; 
	};
	
	// add this packer to the list of available packers
	this.register = function() {
		packers[self.name] = self;
	};
}

BasePacker.SortBy = {};
BasePacker.SortByDefault = "AREA_DESC"

BasePacker.SORT_BY_KEY = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0;
	});
};
BasePacker.SortBy["NAME"] = BasePacker.SORT_BY_KEY;

BasePacker.SORT_BY_KEY_DESC = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (a.toUpperCase() < b.toUpperCase()) ? 1 : (a.toUpperCase() > b.toUpperCase()) ? -1 : 0;
	});
};
BasePacker.SortBy["NAME_DESC"] = BasePacker.SORT_BY_KEY_DESC;

BasePacker.SORT_BY_WIDTH = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].width < images[b].width) ? -1 : (images[a].width > images[b].width) ? 1 :
			// if width is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
BasePacker.SortBy["WIDTH"] = BasePacker.SORT_BY_WIDTH_DESC;

BasePacker.SORT_BY_HEIGHT = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].height < images[b].height) ? -1 : (images[a].height > images[b].height) ? 1 : 
			// if height is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
BasePacker.SortBy["HEIGHT"] = BasePacker.SORT_BY_HEIGHT;

BasePacker.SORT_BY_WIDTH_DESC = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].width < images[b].width) ? 1 : (images[a].width > images[b].width) ? -1 :
			// if width is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
BasePacker.SortBy["WIDTH_DESC"] = BasePacker.SORT_BY_WIDTH_DESC;

BasePacker.SORT_BY_HEIGHT_DESC = function(images) {
	return Object.keys(images).sort(function(a,b) {
		return (images[a].height < images[b].height) ? 1 : (images[a].height > images[b].height) ? -1 :
			// if height is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
BasePacker.SortBy["HEIGHT_DESC"] = BasePacker.SORT_BY_HEIGHT_DESC;

BasePacker.SORT_BY_AREA_DESC = function(images) {
	return Object.keys(images).sort(function(a,b) {
		var area_a = images[a].width * images[a].height;
		var area_b = images[b].width * images[b].height;
		return (area_a < area_b) ? 1 : (area_a > area_b) ? -1 :
			// if area is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
BasePacker.SortBy["AREA_DESC"] = BasePacker.SORT_BY_AREA_DESC;

BasePacker.SORT_BY_AREA = function(images) {
	return Object.keys(images).sort(function(a,b) {
		var area_a = images[a].width * images[a].height;
		var area_b = images[b].width * images[b].height;
		return (area_a < area_b) ? -1 : (area_a > area_b) ? 1 :
			// if area is same, use key to sort
			((a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0);
	});
};
BasePacker.SortBy["AREA"] = BasePacker.SORT_BY_AREA_DESC;

