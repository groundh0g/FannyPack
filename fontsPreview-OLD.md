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
</form>

<div id="foo" style="display:none;"></div>
<div style="clear:both;"></div>

<div id="preview" style="color:#777;">
    <h1>Sample</h1>
    <p style="font-size:2.00em;">The quick brown fox jumps over the lazy dog.</p>
    <p style="font-size:1.50em;">The quick brown fox jumps over the lazy dog.</p>
    <p style="font-size:1.00em;">The quick brown fox jumps over the lazy dog.</p>
    <p style="font-size:0.75em;">The quick brown fox jumps over the lazy dog.</p>
</div>

<script type="text/javascript" src="{{BASE_PATH}}/script/search.js"></script>

<script type="text/javascript">
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
                meta.push({ name: name, path: path, vendor: vendor || "unknown" });
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
    
    var loadedFontLists = {
        "googleApache": false,
        "googleOfl":    false
    };
    
    function initSearch() {
        if(loadedFontLists["googleApache"] && loadedFontLists["googleOfl"]) {
            initTypeahead(FontList);
        }
    }
    
    window.onload = function() {
        $.getJSON("https://api.github.com/repos/google/fonts/contents/apache",
            null,
            function(data, textStatus, jqXHR) {
                appendFonts(data, "google", "name", "path");
                loadedFontLists["googleApache"] = true;
                initSearch();
            }
        );
        $.getJSON("https://api.github.com/repos/google/fonts/contents/ofl",
            null,
            function(data, textStatus, jqXHR) {
                appendFonts(data, "google", "name", "path");
                loadedFontLists["googleOfl"] = true;
                initSearch();
            }
        );
        $("#cmdSearch").click(function() {
            var name = $("#txtSearch").val();
            var root = "https://api.github.com/repos/google/fonts/contents";
            var group = "/" + FontMeta[name].path;
            var path = "/METADATA.json?ref=master";
            var url = root + group + path;
console.log("1: " + url);
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
                        var group = "/" + FontMeta[name].path; // "/apache";
                        var path = "/" + fonts[0]["filename"] + "?ref=master";
                        var url = root + group + path;
console.log("2: " + url);
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
        });
    };
</script>