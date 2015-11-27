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

// -- TOOLBAR --

// -- LEFT SIDEBAR --


// -- RIGHT NAV --

OnTopTabChanged = function(text) {
    if(text === "Fonts") {
        $(".divSidebarRightTop").css("bottom", "254px");
        $(".divSidebarRightBottom").show()
    } else {
        $(".divSidebarRightTop").css("bottom", "0");
        $(".divSidebarRightBottom").hide();
    }
};

var animateAddFontPrompt = function () {
    var $i = $("#iconPromptToAddFont");
    if($i) {
        setTimeout(function(){
            var margin = 5 + Math.round(Math.sin((new Date()).getTime() / 500) * 5.0);
            $("#iconPromptToAddFont").css("margin-top", margin + "px");
            animateAddFontPrompt();
        }, 100);
    }
};

var clearFontsListDiv = function () {
    $("#divFontsList").html(
        "<p>&nbsp;&nbsp;" +
        "<i id='iconPromptToAddFont' class='fa fa-arrow-up' style='font-size:1.1em; font-weight:bold; color:#d33;'></i>" +
        " Click 'Add' to get started.</p>"
    );
    updateFontsListToolbar();
    animateAddFontPrompt();
};

var loadedFonts = loadedFonts || [];
var selectedFontIndex = selectedFontIndex || -1;

var updateFontsListToolbar = function () {
    $("#cmdRemoveFont").removeClass("disabled");
    if(selectedFonts.length === 0 || selectedFontIndex === -1) {
        $("#cmdRemoveFont").addClass("disabled");
    }
};

// -- POPUPS --
$("#cmdUploadSprites").click(function(){ $("#uploadSprites").click(); });
$("#cmdUploadProject").click(function(){ $("#uploadProject").click(); });

// DoToggleHelp();

$(window).on('beforeunload', function(e) {
	var prompt = PromptUserIfDirty();
	prompt = prompt == null ? undefined : prompt;
	if(e && typeof e.returnValue != "undefined") { e.returnValue = prompt; }
	return prompt;
});



$(document).ready(function() {
    clearFontsListDiv();
});