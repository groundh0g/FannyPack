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

var OnValueChanged = function() { return false; }

var DoFileNew = function () { return false; };
var DoFileOpen = function () { return false; };

var DoFileSave = function () { 
	var options = new Options();
	options.read();
	var data = {
		options: options,
		images: imagePool
	};
	console.log(JSON.stringify(data, null, 2));
};

var DoSpriteAdd = function () { 
	$("#popupFileModalTitle").text("Add Sprite(s)");
	$("#popupFileModalDropLabel").text("Drag and drop image files here, or ...");
	$("#popupFileModalDropInfo").text("No file(s) selected.");
	$("#popupFileModal").modal("show");
	return false; 
};		
var DoSpriteRemove = function () { return false; };
var DoPublish = function () { return false; };

var isHelpVisible = true;
var DoToggleHelp = function () {
	if(isHelpVisible) {
		$("td.tipcol").hide();
		$("table.leftSidebar").css("width","274px");
		$("td.leftSidebar").css("width","284px");
		isHelpVisible = false;
	} else {
		$("td.leftSidebar").css("width","305px");
		$("table.leftSidebar").css("width","295px");
		$("td.tipcol").show();
		isHelpVisible = true;
	}
	return false;
}

var isSettingsVisible = true;
var DoToggleSettings = function () {
	if(isSettingsVisible) {
		$("#divSidebarLeft").hide();
		$("#divWorkspace").css("left","0");
		$("#divWorkspaceToolbar").css("left","0");
		isSettingsVisible = false;
	} else {
		$("#divSidebarLeft").show();
		$("#divWorkspace").css("left","301px");
		$("#divWorkspaceToolbar").css("left","301px");
		isSettingsVisible = true;
	}
	return false;
}

var UpdateDropDownValue = function(ddlName, $obj) {
	$("#" + ddlName).text($obj.text().replace(" *",""));
	OnValueChanged();
	return true;
};

var UpdateDropDownValueInput = function(ddlName, $obj) {
	$("#" + ddlName).val($obj.text().replace(" *",""));
	OnValueChanged();
	return true;
};

var UpdateSpinBox = function (txtName, event, key) {
	var delta = 0;
	if(event && event.which) {
		var which = event.which;
		if(key && which === key) { which = 13; }
		if(key && which !== key) { which = 0; }
		if(which === 38) { delta = 1; }
		if(which === 40) { delta = -1; }
		if(which === 13) { 
			OnValueChanged();
			$("#" + txtName).blur();
			return true;
		}
	}
	if(delta !== 0) {
		var valTxt = $("#" + txtName).val()
		var valInt = parseInt(valTxt, 10);
		if(valTxt !== "" && !isNaN(valInt) && isFinite(valInt)) {
			$("#" + txtName).val(valInt + delta);
			OnValueChanged();
			return true;
		}
	}
	return false;
}

var fileHasChanges = false;
var imagePool = {};
var isProcessingFiles = false;
var filesToProcess = {};

var ProcessSpriteAdd = function(files) {
	filesToProcess = {};
	isProcessingFiles = true;
	for(var i = 0; i < files.length; i++) {
		var file = files[i];
		var imageRegEx = /image.*/;
	
		if(!file.type.match(imageRegEx)) { continue; }

		filesToProcess[file.name] = true;

		var reader = new FileReader();
		reader.filename = file.name;
		reader.filetype = file.type;
		reader.onload = function(e) { 
			var $img = $("<img />");
			$img.addClass("foo");
			$img.attr("src", e.target.result);
			$("#divWorkspaceContainerCrop").append($img);
			AddSpriteToImagePool(new Image(
				null, // not a copy of existing image
				this.filename,
				this.filetype,
				$img.css("width"),
				$img.css("height"),
				e.target.result,
				UUID.generate()
			));
			$img.remove();
		}
		reader.readAsDataURL(file);
	}
	
	isProcessingFiles = false;

	$("#uploadSprites").val("");
	$("#popupFileModal").modal("hide");

	return false;
};

var AddSpriteToImagePool = function(img) {
	// TODO: error checking
	if(imagePool[img.filename]) {
		LogConsoleMessage("warn", "Image '" + img.filename + "' already exists. Replacing.");
	}
	imagePool[img.filename] = img;
	if(filesToProcess[img.filename]) { 
		delete filesToProcess[img.filename];
		if(!isProcessingFiles && Object.keys(filesToProcess).length === 0) { BuildSpriteList(); } 
	}
};

var BuildSpriteList = function() {
	var keys = Object.keys(imagePool).sort(function(a,b){ return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; });
	$("#divSpritesList").html("");
	if(keys.length === 0) {
		$("#divSpritesList").text("[No sprites selected.]");
	} else {
		$.each(keys, function(idx, itm) { 
			var $div = $("<div/>");
			$div.addClass("divSpritesListItem");
			var $img = $("<img/>");
			$img.attr("src",imagePool[itm].src);
			var $span = $("<span/>");
			$span.text(imagePool[itm].filename);
			$div.append($img);
			$div.append($span);
			$("#divSpritesList").append($div);
		});
	}
	PlaceSpritesOnWorkspace(null);
};

var PlaceSpritesOnWorkspace = function(map) {
	var keys = Object.keys(imagePool).sort(function(a,b){ return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; });
	if(keys.length > 0) {
		$("#divWorkspaceContainerCrop").append(
			$("<img/>")
			.attr("src",imagePool[keys[0]].src)
			.css("left","100px")
			.css("top","100px")
		);
	}
};

var LogConsoleMessage = function(type, msg) {
	// TODO: Log to console tab
	console.log(msg);
};
