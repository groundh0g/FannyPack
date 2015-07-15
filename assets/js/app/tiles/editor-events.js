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

// -- TOOLBAR --
		$("#cmdFileNew").click(function() { return DoFileNew(); });
		$("#cmdFileOpen").click(function() { return DoFileOpen(); });
		$("#cmdFileSave").click(function() { return DoFileSave(); });
		$("#cmdSpriteAdd").click(function() { return DoSpriteAdd(); });
		$("#cmdSpriteRemove").click(function() { return DoSpriteRemove(); });
		$("#cmdRefresh").click(function() { OnValueChanged(); return true; });
		$("#cmdPublish").click(function() { DoPublish(); return true; });
		$("#cmdToggleHelp").click(function() { return DoToggleHelp(); });
		$("#cmdFileOptions").click(function() { return DoToggleSettings(); } )

// -- LEFT SIDEBAR --
		$("#txtName").keyup(function(event) { return UpdateSpinBox("txtName", event, 13); });
		//$("#ddlImageFormatOptions li a").click(function() { return UpdateDropDownValue("ddlImageFormat", $(this)); });
		$("#ddlNameInSheetOptions li a").click(function() { return UpdateDropDownValue("ddlNameInSheet", $(this)); });
		// NOTE: ddlImageFormatOptions, ddlDataFormatOptions, ddlSpritePacker, and ddlSortBy are handled in $(document).ready(); [in sheets.js]
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
		$("#cmdWorkspaceZoomOut"  ).click(function() { DoWorkspaceZoomOut();  return true; });
		$("#cmdWorkspaceZoomIn"   ).click(function() { DoWorkspaceZoomIn();  return true; });
		$("#txtWorkspaceZoom").keyup(function(event) { DoWorkspaceZoom($(this).val(), event); return true; });
		$("#txtWorkspaceZoomOptions li a").click(function() { DoWorkspaceZoom($(this).text()); return true; });
		$("#cmdWorkspaceFitWidth" ).click(function() { DoWorkspaceFitWidth();  return true; });
		$("#cmdWorkspaceFitHeight").click(function() { DoWorkspaceFitHeight(); return true; });
		$("#cmdWorkspaceFitBoth"  ).click(function() { DoWorkspaceFitBoth();   return true; });

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

// -- RIGHT NAV: TOP TABS --
$("#tabSidebarRightTop").children("li").click(function(event){
    var $this = $(this);
    $this.siblings("li").removeClass("active");
    $this.addClass("active");

    $("#divRightTopToolbars").siblings("div").hide();
    $("#divRightTopLists").siblings("div").hide();
    $("#div" + $this.children("a").attr("title").replace(" ", "") + "Toolbar").show();
    $("#div" + $this.children("a").attr("title").replace(" ", "") + "List").show();
});

// -- RIGHT NAV: BOTTOM TABS --
$("#tabSidebarRightBottom").children("li").click(function(event){
    var $this = $(this);
    $this.siblings("li").removeClass("active");
    $this.addClass("active");

    $("#divRightBottomToolbars").siblings("div").hide();
    $("#divRightBottomLists").siblings("div").hide();
    $("#div" + $this.children("a").attr("title").replace(" ", "") + "Toolbar").show();
    $("#div" + $this.children("a").attr("title").replace(" ", "") + "List").show();
});

// -- RIGHT NAV: LAYERS --
$("#cmdLayersSelectAll").click(function() {
    Layers.selectAllLayers();
    BuildLayerList();
    $(this).blur();
});

$("#cmdLayersMoveUp").click(function() {
    var index = Layers.getLayerIndexById(Layers.getSelectedLayers()[0].id);
    var layer = Layers.getLayers().splice(index, 1);
    Layers.getLayers().splice(index - 1, 0, layer[0]);
    Layers.doSelectedLayersChanged();
    BuildLayerList();
    $(this).blur();
});

$("#cmdLayersMoveDown").click(function() {
    var index = Layers.getLayerIndexById(Layers.getSelectedLayers()[0].id);
    var layer = Layers.getLayers().splice(index, 1);
    Layers.getLayers().splice(index + 1, 0, layer[0]);
    Layers.doSelectedLayersChanged();
    BuildLayerList();
    $(this).blur();
});

$("#cmdTilesRemove").click(function() {
    var selected = Layers.getSelectedLayers();
    while(selected.length > 0) {
        Layers.getLayers().splice(Layers.getLayerIndexById(selected[0].id),1);
        selected.splice(0,1);
    }
    Layers.doSelectedLayersChanged();
    BuildLayerList();
    $(this).blur();
});

$("#cmdLayersAddTiles").click(function() {
    Layers.addLayer(Layers.LayerTypes.TILE);
    BuildLayerList();
    $(this.blur());
});

$("#cmdLayersAddObjects").click(function() {
    Layers.addLayer(Layers.LayerTypes.OBJECT);
    BuildLayerList();
    $(this.blur());
});

$("#cmdLayersAddActors").click(function() {
    Layers.addLayer(Layers.LayerTypes.ACTOR);
    BuildLayerList();
    $(this.blur());
});

Layers.addOnSelectedLayersChangedListener(function (selected) {
    var noneSelected = true;
    var oneSelected = false;
    var anySelected = false;
    var manySelected = false;
    var firstSelected = false;
    var lastSelected = false;

    if(selected) {
        noneSelected = selected.length === 0;
        oneSelected = selected.length === 1;
        anySelected = selected.length > 0;
        manySelected = selected.length > 1;
        firstSelected = anySelected && Layers.getCount() > 0 && selected[0].id === Layers.getLayer(0).id;
        lastSelected = anySelected && Layers.getCount() > 0 && selected[selected.length-1].id === Layers.getLayers()[Layers.getCount()-1].id;
    }

    $("#cmdLayersMoveUp").prop("disabled", noneSelected || manySelected || firstSelected);
    $("#cmdLayersMoveDown").prop("disabled", noneSelected || manySelected || lastSelected);
    $("#cmdTilesRemove").prop("disabled", noneSelected);
});

var eventHandler_LayerButtons = function(evt) {
    var $src = $(this);
    var layer = Layers.getLayerById($src.parent().attr("id").split('_')[1]);
    if(layer) {
        if($src.hasClass("chkSelected")) {
            layer.selected = !layer.selected;
        } else if($src.hasClass("cmdVisible")) {
            layer.visible = !layer.visible;
        } else if($src.hasClass("cmdLocked")) {
            layer.locked = !layer.locked;
        } else {
            Layers.selectSingleLayer(layer.id);
        }
        BuildLayerList();
    }
};

// -- POPUPS --
		$("#cmdUploadSprites").click(function(){ $("#uploadSprites").click(); });
		$("#cmdUploadProject").click(function(){ $("#uploadProject").click(); });

//DoToggleHelp();

$(window).on('beforeunload', function(e) {
	var prompt = PromptUserIfDirty();
	prompt = prompt == null ? undefined : prompt;
	if(e && typeof e.returnValue != "undefined") { e.returnValue = prompt; }
	return prompt;
});
