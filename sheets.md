---
layout: page
title: FannyPack
tagline: a suite of &#35;gamedev tools
description: FannyPack is a suite of &#35;gamedev tools.
pagename: sheets
scripts: [image-item, options, packers/base, packers/basic, packers/joe, exporters/base, exporters/exportJson, exporters/exportXml, sheets, sheets-events]
isApp: true
---
{% include JB/setup %}

<div class="" style="background-color:#eee; padding:5px 0px; margin:0;">
	<div style="margin-left:20px; margin-right:20px;">
		<div class="btn-toolbar" style="margin:0;">
		  <div class="btn-group">
			<a id="cmdFileNew"  href="#null" class="btn"><i class="icon icon-file"></i> New</a>
			<a id="cmdFileOpen" href="#null" class="btn"><i class="icon icon-folder-open"></i> Open</a>
			<a id="cmdFileSave" href="#null" class="btn"><i class="icon icon-download-alt"></i> Save</a>
		  </div>
		  <div class="btn-group">
			<a id="cmdSpriteAdd"    href="#null" class="btn"><i class="icon icon-picture"></i> Add</a>
			<a id="cmdSpriteRemove" href="#null" class="btn"><i class="icon icon-remove"></i> Remove</a>
		  </div>
		  <div class="btn-group">
			<a id="cmdRefresh" href="#null" class="btn"><i class="icon icon-refresh"></i> Refresh</a>
			<a id="cmdPublish" href="#null" class="btn"><i class="icon icon-share"></i> Publish</a>
		  </div>
		  <div class="btn-group">
			<a id="cmdToggleSettings" href="#null" class="btn"><i class="icon icon-wrench"></i> Settings</a>
		  </div>
		  <div class="btn-group pull-right" style="">
			<a id="cmdStatus" href="#null" class="btn btn-link" style="color:#000;">STATUS: <span id="txtStatusMessage">Ready.</span></a>
		  </div>
		</div>
	</div>

