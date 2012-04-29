jquery.selectBoxIt.js - jQuery Select Box Plugin
------------------------------------------------

![Example](http://gregfranko.com/images/select.PNG)

A jQuery plugin that progressively enhances an HTML Select Box into a single option dropdown list.  The dropdown list can be optionally styled with **ThemeRoller** and optionally animated with **jQueryUI show/hide effects**.

[Homepage](http://gregfranko.com/jQuery.selectBoxIt.js/)

[Documentation](http://www.gregfranko.com/blog/introducing-the-jquery-plugin-selectboxit)

[Annotated Source Code](http://www.gregfranko.com/docs/jQuery.selectBoxIt.html)

[Unit Test Suite](http://www.gregfranko.com/test/SpecRunner.html)

**Notable Features**

	- Styleable with the jQueryUI Themeroller (optional)

	- Supports all jQuery and jQueryUI show/hide effects (optional)

	- Includes ARIA (Accessible Rich Internet Applications) support

	- Full keyboard search and navigation support

	- An event API triggered on the original select box element that calls the plugin

    - A method API providing methods to interact with the dropdown list (i.e. Search, Open, Disable, Set Options).

	- Passes jsHint with no errors

	- Selected and Disabled Support

##Requirements
jQuery 1.6.1+

jQueryUI Widget Factory 1.8.19+

##Browser Support
IE7+, Firefox 4+, Chrome, Safari 4+, and Opera 11+

##Unit Tests
All unit tests are written using the Jasmine Framework

##Contributing
Take care to maintain the existing coding style. Add Jasmine unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

If you plan to contribute to `SelectBoxIt` in the future, keep in mind that you should make sure your code passes the Grunt checks.  If you are on Windows (like me) remember you need to run the grunt command using `grunt.cmd`.  Also, if you have trouble getting the Jasmine Unit Tests to work with PhantomJS 1.5 (the current release), install PhantomJS 1.3.

After you have verified your code, send a pull request to the `SelectBoxIt` dev branch.  After you send a pull request, you will hear back from me shortly after I review your code.

You'll find source code in the "src" subdirectory!_

##Change Log

`0.5.0` - April 29, 2012 **MAJOR REWRITE**

- `SelectBoxIt` has been rewritten using the jQueryUI Widget Factory!  This means that `SelectBoxIt` depends on both jQuery and the jQueryUI Widget Factory.  This also means that there are a few API changes that are not backwards compatible...
	* `getOption()`, `getOptions()`, and `create()` were all removed from the Method API
	* To use the custom pseudo selector, you must now use $(":selectBox-selectBoxIt")

- `SelectBoxIt` now uses [grunt](https://github.com/cowboy/grunt) to run jsHint for code quality checking, Jasmine for unit testing, and UglifyJS for minification.

- Removed AMD Support


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
Greg Franko

## License
Copyright (c) 2012 Greg Franko  
Licensed under the MIT license.
