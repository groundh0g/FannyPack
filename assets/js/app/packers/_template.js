var packers = packers || {};

packers["Null"] = {
	// likely unused, but called for all packers before pack()
	// returns error message, or empty string on success
	// this might be useful for checking browser compatibility?
	init: function() { return ""; },
	
	// accepts array of imagePool entities, and set of options from left sidebar
	// returns array of imagePool keys with their location (and rotation) in the sheet
	pack: function(images, options) { return []; }
};