<div id="divSidebarLeft" class="divSidebarLeft">
	<table style="width:100%;">
	
		<tr><td colspan="3"><div class="optionHeading">Output</div></td></tr>
	
		<tr><td class="optionLabel" title="">Name&nbsp;</td>
			<td><input id="txtName" type="text" value="Untitled" style="margin:0; width:140px;" />
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="What format should the published image be?">Image&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlImageFormat">PNG</span> <span class="caret"></span></a>
				  <ul id="ddlImageFormatOptions" class="dropdown-menu">
					<li><a href="#null">GIF</a></li>
					<li><a href="#null">JPG</a></li>
					<li><a href="#null">PNG *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="What format should the atlas use?">Data&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlDataFormat">UNKNOWN</span> <span class="caret"></span></a>
				  <ul id="ddlDataFormatOptions" class="dropdown-menu">
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Strip filename extensions in sprite names?">Name&nbsp;in&nbsp;Sheet</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlNameInSheet">Strip Extension</span> <span class="caret"></span></a>
				  <ul id="ddlNameInSheetOptions" class="dropdown-menu">
					<li><a href="#null">Strip Extension *</a></li>
					<li><a href="#null">Keep Extension</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
	
		<tr><td colspan="3"><div class="optionHeading">Algorithm</div></td></tr>
		
		<tr><td class="optionLabel" title="What method should be used to pack the sprites?">Sprite&nbsp;Packer&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlSpritePacker">UNKNOWN</span> <span class="caret"></span></a>
				  <ul id="ddlSpritePackerOptions" class="dropdown-menu">
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		
		<tr><td class="optionLabel" title="Order images by ...?">Sort&nbsp;By&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlSortBy">UNKNOWN</span> <span class="caret"></span></a>
				  <ul id="ddlSortByOptions" class="dropdown-menu">
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="May sprites be rotated in published image?">Allow&nbsp;Rotate&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlAllowRotate">No</span> <span class="caret"></span></a>
				  <ul id="ddlAllowRotateOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		
		<tr><td colspan="3"><div class="optionHeading">Dimensions</div></td></tr>

		<tr><td class="optionLabel" title="The width of the published image.">Width&nbsp;</td>
			<td>
				<div class="input-append btn-group" style="margin:0;"><input id="txtWidth" type="text" value=" 1024" style="width:110px;" /><a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
				  <ul id="txtWidthOptions" class="dropdown-menu">
					<li><a href="#null">&nbsp;&nbsp;&nbsp;16</a></li>
					<li><a href="#null">&nbsp;&nbsp;&nbsp;32</a></li>
					<li><a href="#null">&nbsp;&nbsp;&nbsp;64</a></li>
					<li><a href="#null">&nbsp;&nbsp;128</a></li>
					<li><a href="#null">&nbsp;&nbsp;256</a></li>
					<li><a href="#null">&nbsp;&nbsp;512</a></li>
					<li><a href="#null">&nbsp;1024 *</a></li>
					<li><a href="#null">&nbsp;2048</a></li>
					<li><a href="#null">&nbsp;4096</a></li>
					<li><a href="#null">&nbsp;8192</a></li>
					<li><a href="#null">16384</a></li>
				  </ul>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="The height of the published image.">Height&nbsp;</td>
			<td>
				<div class="input-append btn-group" style="margin:0;"><input id="txtHeight" type="text" value=" 1024" style="width:110px;" /><a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
				  <ul id="txtHeightOptions" class="dropdown-menu">
					<li><a href="#null">&nbsp;&nbsp;&nbsp;16</a></li>
					<li><a href="#null">&nbsp;&nbsp;&nbsp;32</a></li>
					<li><a href="#null">&nbsp;&nbsp;&nbsp;64</a></li>
					<li><a href="#null">&nbsp;&nbsp;128</a></li>
					<li><a href="#null">&nbsp;&nbsp;256</a></li>
					<li><a href="#null">&nbsp;&nbsp;512</a></li>
					<li><a href="#null">&nbsp;1024 *</a></li>
					<li><a href="#null">&nbsp;2048</a></li>
					<li><a href="#null">&nbsp;4096</a></li>
					<li><a href="#null">&nbsp;8192</a></li>
					<li><a href="#null">16384</a></li>
				  </ul>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Are Width and Height maximum size or actual size?">Size&nbsp;Mode&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlSizeMode">Max Size</span> <span class="caret"></span></a>
				  <ul id="ddlSizeModeOptions" class="dropdown-menu">
					<li><a href="#null">Fixed Size</a></li>
					<li><a href="#null">Max Size *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Published image must have power of two size?">Constraint&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlConstraint">Power of Two</span> <span class="caret"></span></a>
				  <ul id="ddlConstraintOptions" class="dropdown-menu">
					<li><a href="#null">Any Size</a></li>
					<li><a href="#null">Power of Two *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Published image must be square?">Force&nbsp;Square&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlForceSquare">No</span> <span class="caret"></span></a>
				  <ul id="ddlForceSquareOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Publish full size as '*@2x'. Include 1/2 size copy.">Include&nbsp;@2x</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlIncludeAt2x">No</span> <span class="caret"></span></a>
				  <ul id="ddlIncludeAt2xOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>

		<tr><td colspan="3"><div class="optionHeading">Padding</div></td></tr>

		<tr><td class="optionLabel" title="Minimum transparent space from edge of image.">Border&nbsp;Padding&nbsp;</td>
			<td><div class="input-append" style="margin:0;"><input id="txtBorderPadding" type="text" value="2" style="margin:0; width:115px;" /><span class="add-on"><i class="icon icon-resize-vertical"></i></span></div></td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Minimum transparent space between sprites.">Shape&nbsp;Padding&nbsp;</td>
			<td><div class="input-append" style="margin:0;"><input id="txtShapePadding" type="text" value="2" style="margin:0; width:115px;" /><span class="add-on"><i class="icon icon-resize-vertical"></i></span></div></td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Add transparent pixels around each sprite.">Inner&nbsp;Padding&nbsp;</td>
			<td><div class="input-append" style="margin:0;"><input id="txtInnerPadding" type="text" value="0" style="margin:0; width:115px;" /><span class="add-on"><i class="icon icon-resize-vertical"></i></span></div></td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>

		<tr><td colspan="3"><div class="optionHeading">Filters</div></td></tr>

		<tr><td class="optionLabel" title="Make transparent pixels RGBA(0,0,0,0)? Compresses better.">Clean&nbsp;Alpha&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlCleanAlpha">No</span> <span class="caret"></span></a>
				  <ul id="ddlCleanAlphaOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Use top-left pixel color as transparency mask?">Color&nbsp;Mask&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlColorMask">No</span> <span class="caret"></span></a>
				  <ul id="ddlColorMaskOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Merge identical sprites into one instance?">Alias&nbsp;Sprites&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlAliasSprites">No</span> <span class="caret"></span></a>
				  <ul id="ddlAliasSpritesOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Draw shape borders?">Debug&nbsp;Mode&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlDebugMode">No</span> <span class="caret"></span></a>
				  <ul id="ddlDebugModeOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Trim transparent border pixels?">Trim&nbsp;Mode&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlTrimMode">None</span> <span class="caret"></span></a>
				  <ul id="ddlTrimModeOptions" class="dropdown-menu">
					<li><a href="#null">None *</a></li>
					<li><a href="#null">Trim</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Alpha values below this value are considered transparent.">Trim&nbsp;Threshold&nbsp;</td>
			<td><div class="input-append" style="margin:0;"><input id="txtTrimThreshold" type="text" value="1" style="margin:0; width:115px;" /><span class="add-on"><i class="icon icon-resize-vertical"></i></span></div></td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>

		<tr><td colspan="3"><div class="optionHeading">Advanced</div></td></tr>

		<tr><td class="optionLabel" title="Extract animation frames?">Animated&nbsp;GIF&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlAnimatedGif">Use First Frame</span> <span class="caret"></span></a>
				  <ul id="ddlAnimatedGifOptions" class="dropdown-menu">
					<li><a href="#null">Use First Frame *</a></li>
					<li><a href="#null">Extract Frames</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>
		<tr><td class="optionLabel" title="Compress project file? Not human-readable.">ZIP&nbsp;Project&nbsp;</td>
			<td><div class="btn-toolbar" style="margin:0;">
				<div class="btn-group">
				  <a class="btn dropdown-toggle" data-toggle="dropdown"><span id="ddlCompressProject">No</span> <span class="caret"></span></a>
				  <ul id="ddlCompressProjectOptions" class="dropdown-menu">
					<li><a href="#null">Yes</a></li>
					<li><a href="#null">No *</a></li>
				  </ul>
				</div>
				</div>
			</td>
			<td class="tipcol"><i class="icon icon-question-signx"></i></td>
		</tr>

		<tr><td colspan="3"><div><br/><br/><br/><br/></div></td></tr>

	</table>
