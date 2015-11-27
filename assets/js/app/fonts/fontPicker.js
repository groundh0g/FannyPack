var vendors = [];
var BASE_PATH = BASE_PATH || "/";
var currentFontList = [];
var currentFontListLoadedCount = 0;
var currentFontScrollTop = 0;
var selectedFonts = {};

var clearFontExamples = function () {
    $("#divFontExamples").html("");
    currentFontListLoadedCount = 0;
    currentFontScrollTop = 0;
    window.parent.setSelectedFontCount(0);
    window.parent.setTotalFontCount(currentFontList.length);
};

var createFontExampleDiv = function (name, selected, size) {
    name = name || "";
    var $divExample = $("<div>").addClass("example " + (selected ? "example-selected" : "example-loading"));
    var $divControls = $("<div>").addClass("controls")
            .html(
                "<div class='btn " + (selected ? "btn-primary" : "btn-default") + "'>" +
                "<i class='fa fa-" + (selected ? 'check-' : '') + "square-o'></i> Add Font" +
                "</div>" +
                "<span class='fontSize'>" + (size || "") + "</span>" +
                "<input type='hidden' class='fontName' value='" + name + "' />");
    var $divSample = $("<div>").addClass("sample").html("<img src='assets/img/loading.gif' />");
    var $divInfo = $("<div>").addClass("info").text("Loading " + name + " ...");
    return $divExample
        .append($divControls)
        .append($divSample)
        .append($divInfo);
};

var getSelectedFonts = function() {
    var fonts = [];
    for(var key in selectedFonts) {
        if(selectedFonts.hasOwnProperty(key) && selectedFonts[key]) {
            fonts.push(key + "|" + selectedFonts[key]);
        }
    }
    return fonts;
};

var getCurrentFontSize = function() {
    var txtFontSize = $("#txtFontSize").val();
    if(txtFontSize === "") {
        switch($("#txtShowAs").val()) {
            case "Paragraph": txtFontSize = SAMPLE_TEXT_PARAGRAPH_DEFAULT_SIZE; break;
            case "Sentence": txtFontSize = SAMPLE_TEXT_SENTENCE_DEFAULT_SIZE; break;
            case "Title": txtFontSize = SAMPLE_TEXT_TITLE_DEFAULT_SIZE; break;
            case "FontName": txtFontSize = SAMPLE_TEXT_TITLE_DEFAULT_SIZE; break;
            case "": txtFontSize = SAMPLE_TEXT_TITLE_DEFAULT_SIZE; break;
            default: txtFontSize = SAMPLE_TEXT_SENTENCE_DEFAULT_SIZE; break;
        }
    }
    return txtFontSize;
};

var getAddFontButton = function($divExample) {
    return $divExample.children("div.controls").first().children("div.btn").first();
};

var doToggleSelectFont = function($divExample) {
    var $divControls = $divExample.children("div.controls").first();
    var $cmdAddFont = $divControls.children("div.btn").first();
    var $spanFontSize = $divControls.children("span.fontSize").first();

    var isSelected = $cmdAddFont.children("i").first().hasClass("fa-check-square");

    isSelected = !isSelected; // toggle

    var fontName = $divControls.children("input.fontName").first().val();
    var fontSize = isSelected ? getCurrentFontSize() : "";

    $divExample
        .removeClass("example-selected")
        .addClass(isSelected ? "example-selected" : "");
    $cmdAddFont
        .removeClass("btn-default").removeClass("btn-primary")
        .addClass(isSelected ? "btn-primary" : "btn-default");
    $cmdAddFont.children("i").first()
        .removeClass("fa-check-square").removeClass("fa-square-o")
        .addClass(isSelected ? "fa-check-square" : "fa-square-o");
    $spanFontSize.text(isSelected ? getCurrentFontSize() : "");

    selectedFonts[fontName] = isSelected ? fontSize : undefined;
    window.parent.setSelectedFonts(getSelectedFonts());
};

