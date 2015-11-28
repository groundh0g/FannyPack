/*
 Copyright (c) 2015 Joseph B. Hall [@groundh0g]

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

function Search(vendors, basePath) {
    var that = this;

    this.vendors = vendors || [];
    this.basePath = basePath || "/";

    this.indexByVendor = {};
    this.indexByLicense = {};
    this.indexByCategory = {};
    this.indexByWeight = {};
    this.indexByFamily = {};
    this.indexByFont = {};

    this.typeaheadVendor = [];
    this.typeaheadLicense = [];
    this.typeaheadCategory = [];
    this.typeaheadWeight = [];
    this.typeaheadFont = [];

    this.dropdownVendor = [];
    this.dropdownLicense = [];
    this.dropdownCategory = [];
    this.dropdownWeight = [];

    this.filterByVendor = undefined;
    this.filterByLicense = undefined;
    this.filterByCategory = undefined;
    this.filterByWeight = undefined;

    this.initFilterByValues = function(txtVendor, txtLicense, txtCategory, txtWeight) {
        this.filterByVendor   = (txtVendor || "").toLowerCase()  || undefined;
        this.filterByLicense  = (txtLicense || "").toLowerCase()  || undefined;
        this.filterByCategory = (txtCategory || "").toLowerCase() || undefined;
        this.filterByWeight   = (txtWeight || "").toLowerCase()   || undefined;
    };

    this.initSearchIndexes = function () {
        if(this.vendors && this.vendors.length > 0) {
            for(var v = 0; v < this.vendors.length; v++) {
                var vendor = this.vendors[v];
                var vendorName = vendor.name.toLowerCase();
                this.indexByVendor[vendorName] = [];
                this.typeaheadVendor.push("vendor:" + vendorName);
                this.dropdownVendor.push(vendorName);
                for(var l = 0; l < vendor.licenses.length; l++) {
                    var license = vendor.licenses[l];
                    for(var ff = 0; ff < license.fontFamilies.length; ff++) {
                        var fontFamily = license.fontFamilies[ff];
                        var licenseName = fontFamily.license.toLowerCase();
                        var categoryName = fontFamily.category.toLowerCase();
                        var fontFamilyName = fontFamily.name.toLowerCase();
                        this.indexByLicense[licenseName] = this.indexByLicense[licenseName] || [];
                        this.indexByCategory[categoryName] = this.indexByCategory[categoryName] || [];
                        this.indexByFamily[fontFamilyName] = this.indexByFamily[fontFamilyName] || [];
                        if(this.indexByLicense[licenseName].length === 0) {
                            this.typeaheadLicense.push("license:" + licenseName);
                            this.dropdownLicense.push(licenseName);
                        }
                        if(this.indexByCategory[categoryName].length === 0) {
                            this.typeaheadCategory.push("category:" + categoryName);
                            this.dropdownCategory.push(categoryName);
                        }
                        for(var f = 0; f < fontFamily.fonts.length; f++) {
                            var font = fontFamily.fonts[f];
                            var fontName = font.postScriptName;
                            var key = v + "/" + l + "/" + ff + "/" + f;
                            var weightName = "" + font.weight;
                            this.indexByVendor[vendorName].push(key);
                            this.indexByLicense[licenseName].push(key);
                            this.indexByCategory[categoryName].push(key);
                            this.indexByFamily[fontFamilyName].push(key);
                            this.indexByFont[fontName] = this.indexByFont[fontName] || [];
                            if(this.indexByFont[fontName].length === 0) this.typeaheadFont.push(fontName);
                            this.indexByFont[fontName].push(key);
                            this.indexByWeight[weightName] = this.indexByWeight[weightName] || [];
                            if(this.indexByWeight[weightName].length === 0) {
                                this.typeaheadWeight.push("weight:" + weightName);
                                this.dropdownWeight.push(weightName);
                            }
                            this.indexByWeight[weightName].push(key);
                        }
                    }
                }

                this.typeaheadVendor.sort();
                this.typeaheadLicense.sort();
                this.typeaheadCategory.sort();
                this.typeaheadWeight.sort();
                this.typeaheadFont.sort();

                this.dropdownVendor.sort();
                this.dropdownLicense.sort();
                this.dropdownCategory.sort();
                this.dropdownWeight.sort();
            }
        }
    };

    this.fontNamesThatMatchAllFilters = function (searchText) {
        var results = [];
        results.exactMatch = false;
        var searchTextLower = (searchText || "").toLowerCase();

        for(var fontName in this.indexByFont) {
            if(this.indexByFont.hasOwnProperty(fontName)) {
                var match = fontName.toLowerCase().includes(searchTextLower) || !searchText;
                var indexes = this.indexByFont[fontName][0].split("/");
                if (match && indexes && indexes.length > 3) {
                    var font = this.vendors[indexes[0]].licenses[indexes[1]].fontFamilies[indexes[2]].fonts[indexes[3]];
                    if (match && this.filterByVendor) {
                        match = this.filterByVendor === this.vendors[indexes[0]].name.toLowerCase();
                    }
                    if (match && this.filterByLicense) {
                        match = this.filterByLicense === this.vendors[indexes[0]].licenses[indexes[1]].fontFamilies[indexes[2]].license.toLowerCase();
                    }
                    if (match && this.filterByCategory) {
                        match = this.filterByCategory === this.vendors[indexes[0]].licenses[indexes[1]].fontFamilies[indexes[2]].category.toLowerCase();
                    }
                    if (match && this.filterByWeight) {
                        match = this.filterByWeight == font.weight;
                    }

                    if(match) {
                        if(fontName.toLowerCase() === searchTextLower) { results.exactMatch = true; }
                        results.push(fontName);
                    }
                }
            }
        }

        if(results.length > 0) {
            results.sort();
        }

        return results;
    };

    var searchForTerm = function(text) {
        var searchText = this.initFilterByValues(text);
        return this.fontNamesThatMatchAllFilters(searchText);
    };

    this.doSearch = function(text) {
        text = text || "";
        if(text.length > 0) {
            return this.searchForTerm(searchText);
        }
    };

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches; //, substringRegex;
            var searchText = this.initFilterByValues(q);
            matches = this.fontNamesThatMatchAllFilters(searchText);
            cb(matches);
        };
    };

    this.initTypeahead = function($txtSearch) {
        if($txtSearch) {
            var list = [];

            for (var i = 0; i < this.typeaheadFont.length; i++) {
                list.push(this.typeaheadFont[i]);
            }

            var FontList = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: list
            });
            FontList.initialize();

            $txtSearch.typeahead(
            	{ hint: true, highlight: true, minLength: 1 },
            	{ name: "titles", limit: 10, source: substringMatcher(list) }
            );
        }
    };

    this.getFontMetadata = function(fontName) {
        var result = {};
        var index = this.indexByFont[fontName || ""];
        if(index && index.length > 0) {
            var indexes = index[0].split("/");
            if(indexes && indexes.length > 3) {
                var v = vendors[indexes[0]];
                var l = v.licenses[indexes[1]];
                var ff = l.fontFamilies[indexes[2]];
                var f = ff.fonts[indexes[3]];
                var url = this.basePath +
                    "assets/data/fontdata/" +
                    v.name + "_" +
                    l.name + "_" +
                    ff.name.replace(/_/gm, "-").replace(/\-/gm, " ") + "_" +
                    f.postScriptName + ".json";

                result.index = index;
                result.indexes = indexes;
                result.vendor = v;
                result.license = l;
                result.fontFamily = ff;
                result.font = f;
                result.url = this.basePath +
                    "assets/data/fontdata/" +
                    v.name + "_" +
                    l.name + "_" +
                    ff.name.replace(/_/gm, "-").replace(/\-/gm, " ") + "_" +
                    f.postScriptName + ".json";
                result.fontNameEscaped = FontManager.escapeFontFaceName(f.postScriptName);
            }
        }
        return result;
    };

    // init lists
    this.initSearchIndexes();
    this.fontNamesThatMatchAllFilters();
}



