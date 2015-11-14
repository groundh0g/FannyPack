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

{% include app-fragments/fonts/dialogs/fontPicker.html %}

<div id="foo" style="display:none;"></div>

<script type="text/javascript">

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
            $("#frameFontPicker").prop("src", "fontPickerFrame.html");
            $("#popupFontPickerModal").modal("show");
        });
    }
</script>