var SAMPLE_TEXT_PARAGRAPH_DEFAULT_SIZE = "14px";
var SAMPLE_TEXT_PARAGRAPH = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor tellus id vestibulum hendrerit. Donec lobortis facilisis justo nec maximus. Nullam libero ante, mattis eu iaculis vitae, malesuada a urna. Sed viverra odio ligula, accumsan lacinia ligula elementum sed. Fusce et diam viverra augue pulvinar tincidunt in ultrices metus. Etiam vitae purus enim. Etiam sollicitudin euismod sapien, vel tempor turpis sodales id. Vestibulum a mauris blandit, molestie orci at, tristique odio. Quisque tristique at ipsum in facilisis.</p><p>0123456789!@#$%^&*()[]{};:'\"\\|,./?&lt;&gt;</p>";

var SAMPLE_TEXT_SENTENCE_DEFAULT_SIZE = "28px";
var SAMPLE_TEXT_SENTENCE = [
    "<p>Five quick judges spent my zebra hex allowance.</p>",
    "<p>Quick wafting zephyrs vex bold Jim.</p>",
    "<p>The five boxing wizards jump quickly.</p>",
    "<p>Jackdaws love my sphinx of black quartz.</p>",
    "<p>Hick Jed wins quiz for extra blimp voyage.</p>",
    "<p>Sympathizing would fix Quaker objectives.</p>",
    "<p>Brawny gods just flocked up to quiz and vex him.</p>",
    "<p>Jim just quit and packed extra bags for Liz Owen.</p>",
    "<p>Puzzled women bequeath jerks very exotic gifts.</p>",
    "<p>A large fawn jumped quickly over white zinc boxes.</p>",
    "<p>Five wine experts jokingly quizzed sample Chablis.</p>",
    "<p>The vixen jumped quickly on her foe barking with zeal.</p>",
    "<p>Five or six big jet planes zoomed quickly by the tower.</p>",
    "<p>Five big quacking zephyrs jolt my wax bed.</p>",
    "<p>Grumpy wizards make toxic brew for the evil Queen and Jack.</p>",
    "<p>The quick brown fox jumps over the lazy dog.</p>",
    "<p>My twig flicked the baroque jazz xylophone.</p>",
    ];

var SAMPLE_TEXT_TITLE_DEFAULT_SIZE = "48px";
var SAMPLE_TEXT_TITLE = [
    "<p>Super Awesome Game</p>",
    "<p>Best Game Ever</p>",
    "<p>42 is The Answer</p>",
    "<p>Ultimate Quest</p>",
    "<p>Shoot Everything</p>",
    "<p>Uranus Hertz</p>",
    "<p>Saturn Day Morning</p>",
    "<p>Rise of the Rhubarbs</p>",
    "<p>Bravely Default</p>",
    "<p>Flying Fairy</p>",
    ];

var loadFontExamples = function (numExamples) {
    var max = Math.min(currentFontListLoadedCount + (numExamples || 10), currentFontList.length);
    var delay = 20;

    for(; currentFontListLoadedCount < max; currentFontListLoadedCount++) {
        var fontName = currentFontList[currentFontListLoadedCount];
        var $divExample = createFontExampleDiv(fontName);
        $("#divFontExamples").append($divExample);
        setTimeout((function (name, $div, ndx) {
            return function() {
                loadFontFace(name, $div, ndx);
                //updateSampleText($div, name);
                getAddFontButton($div).click(function() {
                    doToggleSelectFont($div);
                });
            }
        })(fontName, $divExample, currentFontListLoadedCount + 1), delay);
        delay += 200;
    }
};

var highlightSearchTerm = function (text, filterByValue) {
    var prefix = "<span style='background-color:#ff7;'>";
    var suffix = "</span>";
    if(text === filterByValue) {
        return prefix + text + suffix;
    } else if(text && filterByValue && text.toLowerCase().includes(filterByValue.toLowerCase())) {
        return text.replace(
            new RegExp($.escapeRegExp(filterByValue), "i"),
            prefix + filterByValue + suffix
        );
    } else {
        return text;
    }
};

