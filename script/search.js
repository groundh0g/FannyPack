var indexByVendor = {};
var indexByLicense = {};
var indexByCategory = {};
var indexByWeight = {};
var indexByFamily = {};
var indexByFont = {};

var initSearchIndexes = function () {
    if(vendors && vendors.length > 0) {
        for(var v = 0; v < vendors.length; v++) {
            var vendor = vendors[v];
            var vendorName = vendor.name.toLowerCase();
            indexByVendor[vendorName] = [];
            for(var l = 0; l < vendor.licenses.length; l++) {
                var license = vendor.licenses[l];
                for(var ff = 0; ff < license.fontFamilies.length; ff++) {
                    var fontFamily = license.fontFamilies[ff];
                    var licenseName = fontFamily.license.toLowerCase();
                    var categoryName = fontFamily.category.toLowerCase();
                    var weightName = "" + fontFamily.weight;
                    var fontFamilyName = fontFamily.name.toLowerCase();
                    indexByLicense[licenseName] = indexByLicense[licenseName] || [];
                    indexByCategory[categoryName] = indexByCategory[categoryName] || [];
                    indexByWeight[weightName] = indexByWeight[weightName] || [];
                    indexByFamily[fontFamilyName] = indexByFamily[fontFamilyName] || [];
                    for(var f = 0; f < fontFamily.fonts.length; f++) {
                        var font = fontFamily.fonts[f];
                        var fontName = font.fullName;
                        var key = v + "/" + l + "/" + ff + "/" + f;
                        indexByVendor[vendorName].push(key);
                        indexByLicense[licenseName].push(key);
                        indexByCategory[categoryName].push(key)
                        indexByWeight[weightName].push(key);
                        indexByFamily[fontFamilyName].push(key);
                        indexByFont[fontName] = indexByFamily[fontName] || [];
                        indexByFont[fontName].push(key);
                    }
                }
            }
        }
    }
}

var filterByVendor = undefined;
var filterByLicense = undefined;
var filterByCategory = undefined;
var filterByWeight = undefined;
var filterByFamily = undefined;

var searchForTerm = function(text) {
    var results = [];
    results.exactMatch = false;
    text = text.toLowerCase();

    filterByVendor = undefined;
    filterByLicense = undefined;
    filterByCategory = undefined;
    filterByWeight = undefined;
    filterByFamily = undefined;

    var textParts = text.replace(/[ ]*/gm, "+").split("+");
    var searchText = "";
    for(var i = 0; i < textParts.length; i++) {
        var textPart = textParts[i].toLowerCase();
        if (textPart.includes("vendor:")) {
            filterByVendor = textParts.replace(/vendor\:/gm, "");
        } else if (textPart.includes("license:")) {
            filterByLicense = textParts.replace(/license\:/gm, "");
        } else if (textPart.includes("category:")) {
            filterByCategory = textParts.replace(/category\:/gm, "");
        } else if (textPart.includes("weight:")) {
            filterByWeight = textParts.replace(/weight\:/gm, "");
        } else if (textPart.includes("family:")) {
            filterByFamily = textParts.replace(/family\:/gm, "");
        } else {
            searchText = (searchText + " " + textPart).trim();
        }


    }



    for(var i = 0; i < FontList.length; i++) {

        var display = FontMeta[FontList[i]].display;
        var name = FontMeta[FontList[i]].name;
        var match =
            display.toLowerCase().includes(text);
        if(match) {
            results.push(display);
            if(FontList[i].toLowerCase() === text) {
                results.exactMatch = true;
            } else if(name === text) {
                results.exactMatch = true;
            } else if(display === text) {
                results.exactMatch = true;
            }
        }
    }
    if(results.length > 0) {
        results.sort();
    }
    return results;
};












// var FontList = [];

//var searchForTerm = function(text) {
//	var results = [];
//	results.exactMatch = false;
//	text = text.toLowerCase();
//	for(var i = 0; i < FontList.length; i++) {
//        var display = FontMeta[FontList[i]].display;
//        var name = FontMeta[FontList[i]].name;
//		var match =
//            display.toLowerCase().includes(text);
//		if(match) {
//			results.push(display);
//			if(FontList[i].toLowerCase() === text) {
//				results.exactMatch = true;
//			} else if(name === text) {
//                results.exactMatch = true;
//			} else if(display === text) {
//                results.exactMatch = true;
//            }
//		}
//	}
//    if(results.length > 0) {
//        results.sort();
//    }
//	return results;
//};

var doSearch = function() {
	var searchText = $("#txtSearch").val();
	if(searchText.length > 0) {
		var results = searchForTerm(searchText);
		return results;
	}
};

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      var match = str.match(substrRegex);
      if(match && match.length) {
        matches.push(str);
      }
    });
 
    cb(matches);
  };
};

var initTypeahead = function(data) {
	var list = data;
	////var data = FontList;
	//for(var i = 0; i < data.length; i++) {
	//	list.push(data[i]);
	//}
	
	var FontList = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: list
	});
	FontList.initialize();

	$("#txtSearch").typeahead(
		{ hint: true, highlight: true, minLength: 1 },
		{ name: "titles", source: substringMatcher(list) }
	);
};
