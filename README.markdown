jQuery.selectBoxIt.js - jQuery Select Box Plugin
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

	- Provides API methods to programmatically interact with the Select Box

	- Passes jsHint with no errors

	- Small footprint (2.9KB minified and gzipped)

**Requirements**
jQuery 1.6.1+

**Browser Support**
IE7+, Firefox 4+, Chrome, and Safari 4+

**Unit Tests**
All unit tests are written using the Jasmine Framework

##Change Log

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
