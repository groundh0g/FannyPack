// http://stackoverflow.com/questions/280634/endswith-in-javascript/2548133#2548133
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

// http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string/646643#646643
if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}
