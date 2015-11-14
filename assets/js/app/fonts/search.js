var indexByVendor = {};
var indexByLicense = {};
var indexByCategory = {};
var indexByWeight = {};
var indexByFamily = {};
var indexByFont = {};

var typeaheadVendor = [];
var typeaheadLicense = [];
var typeaheadCategory = [];
var typeaheadWeight = [];
var typeaheadFont = [];

var initSearchIndexes = function () {
    if(vendors && vendors.length > 0) {
        for(var v = 0; v < vendors.length; v++) {
            var vendor = vendors[v];
            var vendorName = vendor.name.toLowerCase();
            indexByVendor[vendorName] = [];
            typeaheadVendor.push("vendor:" + vendorName);
            for(var l = 0; l < vendor.licenses.length; l++) {
                var license = vendor.licenses[l];
                for(var ff = 0; ff < license.fontFamilies.length; ff++) {
                    var fontFamily = license.fontFamilies[ff];
                    var licenseName = fontFamily.license.toLowerCase();
                    var categoryName = fontFamily.category.toLowerCase();
                    var fontFamilyName = fontFamily.name.toLowerCase();
                    indexByLicense[licenseName] = indexByLicense[licenseName] || [];
                    indexByCategory[categoryName] = indexByCategory[categoryName] || [];
                    indexByFamily[fontFamilyName] = indexByFamily[fontFamilyName] || [];
                    if(indexByLicense[licenseName].length === 0)   typeaheadLicense.push("license:" + licenseName);
                    if(indexByCategory[categoryName].length === 0) typeaheadCategory.push("category:" + categoryName);
                    for(var f = 0; f < fontFamily.fonts.length; f++) {
                        var font = fontFamily.fonts[f];
                        var fontName = font.postScriptName;
                        var key = v + "/" + l + "/" + ff + "/" + f;
                        var weightName = "" + font.weight;
                        indexByVendor[vendorName].push(key);
                        indexByLicense[licenseName].push(key);
                        indexByCategory[categoryName].push(key)
                        indexByFamily[fontFamilyName].push(key);
                        indexByFont[fontName] = indexByFont[fontName] || [];
                        if(indexByFont[fontName].length === 0) typeaheadFont.push(fontName);
                        indexByFont[fontName].push(key);
                        indexByWeight[weightName] = indexByWeight[weightName] || [];
                        if(indexByWeight[weightName].length === 0) typeaheadWeight.push("weight:" + weightName);
                        indexByWeight[weightName].push(key);
                    }
                }
            }
            typeaheadVendor.sort();
            typeaheadLicense.sort();
            typeaheadCategory.sort();
            typeaheadWeight.sort();
            typeaheadFont.sort();
        }
    }
};

var filterByVendor = undefined;
var filterByLicense = undefined;
var filterByCategory = undefined;
var filterByWeight = undefined;

var initFilterByValues = function(text) {
    //filterByVendor   = $("#txtVendor").val().toLowerCase()   || undefined;
    filterByVendor   = undefined;
    filterByLicense  = $("#txtLicense").val().toLowerCase()  || undefined;
    filterByCategory = $("#txtCategory").val().toLowerCase() || undefined;
    //filterByWeight   = $("#txtWeight").val().toLowerCase()   || undefined;
    filterByWeight = undefined;

    return text;
};

//var initFilterByValues = function(text) {
//    text = text.toLowerCase();
//
//    filterByVendor = undefined;
//    filterByLicense = undefined;
//    filterByCategory = undefined;
//    filterByWeight = undefined;
//
//    var textParts = text.replace(/\s+/gm, "+").split("+");
//    var searchText = "";
//    for(var i = 0; i < textParts.length; i++) {
//        var textPart = textParts[i];
//        if (textPart.includes("vendor:")) {
//            filterByVendor = textPart.replace(/vendor\:/gm, "");
//            if(!indexByVendor[filterByVendor]) {
//                filterByVendor = undefined;
//                searchText = (searchText + " " + textPart).trim();
//            }
//        } else if (textPart.includes("license:")) {
//            filterByLicense = textPart.replace(/license\:/gm, "");
//            if(!indexByLicense[filterByLicense]) {
//                filterByLicense = undefined;
//                searchText = (searchText + " " + textPart).trim();
//            }
//        } else if (textPart.includes("category:")) {
//            filterByCategory = textPart.replace(/category\:/gm, "");
//            if(!indexByCategory[filterByCategory]) {
//                filterByCategory = undefined;
//                searchText = (searchText + " " + textPart).trim();
//            }
//        } else if (textPart.includes("weight:")) {
//            filterByWeight = textPart.replace(/weight\:/gm, "");
//            if(!indexByWeight[filterByWeight]) {
//                filterByWeight = undefined;
//                searchText = (searchText + " " + textPart).trim();
//            }
//        } else {
//            searchText = (searchText + " " + textPart).trim();
//        }
//    }
//
//    return searchText;
//};

