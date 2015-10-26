var FontList = [];

var searchForTerm = function(text) {
	var results = [];
	results.exactMatch = false;
	text = text.toLowerCase();
	for(var i = 0; i < FontList.length; i++) {
		var match =
            FontList[i].toLowerCase().includes(text);
		if(match) {
			results.push(FontList[i]);
			if(FontList[i].toLowerCase() === text.toLowerCase()) {
				results.exactMatch = true;
			}
		}
	}
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
