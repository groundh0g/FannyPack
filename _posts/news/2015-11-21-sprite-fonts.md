---
layout: post
category: news
title: "Sprite Fonts, MonoGame Book"
tags : [site]
pagename: blog
---
{% include JB/setup %}

<div style="float:right; margin-left:15px; margin-bottom:15px;"><img alt="" src="{{ BASE_PATH }}/assets/img/blog/CodeCampsBookCover.png" style="width:300px;" /></div>

I've shifted gears yet again. I'm taking a little break from the day job to work on my [#30DaysOfWriting](https://twitter.com/search?f=tweets&q=%2330DaysOfWriting%20%40groundh0g) for [*MonoGame: Code Camps*]({{ BASE_PATH }}/book/codecamps/).

[Fanny Pack](http://fpack.moreoncode.com/)'s Sprite Fonts tool has monopolized my time, but I have no regrets. It's shaping up to become a powerful open source tool for game development. Today should be my last day on this task, though. I need to make some progress on the book while I'm off work. I won't get an opportunity like this again before [the 2016 summer camp](http://codetopia.com/camps/index.html#2016). 

The Sprite Fonts tool isn't 100% quite yet. I'm giving myself another two days to get Sprite Fonts into a usable state, then the book's text and example games are back in my crosshairs. I've knocked out several bug fixes in recent days, and added extra error handling to make the app more stable when things go wrong.

One of those bug fixes was in the font scraper that was unintentionally excluding 300+ fonts from the user interface. Of course, that's exposed several fonts that aren't browser-friendly (which the app correctly handles and flags with a nice error message).

The font picker dialog now supports selecting fonts, highlighting filtered fields and their text within the search results, and corrects an issue that prevented many fonts from loading. There are still a number of fonts that don't properly load. The error logs indicate that the fonts are corrupt. I doubt that. I think the browser is just a bit pickier than the OS. I've been able to use those fonts in other apps. I'm making a note to research at a later time, and I'm leaving the errant fonts in the collection in the hopes that I'll be able to resolve whatever the issue is.

<div style="float:right; margin-left:15px; margin-bottom:15px;"><img alt="" src="{{ BASE_PATH }}/assets/img/blog/2015-11-21-sprite-fonts.png" style="width:300px;" /></div>

In the interest of getting something usable online ASAP, I might postpone support for importing your own truetype fonts. But don't worry. It's high on my priority list. It's just not an essential feature for the book to proceed.

For the curious, you can check out the current iteration of the font picker dialog by visiting [the test page](http://fpack.moreoncode.com/fontsPreview-OLD.html) and clicking the `Popup` button. And, if you know of any kick-ass sources for free-for-commercial-use fonts, feel free to leave a link in the comments. I'm currently pulling fonts from the following sources:

* [Google Fonts](https://www.google.com/fonts)
* [Font Squirrel](http://www.fontsquirrel.com/)
* [Font SC](http://www.fontsc.com/index.html)
* [Font Library](https://fontlibrary.org/)
* [ByPeople](http://www.bypeople.com/free-fonts/) (coming soon)

Don't forget to [let me know](https://github.com/groundh0g/FannyPack/issues) if you see any issues. Your feedback is most appreciated.

-- Joe

P.S. If you'd like to show your support, I'd appreciate a follow on [Twitter](https://twitter.com/groundh0g) or [Facebook](https://www.facebook.com/Fauxcabulary). And don't forget that while you're waiting for [the new book](https://leanpub.com/monogamecodecamps) to hit the printing press, you can check out my 2015 pun book, [*Fauxcabulary*]({{ BASE_PATH }}/books/).

<div style="clear:both;"></div>
