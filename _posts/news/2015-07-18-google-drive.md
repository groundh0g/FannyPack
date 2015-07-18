---
layout: post
category: news
title: Google Drive?
tags : [site]
pagename: blog
---
{% include JB/setup %}

OK. So now that I'm working on the Tile Editor for [FannyPack](http://fpack.moreoncode.com/) ...

> I'm still working on writing a new [book on MonoGame](https://leanpub.com/monogamecodecamps), but FannyPack is now an integral part of that process. SpriteSheets is (mostly) feature complete. I'm currently designing the Tile Editor tool. 


I realize that embedding the assets will make the project files **HUGE**. So, I'm seriously considering crafting the code to support three modes:

1. The current, standalone mode where assets travel with projects and there are **NO** dependencies. [*That's really why I started the project in the first place.*]
1. A Node.js wrapper around the core libs, for (command line) build pipeline integration.
1. And ...

I've been poking around Google's APIs for Chrome Store apps. If the project sizes get too bloated, it would be nice to have links to assets on Google Drive or Dropbox rather than embedding them within the editor files. Of course, sharing files comes with it's own issues, but I could wrap the existing code in Google Apps Script to allow easier collaboration on projects.

Honestly, I don't care how big the project files get when working solo, but it seems like a waste to maintain two copies of the assets (plus another copy if you enable "@2x" support in the sprite sheet).

I'll just keep plugging away at the first option for now. But, I think building on a foundation of collaboration (using your existing Google account and storage, with it's own sharing and permissions management) would be useful.

Don't forget to [let me know](https://github.com/groundh0g/FannyPack/issues) if you see any issues. Your feedback is most appreciated.