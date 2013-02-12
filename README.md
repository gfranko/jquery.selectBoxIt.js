jquery.selectBoxIt.js - jQuery Select Box Plugin
------------------------------------------------

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

##Requirements
jQuery 1.6.1+ (It is always recommended to use the latest version of jQuery)

jQueryUI Widget Factory 1.8.19+ (It is always recommended to use the latest version of the jQueryUI Widget Factory)

##Desktop Browser Support
IE8+, Firefox 4+, Chrome, Safari 4+, Opera 11+ (Other browsers may work, but I did not test on them)

**Note:** The CSS3 `background-size` property is used for the icon images, which is only supported in IE9+

##Mobile/Tablet Browser Support
iOs 3+, Android 2.1+ (Other browsers may work, but I did not test on them)


##Unit Tests
All unit tests are written using the Jasmine Framework

##Contributing
Take care to maintain the existing coding style. Add Jasmine unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

If you plan to contribute to `SelectBoxIt` in the future, keep in mind that you should make sure your code passes the Grunt checks.

To set up the SelectBoxIt grunt/node.js dependencies, first make sure you have [PhantomJS](http://phantomjs.org/) installed, which is a headless browser. Unfortunately PhantomJS cannot be installed automatically.

Next, navigate to within the **jquery.selectBoxIt.js** folder and type `npm install' (this should install grunt and a few other node.js libraries).

**Note:** If you are on Windows, remember you need to run the grunt command using `grunt.cmd`.  Also, if you have trouble getting the Jasmine Unit Tests to work with PhantomJS 1.5 (the current release), install PhantomJS 1.3.

After you have verified your code, send a pull request to the `SelectBoxIt` dev branch.  After you send a pull request, you will hear back from me shortly after I review your code.

You'll find source code in the "src" subdirectory!

##Forking
If you find that you need a feature that SelectBoxIt does not currently support, either let me know via the SelectBoxIt issue tracker, or fork SelectBoxIt on Github and easily extend SelectBoxIt to create your own widget!

##Change Log

`2.9.9` - January 20, 2013

- Fixed [#98](https://github.com/gfranko/jquery.selectBoxIt.js/issues/98)
- Fixed keyboard search with disabled options bug and keyboard search accuracy
- Refactored attribute copy logic
- Added the **selectWhenHidden** option to allow drop down options to be selected with the keyboard when the drop down is hidden
- Added back **IE 7 support** in this release after numerous requests
- Fixed [#102](https://github.com/gfranko/jquery.selectBoxIt.js/issues/102)
- Fixed optgroup mouse cursor
- Upgrade CSS styles to support select boxes with options without text

`2.9.0` - January 15, 2013

- Removed outline from appearing around the drop down
- Fixed non select box bug [#94](https://github.com/gfranko/jquery.selectBoxIt.js/issues/94)
- Fixed IE 8 bug from copying over all select box attributes to the new drop down [#95](https://github.com/gfranko/jquery.selectBoxIt.js/issues/95)

`2.8.0` - January 12, 2013

_IMPORTANT_: **Dropped IE7 support** - This does not mean new features will not work in IE7, but instead that they will not be tested in IE7.

- All attributes on the original select box and select box options are now being copied over to the new drop down.

`2.7.0` - January 11, 2013

- Refactored internal drop down DOM element property names.

`2.6.0` - January 8, 2013

- Added support for styling the currently `selected` drop down option via the **selectboxit-selected** CSS class [#86](https://github.com/gfranko/jquery.selectBoxIt.js/issues/86)

- Fixed `refresh()` method mobile bug [#68](https://github.com/gfranko/jquery.selectBoxIt.js/issues/68)

- Refactored and fixed bugs for SelectBoxIt internal event triggering:  All custom events now return an object containing both the currently selected select box and drop down options  

`2.5.0` - January 6, 2013

**Default Behavior Change**

- SelectBoxIt will no longer select a drop down option (and trigger the change event on the original select box) when a user navigates to an option using the up and down arrow keys via the keyboard, or searches for an option using the keyboard.  An option will only be `selected` when a user clicks an option or presses the `enter` key when an option is actively "focused".  [#85](https://github.com/gfranko/jquery.selectBoxIt.js/issues/85)

- Added a new option, **aggressiveChange**, which _will_ select a drop down option (and trigger the change event on the original select box) when a user navigates to an option using the up and down arrow keys via the keyboard, or searchs for an option using the keyboard.

- There is now always an "active" class when drop down options are moused over.  [#84](https://github.com/gfranko/jquery.selectBoxIt.js/issues/84)

`2.4.0` - January 2, 2013

- Added the **data-iconurl** HTML5 data attribute to support relative and absolute image url's

`2.3.0` - December 18, 2012

- Added the `disableOption()` and `enableOption()` methods

- Fixed disabled state CSS class bug. Now allows all supported themes (Twitter Bootstrap, jQueryUI, and jQuery Mobile) CSS class's are able to take effect

- Improved custom event handling.  The **moveDown**, **moveUp**, **search**, **option-click**, **disable-option**, and **enable-option** custom events now pass an object back in the second argument of the callback function event handler.  Within the _object.elem_ property, is the single select box option that was interacted with.

- Added Travis CI testing support

**Note:** If you are using Twitter Bootstrap as your theme, then it is recommended to upgrade to Twitter Bootstrap v2.2.0 or greater ()

`2.2.0` - December 15, 2012

- Added jQuery Mobile `data-theme` supporting

`2.2.0 RC1` - December 13, 2012

- Added jQuery Mobile CSS Theming Support

- Added the **selectOption()** method

`2.1.0` - December 3, 2012

- Multiple bug fixes: [#53](https://github.com/gfranko/jquery.selectBoxIt.js/issues/53), [#54](https://github.com/gfranko/jquery.selectBoxIt.js/issues/54), [#55](https://github.com/gfranko/jquery.selectBoxIt.js/issues/55), and [#56](https://github.com/gfranko/jquery.selectBoxIt.js/issues/56).

- Added the **native** option: Allows you to trigger the native select box element when a user is interacting with the drop down

`2.0.0` - November 9th, 2012

- Greatly improved dynamic positioning.  SelectBoxIt now makes sure that the drop down list never runs off of the page (no matter how small the viewport is)

- Improved support for enclosing a drop down arrow inside of a box (by setting a border)

- Simplified mobile device checking for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices (Removed the long regex supplied by [detectmobilebrowsers.com](http://www.detectmobilebrowsers.com))
 

`1.9.0` - October 31, 2012

- Added **nostyle** option

- Updated the CSS to remove tag names, remove IE7 hack, and improve CSS specificity

- Thanks to @gavacho for the contributions

`1.8.0` - October 27, 2012

    **Multiple Bug Fixes and Features Added:

- Fixed IE7 focus bug

- Removed all CSS attributes from the JS (to allow for maximum flexibility when changing styles) #34

- SelectBoxIt now copies over all classes and inline styles from the original select box to the new drop down #34

- Refresh method bug fix #32

`1.7.0` - October 12, 2012

    **Multiple Bug Fixes**

- Allow users to programmatically change the value of the select element [#28](https://github.com/gfranko/jquery.selectBoxIt.js/issues/28)

- Removed unique id attributes from select boxes that do not originally include an id attribute [#27](https://github.com/gfranko/jquery.selectBoxIt.js/issues/27)

- Applied HTML attribute encoding for quotes inside of option values [#8](https://github.com/gfranko/jquery.selectBoxIt.js/issues/8)

- Fixed jQuery 1.8.2 keyboard compatibility bug [#26](https://github.com/gfranko/jquery.selectBoxIt.js/issues/26)

`1.6.0` - September 28, 2012

- Improved the CSS flexibility (can now more easily use auto widths)

`1.5.0` - September 26, 2012

- Improved the search algorithm

`1.4.0` - September 23, 2012

- **BIG NEWS:** Added Mobile and Tablet Support

- Added the **isMobile** option

`1.3.0` - September 9, 2012

- Added the **changed** custom event

`1.2.0` - September 6, 2012

- Fixed IE8 keyboard navigation and search bug

- Added a **keydownOpen** option to allow the dropdown list to be visible if the user presses the up or down arrow key

`1.1.0` - September 5, 2012

- Added Twitter Bootstrap Theming Support

- Added a **refresh** public method

- Added the _destroy_ method into the SelectBoxIt core

`1.0.0` - August 8, 2012 *Stable 1.0 release*

- Upgraded Homepage/Documentation

- The plugin was split into modules (multiple files) and a custom build process was created

- Big fixes/code clean up

`0.9.0` - May 21, 2012 *Approaching a stable 1.0 release*

- IE7 and IE8 bug fix: A special thanks to [lhwparis](https://github.com/lhwparis)

`0.8.0` - May 15, 2012 *Approaching a stable 1.0 release*

- Bug fixes for the `disabled` use cases

`0.7.0` - May 10, 2012 [Documentation](http://gregfranko.com/blog/introducing-the-jquery-plugin-selectboxit/#optgroup-support)

- Added optgroup support to allow dropdown list options to be put in subgroups.

- Bug fixes to the `change` and `focus` Event API handlers

`0.6.0` - May 3, 2012 [Documentation](http://gregfranko.com/blog/introducing-the-jquery-plugin-selectboxit/#using-icons)

- Added jQueryUI and custom icon support to allow icons to be used for the dropdown list and also alongside individual dropdown options.  You can specify the class names that you want to use to show the appropriate icon (set the background-image property inside of your CSS).  There are two ways to do this (HTML5 data attributes or SelectBoxIt options)

	* Added support for three new HTML5 data attributes to be used with the original select box element.  Use cases for each are described below.
		* data-icon - Specifies the custom or jQueryUI CSS classes you want to use to show icon images for the dropdown list and/or dropdown list individual options
		* data-downarrow - Specifies the custom or jQueryUI CSS classes you want to use to replace the default down arrow icon image
		* data-text - Specifies the custom text that you want to use for the dropdown list

	* Added support for two new options.  Use cases for each are described below.
		* defaultIcon - An alternative to the `data-icon` HTML5 data attribute
		* downArrowIcon - An alternative to the `data-downarrow` HTML5 data attribute

`0.5.0` - April 29, 2012   **MAJOR REWRITE**

- `SelectBoxIt` has been rewritten using the `jQueryUI Widget Factory`!  This means that `SelectBoxIt` depends on both jQuery and the jQueryUI Widget Factory.  This also means that there are a few API changes that are not backwards compatible...
	* `getOption()`, `getOptions()`, and `create()` were all removed from the Method API
	* To use the custom pseudo selector, you must now use `$(":selectBox-selectBoxIt")`

- `Grunt` Integration.  `SelectBoxIt` now uses [grunt](https://github.com/cowboy/grunt) to run jsHint for code quality checking, Jasmine for unit testing, and UglifyJS for minification.

- Removed `AMD` Support


`0.4.0` - April 28, 2012

- `AMD Support`.  If `AMD` support is found, SelectBoxIt is wrapped in a define `module`.
	[UMD Patterns](https://github.com/umdjs/umd/blob/master/jqueryPlugin.js)
- Bug fixes for supporting the `disabled` HTML property for individual select box options


`0.3.0` - April 25, 2012

- A new option, `defaultText`, was added to allow users to specify the default text of the dropdown list that is not linked to a specific select box option

- The `disabled` HTML property is now supported for individual select box options

- When a user presses the `esc` keyboard key, the dropdown options list will now close (become hidden)


`0.2.0` - April 24, 2012

- This release requires you to use jQuery 1.6.1+.

- You are no longer required to have select box option values be the same as the select box option text.

- IE bug fix to prevent default dropdown text from being selectable


`0.1.0` - April 14, 2012

- Initial SelectBoxIt release.  Added annotated source code, unit tests, and documentation

**Contributors**

Greg Franko - [@gfranko](https://github.com/gfranko)

Thomas von Deyen - [@tvdeyen](https://github.com/tvdeyen)

## License
Copyright (c) 2012 Greg Franko  
Licensed under the MIT license.
