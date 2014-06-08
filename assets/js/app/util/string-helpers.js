// http://stackoverflow.com/questions/280634/endswith-in-javascript/2548133#2548133
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

// http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string/646643#646643
if (typeof String.prototype.startsWith !== 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

// http://stackoverflow.com/questions/19196337/string-contains-doesnt-exist-while-working-in-chrome#19196456
// (tweaked a bit, @groundh0g)
if (typeof String.prototype.contains !== 'function') {
   String.prototype.contains = function(str, startIndex) {
	 return -1 !== this.indexOf(str, startIndex);
   };
}

// http://stackoverflow.com/questions/19196337/string-contains-doesnt-exist-while-working-in-chrome#19196456
// (tweaked a bit, @groundh0g)
if (typeof String.prototype.contains !== 'function') {
   String.prototype.contains = function(str, startIndex) {
	 return -1 !== this.indexOf(str, startIndex);
   };
}

//http://stackoverflow.com/questions/202605/repeat-string-javascript#5450113
// (tweaked a bit, @groundh0g)
if (typeof String.prototype.repeat !== 'function') {
	String.prototype.repeat = function(count) {
		var result = "";
		var pattern = this.valueOf();
		var num = parseInt(count);
		while (num > 1) {
			if (num & 1) { result += pattern; }
			pattern += pattern;
			num >>= 1;
		}
		return result + pattern;
	};
}