</div>

<div id="divWorkspaceToolbar" class="divWorkspaceToolbar">
	<div class="btn-toolbar" style="margin:0; ">
	  <div class="btn-group">
		<a id="cmdWorkspaceZoomOut" title="Zoom Out" href="#null" class="btn btn-inverse"><i class="icon icon-white icon-zoom-out"></i></a>
		<a id="cmdWorkspaceZoomIn"  title="Zoom In" href="#null" class="btn btn-inverse"><i class="icon icon-white icon-zoom-in"></i></a>
	  </div>
	  <div class="btn-group">
		<div class="input-append" style="margin:0;"><input id="txtWorkspaceZoom" type="text" value="100%" size="5" style="width:66px;" /><a class="btn btn-inverse dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
		  <ul id="txtWorkspaceZoomOptions" class="dropdown-menu">
			<li><a href="#null">1600.0%</a></li>
			<li><a href="#null">&nbsp;800.0%</a></li>
			<li><a href="#null">&nbsp;400.0%</a></li>
			<li><a href="#null">&nbsp;200.0%</a></li>
			<li><a href="#null">&nbsp;100.0% *</a></li>
			<li><a href="#null">&nbsp;&nbsp;50.0%</a></li>
			<li><a href="#null">&nbsp;&nbsp;25.0%</a></li>
			<li><a href="#null">&nbsp;&nbsp;12.5%</a></li>
		  </ul>
		</div>
	  </div>
	  <div class="btn-group">
		<a id="cmdWorkspaceFitWidth"  title="Fit Workspace Width"  href="#null" class="btn btn-inverse"><i class="icon icon-white icon-resize-horizontal"></i></a>
		<a id="cmdWorkspaceFitHeight" title="Fit Workspace Height" href="#null" class="btn btn-inverse"><i class="icon icon-white icon-resize-vertical"></i></a>
		<a id="cmdWorkspaceFitBoth"   title="Fit to Workspace"     href="#null" class="btn btn-inverse"><i class="icon icon-white icon-resize-full"></i></a>
	  </div>
	  <div class="btn-group pull-right" style="width:200px;">
		<div class="progress progress-info" style="height:30px; background-color:#889; background-image:none;">
		  <div id="progressBar" class="bar" style="width:0;"></div>
		</div>
	  </div>
	</div>
