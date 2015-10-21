---
layout: page
title: FannyPack
tagline: a suite of &#35;gamedev tools
description: FannyPack is a suite of &#35;gamedev tools.
pagename: fonts
---
{% include JB/setup %}

![Sprite Fonts]({{BASE_PATH}}assets/img/index/iconSpriteFonts@2x.png "Sprite Fonts are Coming Soon.")

<div id="foo"></div>

<script type="text/javascript">
    var FontList = [];
    var FontMeta = {};
    
    function appendFonts(data, vendor, propName, propPath) {
        var meta = [];
        for(var i = 0; i < data.length; i++) {
            var name = data[i][propName || "name"];
            var path = data[i][propPath || "path"];
            vendor = vendor || "unknown";
            FontList.push(name);
            meta.push({ name: name, path: path, vendor: vendor });
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
    
    window.onload = function() {
        $.getJSON("https://api.github.com/repos/google/fonts/contents/apache",
            null,
            function(data, textStatus, jqXHR) {
                appendFonts(data, "google", "name", "path");
                console.log("DONE: apache");
                //console.log(data);
            }
        );
        $.getJSON("https://api.github.com/repos/google/fonts/contents/ofl",
            null,
            function(data, textStatus, jqXHR) {
                appendFonts(data, "google", "name", "path");
                console.log("DONE: ofl");
                //console.log(data);
            }
        );
    };
</script>