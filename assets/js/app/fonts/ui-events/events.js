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

//var loadedFonts = loadedFonts || [];
var vendors = [];
var search = {};
var fontManager = {};

var addedFontNamesAndSizes = [];
var selectedFontIndex = -1;
var DEFAULT_CHARLIST_KEY = "{default}";

// -- TOOLBAR --

// -- LEFT SIDEBAR --


// -- RIGHT NAV --

var OnTopTabChanged = function(text) {
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

var createFontsListDivItem = function(fontNameAndSize) {
    var parts = fontNameAndSize.split("|");
    var fontName = parts[0];
    var fontSize = parts[1];

    var $divItem = $("<div>").addClass("divFontsListItem");
    var $divSample = $("<div>")
        .addClass("sample")
        .html(fontName)
        .css({
            "font-family": FontManager.escapeFontFaceName(fontName)
        });
    var $divInfo = $("<div>")
        .addClass("info")
        .text(fontName + " @ " + fontSize + ", default glyphs");
    var $divHidden = $("<div>").addClass("values").html(
        "<input type='hidden' class='fontName' value='" + fontName + "' />" +
        "<input type='hidden' class='fontSize' value='" + fontSize + "' />" +
        "<input type='hidden' class='charList' value='" + DEFAULT_CHARLIST_KEY + "' />"
    );

    return $divItem
        .append($divSample)
        .append($divInfo)
        .append($divHidden);
};

var updateFontsListToolbar = function () {
    $("#cmdRemoveFont").removeClass("disabled");
    if(selectedFonts.length === 0 || selectedFontIndex === -1) {
        $("#cmdRemoveFont").addClass("disabled");
    }
};

var updateSelectedFontsListItem = function($div) {
    if($div) {
        selectedFontIndex = $div.index();
    } else {
        selectedFontIndex = -1;
    }

    $("#cmdRemoveFont").removeClass("disabled")
    if(selectedFontIndex === -1) {
        $("#cmdRemoveFont").addClass("disabled")
    }

    updateFontItemProperties($div);
};

var updateFontItemProperties = function($div) {
    if($div) {
        $("#divPropertiesFontsListNoneSelected").hide();
        $("#divPropertiesFontsListItemSelected").show();
    } else {
        $("#divPropertiesFontsListNoneSelected").show();
        $("#divPropertiesFontsListItemSelected").hide();
    }
};

// -- POPUPS --
$("#cmdUploadSprites").click(function(){ $("#uploadSprites").click(); });
$("#cmdUploadProject").click(function(){ $("#uploadProject").click(); });

// -- Load and manage fonts --

var loadSelectedFonts = function() {
    if(selectedFonts && selectedFonts.length > 0) {
        for(var i = 0; i < selectedFonts.length; i++) {
            var fontNameAndSize = selectedFonts[i];
            var parts = fontNameAndSize.split("|");
            var fontName = parts[0];
            var fontSize = parts[1];

            var containsNameAndSize = ~addedFontNamesAndSizes.indexOf(fontNameAndSize);
            if(!containsNameAndSize) {
                addedFontNamesAndSizes.push(fontNameAndSize);
                if(addedFontNamesAndSizes.length === 1) { $("#divFontsList").html(""); }
                var $divFontListItem = createFontsListDivItem(fontNameAndSize);
                $("#divFontsList").append($divFontListItem);
                loadFontFace(fontName, $divFontListItem);
                $divFontListItem.mouseenter(function(){
                    $(this).siblings("div.divFontsListItem").each(function(){ $(this).removeClass("fontsListItemHighlight"); });
                    $(this).addClass("fontsListItemHighlight");
                }).mouseleave(function(){
                    $(this).removeClass("fontsListItemHighlight");
                }).click(function(){
                    var selected = $(this).hasClass("fontsListItemSelected");
                    $(this).siblings("div.divFontsListItem").each(function(){ $(this).removeClass("fontsListItemSelected"); });
                    $(this).removeClass("fontsListItemSelected");
                    if(!selected) {
                        $(this).addClass("fontsListItemSelected");
                        updateSelectedFontsListItem($(this));
                    } else {
                        updateSelectedFontsListItem(null);
                    }
                });
            }
        }
    }
};

var loadFontFace = function (fontName, $divExample, ndx) {
    var meta = search.getFontMetadata(fontName);

    if(meta.indexes && meta.indexes.length > 3) {
        var fontNameEscaped = meta.fontNameEscaped;
        fontManager.loadFontFromUrl(
            meta.url,
            meta.font.postScriptName,
            meta.font.uriFormat,
            $divExample, null /*infoHtml*/,
            function ($div, info) {
                $div.removeClass("example-loading");
                $div.children("div.sample").css({"font-family": fontNameEscaped });
                if(info) { $div.children("div.info").html(info); }
            },
            function ($div, info, err) {
                var message =
                    (info ? info + "<br/>" : "") +
                    (err ? "<strong>ERROR:</strong> " + err : "");
                $div.removeClass("example-loading");
                $div.addClass("example-error");
                $div.children("div.info").html(message);
            }
        );
    }
};

// -- Register GUI events --

$(window).on('beforeunload', function(e) {
    var prompt = PromptUserIfDirty();
    prompt = prompt == null ? undefined : prompt;
    if(e && typeof e.returnValue != "undefined") { e.returnValue = prompt; }
    return prompt;
});

$(document).ready(function() {
    clearFontsListDiv();

    $('#popupFontPickerModal').modal({ show:false });
    $('#popupFontPickerModal').on('shown.bs.modal', function () {
        setTimeout(function(){
            var docHeight = $("#popupFontPickerModal").height();
            var modHeight = $("#popupFontPickerModalDialog").height();
            var bodHeight = $("#popupFontPickerModalBody").height();
            var modPosTop = $("#popupFontPickerModalDialog").offset().top;
            var height = docHeight
                - (modHeight - bodHeight)
                - modPosTop * 2;
            $("#popupFontPickerModalBody").css("height", height + "px");
        }, 5);
    });

    $("#cmdSelectFonts").click(function() {
        $("#frameFontPicker").prop("src", "fontPickerFrame.html");
        $("#popupFontPickerModal").modal("show");
    });

    $("#popupFontPickerModalFooter").find("button.btn-primary").click(function(e){
        loadSelectedFonts();
        $("#frameFontPicker").prop("src", "");
        $("#popupFontPickerModal").modal("hide");
    });

    $.getJSON( // initialize search and fontManager classes
        BASE_PAGE + "/assets/data/fontlist.json",
        null,
        function(data, textStatus, jqXHR) {
            vendors = data;
            search = new Search(vendors, BASE_PAGE);
            search.initSearchIndexes();
            search.fontNamesThatMatchAllFilters();
            fontManager = new FontManager(BASE_PAGE)
        }
    );
});