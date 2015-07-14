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

function LayersCollection() {
    var self = this;

    this.LayerTypes = {
        "TILE"   : { value: "TILE",   icon: "image", name: "Title"  },
        "OBJECT" : { value: "OBJECT", icon: "cubes", name: "Object" },
        "ACTOR"  : { value: "ACTOR",  icon: "users", name: "Actor"  }
    };

    var layers = [
        { type: self.LayerTypes.TILE.value,   id:"00000000-0000-0000-0000-000000000001", selected: false, visible: true,  locked: false, name:"Tile Layer 1"},
        { type: self.LayerTypes.TILE.value,   id:"00000000-0000-0000-0000-000000000002", selected: false, visible: false, locked: false, name:"Tile Layer 2"},
        { type: self.LayerTypes.OBJECT.value, id:"00000000-0000-0000-0000-000000000003", selected: true,  visible: true,  locked: false, name:"Object Layer"},
        { type: self.LayerTypes.TILE.value,   id:"00000000-0000-0000-0000-000000000004", selected: false, visible: true,  locked: true,  name:"Tile Layer 3"},
        { type: self.LayerTypes.ACTOR.value,  id:"00000000-0000-0000-0000-000000000005", selected: true,  visible: true,  locked: false, name:"Actor Layer"},
        { type: self.LayerTypes.TILE.value,   id:"00000000-0000-0000-0000-000000000006", selected: false, visible: false, locked: true,  name:"Tile Layer 4"},
        { type: self.LayerTypes.TILE.value,   id:"00000000-0000-0000-0000-000000000007", selected: false, visible: false, locked: false, name:"Tile Layer 5"}
    ];

    this.addLayer = function(obj) {
        var layer = null;

        if(obj && obj.type) {
            layer = {
                type:     obj.type.value,
                id:       obj.guid || UUID.generate(),
                selected: true,
                visible:  obj.visible === false ? false : true,
                locked:   obj.locked  === false ? false : true,
                name:     obj.name || obj.type.name + " Layer" };
        } else if(obj && obj.value && obj.icon && obj.name) {
            layer = {
                type:     obj.value,
                id:       UUID.generate(),
                selected: true,
                visible:  true,
                locked:   false,
                name:     obj.name + " Layer" };
        } else if(obj && self.LayerTypes[obj]) {
            layer = {
                type:     self.LayerTypes[obj].value,
                id:       UUID.generate(),
                selected: true,
                visible:  true,
                locked:   false,
                name:     self.LayerTypes[obj].name + " Layer" };
        }

        if(layer) {
            var selected = self.getSelectedLayers();
            var selectedIndex = selected.length > 0 ? self.getLayerIndexById(selected[0].id) : -1;
            self.selectNoLayers();
            layers.splice(Math.max(selectedIndex, 0), 0, layer);
            self.doSelectedLayersChanged();
        }
    };

    var onSelectedLayersChangedListeners = [];
    var onSelectedLayersChanged = function() {
        if(onSelectedLayersChangedListeners.length > 0) {
            var selected = self.getSelectedLayers();
            for(var i=0; i<onSelectedLayersChangedListeners.length; i++) {
                onSelectedLayersChangedListeners[i](selected);
            }
        }
    };

    this.doSelectedLayersChanged = function() {
        onSelectedLayersChanged();
    };

    this.addOnSelectedLayersChangedListener = function(listener) {
        onSelectedLayersChangedListeners.push(listener);
    };

    this.clearOnSelectedLayersChangedListeners = function() {
        onSelectedLayersChangedListeners = [];
    };

    var selectLayers = function(callback) {
        for(var i=0; i<layers.length; i++) {
            layers[i].selected = (callback && callback(layers[i]));
        }
        onSelectedLayersChanged();
    };

    this.selectAllLayers = function(force) {
        var doSelect = force || self.getSelectedLayers().length < layers.length;
        selectLayers(function(layer) { return doSelect; });
    };

    this.selectNoLayers = function() {
        selectLayers(function(layer) { return false; });
    };

    this.selectSingleLayer = function(id) {
        selectLayers(function(layer) { return layer.id === id; });
    };

    this.getSelectedLayers = function() {
        var selected = [];
        for(var i=0; i<layers.length; i++) {
            if(layers[i].selected) { selected.push(layers[i]); }
        }
        return selected;
    };

    this.getLayers = function() {
        return layers;
    };

    this.getLayer = function(index) {
        return layers[index];
    };

    this.getCount = function() {
        return layers.length;
    };

    this.clearLayers = function() {
        layers = [];
    };

    this.getLayerById = function(id) {
        var result = null;
        for(var i=0; i<layers.length; i++) {
            if(layers[i].id === id) {
                result = layers[i];
                break;
            }
        }
        return result;
    };

    this.getLayerIndexById = function(id) {
        var selectedIndex = -1;
        for(var i=0; i<layers.length; i++) {
            if(layers[i].id === id) { selectedIndex = i; break; }
        }
        return selectedIndex;
    };
};

var Layers = new LayersCollection();