</div>

<div id="divWorkspace" class="divWorkspace">
	<div class="divWorkspaceContainer">
		<div id="divWorkspaceContainerCrop" class="divWorkspaceContainerCrop" style="width:32px; height:32px;">
		</div>
	</div>
</div>

<div class="divSidebarRightToolbar">
	<div id="radioRightNav" class="btn-group">
	  <button id="tabSprites" type="button" class="btn active">Sprites
		<span id="lblSpriteCount" class="badge">0</span>
	  </button>
	  <button id="tabConsole" type="button" class="btn">Console 
		<span id="lblLogCountNothing" class="badge">0</span>
		<span id="lblLogCountSUCCESS" class="badge badge-success" style="display:none;">0</span>
		<span id="lblLogCountWARNING" class="badge badge-warning" style="display:none;">0</span>
		<span id="lblLogCountERROR" class="badge badge-important" style="display:none;">0</span>
		<span id="lblLogCountINFO" class="badge badge-info" style="display:none;">0</span>
	  </button>
	</div>
</div>

<div class="divSidebarRight">
	<div id="divSpritesList">
		[No sprites selected.]
	</div>
	<div id="divConsole" style="display:none;">
		[No messages.]
	</div>
</div>
</div>

<INPUT id="uploadSprites" type="file" name="submitfile" multiple="multiple" style="display:none;" onchange="return ProcessSpriteAdd(this.files);" />
<INPUT id="uploadProject" type="file" name="submitfile" style="display:none;" onchange="return ProcessProjectOpen(this.files);" />

<div id="popupFileModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="popupAddSpritesLabel" aria-hidden="true">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
<h3 id="popupFileModalTitle">Add Sprite(s)</h3>
</div>
<div class="modal-body">
<div class="dropzone">
	<span id="popupFileModalDropLabel" style="text-decoration:line-through;">Drag and drop image files here, or ...</span>
	<br/><br/><br/>
	<a id="cmdUploadProject" class="btn btn-primary" href="#null">Click to Upload</a>
	<a id="cmdUploadSprites" class="btn btn-primary" href="#null">Click to Upload</a>
	<br/><br/><br/>
	<span id="popupFileModalDropInfo">No file(s) selected.</span>
</div>
</div>
<div class="modal-footer">
<button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
<button class="btn btn-primary" aria-hidden="true">OK</button>
</div>
</div>
