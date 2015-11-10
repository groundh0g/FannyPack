---
layout: page
title: FannyPack
tagline: a suite of &#35;gamedev tools
description: FannyPack is a suite of &#35;gamedev tools.
pagename: fonts
isApp: true
---
{% include JB/setup %}

<div style="clear:both;"></div>

<form class="navbar-form navbar-right" role="xsearch" action="/search.html">
    <div class="form-group">
      <input id="txtSearch" name="txtSearch" type="text" class="typeahead form-control" autocomplete="off" spellcheck="false" placeholder="Search" />
    </div>
    <input id="cmdSearch" class="btn btn-default" type="button" value="Go!">
    <input id="cmdGetFontDetails" class="btn btn-default" type="button" value="Popup">
</form>

<div style="clear:both;"></div>

<div id="preview" style="color:#777;">
    <h1>Sample</h1>
    <p style="font-size:2.00em;">The quick brown fox jumps over the lazy dog.</p>
    <p style="font-size:1.50em;">The quick brown fox jumps over the lazy dog.</p>
    <p style="font-size:1.00em;">The quick brown fox jumps over the lazy dog.</p>
    <p style="font-size:0.75em;">The quick brown fox jumps over the lazy dog.</p>
</div>

{% include app-fragments/fonts/dialogs/fontpicker.html %}

<div id="foo" style="display:none;"></div>

<script type="text/javascript" src="{{BASE_PATH}}/script/search.js"></script>

<script type="text/javascript">
/*
    var FontList = [];
    var FontMeta = {};
    
    function appendFonts(data, vendor, propName, propPath) {
        if(data) {
            var meta = [];
            for(var i = 0; i < data.length; i++) {
                var name = data[i][propName || "name"];
                var path = data[i][propPath || "path"];
                vendor = vendor || "unknown";
                FontList.push(name);
                meta.push({ 
                    name: name, 
                    path: path, 
                    vendor: vendor || "unknown",
                    display: path // name + " [" + path + "]"
                });
            }
            FontList.sort();
            meta.sort(function (a,b) {
                return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
            });
            var html = "";
            for(var i = 0; i < meta.length; i++) {
                html += "<br/>" + meta[i].name + " [" + meta[i].vendor + ":" + meta[i].path + "]";
                FontMeta[meta[i].name] = meta[i];
            }
            $("#foo").html(html);
        }
    }

    function initSearch() {
        if(loadedFontLists["googleApache"] && loadedFontLists["googleOfl"]) {
            var list = [];
            for(var i = 0; i < FontList.length; i++) {
                list.push(FontMeta[FontList[i]].display);
            }
            list.sort();
            initTypeahead(list);
            
        }
    }
    
    function findMetaByDisplay(display) {
        var result = null;
        for(var i = 0; i < FontList.length; i++) {
            var meta = FontMeta[FontList[i]];
            if(meta && meta.display === display) {
                result = meta;
                break;
            }
        }
        return result;
    }

    function buildFontList(fontdata) {
        var fontlist = [];
        for(var i = 0; i < licenses.length; i++) {
            var families = fontdata[licenses[i]]; 
            for(var j = 0; j < families.length; j++) {
                var fonts = families[j].fonts;
                for(var k = 0; fonts && k < fonts.length; k++) {
                    var display = fonts[k].postScriptName || fonts[k].fullName || fonts[k].name;
                    fonts[k].display = display;
                    fontlist.push(fonts[k])
                }
            }
        }
        fontlist.sort(function (a,b) {
            a = a.display.toLowerCase();
            b = b.display.toLowerCase();
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        });
        var html = "";
        for(var i = 0; i < fontlist.length; i++) {
            html += fontlist[i].display + "<br/>";
        }
        $("#foo").html(html).show();
        console.log(fontlist);
    }
*/

    var vendors = [];
    
    window.onload = function() {
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

        $.getJSON(
            "{{BASE_PAGE}}/assets/data/fontlist.json",
            null,
            function(data, textStatus, jqXHR) {
                vendors = data;
                initSearchIndexes();
            }
        );

        $("#cmdSearch").click(function() {
            var name = $("#txtSearch").val();
            var meta = findMetaByDisplay(name);
            if(meta) {
                var root = "https://api.github.com/repos/google/fonts/contents";
                var group = "/" + meta.path;
                var path = "/METADATA.json?ref=master";
                var url = root + group + path;
                $.getJSON(
                    url,
                    null,
                    function(data, textStatus, jqXHR) {
                        var content = base64.decode(data.content);
                        var metadata = $.parseJSON(content);
                        var fonts = metadata["fonts"];
                        if(fonts && fonts.length > 0) {
                            var name = $("#txtSearch").val();
                            var root = "https://api.github.com/repos/google/fonts/contents";
                            var group = "/" + meta.path;
                            var path = "/" + fonts[0]["filename"] + "?ref=master";
                            var url = root + group + path;
console.log(url);
                            $.getJSON(
                                url,
                                null,
                                function(data, textStatus, jqXHR) {
                                    previewFF = new FontFace(
                                        "previewFontFamily",
                                        "url(data:font/ttf;charset=utf-8;base64," + data.content.replace(/[\r\n]*/gm, "") + ")",
                                        {}
                                    );
                                    previewFF.load().then(function(ff) {
                                        document.fonts.add(ff);
                                        $("#preview").css({"font-family": "previewFontFamily"});
                                    });
                                }
                            );
                        }
                    }
                );
            }
        });
        
        $("#cmdGetFontDetails").click(function() {
            $("#frameFontPicker").prop("src", "fontPickerFrame.html?_=" + Date.now());
            $("#popupFontPickerModal").modal("show");
        });
    }
</script>