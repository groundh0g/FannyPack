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

    if(selected && selected.length > 0) {
        noneSelected  = selected.length === 0;
        oneSelected   = selected.length === 1;
        anySelected   = selected.length > 0;
        manySelected  = selected.length > 1;
        firstSelected = anySelected && Layers.getCount() > 0 && selected[0].id === Layers.getLayer(0).id;
        lastSelected  = anySelected && Layers.getCount() > 0 && selected[selected.length-1].id === Layers.getLayers()[Layers.getCount()-1].id;
    }

    $("#cmdLayersMoveUp")  .prop("disabled", noneSelected || manySelected || firstSelected);
    $("#cmdLayersMoveDown").prop("disabled", noneSelected || manySelected || lastSelected);
    $("#cmdTilesRemove")   .prop("disabled", noneSelected);
});

var eventHandler_LayerToolbarButtons = function(evt) {
    var $src = $(this);
    if($src) {
        var layer = Layers.getLayerById($src.parent().attr("id").split('_')[1]);
        if (layer) {
            if ($src.hasClass("chkSelected")) {
                layer.selected = !layer.selected;
            } else if ($src.hasClass("cmdVisible")) {
                layer.visible = !layer.visible;
            } else if ($src.hasClass("cmdLocked")) {
                layer.locked = !layer.locked;
            } else {
                Layers.selectSingleLayer(layer.id);
            }
            Layers.doSelectedLayersChanged();
            BuildLayerList();
        }
    }
};
