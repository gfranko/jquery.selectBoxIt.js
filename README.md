jquery.selectBoxIt.js - jQuery Select Box Plugin
------------------------------------------------

*Note:* I haven't had time to maintain this repository for the last few years, so if anyone would like a particular fix just send me a tip via Paypal (gfranko5@yahoo.com) and I'll look into it

[![Build Status](https://travis-ci.org/gfranko/jquery.selectBoxIt.js.png?branch=master)](https://travis-ci.org/gfranko/jquery.selectBoxIt.js)

A jQuery plugin that progressively enhances an HTML Select Box into a single option dropdown list.  The dropdown list can be optionally styled with **Twitter Bootstrap**, **jQueryUI ThemeRoller**, or **jQuery Mobile**, optionally animated with **jQueryUI show/hide effects**, and works on Desktop, Tablet, and Mobile browsers.

[Homepage](http://gregfranko.com/jquery.selectBoxIt.js/)

[Annotated Source Code](http://www.gregfranko.com/jquery.selectBoxIt.js/docs/jQuery.selectBoxIt.html)

**Notable Features**

   - Styleable with Twitter Bootstrap, jQueryUI Themeroller, and jQuery Mobile

   - Supports Desktop, Tablet, and Mobile browsers

   - Supports all jQuery and jQueryUI show/hide effects (optional)

   - Supports all Twitter Bootstrap (Glyphicons) and jQueryUI/custom icons

   - Includes ARIA (Accessible Rich Internet Applications) support

   - Full keyboard search and navigation support

   - An event API triggered on the original select box element that calls the plugin

   - A method API providing methods to interact with the dropdown list (i.e. Search, Open, Disable, Set Options).

   - Passes jsHint with no errors

   - Selected, Disabled, and Optgroup Support

   - Easily extendable to allow developers to create new widgets

## Requirements
jQuery 1.8.3+ (It is always recommended to use the latest version of jQuery)

jQueryUI Widget Factory 1.10.0+ (It is always recommended to use the latest version of the jQueryUI Widget Factory)

## Desktop Browser Support
IE8+, Firefox 4+, Chrome, Safari 4+, Opera 11+ (Other browsers may work, but I did not test on them)

**Note:** The CSS3 `background-size` property is used for the icon images, which is only supported in IE9+

## Mobile/Tablet Browser Support
iOs 3+, Android 2.1+ (Other browsers may work, but I did not test on them)


## Unit Tests
All unit tests are written using the Jasmine Framework

## Contributing
Take care to maintain the existing coding style. Add Jasmine unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

If you plan to contribute to `SelectBoxIt` in the future, keep in mind that you should make sure your code passes the Grunt checks.

To set up the SelectBoxIt grunt/node.js dependencies, first make sure you have [PhantomJS](http://phantomjs.org/) installed, which is a headless browser. Unfortunately PhantomJS cannot be installed automatically.

Next, navigate to within the **jquery.selectBoxIt.js** folder and type `npm install' (this should install grunt and a few other node.js libraries).

Next, type `grunt`

**Note:** If you are on Windows, remember you need to run the grunt command using `grunt.cmd`.  Also, if you have trouble getting the Jasmine Unit Tests to work with PhantomJS 1.5 (the current release), install PhantomJS 1.3.

After you have verified your code, send a pull request to the `SelectBoxIt` dev branch.  After you send a pull request, you will hear back from me shortly after I review your code.

You'll find source code in the "src" subdirectory!

## Forking
If you find that you need a feature that SelectBoxIt does not currently support, either let me know via the SelectBoxIt issue tracker, or fork SelectBoxIt on Github and easily extend SelectBoxIt to create your own widget!

**Contributors**

Greg Franko - [@gfranko](https://github.com/gfranko)

Thomas von Deyen - [@tvdeyen](https://github.com/tvdeyen)

Ron 'coyote' Lussier - [@lenscraft](https://github.com/ronlussier)

## License
Copyright (c) 2013 Greg Franko
Licensed under the MIT license.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/gfranko/jquery.selectBoxIt.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
