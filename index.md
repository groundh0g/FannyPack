---
layout: page
title: FannyPack
tagline: a suite of &#35;gamedev tools
description: FannyPack is a suite of &#35;gamedev tools.
pagename: index
---
{% include JB/setup %}

## What is Fanny Pack?

Fanny Pack is a suite of tools that I developed for my game programming students. There are certainly 
better products out there, but I wanted my students to have access to free tools and, more importantly, 
access to the source code for those tools. I also didn't want the tools to look like poop that was 
designed in the 80's.

<table border="0" cellpadding="0" cellspacing="0" style="width:600px; margin-left:30px;">
	<tr>
		<td style="width:300px;">
			<img src="assets/img/index/iconSpriteSheets.png" alt="Sprite Sheets"/>
		</td>
		<td style="text-align:center; white-space:nowrap;">
			<p>A tool to merge several art assets (objects <br/>
			   within the game) into a single image, saving <br/>
			   memory and reducing CPU-to-GPU chatter.
			</p>
			<p><a href="#popupFeatureSheets" role="button" data-toggle="modal" class="btn btn-primary">Show Features</a></p>
		</td>
	</tr><tr>
		<td style="width:300px;">
			<img src="assets/img/index/iconSpriteFonts.png" alt="Sprite Sheets"/>
		</td>
		<td style="text-align:center; white-space:nowrap;">
			<p>A tool to convert public domain TTF fonts <br/>
			   into bitmap fonts - a format that is more <br/>
			   easily consumed by game engines.
			</p>
			<p><a id="cmdShowFeaturesFonts" href="#null" class="btn btn-default disabled">Show Features</a></p>
		</td>
	</tr><tr>
		<td style="width:300px;">
			<img src="assets/img/index/iconTileEditor.png" alt="Sprite Sheets"/>
		</td>
		<td style="text-align:center; white-space:nowrap;">
			<p>A tool that manages the placement of a fixed <br/>
			   set of tiled images. By painting these tiles <br/>
			   into place, entire game worlds can be made.
			</p>
			<p><a id="cmdShowFeaturesTileEditor" href="#null" class="btn btn-default disabled">Show Features</a></p>
		</td>
	</tr>
</table>

## What Makes Fanny Pack So Special?

It's certainly not its features. The commercial offerings provide options and functionality that 
aren't (yet) supported in this suite of tools. The biggest benefits of Fanny Pack are that it's 
open source, and that it doesn't require you to install anything. Everything runs in your browser.

<div style="margin-left:30px;">

<h3>Everything Runs in Your Browser</h3>

<p>You read that right. Everything runs in your browser. The technology that drives Fanny Pack is 
vanilla HTML5 and JavaScript. That means that you can use the app from any operating system, 
using any modern web browser.</p>

<p>You don't have to be an administrator on your computer. You don't have to worry about updates.</p>

<p>At least, that's the idea. I've been developing on my MacBook Pro, using Google's Chrome web 
browser. I'll be doing more extensive testing in the near future.</p>

<h3>Your Assets, on Your Computer</h3>

<p>There is no server component to FannyPack. Assets are loaded into your browser from your local
file system. Project files are loaded from and saved to your computer. Published resources are
generated on and saved to your computer.</p>

<p>Your data is never transmitted to the server. I don't need to see it, and I don't need to pay
for dedicated servers that churn through data or bandwidth for that data to travel to and from 
those servers.</p>

<p>In fact, if you really want to be cautious (*cough* *cough* tinfoil hat *cough*), you
can download the static HTML and Javascript and run them on your computer - even without an
internet connection.</p>

<h3>Stop, Collaborate, and Listen! (Share Your Work)</h3>

<p>Project files and published resources are generated as self-contained plaintext or compressed 
(ZIP DEFLATE) files. Just share the file via email, DropBox, or however you normally 
share files with teammates.</p>

<p>Resources are embedded in the project file, not linked. FannyPack embeds the source image 
data and configured options. Once assets have been added to the project, they're never 
referenced from your filesystem again. Share away.</p>

</div>

## What's Up with the Name?

Fanny Pack was initially intended to simply be a sprite sheet packer. Texture Packer (by @CodeAndWeb) 
was the inspiration, so I chose a name that included "pack", but was less likely to get me sued. 
Since its inception, though, the project has grown to become a suite of tools. I decided to keep the 
name. It's a geeky representation of a utility belt. (Think Schneider or Batman.) 

Besides, I like it.

<div id="popupFeatureSheets" class="modal fade">
  <div class="modal-dialog">
	<div class="modal-content">
	  <div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h4 class="modal-title">Sprite Sheet Features</h4>
	  </div>
	  <div class="modal-body">
		<p>Current Features:</p>
		<div style="padding-left:10px;"><p>
			<i class="icon icon-ok"></i> Import web-friendly image formats<br/>
			<i class="icon icon-ok"></i> <em>Extract animated GIF frames!</em><br/>
			<i class="icon icon-ok"></i> Export images as PNG, GIF, or JPG<br/>
			<i class="icon icon-ok"></i> Export data as XML or JSON<br/>
			<i class="icon icon-ok"></i> Export data as CSS<br/>
			<i class="icon icon-ok"></i> Trim &amp; crop unused pixels<br/>
			<i class="icon icon-ok"></i> Heuristic mapping (chroma key)<br/>
			<i class="icon icon-ok"></i> Basic rects (shelf) texture packing<br/>
			<i class="icon icon-ok"></i> MaxRects texture packing<br/>
			<i class="icon icon-ok"></i> Alpha (transparent) cleaning (aids compression)<br/>
			<i class="icon icon-ok"></i> Debug mode (show sprite outlines)
		</p></div>
		<p>Planned Features:</p>
		<div style="padding-left:10px;"><p>
			<i class="icon icon-wrench"></i> Import non-web image formats<br/>
			<i class="icon icon-wrench"></i> Export optimized images<br/>
			<i class="icon icon-wrench"></i> Allow sprite rotate within sheet<br/>
			<i class="icon icon-wrench"></i> Alias duplicate sprites<br/>
			<i class="icon icon-wrench"></i> DropBox support
		</p></div>
	  </div>
	  <div class="modal-footer">
		<button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>
	  </div>
	</div>
  </div>
</div>