//var addFiltersToFontList = function(list, searchText) {
//
//    for (var i = 0; i < typeaheadCategory.length; i++) {
//        if (searchText === undefined || typeaheadCategory[i].includes(searchText)) {
//            list.push(typeaheadCategory[i]);
//        }
//    }
//
//    for (var i = 0; i < typeaheadWeight.length; i++) {
//        if (searchText === undefined || ("" + typeaheadWeight[i]).includes(searchText)) {
//            list.push(typeaheadWeight[i]);
//        }
//    }
//
//    for (var i = 0; i < typeaheadVendor.length; i++) {
//        if (searchText === undefined || typeaheadVendor[i].includes(searchText)) {
//            list.push(typeaheadVendor[i]);
//        }
//    }
//
//    for (var i = 0; i < typeaheadLicense.length; i++) {
//        if (searchText === undefined || typeaheadLicense[i].includes(searchText)) {
//            list.push(typeaheadLicense[i]);
//        }
//    }
//};

var currentFontList = [];

var fontNamesThatMatchAllFilters = function (searchText) {
    var results = [];
    results.exactMatch = false;
    var searchTextLower = (searchText || "").toLowerCase();

    for(var fontName in indexByFont) {
        if(indexByFont.hasOwnProperty(fontName)) {
            var match = fontName.toLowerCase().includes(searchTextLower) || !searchText;
            var indexes = indexByFont[fontName][0].split("/");
            if (match && indexes && indexes.length > 3) {
                var font = vendors[indexes[0]].licenses[indexes[1]].fontFamilies[indexes[2]].fonts[indexes[3]];
                if (match && filterByVendor) {
                    match = filterByVendor === vendors[indexes[0]].name.toLowerCase();
                }
                if (match && filterByLicense) {
                    match = filterByLicense === vendors[indexes[0]].licenses[indexes[1]].name.toLowerCase();
                }
                if (match && filterByCategory) {
                    match = filterByCategory === vendors[indexes[0]].licenses[indexes[1]].fontFamilies[indexes[2]].category.toLowerCase();
                }
                if (match && filterByWeight) {
                    match = filterByWeight == font.weight;
                }

                if(match) {
                    if(fontName.toLowerCase() === searchTextLower) { results.exactMatch = true; }
                    results.push(fontName);
                }
            }
        }
    }

    //if(!filterByVendor && !filterByLicense && !filterByCategory && ! filterByWeight) {
    //    addFiltersToFontList(results, searchText);
    //}

    if(results.length > 0) {
        results.sort();
    }

    currentFontList = results;
    return results;
};

var searchForTerm = function(text) {
    var searchText = initFilterByValues(text);
    var results = fontNamesThatMatchAllFilters(searchText);

    return results;
};

var doSearch = function() {
	var searchText = $("#txtSearch").val();
	if(searchText.length > 0) {
		var results = searchForTerm(searchText);
		return results;
	}
};

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches; //, substringRegex;
    var searchText = initFilterByValues(q);
    matches = fontNamesThatMatchAllFilters(searchText);
    cb(matches);
  };
};

var initTypeahead = function() {
	var list = [];

    for(var i = 0; i < typeaheadFont.length; i++) {
        list.push(typeaheadFont[i]);
    }

    //addFiltersToFontList(list);

	var FontList = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: list
	});
	FontList.initialize();

	$("#txtSearchFonts").typeahead(
		{ hint: true, highlight: true, minLength: 1 },
		{ name: "titles", limit: 10, source: substringMatcher(list) }
	);
};
