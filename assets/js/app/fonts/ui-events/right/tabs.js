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

var onTopTabChanged = function(text) {
    if(text === "Fonts") {
        $(".divSidebarRightTop").css("bottom", "254px");
        $(".divSidebarRightBottom").show()
    } else {
        $(".divSidebarRightTop").css("bottom", "0");
        $(".divSidebarRightBottom").hide();
    }
};

var onBottomTabChanged = function(text) { };

// -- TOP TABS --
$("#tabSidebarRightTop").children("li").click(function(event){
    var $this = $(this);
    $this.siblings("li").removeClass("active");
    $this.addClass("active");

    $("#divRightTopToolbars").siblings("div").hide();
    $("#divRightTopLists").siblings("div").hide();
    var title = $this.children("a").attr("title").replace(" ", "");
    $("#div" + title + "Toolbar").show();
    $("#div" + title + "List").show();
    onTopTabChanged(title);
});

// -- BOTTOM TABS --
$("#tabSidebarRightBottom").children("li").click(function(event){
    var $this = $(this);
    $this.siblings("li").removeClass("active");
    $this.addClass("active");

    $("#divRightBottomToolbars").siblings("div").hide();
    $("#divRightBottomLists").siblings("div").hide();
    var title = $this.children("a").attr("title").replace(" ", "");
    $("#div" + title + "Toolbar").show();
    $("#div" + title + "List").show();
    onBottomTabChanged(title);
});
