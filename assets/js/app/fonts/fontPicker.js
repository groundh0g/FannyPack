var vendors = vendors || [];
var BASE_PATH = BASE_PATH || "/";
var currentFontList = currentFontList || [];
var currentFontListLoadedCount = 0;
var currentFontScrollTop = 0;

var clearFontExamples = function () {
    // window.location.hash = "#fontsExample";
    $("#divFontExamples").html("");
    currentFontListLoadedCount = 0;
    currentFontScrollTop = 0;
    window.parent.setSelectedFontCount(0);
    window.parent.setTotalFontCount(currentFontList.length);
};

var createFontExampleDiv = function (name, selected, size) {
    name = name || "";
    var $divExample = $("<div>").addClass("example");
    var $divControls = $("<div>").addClass("controls")
            .html(
                "<div class='btn " + (selected ? "btn-primary" : "btn-default") + "'>" +
                "<i class='fa fa-" + (selected ? 'check-' : '') + "square-o'></i> Add Font" +
                "</div>" +
                "<span class='fontSize'></span>" +
                "<input type='hidden' class='fontName' value='" + name + "' />");
    var $divSample = $("<div>").addClass("sample").html("<img src='assets/img/loading.gif' />");
    var $divInfo = $("<div>").addClass("info").text("Loading " + name + " ...");
    return $divExample
        .append($divControls)
        .append($divSample)
        .append($divInfo);
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
        //var $divSample = $divExample.find("div.sample").first();
        setTimeout((function (name, $div, ndx) {
            return function() {
                loadFontFace(name, $div, ndx);
                updateSampleText($div, name);
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

var loadedFontFaces = {};

var loadFontFace = function (fontName, $divExample, ndx) {
    var index = indexByFont[fontName];
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
                highlightSearchTerm(v.name, filterByVendor);
            var licenseName =
                highlightSearchTerm(l.name.replace(/various/, "unknown"), filterByLicense);
            var categoryName =
                highlightSearchTerm(ff.category, filterByCategory);
            var fontName =
                highlightSearchTerm(f.postScriptName, $("#txtSearchFonts").val());

            var infoText =
                "#" + ndx +
                ": Vendor: " + vendorName +
                ", Family: " + ff.name +
                ", Font: " + fontName +
                ", License: " + licenseName +
                ", Category: " + categoryName;

            if(loadedFontFaces[f.postScriptName] === undefined) {
                $.get(
                    encodeURI(url),
                    {},
                    function (data, foo, bar) {
                        if(foo === "success") {
                            try {
                                var face = new FontFace(
                                    f.postScriptName,
                                    "url(data:" + f.uriFormat.replace(/font\//, "application/") +
                                    ";charset=utf-8;base64," +
                                    data.replace(/[\r\n]*/gm, "") + ")",
                                    {}
                                );
                                face.load().then(
                                    function (fontFace) {
                                        try {
                                            document.fonts.add(fontFace);
                                            loadedFontFaces[f.postScriptName] = fontFace;
                                            $divExample.children("div.sample").css({"font-family": f.postScriptName});
                                            $divExample.children("div.info").html(infoText);
                                        } catch(e) {
                                            parent.window.logError(e);
                                        }
                                        var appliedFF = $divExample.children("div.sample").first().css("font-family").replace(/['"]/g, "");
                                        var isApplied = appliedFF === f.postScriptName;
                                        if(loadedFontFaces[f.postScriptName] === undefined || !isApplied) {
                                            $divExample.children("div.sample")
                                                .css({"font-family": f.postScriptName})
                                                .css("background-color", "#fdd");
                                            $divExample.children("div.info")
                                                .html(
                                                infoText +
                                                "<br/>" +
                                                "<strong>ERROR:</strong> Font loaded, but could not apply to sample text. ['" +
                                                appliedFF +
                                                "' != '" +
                                                f.postScriptName +
                                                "']"
                                            );
                                            loadedFontFaces[f.postScriptName] = undefined
                                        }
                                    },
                                    function (e) {
                                        $divExample.children("div.sample")
                                            .css({"font-family": f.postScriptName})
                                            .css("background-color", "#fdd");
                                        $divExample.children("div.info")
                                            .html(
                                            infoText +
                                            "<br/>" +
                                            "<strong>ERROR:</strong> Font failed to load."
                                        );
                                    }
                                );
                            } catch (e) {
                                window.parent.logError(e);
                            }
                        } else {
                            window.parent.logError("Status: " + foo);
                        }
                    },
                    "text"
                );
            } else {
                $divExample.children("div.sample").css({"font-family": f.postScriptName });
                $divExample.children("div.info").html(infoText);
            }
        }
    }
};

var updateSampleText = function($divExample, fontName) {
    var $divSample = $divExample.children("div.sample");
    if(!fontName) {
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

    var txtFontSize = $("#txtFontSize").val();
    if(txtFontSize === "") {
        switch(txtShowAs) {
            case "Paragraph": txtFontSize = SAMPLE_TEXT_PARAGRAPH_DEFAULT_SIZE; break;
            case "Sentence": txtFontSize = SAMPLE_TEXT_SENTENCE_DEFAULT_SIZE; break;
            case "Title": txtFontSize = SAMPLE_TEXT_TITLE_DEFAULT_SIZE; break;
            case "FontName": txtFontSize = SAMPLE_TEXT_TITLE_DEFAULT_SIZE; break;
            default: txtFontSize = SAMPLE_TEXT_SENTENCE_DEFAULT_SIZE; break;
        }
    }

    $divSample.find("p").each(function(){
        $(this).css("font-size", txtFontSize);
    });

    currentFontScrollTop = $(window).scrollTop();
};

var doShowAsOrFontSizeChanged = function() {
    if($("#txtFontSize").val() === "Default") { $("#txtFontSize").val(""); }
    $("#divFontExamples div.example").each(function () {
        updateSampleText($(this));
    });
};

var doVendorOrLicenseOrCategoryChanged = function () {
    if($("#txtVendor").val() === "All") { $("#txtVendor").val(""); }
    if($("#txtLicense").val() === "All") { $("#txtLicense").val(""); }
    if($("#txtCategory").val() === "All") { $("#txtCategory").val(""); }
    fontNamesThatMatchAllFilters(initFilterByValues($("#txtSearchFonts").val()));
    clearFontExamples();
    loadFontExamples();
};

var doSearchFontsClicked = function () {
    doVendorOrLicenseOrCategoryChanged();
};

$(document).ready(function () {
    vendors = window.parent["vendors"] || [];
    BASE_PATH = window.parent["BASE_PATH"] || "/";

    // assume parent loaded font data, init indices

    initSearchIndexes();
    initTypeahead();
    fontNamesThatMatchAllFilters();

    // fix inline styles set by initTypeahead ... :/

    $("#groupSearchFonts span.twitter-typeahead").css("position", "").css("display", "");
    $("#cmdSearchFonts").css("position", "relative").css("display", "").css("z-index", "444");

    // populate dropdowns

    var $ul = $("#ddlVendor").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < dropdownVendor.length; i++) {
        $ul.append($("<li>").append($("<a>").text(dropdownVendor[i]).prop("href", "#null")));
    }

    var $ul = $("#ddlLicense").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < dropdownLicense.length; i++) {
        $ul.append($("<li>").append($("<a>").text(dropdownLicense[i]).prop("href", "#null")));
    }

    $ul = $("#ddlCategory").siblings("ul");
    $ul.html("");
    $ul.append($("<li>").append($("<a>").text("All").prop("href", "#null")));
    $ul.append($("<li>").prop("role", "separator").addClass("divider"));
    for(var i = 0; i < dropdownCategory.length; i++) {
        $ul.append($("<li>").append($("<a>").text(dropdownCategory[i]).prop("href", "#null")));
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
        $("#txtVendor").val($(this).text()); doVendorOrLicenseOrCategoryChanged();
    });

    $("#ddlLicense").siblings("ul").children("li").click(function () {
        $("#txtLicense").val($(this).text()); doVendorOrLicenseOrCategoryChanged();
    });

    $("#ddlCategory").siblings("ul").children("li").click(function () {
        $("#txtCategory").val($(this).text()); doVendorOrLicenseOrCategoryChanged();
    });

    window.parent.registerViewSelectedClickHandler();

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



