/*
Copyright (c) 2014 Joseph B. Hall [@groundh0g]

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
$("#cmdFileNew").click(function() { return DoFileNew(); });
$("#cmdFileOpen").click(function() { return DoFileOpen(); });
$("#cmdFileSave").click(function() { return DoFileSave(); });
$("#cmdSpriteAdd").click(function() { return DoSpriteAdd(); });
$("#cmdSpriteRemove").click(function() { return DoSpriteRemove(); });
$("#cmdRefresh").click(function() { OnValueChanged(); });
$("#cmdPublish").click(function() { return DoPublish(); });
$("#cmdToggleHelp").click(function() { return DoToggleHelp(); });
$("#cmdToggleSettings").click(function() { return DoToggleSettings(); } )

// -- LEFT SIDEBAR --
$("#txtName").keyup(function(event) { return UpdateSpinBox("txtName", event, 13); });
$("#ddlImageFormatOptions li a").click(function() { return UpdateDropDownValue("ddlImageFormat", $(this)); });
$("#ddlDataFormatOptions li a").click(function() { return UpdateDropDownValue("ddlDataFormat", $(this)); });
$("#ddlNameInSheetOptions li a").click(function() { return UpdateDropDownValue("ddlNameInSheet", $(this)); });
// NOTE: ddlSpritePacker and ddlSortBy are handled in $(document).ready(); [in sheets.js]
$("#ddlAllowRotateOptions li a").click(function() { return UpdateDropDownValue("ddlAllowRotate", $(this)); });
$("#txtWidthOptions li a").click(function() { return UpdateDropDownValueInput("txtWidth", $(this)); });
$("#txtWidth").keyup(function(event) { return UpdateSpinBox("txtWidth", event); });
$("#txtHeightOptions li a").click(function() { return UpdateDropDownValueInput("txtHeight", $(this)); });
$("#txtHeight").keyup(function(event) { return UpdateSpinBox("txtHeight", event); });
$("#ddlSizeModeOptions li a").click(function() { return UpdateDropDownValue("ddlSizeMode", $(this)); });
$("#ddlConstraintOptions li a").click(function() { return UpdateDropDownValue("ddlConstraint", $(this)); });
$("#ddlForceSquareOptions li a").click(function() { return UpdateDropDownValue("ddlForceSquare", $(this)); });
$("#ddlIncludeAt2xOptions li a").click(function() { return UpdateDropDownValue("ddlIncludeAt2x", $(this)); });
$("#txtBorderPadding").keyup(function(event) { return UpdateSpinBox("txtBorderPadding", event); });
$("#txtShapePadding").keyup(function(event) { return UpdateSpinBox("txtShapePadding", event); });
$("#txtInnerPadding").keyup(function(event) { return UpdateSpinBox("txtInnerPadding", event); });
$("#ddlCleanAlphaOptions li a").click(function() { return UpdateDropDownValue("ddlCleanAlpha", $(this)); });
$("#ddlColorMaskOptions li a").click(function() { return UpdateDropDownValue("ddlColorMask", $(this)); });
$("#ddlAliasSpritesOptions li a").click(function() { return UpdateDropDownValue("ddlAliasSprites", $(this)); });
$("#ddlDebugModeOptions li a").click(function() { return UpdateDropDownValue("ddlDebugMode", $(this)); });
$("#ddlTrimModeOptions li a").click(function() { return UpdateDropDownValue("ddlTrimMode", $(this)); });
$("#txtTrimThreshold").keyup(function(event) { return UpdateSpinBox("txtTrimThreshold", event); });
$("#ddlAnimatedGifOptions li a").click(function() { return UpdateDropDownValue("ddlAnimatedGif", $(this)); });
$("#ddlCompressProjectOptions li a").click(function() { return UpdateDropDownValue("ddlCompressProject", $(this)); });

// -- WORKSPACE TOOLBAR --
$("#txtWorkspaceZoomOptions li a").click(function() { return UpdateDropDownValueInput("txtWorkspaceZoom", $(this)); });

// -- RIGHT NAV --
$("#radioRightNav button").click(function() {
	$(this).addClass('active').siblings().removeClass('active');
	if($(this).attr("id") === "tabSprites") {
		$("#divConsole").hide();
		$("#divSpritesList").show();
	} else {
		$("#divSpritesList").hide();
		$("#divConsole").show();
	}
});

// -- POPUPS --
$("#cmdUploadSprites").click(function(){ $("#uploadSprites").click(); });
$("#cmdUploadProject").click(function(){ $("#uploadProject").click(); });

//DoToggleHelp();

$(window).on('beforeunload', function(e) {
	var prompt = PromptUserIfDirty();
	if(e && typeof e.returnValue != "undefined") { e.returnValue = prompt; }
	return prompt;
});
