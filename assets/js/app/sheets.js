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

var OnValueChanged = function() { 
	BuildSpriteList();
	UpdateConsole();
	return false; 
}

var DoFileNew = function () { return false; };
var DoFileOpen = function () { 
	$("#popupFileModalTitle").text("Open Project");
	$("#popupFileModalDropLabel").text("Drag and drop project file here, or ...");
	$("#popupFileModalDropInfo").text("No project selected.");
	$("#cmdUploadProject").show();
	$("#cmdUploadSprites").hide();
	$("#popupFileModal").modal("show");
	return false; 
};

var DoFileSave = function () { 
	var options = new Options();
	options.read();
	var data = {
		application: "FannyPack",
		version: FannyPack_SpriteSheet_Version,
		url: "https://github.com/groundh0g/FannyPack",
		options: options,
		images: imagePool
	};

// 	var zip = new JSZip();
// 	zip.file("project.json", JSON.stringify(data, null, 2));
// 	saveAs(zip.generate({type:"blob"}), options.name + ".zip");

	saveAs(
		new Blob([JSON.stringify(data, null, 2)], {type: "application/json"}), 
		options.name + ".fanny"
	);
};

var DoSpriteAdd = function () { 
	$("#popupFileModalTitle").text("Add Sprite(s)");
	$("#popupFileModalDropLabel").text("Drag and drop image files here, or ...");
	$("#popupFileModalDropInfo").text("No file(s) selected.");
	$("#cmdUploadProject").hide();
	$("#cmdUploadSprites").show();
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

var ProcessProjectOpen = function(files) {
	if(files && files.length) {
		var file = files[0];
		var reader = new FileReader();
		reader.filename = file.name;
		reader.filetype = file.type;
		reader.onload = function(e) { 
			try {
				var project = $.parseJSON(e.target.result);
				var options = new Options();
				options.read(project.options);
				options.updateUI();
				imagePool = project.images;
			} catch (e) {
				LogConsoleMessage(ConsoleMessageTypes.ERROR, "Unable to open project.");
				$("#tabConsole").click();
			}
			OnValueChanged();
			return false;
		};
		reader.readAsText(file);
	}

	$("#uploadProject").val("");
	$("#popupFileModal").modal("hide");

	return false;
};

var fileHasChanges = false;
var imagePool = {};
var isProcessingFiles = false;
var filesToProcess = {};
var filesProcessedCount = 0;
var filesErroredCount = 0;

var ProcessSpriteAdd = function(files) {
	ClearConsoleMessages();
	
	filesToProcess = {};
	isProcessingFiles = true;
	filesProcessedCount = 0;
	filesErroredCount = 0;
	
	for(var i = 0; i < files.length; i++) {
		var file = files[i];
		var imageRegEx = /image.*/;
	
		if(!file.type.match(imageRegEx)) { 
			LogConsoleMessage(ConsoleMessageTypes.ERROR, "Image '" + file.name + "' failed to load.");
			filesErroredCount++;
			continue; 
		}

		filesToProcess[file.name] = true;

		var reader = new FileReader();
		reader.filename = file.name;
		reader.filetype = file.type;
		reader.onload = function(e) { 
			try {
				var $img = $("<img />");
				$img.addClass("foo");
				$img.attr("src", e.target.result);
				$("#divWorkspaceContainerCrop").append($img);
				AddSpriteToImagePool(new ImageData(
					null, // not a copy of existing image
					this.filename,
					this.filetype,
					$img.css("width"),
					$img.css("height"),
					e.target.result,
					UUID.generate()
				));
				$img.remove();
			} catch(e) { 
				LogConsoleMessage(ConsoleMessageTypes.ERROR, "Image '" + this.filename + "' failed to load.");
				filesErroredCount++;
			}
		};
		reader.readAsDataURL(file);
	}
	
	isProcessingFiles = false;

	$("#uploadSprites").val("");
	$("#popupFileModal").modal("hide");

	return false;
};

var AddSpriteToImagePool = function(img) {
	if(imagePool[img.filename]) {
		LogConsoleMessage(ConsoleMessageTypes.WARNING, "Image '" + img.filename + "' already exists. Replacing.");
	}
	imagePool[img.filename] = img;
	if(filesToProcess[img.filename]) { 
		delete filesToProcess[img.filename];
		filesProcessedCount++;
		if(!isProcessingFiles && Object.keys(filesToProcess).length === 0) { 
			LogConsoleMessage(ConsoleMessageTypes.SUCCESS, "" + filesProcessedCount + " image(s) processed.");
			OnValueChanged(); 
		} 
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

var ConsoleMessageTypes = {
	"SUCCESS": "SUCCESS",
	"WARNING": "WARNING",
	"ERROR"  : "ERROR"
};

var consoleMessages = {
	"SUCCESS": [],
	"WARNING": [],
	"ERROR"  : []
};

var ClearConsoleMessages = function() {
	consoleMessages = {
		"SUCCESS": [],
		"WARNING": [],
		"ERROR"  : []
	};
};

var LogConsoleMessage = function(type, msg) {
	if(consoleMessages[type]) {
		consoleMessages[type].push(msg);
	}
	UpdateConsole();
};

var UpdateConsole = function() {
	var hasMessage = false;
	var hasError = false;

	$("#lblLogCountNothing").hide();
	$("#lblLogCountSUCCESS").hide();
	$("#lblLogCountWARNING").hide();
	$("#lblLogCountERROR").hide();
	$("#divConsole").text("");

	var keys = Object.keys(consoleMessages);
	for(var i = 0; i < keys.length; i++) {
		var msgs = consoleMessages[keys[i]];
		if(msgs.length > 0) {
			hasMessage = true;
			if(keys[i] == ConsoleMessageTypes.ERROR) {
				hasError = true;
			}
			$("#lblLogCount" + keys[i]).text(msgs.length);
			$("#lblLogCount" + keys[i]).show();

			for(var j = 0; j < msgs.length; j++) {
				var $alert = $("<div/>").addClass("alert alert-" + keys[i].toLowerCase());
				$alert.html("<strong>" + keys[i] + "</strong>: " + msgs[j]);
				$("#divConsole").append($alert);
			}
		}
	}
	
	if(!hasMessage) {
		$("#lblLogCountNothing").show();
		$("#divConsole").text("[No messages.]");
	}
	
	if(hasError) {
		$("#tabConsole").click();
	}
	
	// seems silly to report success as badge
	// comment out this line if you want it to show
	$("#lblLogCountSUCCESS").hide();
}

$(document).ready(function () {
	var i = 0;
	var keys = [];
	var defaultSortBy = BasePacker.SortByDefault;

	// add Sprite Packer options
	keys = BasePacker.SORT_BY_KEY(packers);
	for(i = 0; i < keys.length; i++) {
		var $li = $("<li/>");
		var $a = $("<a/>").attr("href","#null");
		var item = packers[keys[i]];
		if(item.isDefault) {
			$a.text(item.name + " *");
			$("#ddlSpritePacker").text(item.name);
			defaultSortBy = item.defaultSortBy;
		} else {
			$a.text(item.name);
		}
		$li.append($a);
		$("#ddlSpritePackerOptions").append($li);
	}

	// add Sort By options
	keys = BasePacker.SORT_BY_KEY(BasePacker.SortBy);
	for(i = 0; i < keys.length; i++) {
		var $li = $("<li/>");
		var $a = $("<a/>").attr("href","#null");
		if(keys[i] == defaultSortBy) {
			$("#ddlSortBy").text(keys[i]);
		}
		$a.text(keys[i]);
		$li.append($a);
		$("#ddlSortByOptions").append($li);
	}
	
	$("#ddlSpritePackerOptions li a").click(function() { 
		var result = UpdateDropDownValue("ddlSpritePacker", $(this));
		$("#ddlSortBy").text(packers[$("#ddlSpritePacker").text()].defaultSortBy);
		return result;
	});
	$("#ddlSortByOptions li a").click(function() { return UpdateDropDownValue("ddlSortBy", $(this)); });
});