var escapeFontFaceName = function(name) {
    var result = (name || "").replace(/[!\.\[\]&\s]/g, "-");
    return "fp-" + result;
};

var loadedFontFaces = {};

var loadFontFaceErrorMessage = function($divExample, infoText, errorText) {
    var message =
        (infoText ? infoText + "<br/>" : "") +
        (errorText ? "<strong>ERROR:</strong> " + errorText : "");
    $divExample.addClass("example-error");
    $divExample.children("div.info").html(message);
};

var loadFontFace = function (fontName, $divExample, ndx) {
    var index = window.parent.indexByFont[fontName];
    if(index && index.length > 0) {
        var indexes = index[0].split("/");
        if(indexes && indexes.length > 3) {
            var v = vendors[indexes[0]];
            var l = v.licenses[indexes[1]];
            var ff = l.fontFamilies[indexes[2]];
            var f = ff.fonts[indexes[3]];
            var url = BASE_PATH +
                "assets/data/fontdata/" +
                v.name + "_" +
                l.name + "_" +
                ff.name.replace(/_/gm, "-").replace(/\-/gm, " ") + "_" +
                f.postScriptName + ".json";

            var vendorName =
                highlightSearchTerm(v.name, window.parent.filterByVendor);
            var licenseName =
                highlightSearchTerm(l.name.replace(/various/, "unknown"), window.parent.filterByLicense);
            var categoryName =
                highlightSearchTerm(ff.category, window.parent.filterByCategory);
            var fontName =
                highlightSearchTerm(f.postScriptName, $("#txtSearchFonts").val());
            var weightName =
                highlightSearchTerm("" + f.weight, window.parent.filterByWeight);

            var infoText =
                "#" + ndx +
                ": Vendor: " + vendorName +
                ", Family: " + ff.name +
                ", Font: " + fontName +
                ", License: " + licenseName +
                ", <br/>" +
                "Category: " + categoryName +
                ", Format: " + f.uriFormat +
                ", Weight: " + weightName;

            if(loadedFontFaces[f.postScriptName] === undefined) {
                $.get(
                    encodeURI(url),
                    {},
                    function (data, statusText, bar) {
                        $divExample.removeClass("example-loading");
                        if(statusText === "success") {
                            try {
                                var face = new FontFace(
                                    escapeFontFaceName(f.postScriptName),
                                    "url(data:" + f.uriFormat.replace(/font\//, "application/x-font-") +
                                    ";charset=utf-8;base64," +
                                    data.replace(/[\r\n]*/gm, "") + ")",
                                    {}
                                );
                                if(face.status === "error") {
                                    loadFontFaceErrorMessage($divExample, infoText, face["[[PromiseValue]]"]);
                                } else {
                                    face.load().then(
                                        function (fontFace) {
                                            try {
                                                document.fonts.add(fontFace);
                                                loadedFontFaces[f.postScriptName] = fontFace;
                                                $divExample.children("div.sample").css({"font-family": escapeFontFaceName(f.postScriptName)});
                                                $divExample.children("div.info").html(infoText);
                                            } catch (e) {
                                                loadFontFaceErrorMessage($divExample, infoText, e);
                                            }
                                            var appliedFF = $divExample.children("div.sample").first().css("font-family").replace(/['"]/g, "");
                                            var isApplied = appliedFF === escapeFontFaceName(f.postScriptName);
                                            if (loadedFontFaces[f.postScriptName] === undefined || !isApplied) {
                                                loadFontFaceErrorMessage($divExample, infoText, "Font loaded, but could not apply to sample text. ['" +
                                                    appliedFF +
                                                    "' != '" +
                                                    escapeFontFaceName(f.postScriptName) +
                                                    "']");
                                                $divExample.children("div.sample")
                                                    .css({"font-family": escapeFontFaceName(f.postScriptName)});
                                                loadedFontFaces[f.postScriptName] = undefined
                                            }
                                        },
                                        function (e) {
                                            loadFontFaceErrorMessage($divExample, infoText, e);
                                            $divExample.children("div.sample")
                                                .css({"font-family": escapeFontFaceName(f.postScriptName)});
                                        }
                                    );
                                }
                            } catch (e) {
                                loadFontFaceErrorMessage($divExample, infoText, e);
                                $divExample.children("div.sample")
                                    .css({"font-family": escapeFontFaceName(f.postScriptName)});
                            }
                        } else {
                            loadFontFaceErrorMessage($divExample, infoText, statusText);
                            $divExample.children("div.sample")
                                .css({"font-family": escapeFontFaceName(f.postScriptName)});
                        }
                        updateSampleText($divExample);
                    },
                    "text"
                );
            } else {
                $divExample.removeClass("example-loading");
                $divExample.children("div.sample").css({"font-family": escapeFontFaceName(f.postScriptName) });
                $divExample.children("div.info").html(infoText);
                updateSampleText($divExample);
            }
        }
    }
};

var updateSampleText = function($divExample, fontName) {
    var doUpdateSampleText =
        !$divExample.hasClass("example-selected") &&
        !$divExample.hasClass("example-error") &&
        !$divExample.hasClass("example-loading");
    if(doUpdateSampleText) {
        var $divSample = $divExample.children("div.sample");
        if (!fontName) {
            fontName = $divSample.siblings("div.controls").children("input.fontName").first().val();
        }
        var txtShowAs = $("#txtShowAs").val() || "FontName";
        if (txtShowAs === "Paragraph") {
            $divSample.html(SAMPLE_TEXT_PARAGRAPH);
        } else if (txtShowAs === "Sentence") {
            $divSample.html($.rand(SAMPLE_TEXT_SENTENCE));
        } else if (txtShowAs === "Title") {
            $divSample.html($.rand(SAMPLE_TEXT_TITLE));
        } else if (txtShowAs === "FontName") {
            $divSample.html("<p>" + fontName + "</p>");
        } else {
            $divSample.html("").append($("<p>").text(txtShowAs));
        }

        var txtFontSize = getCurrentFontSize();

        $divSample.find("p").each(function () {
            $(this).css("font-size", txtFontSize);
        });
    }

    currentFontScrollTop = $(window).scrollTop();
};

var doShowAsOrFontSizeChanged = function() {
    if($("#txtFontSize").val() === "Default") { $("#txtFontSize").val(""); }
    if($("#txtShowAs").val() === "FontName") { $("#txtShowAs").val(""); }
    $("#divFontExamples div.example").each(function () {
        updateSampleText($(this));
    });
};

var highlightActiveFilterDropdowns = function () {
    $("#ddlVendor")
        .removeClass("btn-info").removeClass("btn-default")
        .addClass(window.parent.filterByVendor ? "btn-info" : "btn-default");
    $("#ddlLicense")
        .removeClass("btn-info").removeClass("btn-default")
        .addClass(window.parent.filterByLicense ? "btn-info" : "btn-default");
    $("#ddlCategory")
        .removeClass("btn-info").removeClass("btn-default")
        .addClass(window.parent.filterByCategory ? "btn-info" : "btn-default");
    $("#ddlWeight")
        .removeClass("btn-info").removeClass("btn-default")
        .addClass(window.parent.filterByWeight ? "btn-info" : "btn-default");
}

var doVendorOrLicenseOrCategoryOrWeightOrSearchChanged = function () {
    if($("#txtVendor").val() === "All") { $("#txtVendor").val(""); }
    if($("#txtLicense").val() === "All") { $("#txtLicense").val(""); }
    if($("#txtCategory").val() === "All") { $("#txtCategory").val(""); }
    if($("#txtWeight").val() === "All") { $("#txtWeight").val(""); }
    currentFontList = window.parent.fontNamesThatMatchAllFilters(
        window.parent.initFilterByValues(
            $("#txtSearchFonts").val(),
            $("#txtVendor").val(),
            $("#txtLicense").val(),
            $("#txtCategory").val(),
            $("#txtWeight").val()
        )
    );
    highlightActiveFilterDropdowns();
    clearFontExamples();
    loadFontExamples();
};

var doSearchFontsClicked = function () {
    doVendorOrLicenseOrCategoryOrWeightOrSearchChanged();
};

$(document).ready(function () {
    vendors = window.parent["vendors"] || [];
    BASE_PATH = window.parent["BASE_PATH"] || "/";

    // assume parent loaded font data, init indices
    //window.parent.initTypeahead();
    //window.parent.fontNamesThatMatchAllFilters();
    $("#txtSearchFonts").typeahead(
        { hint: true, highlight: true, minLength: 1 },
        { name: "titles", limit: 10, source: window.parent.substringMatcher(window.parent.initTypeaheadResultList) }
    );

    // fix inline styles set by initTypeahead ... :/

    $("#groupSearchFonts span.twitter-typeahead").css("position", "").css("display", "");
    $("#cmdSearchFonts").css("position", "relative").css("display", "").css("z-index", "444");

    // populate dropdowns

    var $ul = $("#ddlVendor").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < window.parent.dropdownVendor.length; i++) {
        $ul.append($("<li>").append($("<a>").text(window.parent.dropdownVendor[i]).prop("href", "#null")));
    }

    var $ul = $("#ddlLicense").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < window.parent.dropdownLicense.length; i++) {
        $ul.append($("<li>").append($("<a>").text(window.parent.dropdownLicense[i]).prop("href", "#null")));
    }

    $ul = $("#ddlCategory").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < window.parent.dropdownCategory.length; i++) {
        $ul.append($("<li>").append($("<a>").text(window.parent.dropdownCategory[i]).prop("href", "#null")));
    }

    $ul = $("#ddlWeight").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < window.parent.dropdownWeight.length; i++) {
        $ul.append($("<li>").append($("<a>").text(window.parent.dropdownWeight[i]).prop("href", "#null")));
    }

    // register event handlers

    $("#cmdSearchFonts").click(function () {
        doSearchFontsClicked();
    });

    $("#txtSearchFonts").keypress(function (e) {
        if(e.keyCode === 13) doSearchFontsClicked();
    });

    $("#txtShowAs").siblings("ul").children("li").click(function () {
        $("#txtShowAs").val($(this).text()); doShowAsOrFontSizeChanged();
    });

    $("#txtShowAs").keypress(function (e) {
        if(e.keyCode === 13) doShowAsOrFontSizeChanged();
    });

    $("#txtFontSize").siblings("ul").children("li").click(function () {
        $("#txtFontSize").val($(this).text()); doShowAsOrFontSizeChanged();
    });

    $("#txtFontSize").keypress(function (e) {
        if(e.keyCode === 13) doShowAsOrFontSizeChanged();
    });

    $("#ddlVendor").siblings("ul").children("li").click(function () {
        $("#txtVendor").val($(this).text()); doVendorOrLicenseOrCategoryOrWeightOrSearchChanged();
    });

    $("#ddlLicense").siblings("ul").children("li").click(function () {
        $("#txtLicense").val($(this).text()); doVendorOrLicenseOrCategoryOrWeightOrSearchChanged();
    });

    $("#ddlCategory").siblings("ul").children("li").click(function () {
        $("#txtCategory").val($(this).text()); doVendorOrLicenseOrCategoryOrWeightOrSearchChanged();
    });

    $("#ddlWeight").siblings("ul").children("li").click(function () {
        $("#txtWeight").val($(this).text()); doVendorOrLicenseOrCategoryOrWeightOrSearchChanged();
    });

    $(window).scroll(function() {
        var $modalBody = window.parent.getHostElementUsingJQuery("#popupFontPickerModalBody");

        if($(window).scrollTop() + $modalBody.height() >= $(document).height() - 200) {
            if($(window).scrollTop() >= currentFontScrollTop) {
                currentFontScrollTop = $(window).scrollTop();
                loadFontExamples();
            }
        }
    });

    // populate UI with fonts to select

    doSearchFontsClicked();
});



