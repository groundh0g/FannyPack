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

function FontManager(basePath) {
    basePath = basePath || "/";
    var that = this;

    var loadedFontFaces = {};
    var doNothing = function () { };

    this.loadFontFromUrl = function(url, fontName, format, $divExample, infoHtml, onSuccess, onError) {
        var fontNameEscaped = FontManager.escapeFontFaceName(fontName);

        url = url || "";
        fontName = fontName || "";
        format = format || "";
        $divExample = $divExample || $("<div>");
        infoHtml = infoHtml || "";
        onSuccess = onSuccess || doNothing();
        onError = onError || doNothing();

        if(loadedFontFaces[fontName] === undefined) {
            $.get(
                encodeURI(url),
                {},
                function (data, statusText, bar) {
                    if(statusText === "success") {
                        try {
                            var face = new FontFace(
                                fontNameEscaped,
                                "url(data:" + format.replace(/font\//, "application/x-font-") +
                                ";charset=utf-8;base64," +
                                data.replace(/[\r\n]*/gm, "") + ")",
                                {}
                            );
                            if(face.status === "error") {
                                onError($divExample, infoHtml, face["[[PromiseValue]]"]);
                            } else {
                                face.load().then(
                                    function (fontFace) {
                                        try {
                                            document.fonts.add(fontFace);
                                            loadedFontFaces[fontName] = fontFace;
                                            onSuccess($divExample, infoHtml, fontNameEscaped);
                                        } catch (e) {
                                            onError($divExample, infoHtml, e);
                                        }
                                        var appliedFF = $divExample.children("div.sample").first().css("font-family").replace(/['"]/g, "");
                                        var isApplied = appliedFF === fontNameEscaped;
                                        if (loadedFontFaces[fontName] === undefined || !isApplied) {
                                            onError($divExample, infoHtml,
                                                "Font loaded, but could not apply to sample text. ['" +
                                                appliedFF +
                                                "' != '" +
                                                fontNameEscaped +
                                                "']"
                                            );
                                            $divExample.children("div.sample").css({"font-family": fontNameEscaped});
                                            loadedFontFaces[fontName] = undefined
                                        }
                                    },
                                    function (e) {
                                        onError($divExample, infoHtml, e);
                                        $divExample.children("div.sample").css({"font-family": fontNameEscaped});
                                    }
                                );
                            }
                        } catch (e) {
                            onError($divExample, infoHtml, e);
                            $divExample.children("div.sample").css({"font-family": fontNameEscaped});
                        }
                    } else {
                        onError($divExample, infoHtml, e);
                        $divExample.children("div.sample").css({"font-family": fontNameEscaped});
                    }
                },
                "text"
            );
        } else {
            onSuccess($divExample, infoHtml, fontNameEscaped);
        }
    };
}

FontManager.escapeFontFaceName = function(name) {
    var result = (name || "").replace(/[!\.\[\]&\s]/g, "-");
    return "fp-" + result;
};