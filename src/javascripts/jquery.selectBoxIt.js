/* jquery SelectBoxIt - v2.9.9 - 2013-2-06
* http://www.gregfranko.com/jQuery.selectBoxIt.js/
* Copyright (c) 2012 Greg Franko; Licensed MIT */

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

;(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calling the jQueryUI Widget Factory Method
    $.widget("selectBox.selectBoxIt", {

        // Plugin version
        VERSION: "2.9.9",

        // These options will be used as defaults
        options: {

            // **showEffect**: Accepts String: "none", "fadeIn", "show", "slideDown", or any of the jQueryUI show effects (i.e. "bounce")
            "showEffect": "none",

            // **showEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "showEffectOptions": {},

            // **showEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "showEffectSpeed": "medium",

            // **hideEffect**: Accepts String: "none", "fadeOut", "hide", "slideUp", or any of the jQueryUI hide effects (i.e. "explode")
            "hideEffect": "none",

            // **hideEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "hideEffectOptions": {},

            // **hideEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "hideEffectSpeed": "medium",

            // **showFirstOption**: Shows the first dropdown list option within the dropdown list options list
            "showFirstOption": true,

            // **defaultText**: Overrides the text used by the dropdown list selected option to allow a user to specify custom text.  Accepts a String.
            "defaultText": "",

            // **defaultIcon**: Overrides the icon used by the dropdown list selected option to allow a user to specify a custom icon.  Accepts a String (CSS class name(s)).
            "defaultIcon": "",

            // **downArrowIcon**: Overrides the default down arrow used by the dropdown list to allow a user to specify a custom image.  Accepts a String (CSS class name(s)).
            "downArrowIcon": "",

            // **theme**: Provides theming support for Twitter Bootstrap and jQueryUI
            "theme": "bootstrap",

            // **keydownOpen**: Opens the dropdown if the up or down key is pressed when the dropdown is focused
            "keydownOpen": true,

            // **isMobile**: Function to determine if a user's browser is a mobile browser
            "isMobile": function() {

                // Adapted from http://www.detectmobilebrowsers.com
                var ua = navigator.userAgent || navigator.vendor || window.opera;

                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);

            },

            "nostyle": false,

            // **native**: Triggers the native select box when a user interacts with the drop down
            "native": false,

            // **aggressiveChange**: Will select a drop down item (and trigger a change event) when a user navigates to the item via the keyboard (up and down arrow or search), before a user selects an option with a click or the enter key
            "aggressiveChange": false,

            // **selectWhenHidden: Will allow a user to select an option using the keyboard when the drop down list is hidden and focused
            "selectWhenHidden": true

        },

        // The index of the currently selected dropdown list option
        "currentFocus": 0,

        // Keeps track of which blur events will hide the dropdown list options
        "blur": true,

        // Array holding all of the original select box options text
        "textArray": [],

        // Maintains search order in the `search` method
        "currentIndex": 0,

        // Whether or not the dropdown list opens up or down (depending on how much room is on the page)
        "flipped": false,

        "getThemes": function() {

            var self = this,
                theme = $(self.element).attr("data-theme") || "c";

            return {

                "bootstrap": {

                    "focus": "active",

                    "hover": "",

                    "disabled": "disabled",

                    "arrow": "caret",

                    "button": "btn",

                    "list": "dropdown-menu",

                    "container": "bootstrap",

                    "open": "open"

                },

                "jqueryui": {

                    "focus": "ui-state-focus",

                    "hover": "ui-state-hover",

                    "disabled": "ui-state-disabled",

                    "arrow": "ui-icon ui-icon-triangle-1-s",

                    "button": "ui-widget ui-state-default",

                    "list": "ui-widget ui-widget-content",

                    "container": "jqueryui",

                    "open": "ui-state-active"

                },

                "jquerymobile": {

                    "focus": "ui-btn-down-" + theme,

                    "hover": "ui-btn-hover-" + theme,

                    "disabled": "ui-disabled",

                    "arrow": "ui-icon ui-icon-arrow-d ui-icon-shadow",

                    "button": "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                    "list": "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                    "container": "jquerymobile",

                    "open": "ui-state-active"

                },

                "default": {

                    "focus": "selectboxit-focus",

                    "hover": "selectboxit-hover",

                    "disabled": "selectboxit-disabled",

                    "arrow": "selectboxit-arrow",

                    "button": "selectboxit-btn",

                    "list": "selectboxit-list",

                    "container": "selectboxit-container",

                    "open": "selectboxit-open"

                }

            };

        },

        // _Create
        // -------
        //      Sets the Plugin Instance variables and
        //      constructs the plugin.  Only called once.
        _create: function() {

            var self = this;

            // If the element calling SelectBoxIt is not a select box
            if(!self.element.is("select")) {

                // Exits the plugin
                return;

            }

            // The original select box DOM element
            self.originalElem = self.element[0];

            // The original select box DOM element wrapped in a jQuery object
            self.selectBox = self.element;

            // All of the original select box options
            self.selectItems = self.element.find("option");

            // The first option in the original select box
            self.firstSelectItem = self.element.find("option").slice(0, 1);

            // The html document height
            self.documentHeight = $(document).height();

            self.theme = self.getThemes()[self.options["theme"]] || self.getThemes()["default"];

            // Creates the dropdown elements that will become the dropdown
            // Creates the ul element that will become the dropdown options list
            // Add's all attributes (excluding id, class names, and unselectable properties) to the drop down and drop down items list
            // Hides the original select box and adds the new plugin DOM elements to the page
            // Adds event handlers to the new dropdown list
            self._createdropdown()._createUnorderedList()._copyAttributes()._replaceSelectBox()._addClasses(self.theme)._eventHandlers();

            if(self.originalElem.disabled && self.disable) {

                // Disables the dropdown list if the original dropdown list had the `disabled` attribute
                self.disable();

            }

            // If the Aria Accessibility Module has been included
            if(self._ariaAccessibility) {

                // Adds ARIA accessibillity tags to the dropdown list
                self._ariaAccessibility();

            }

            if(self._mobile) {

                // Adds mobile support
                self._mobile();

            }

            // If the native option is set to true
            if(self.options["native"]) {

                // Triggers the native select box when a user is interacting with the drop down
                this._applyNativeSelect();

            }

            // Triggers a custom `create` event on the original dropdown list
            self.triggerEvent("create");

            // Maintains chainability
            return self;

        },

        // _Create dropdown
        // ------------
        //      Creates new dropdown and dropdown elements to replace
        //      the original select box with a dropdown list
        _createdropdown: function() {

            var self = this;

            // Creates a dropdown element that contains the dropdown list text value
            self.dropdownText = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItText",

                "class": "selectboxit-text",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on",

                // Sets the dropdown `text` to equal the original select box default value
                "text": self.firstSelectItem.text()

            }).

            // Sets the HTML5 data attribute on the dropdownText `dropdown` element
            attr("data-val", self.originalElem.value);

            // Creates a dropdown element that contains the dropdown list text value
            self.dropdownImage = $("<i/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItDefaultIcon",

                "class": "selectboxit-default-icon",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            });

            // Creates a dropdown to act as the new dropdown list
            self.dropdown = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxIt",

                "class": "selectboxit" + " " + (self.selectBox.attr("class") || ""),

                // Sets the dropdown `name` attribute to be the same name as the original select box
                "name": self.originalElem.name,

                // Sets the dropdown `tabindex` attribute to 0 to allow the dropdown to be focusable
                "tabindex": self.selectBox.attr("tabindex") || "0",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            }).

            // Appends the default text to the inner dropdown list dropdown element
            append(self.dropdownImage).append(self.dropdownText);

            // Create the dropdown container that will hold all of the dropdown list dom elements
            self.dropdownContainer = $("<span/>", {

                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItContainer",

                "class": "selectboxit-container"

            }).

            // Appends the inner dropdown list dropdown element to the dropdown list container dropdown element
            append(self.dropdown);

            // Maintains chainability
            return self;

        },

        // _Create Unordered List
        // ----------------------
        //      Creates an unordered list element to hold the
        //        new dropdown list options that directly match
        //        the values of the original select box options
        _createUnorderedList: function() {

            // Storing the context of the widget
            var self = this,

                dataDisabled,

                optgroupClass,

                optgroupElement,

                iconClass,

                iconUrl,

                iconUrlClass,

                iconUrlStyle,

                // Declaring the variable that will hold all of the dropdown list option elements
                currentItem = "",

                // Creates an unordered list element
                createdList = $("<ul/>", {

                    // Sets the unordered list `id` attribute
                    "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItOptions",

                    "class": "selectboxit-options",

                    //Sets the unordered list `tabindex` attribute to -1 to prevent the unordered list from being focusable
                    "tabindex": -1

                });

            // Checks the `showFirstOption` plugin option to determine if the first dropdown list option should be shown in the options list.
            if (!self.options["showFirstOption"]) {

                // Excludes the first dropdown list option from the options list
                self.selectItems = self.selectBox.find("option").slice(1);
            }

            // Loops through the original select box options list and copies the text of each
            // into new list item elements of the new dropdown list
            self.selectItems.each(function(index) {

                optgroupClass = "";

                optgroupElement = "";

                dataDisabled = $(this).prop("disabled");

                iconClass = $(this).data("icon") || "";

                iconUrl = $(this).data("iconurl") || "";

                iconUrlClass = iconUrl ? "selectboxit-option-icon-url": "";

                iconUrlStyle = iconUrl ? 'style="background-image:url(\'' + iconUrl + '\');"': "";

                // If the current option being traversed is within an optgroup

                if($(this).parent().is("optgroup")) {

                    optgroupClass = "selectboxit-optgroup-option";

                    if($(this).index() === 0) {

                         optgroupElement = '<span class="selectboxit-optgroup-header" data-disabled="true">' + $(this).parent().first().attr("label") + '</span>';

                    }

                }

                // Uses string concatenation for speed (applies HTML attribute encoding)
                currentItem += optgroupElement + '<li id="' + index + '" data-val="' + self.htmlEscape(this.value) + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + " selectboxit-option " + ($(this).attr("class") || "") + '"><a class="selectboxit-option-anchor"><i class="selectboxit-option-icon ' + iconClass + ' ' + iconUrlClass + '"' + iconUrlStyle + '></i>' + self.htmlEscape($(this).text()) + '</a></li>';

                // Stores all of the original select box options text inside of an array
                // (Used later in the `searchAlgorithm` method)
                self.textArray[index] = dataDisabled ? "": $(this).text();

                // Checks the original select box option for the `selected` attribute
                if (this.selected) {

                    //Replace the default text with the selected option
                    self.dropdownText.text($(this).text());

                    //Set the currently selected option
                    self.currentFocus = index;
                }

            });

            // If the `defaultText` option is being used
            if ((self.options["defaultText"] || self.selectBox.data("text")) && !self.selectBox.find("option[selected]").length) {

                var defaultedText = self.options["defaultText"] || self.selectBox.data("text");

                //Overrides the current dropdown default text with the value the user specifies in the `defaultText` option
                self.dropdownText.text(defaultedText);

                self.options["defaultText"] = defaultedText;
            }

            // Append the list item to the unordered list
            createdList.append(currentItem);

            // Stores the dropdown list options list inside of the `list` instance variable
            self.list = createdList;

            // Append the dropdown list options list to the dropdown container element
            self.dropdownContainer.append(self.list);

            // Stores the indropdownidual dropdown list options inside of the `listItems` instance variable
            self.listItems = self.list.find("li");

            // Sets the 'selectboxit-option-first' class name on the first drop down option
            self.listItems.first().addClass("selectboxit-option-first");


            // Sets the 'selectboxit-option-last' class name on the last drop down option
            self.listItems.last().addClass("selectboxit-option-last");

            // Set the disabled CSS class for select box options
            self.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(self.theme["disabled"]);

            // If the first select box option is disabled, and the user has chosen to not show the first select box option
            if (self.currentFocus === 0 && !self.options["showFirstOption"] && self.listItems.eq(0).hasClass(self.theme["disabled"])) {

                //Sets the default value of the dropdown list to the first option that is not disabled
                self.currentFocus = +self.listItems.not(".ui-state-disabled").first().attr("id");

            }

            self.dropdownImage.addClass(self.selectBox.data("icon") || self.options["defaultIcon"] || self.listItems.eq(self.currentFocus).find("i").attr("class"));

            self.dropdownImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));

            //Maintains chainability
            return self;

        },

        // _Replace Select Box
        // -------------------
        //      Hides the original dropdown list and inserts
        //        the new DOM elements
        _replaceSelectBox: function() {

            var self = this;

            // Hides the original select box
            self.selectBox.css("display", "none").

            // Adds the new dropdown list to the page directly after the hidden original select box element
            after(self.dropdownContainer);

            // The height of the dropdown list
            var height = self.dropdown.height();

            // The down arrow element of the dropdown list
            self.downArrow = $("<i/>", {

                // Dynamically sets the dropdown `id` attribute of the dropdown list down arrow
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItArrow",

                "class": "selectboxit-arrow",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            });

            // The down arrow container element of the dropdown list
            self.downArrowContainer = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute for the down arrow container element
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItArrowContainer",

                "class": "selectboxit-arrow-container",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            }).

            // Inserts the down arrow element inside of the down arrow container element
            append(self.downArrow);

            // Appends the down arrow element to the dropdown list
            self.dropdown.append(this.options["nostyle"] ? self.downArrow : self.downArrowContainer);

            if (!self.options["nostyle"]) {

                // The dynamic CSS of the down arrow container element
                self.downArrowContainer.css({

                    "height": height + "px"

                });

                // Dynamically adds the `max-width` and `line-height` CSS styles of the dropdown list text element
                self.dropdownText.css({

                    "line-height": self.dropdown.css("height"),

                    "max-width": self.dropdown.outerWidth() - (self.downArrowContainer.outerWidth() + self.dropdownImage.outerWidth())

                });

                self.dropdownImage.css({

                    "margin-top": height / 4

                });

                // Adds the `selectboxit-selected` class name to the currently selected drop down option
                self.listItems.removeClass("selectboxit-selected").eq(self.currentFocus).addClass("selectboxit-selected");

            }

            // Maintains chainability
            return self;

        },

        // _Scroll-To-View
        // ---------------
        //      Updates the dropdown list scrollTop value
        _scrollToView: function(type) {

            var self = this,

                // The current scroll positioning of the dropdown list options list
                listScrollTop = self.list.scrollTop(),

                // The height of the currently selected dropdown list option
                currentItemHeight = self.listItems.eq(self.currentFocus).height(),

                // The relative distance from the currently selected dropdown list option to the the top of the dropdown list options list
                currentTopPosition = self.listItems.eq(self.currentFocus).position().top,

                // The height of the dropdown list option list
                listHeight = self.list.height();

            // Scrolling logic for a text search
            if (type === "search") {

                // Increases the dropdown list options `scrollTop` if a user is searching for an option
                // below the currently selected option that is not visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // The selected option will be shown at the very bottom of the visible options list
                    self.list.scrollTop(listScrollTop + (currentTopPosition - (listHeight - currentItemHeight)));

                }

                // Decreases the dropdown list options `scrollTop` if a user is searching for an option above the currently selected option that is not visible
                else if (currentTopPosition < -1) {

                    self.list.scrollTop(currentTopPosition - currentItemHeight);

                }
            }

            // Scrolling logic for the `up` keyboard navigation
            else if (type === "up") {

                // Decreases the dropdown list option list `scrollTop` if a user is navigating to an element that is not visible
                if (currentTopPosition < -1) {

                    self.list.scrollTop(listScrollTop - Math.abs(self.listItems.eq(self.currentFocus).position().top));

                }
            }

            // Scrolling logic for the `down` keyboard navigation
            else if (type === "down") {

                // Increases the dropdown list options `scrollTop` if a user is navigating to an element that is not fully visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // Increases the dropdown list options `scrollTop` by the height of the current option item.
                    self.list.scrollTop((listScrollTop + (Math.abs(self.listItems.eq(self.currentFocus).position().top) - listHeight + currentItemHeight)));

                }
            }

            // Maintains chainability
            return self;

        },

        // _Callback
        // ---------
        //      Call the function passed into the method
        _callbackSupport: function(callback) {

            var self = this;

            // Checks to make sure the parameter passed in is a function
            if ($.isFunction(callback)) {

                // Calls the method passed in as a parameter and sets the current `SelectBoxIt` object that is stored in the jQuery data method as the context(allows for `this` to reference the SelectBoxIt API Methods in the callback function. The `dropdown` DOM element that acts as the new dropdown list is also passed as the only parameter to the callback
                callback.call(self, self.dropdown);

            }

            // Maintains chainability
            return self;

        },

        // Open
        // ----
        //      Opens the dropdown list options list
        open: function(callback) {

            var self = this;

            // If there are no select box options, do not try to open the select box
            if(!self.listItems.length) {

                return self;

            }

            if (self._dynamicPositioning) {

                // Dynamically positions the dropdown list options list
                self._dynamicPositioning();

            }

            if(!this.list.is(":visible")) {

                // Triggers a custom "open" event on the original select box
                self.triggerEvent("open");

                // Determines what jQuery effect to use when opening the dropdown list options list
                switch (self.options["showEffect"]) {

                    // Uses `no effect`
                    case "none":

                        // Does not require a callback function because this animation will complete before the call to `scrollToView`
                        self.list.show();

                       // Updates the list `scrollTop` attribute
                       self._scrollToView("search");

                    break;

                    // Uses the jQuery `show` special effect
                    case "show":

                        // Requires a callback function to determine when the `show` animation is complete
                        self.list.show(self.options["showEffectSpeed"], function() {

                            // Updates the list `scrollTop` attribute
                            self._scrollToView("search");

                        });

                    break;

                   // Uses the jQuery `slideDown` special effect
                   case "slideDown":

                       // Requires a callback function to determine when the `slideDown` animation is complete
                       self.list.slideDown(self.options["showEffectSpeed"], function() {

                           // Updates the list `scrollTop` attribute
                           self._scrollToView("search");

                       });

                   break;

                  // Uses the jQuery `fadeIn` special effect
                  case "fadeIn":

                      // Does not require a callback function because this animation will complete before the call to `scrollToView`
                      self.list.fadeIn(self.options["showEffectSpeed"]);

                      // Updates the list `scrollTop` attribute
                      self._scrollToView("search");

                  break;

                  // If none of the above options were passed, then a `jqueryUI show effect` is expected
                  default:

                     // Allows for custom show effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/show/)
                     self.list.show(self.options["showEffect"], self.options["showEffectOptions"], self.options["showEffectSpeed"], function() {

                         // Updates the list `scrollTop` attribute
                         self._scrollToView("search");

                     });

                 break;

                }

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },

        // Close
        // -----
        //      Closes the dropdown list options list
        close: function(callback) {

            var self = this;

            if(self.list.is(":visible")) {

                // Triggers a custom "close" event on the original select box
                self.triggerEvent("close");

                // Determines what jQuery effect to use when closing the dropdown list options list
                switch (self.options["hideEffect"]) {

                    // Uses `no effect`
                    case "none":

                        // Does not require a callback function because this animation will complete before the call to `scrollToView`
                        self.list.hide();

                        // Updates the list `scrollTop` attribute
                        self._scrollToView("search");

                    break;

                    // Uses the jQuery `hide` special effect
                    case "hide":

                        self.list.hide(self.options["hideEffectSpeed"]);

                    break;

                    // Uses the jQuery `slideUp` special effect
                    case "slideUp":

                    self.list.slideUp(self.options["hideEffectSpeed"]);

                    break;

                    // Uses the jQuery `fadeOut` special effect
                    case "fadeOut":

                        self.list.fadeOut(self.options["hideEffectSpeed"]);

                    break;

                    // If none of the above options were passed, then a `jqueryUI hide effect` is expected
                    default:

                        // Allows for custom hide effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/hide/)
                        self.list.hide(self.options["hideEffect"], self.options["hideEffectOptions"], self.options["hideEffectSpeed"], function() {

                            //Updates the list `scrollTop` attribute
                            self._scrollToView("search");

                        });

                    break;
                }

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },


        // _Event Handlers
        // ---------------
        //      Adds event handlers to the new dropdown list
        _eventHandlers: function() {

            // LOCAL VARIABLES
            var self = this,

                upKey = 38,

                downKey = 40,

                enterKey = 13,

                backspaceKey = 8,

                tabKey = 9,

                spaceKey = 32,

                escKey = 27;

            // Select Box events
            this.dropdown.bind({

                // `click` event with the `selectBoxIt` namespace
                "click.selectBoxIt": function() {

                    // Used to make sure the dropdown becomes focused (fixes IE issue)
                    self.dropdown.trigger("focus", true);

                    // The `click` handler logic will only be applied if the dropdown list is enabled
                    if (!self.originalElem.disabled) {

                        // Triggers the `click` event on the original select box
                        self.triggerEvent("click");

                        // If the dropdown list options list is visible when a user clicks on the dropdown list
                        if (self.list.is(":visible")) {

                            // Closes the dropdown list options list
                            self.close();
                        }

                        // If the dropdown list options list is not visible when a user clicks on the dropdown list
                        else {

                            // Shows the dropdown list options list
                            self.open();
                        }

                    }

                },

                // `mousedown` event with the `selectBoxIt` namespace
                "mousedown.selectBoxIt": function() {

                    // Stores data in the jQuery `data` method to help determine if the dropdown list gains focus from a click or tabstop.  The mousedown event fires before the focus event.
                    $(this).data("mdown", true);

                    self.triggerEvent("mousedown");

                },

                // `mouseup` event with the `selectBoxIt` namespace
                "mouseup.selectBoxIt": function() {

                    self.triggerEvent("mouseup");

                },

                // `blur` event with the `selectBoxIt` namespace.  Uses special blur logic to make sure the dropdown list closes correctly
                "blur.selectBoxIt": function() {

                    // If `self.blur` property is true
                    if (self.blur) {

                        // Triggers both the `blur` and `focusout` events on the original select box.
                        // The `focusout` event is also triggered because the event bubbles
                        // This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        // Popular open source projects such as Backbone.js utilize event delegation to bind events, so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.triggerEvent("blur");

                        //If the dropdown options list is visible
                        if (self.list.is(":visible")) {

                            //Closes the dropdown list options list
                            self.close();

                        }

                    }

                },

                "focus.selectBoxIt": function(event, internal) {

                    // Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");

                    // Removes the jQuery data associated with the mousedown event
                    $(this).removeData("mdown");

                    // If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if (!mdown && !internal) {

                        setTimeout(function() {

                            // Triggers the `tabFocus` custom event on the original select box
                            self.triggerEvent("tab-focus");

                        }, 0);

                    }

                    // Only trigger the `focus` event on the original select box if the dropdown list is hidden (this verifies that only the correct `focus` events are used to trigger the event on the original select box
                    if(!internal) {

                        //Triggers the `focus` default event on the original select box
                        self.triggerEvent("focus");

                    }

                },

                // `keydown` event with the `selectBoxIt` namespace.  Catches all user keyboard navigations
                "keydown.selectBoxIt": function(e) {

                    // Stores the `keycode` value in a local variable
                    var currentKey = e.keyCode;

                    // Supports keyboard navigation
                    switch (currentKey) {

                        // If the user presses the `down key`
                        case downKey:

                            // Prevents the page from moving down
                            e.preventDefault();

                            // If the plugin options allow keyboard navigation
                            if (self.moveDown) {

                                if(self.options["keydownOpen"]) {

                                    if(self.list.is(":visible")) {

                                        self.moveDown();

                                    }

                                    else {

                                        self.open();

                                    }

                                }

                                else {

                                    // Moves the focus down to the dropdown list option directly beneath the currently selected selectbox option
                                    self.moveDown();

                                }

                            }

                            if(self.options["keydownOpen"]) {

                                self.open();

                            }

                            break;

                        //If the user presses the `up key`
                        case upKey:

                            // Prevents the page from moving up
                            e.preventDefault();

                            // If the plugin options allow keyboard navigation
                            if (self.moveUp) {

                                if(self.options["keydownOpen"]) {

                                    if(self.list.is(":visible")) {

                                        self.moveUp();

                                    }

                                    else {

                                        self.open();

                                    }

                                }

                                else {

                                    // Moves the focus down to the dropdown list option directly beneath the currently selected selectbox option
                                    self.moveUp();

                                }

                            }

                            if(self.options["keydownOpen"]) {

                                self.open();

                            }

                            break;

                        // If the user presses the `enter key`
                        case enterKey:

                            var activeElem = self.list.find("li." + self.focusClass);

                            // If there is no active Elem yet
                            if(!activeElem.length) {

                                activeElem = self.listItems.first();

                            }

                            // Updates the dropdown list value
                            self._update(activeElem);

                            // Prevents the default event from being triggered
                            e.preventDefault();

                            // Checks to see if the dropdown list options list is open
                            if (self.list.is(":visible")) {

                                // Closes the dropdown list options list
                                self.close();

                            }

                            // Triggers the `enter` events on the original select box
                            self.triggerEvent("enter");

                            break;

                        // If the user presses the `tab key`
                        case tabKey:

                            // Triggers the custom `tab-blur` event on the original select box
                            self.triggerEvent("tab-blur");

                            break;

                        // If the user presses the `backspace key`
                        case backspaceKey:

                            // Prevents the browser from navigating to the previous page in its history
                            e.preventDefault();

                            // Triggers the custom `backspace` event on the original select box
                            self.triggerEvent("backspace");

                            break;

                        // If the user presses the `escape key`
                        case escKey:

                            // Closes the dropdown options list
                            self.close();

                            break;

                        // Default is to break out of the switch statement
                        default:

                            break;

                    }

                },

                // `keypress` event with the `selectBoxIt` namespace.  Catches all user keyboard text searches since you can only reliably get character codes using the `keypress` event
                "keypress.selectBoxIt": function(e) {

                    // Sets the current key to the `keyCode` value if `charCode` does not exist.  Used for cross
                    // browser support since IE uses `keyCode` instead of `charCode`.
                    var currentKey = e.charCode || e.keyCode,

                        // Converts unicode values to characters
                        alphaNumericKey = String.fromCharCode(currentKey);

                    // If the user presses the `space bar`
                    if (currentKey === spaceKey) {

                        // Prevents the browser from scrolling to the bottom of the page
                        e.preventDefault();

                    }

                    // If the plugin options allow text searches
                    if (self.search) {

                        // Calls `search` and passes the character value of the user's text search
                        self.search(alphaNumericKey, true, "");

                    }

                },

                // `mousenter` event with the `selectBoxIt` namespace .The mouseenter JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseenter.selectBoxIt": function() {

                    // Trigger the `mouseenter` event on the original select box
                    self.triggerEvent("mouseenter");

                },

                // `mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseleave.selectBoxIt": function() {

                    // Trigger the `mouseleave` event on the original select box
                    self.triggerEvent("mouseleave");

                }

            });

            // Select box options events that set the dropdown list blur logic (decides when the dropdown list gets
            // closed)
            self.list.bind({

                // `mouseover` event with the `selectBoxIt` namespace
                "mouseover.selectBoxIt": function() {

                    // Prevents the dropdown list options list from closing
                    self.blur = false;

                },

                // `mouseout` event with the `selectBoxIt` namespace
                "mouseout.selectBoxIt": function() {

                    // Allows the dropdown list options list to close
                    self.blur = true;

                },

                // `focusin` event with the `selectBoxIt` namespace
                "focusin.selectBoxIt": function() {

                    // Prevents the default browser outline border to flicker, which results because of the `blur` event
                    self.dropdown.trigger("focus", true);
                }

            })

            // Select box indropdownidual options events bound with the jQuery `delegate` method.  `Delegate` was used because binding indropdownidual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "click.selectBoxIt", function() {

                self._update($(this));

                self.triggerEvent("option-click");

                // If the current drop down option is not disabled
                if ($(this).attr("data-disabled") === "false") {

                    // Closes the drop down list
                    self.close();

                }

            })

            // Delegates the `focus` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "focusin.selectBoxIt", function() {

                // Removes the hover class from the previous drop down option
                self.listItems.not($(this)).removeAttr("data-active");

                $(this).attr("data-active", "");

                if((self.options["searchWhenHidden"] && self.list.is(":hidden")) || self.options["aggressiveChange"] || (self.list.is(":hidden") && self.options["selectWhenHidden"])) {

                    self._update($(this));

                }

            });

            // Original dropdown list events
            self.selectBox.bind({

                // `change` event handler with the `selectBoxIt` namespace
                "change.selectBoxIt, internal-change.selectBoxIt": function(event, internal) {

                    // If the user called the change method
                    if(!internal) {

                        var currentOption = self.list.find('li[data-val="' + self.originalElem.value + '"]');

                        // If there is a dropdown option with the same value as the original select box element
                        if(currentOption.length) {

                            self.listItems.eq(self.currentFocus).removeClass(self.focusClass);

                            self.currentFocus = +currentOption.attr("id");



                        }

                    }

                    // Sets the new dropdown list text to the value of the current option
                    self.dropdownText.text(self.listItems.eq(self.currentFocus).find("a").text()).attr("data-val", self.originalElem.value);

                    if(self.listItems.eq(self.currentFocus).find("i").attr("class")) {

                        self.dropdownImage.attr("class", self.listItems.eq(self.currentFocus).find("i").attr("class")).addClass("selectboxit-default-icon");

                        self.dropdownImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));
                    }

                    // Triggers a custom changed event on the original select box
                    self.triggerEvent("changed");

                },

                // `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function() {

                    // Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.dropdown.addClass(self.theme["disabled"]);

                },

                // `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function() {

                    // Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.dropdown.removeClass(self.theme["disabled"]);

                }

            });

            // Maintains chainability
            return self;

        },

        // _update
        // -------
        //      Updates the drop down and select box with the current value
        _update: function(elem) {

            var self = this;

            if (elem.attr("data-disabled") === "false") {

                // If the default text option is set and the current drop down option is not disabled
                if ((self.options["defaultText"] && self.dropdownText.text() === self.options["defaultText"]) && self.selectBox.val() === elem.attr("data-val")) {

                    // Updates the dropdown list value
                    self.dropdownText.text(self.listItems.eq(self.currentFocus).text()).

                    trigger("internal-change");

                }

                else {

                    // Sets the original dropdown list value and triggers the `change` event on the original select box
                    self.selectBox.val(elem.attr("data-val"));

                    // Sets `currentFocus` to the currently focused dropdown list option.
                    // The unary `+` operator casts the string to a number
                    // [James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                    self.currentFocus = +elem.attr("id");

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.dropdownText.attr("data-val")) {

                        self.triggerEvent("change");

                    }

                }

            }

        },

        // _addClasses
        // -----------
        //      Adds SelectBoxIt CSS classes
        _addClasses: function(obj) {

            var self = this,

                focusClass = obj.focus,

                hoverClass = obj.hover,

                buttonClass = obj.button,

                listClass = obj.list,

                arrowClass = obj.arrow,

                containerClass = obj.container,

                openClass = obj.open;

            self.focusClass = focusClass;

            self.openClass = openClass;

            self.selectedClass = "selectboxit-selected";

            self.downArrow.addClass(self.selectBox.data("downarrow") || self.options["downArrowIcon"] || arrowClass);

            // Adds the correct container class to the dropdown list
            self.dropdownContainer.addClass(containerClass);

            // Adds the correct class to the dropdown list
            self.dropdown.addClass(buttonClass);

            // Adds the default class to the dropdown list options
            self.list.addClass(listClass);

            // Select box individual option events
            self.listItems.bind({

                // `focus` event with the `selectBoxIt` namespace
                "focusin.selectBoxIt": function() {

                    // Adds the focus CSS class to the currently focused dropdown list option
                    $(this).addClass(focusClass);

                },

                // `blur` event with the `selectBoxIt` namespace
                "blur.selectBoxIt": function() {

                    // Removes the focus CSS class from the previously focused dropdown list option
                    $(this).removeClass(focusClass);

                }

            });

            // Select box events
            self.selectBox.bind({

                // `click` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function() {

                    var currentElem = self.list.find("li[data-val='" + self.dropdownText.attr("data-val") + "']");

                    // If no current element can be found, then select the first drop down option
                    if(!currentElem.length) {

                        currentElem = self.listItems.first();

                    }

                    self.currentFocus = +currentElem.attr("id");

                    var activeElem = self.listItems.eq(self.currentFocus);

                    // Adds the open class to the container
                    self.dropdownContainer.addClass(openClass);

                    // Removes the focus class from the dropdown list and adds the library focus class for both the dropdown list and the currently selected dropdown list option
                    self.dropdown.removeClass(hoverClass).addClass(focusClass);

                    self.listItems.removeClass(self.selectedClass);

                    self.listItems.removeAttr("data-active").not(activeElem).removeClass(focusClass);

                    activeElem.addClass(focusClass).addClass(self.selectedClass);

                },

               "close.selectBoxIt": function() {

                    // Removes the open class from the dropdown container
                    self.dropdownContainer.removeClass(openClass);

                },

                "blur.selectBoxIt": function() {

                    self.dropdown.removeClass(focusClass);

                },

                // `mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function() {

                    self.dropdown.addClass(hoverClass);

                },

                // `mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function() {

                    // Removes the hover CSS class on the previously hovered dropdown list option
                    self.dropdown.removeClass(hoverClass);

                }

            });

            self.listItems.bind({

                "mouseenter.selectBoxIt": function() {

                    // If the currently moused over drop down option is not disabled
                    if($(this).attr("data-disabled") === "false") {

                        self.listItems.removeAttr("data-active");

                        $(this).addClass(focusClass).attr("data-active", "");

                        // Sets the dropdown list indropdownidual options back to the default state and sets the focus CSS class on the currently hovered option
                        self.listItems.not($(this)).removeClass(focusClass);

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("id");

                    }

                },

                "mouseleave.selectBoxIt": function() {

                    // If the currently moused over drop down option is not disabled
                    if($(this).attr("data-disabled") === "false") {

                        // Removes the focus class from the previous drop down option
                        self.listItems.not($(this)).removeClass(focusClass).removeAttr("data-active");

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("id");

                    }

                }

            });

            $(".selectboxit-option-icon").not(".selectboxit-default-icon").css("margin-top", self.downArrowContainer.height()/4);

            // Maintains chainability
            return self;

        },

        // Refresh
        // -------
        //    The dropdown will rebuild itself.  Useful for dynamic content.

        refresh: function(callback) {

            var self = this;

            if(self._destroySelectBoxIt) {

                // Destroys the plugin and then recreates the plugin
                self._destroySelectBoxIt()._create(true)._callbackSupport(callback);

                self.triggerEvent("refresh");

            }

            //Maintains chainability
            return self;

        },

        // HTML Escape
        // -----------
        //      HTML encodes a string
        htmlEscape: function(str) {

            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

        },

        // triggerEvent
        // ------------
        //      Trigger's an external event on the original select box
        triggerEvent: function(eventName) {

            var self = this,
                // Finds the currently option index
                currentIndex = self.options["showFirstOption"] ? self.currentFocus : ((self.currentFocus - 1) >= 0 ? self.currentFocus: 0 );

                // Triggers the custom option-click event on the original select box and passes the select box option
                self.selectBox.trigger(eventName, { "elem": self.selectBox.eq(currentIndex), "dropdown-elem": self.listItems.eq(self.currentFocus) });


            // Maintains chainability
            return self;

        },

        _copyAttributes: function() {

            var self = this;

            if(self._addSelectBoxAttributes) {

                self._addSelectBoxAttributes();

            }

            return self;

        }

    });

    // Accessibility Module
    // ====================

    // _ARIA Accessibility
    // ------------------
    //      Adds ARIA (Accessible Rich Internet Applications)
    //      Accessibility Tags to the Select Box

    $.selectBox.selectBoxIt.prototype._ariaAccessibility = function() {

        var self = this;

        // Adds `ARIA attributes` to the dropdown list
        self.dropdown.attr({

            // W3C `combobox` description: A presentation of a select; usually similar to a textbox where users can type ahead to select an option.
            "role": "combobox",

            //W3C `aria-autocomplete` description: Indicates whether user input completion suggestions are provided.
            "aria-autocomplete": "list",

            // W3C `aria-expanded` description: Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
            "aria-expanded": "false",

            // W3C `aria-owns` description: The value of the aria-owns attribute is a space-separated list of IDREFS that reference one or more elements in the document by ID. The reason for adding aria-owns is to expose a parent/child contextual relationship to assistive technologies that is otherwise impossible to infer from the DOM.
            "aria-owns": self.list.attr("id"),

            // W3C `aria-activedescendant` description: This is used when a composite widget is responsible for managing its current active child to reduce the overhead of having all children be focusable. Examples include: multi-level lists, trees, and grids.
            "aria-activedescendant": self.listItems.eq(self.currentFocus).attr("id"),

            // W3C `aria-label` description:  It provides the user with a recognizable name of the object.
            "aria-label": $("label[for='" + self.originalElem.id + "']").text() || "",

            // W3C `aria-live` description: Indicates that an element will be updated.
            // Use the assertive value when the update needs to be communicated to the user more urgently.
            "aria-live": "assertive"

        }).

        // Dynamically adds `ARIA attributes` if the new dropdown list is enabled or disabled
        bind({

            //Select box custom `disable` event with the `selectBoxIt` namespace
            "disable.selectBoxIt" : function() {

                // W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.dropdown.attr("aria-disabled", "true");

            },

            // Select box custom `enable` event with the `selectBoxIt` namespace
            "enable.selectBoxIt" : function() {

                // W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.dropdown.attr("aria-disabled", "false");

            }

        });

        // Adds ARIA attributes to the dropdown list options list
        self.list.attr({

            // W3C `listbox` description: A widget that allows the user to select one or more items from a list of choices.
            "role": "listbox",

            // Indicates that the dropdown list options list is currently hidden
            "aria-hidden": "true"

        });

        // Adds `ARIA attributes` to the dropdown list options
        self.listItems.attr({

            // This must be set for each element when the container element role is set to `listbox`
            "role": "option"

        });

        // Dynamically updates the new dropdown list `aria-label` attribute after the original dropdown list value changes
        self.selectBox.bind({

            // Custom `change` event with the `selectBoxIt` namespace
            "change.selectBoxIt": function() {

                // Provides the user with a recognizable name of the object.
                self.dropdownText.attr("aria-label", self.originalElem.value);

            },

            // Custom `open` event with the `selectBoxIt` namespace
            "open.selectBoxIt": function() {

                // Indicates that the dropdown list options list is currently visible
                self.list.attr("aria-hidden", "false");

                // Indicates that the dropdown list is currently expanded
                self.dropdown.attr("aria-expanded", "true");

            },

            // Custom `close` event with the `selectBoxIt` namespace
            "close.selectBoxIt": function() {

                // Indicates that the dropdown list options list is currently hidden
                self.list.attr("aria-hidden", "true");

                // Indicates that the dropdown list is currently collapsed
                self.dropdown.attr("aria-expanded", "false");

            }

        });

        // Maintains chainability
        return self;

    };

    // Copy Attributes Module
    // ======================

    // addSelectBoxAttributes
    // ----------------------
    //      Add's all attributes (excluding id, class names, and the style attribute) from the default select box to the new drop down

    $.selectBox.selectBoxIt.prototype._addSelectBoxAttributes = function() {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Add's all attributes to the currently traversed drop down option
        self._addAttributes(self.selectBox.prop("attributes"), self.dropdown);

        // Add's all attributes to the drop down items list
        self.selectItems.each(function(iterator) {

            // Add's all attributes to the currently traversed drop down option
            self._addAttributes($(this).prop("attributes"), self.listItems.eq(iterator));

        });

        // Maintains chainability
        return self;

    };

    // addAttributes
    // -------------
    //  Add's attributes to a DOM element
    $.selectBox.selectBoxIt.prototype._addAttributes = function(arr, elem) {

        // Stores the plugin context inside of the self variable
        var self = this,
            // Attributes that will be copied over to the new drop down
            whitelist = [

                "title",

                "rel"

            ];

        // If there are array properties
        if(arr.length) {

            // Iterates over all of array properties
            $.each(arr, function(iterator, property) {

                // Get's the property name and property value of each property
                var propName = (property.name).toLowerCase(), propValue = property.value;

                // If the currently traversed property value is not "null", is on the whitelist, or is an HTML 5 data attribute
                if(propValue !== "null" && ($.inArray(propName, whitelist) !== -1 || propName.indexOf("data") !== -1)) {

                    // Set's the currently traversed property on element
                    elem.attr(propName, propValue);

                }

            });

        }

        // Maintains chainability
        return self;

    };

    // Destroy Module
    // ==============

    // Destroy
    // -------
    //    Removes the plugin from the page

    $.selectBox.selectBoxIt.prototype.destroy = function(callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

        self._destroySelectBoxIt();

        // Calls the jQueryUI Widget Factory destroy method
        $.Widget.prototype.destroy.call(self);

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Internal Destroy Method
    // -----------------------
    //    Removes the plugin from the page

    $.selectBox.selectBoxIt.prototype._destroySelectBoxIt = function() {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
        self.dropdown.unbind(".selectBoxIt").

        // Undelegates all of the dropdown list event handlers with the `selectBoxIt` namespace
        undelegate(".selectBoxIt");

        // Remove all of the `selectBoxIt` DOM elements from the page
        self.dropdownContainer.remove();

        // Triggers the custom `destroy` event on the original select box
        self.triggerEvent("destroy");

        // Shows the original dropdown list
        self.selectBox.removeAttr("style").show();

        // Maintains chainability
        return self;

    };

    // Disable Module
    // ==============

    // Disable
    // -------
    //      Disables the new dropdown list

    $.selectBox.selectBoxIt.prototype.disable = function(callback) {

        var self = this;

        if(!self.options["disabled"]) {

            // Makes sure the dropdown list is closed
            self.close();

            // Triggers a `disable` custom event on the original select box
            self.triggerEvent("disable");

            // Sets the `disabled` attribute on the original select box
            self.selectBox.attr("disabled", "disabled");

            // Makes the dropdown list not focusable by removing the `tabindex` attribute
            self.dropdown.removeAttr("tabindex").

            // Enabled styling for disabled state
            addClass("selectboxit-disabled");

            // Calls the jQueryUI Widget Factory disable method to make sure all options are correctly synced
           $.Widget.prototype.disable.call(self);

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Disable Option
    // --------------
    //      Disables a single drop down option

    $.selectBox.selectBoxIt.prototype.disableOption = function(index, callback) {

        var self = this, currentSelectBoxOption, hasNextEnabled, hasPreviousEnabled;

        // If an index is passed to target an indropdownidual drop down option
        if((typeof index).toLowerCase() === "number") {

            // Makes sure the dropdown list is closed
            self.close();

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `disable-option` custom event on the original select box and passes the disabled option
            self.triggerEvent("disable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.attr("disabled", "disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "true").

            // Applies disabled styling for the drop down option
            addClass(self.theme["disabled"]);

            // If the currently selected drop down option is the item being disabled
            if(self.currentFocus === index) {

                hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

                hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

                // If there is a currently enabled option beneath the currently selected option
                if(hasNextEnabled) {

                    // Selects the option beneath the currently selected option
                    self.moveDown();

                }

                // If there is a currently enabled option above the currently selected option
                else if(hasPreviousEnabled) {

                    // Selects the option above the currently selected option
                    self.moveUp();

                }

                // If there is not a currently enabled option
                else {

                    // Disables the entire drop down list
                    self.disable();

                }

            }

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // _Is Disabled
    // -----------
    //      Checks the original select box for the
    //    disabled attribute

    $.selectBox.selectBoxIt.prototype._isDisabled = function(callback) {

        var self = this;

        // If the original select box is disabled
        if (self.originalElem.disabled) {

            // Disables the dropdown list
            self.disable();

        }

        // Maintains chainability
        return self;

    };

    // Dynamic Positioning Module
    // ==========================

    // _Dynamic positioning
    // ------------------
    //      Dynamically positions the dropdown list options list

    $.selectBox.selectBoxIt.prototype._dynamicPositioning = function() {

        var self = this,

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            listOffsetTop = self.dropdown.offset().top,

            // The height of the dropdown list options list
            listHeight = self.list.data("max-height") || self.list.outerHeight(),

            // The height of the dropdown list DOM element
            selectBoxHeight = self.dropdown.outerHeight(),

            windowHeight = $(window).height(),

            windowScrollTop = $(window).scrollTop(),

            topToBottom = (listOffsetTop + selectBoxHeight + listHeight <= windowHeight + windowScrollTop),

            bottomReached = !topToBottom;

        if(!self.list.data("max-height")) {

            self.list.data("max-height", self.list.outerHeight());

        }

        // Makes sure the original select box is hidden
        self.selectBox.css("display", "none");

        // If there is room on the bottom of the viewport to display the drop down options
        if (!bottomReached) {

            self.list.css("max-height", self.list.data("max-height"));

            // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
            self.list.css("top", "auto");

        }

        // If there is room on the top of the viewport
        else if((self.dropdown.offset().top - windowScrollTop) >= listHeight) {

            self.list.css("max-height", self.list.data("max-height"));

            // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
            self.list.css("top", (self.dropdown.position().top - self.list.outerHeight()));

        }

        // If there is not enough room on the top or the bottom
        else {

            var outsideBottomViewport = Math.abs((listOffsetTop + selectBoxHeight + listHeight) - (windowHeight + windowScrollTop)),

                outsideTopViewport = Math.abs((self.dropdown.offset().top - windowScrollTop) - listHeight);

            // If there is more room on the bottom
            if(outsideBottomViewport < outsideTopViewport) {

                self.list.css("max-height", self.list.data("max-height") - outsideBottomViewport - (selectBoxHeight/2));

                self.list.css("top", "auto");

            }

            // If there is more room on the top
            else {

                self.list.css("max-height", self.list.data("max-height") - outsideTopViewport - (selectBoxHeight/2));

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (self.dropdown.position().top - self.list.outerHeight()));

            }

        }

        // Maintains chainability
        return self;

    };

    // Enable Module
    // =============

    // Enable
    // -----
    //      Enables the new dropdown list

    $.selectBox.selectBoxIt.prototype.enable = function(callback) {

        var self = this;

        if(self.options["disabled"]) {

            // Triggers a `enable` custom event on the original select box
            self.triggerEvent("enable");

            // Removes the `disabled` attribute from the original dropdown list
            self.selectBox.removeAttr("disabled");

            // Make the dropdown list focusable
            self.dropdown.attr("tabindex", 0).

            // Disable styling for disabled state
            removeClass(self.disabledClasses);
                
            $.Widget.prototype.enable.call(self);

            // Provide callback function support
            self._callbackSupport(callback);

        }

        // Maintains chainability
        return self;

    };

    // Enable Option
    // -------------
    //      Disables a single drop down option

    $.selectBox.selectBoxIt.prototype.enableOption = function(index, callback) {

        var self = this, currentSelectBoxOption, currentIndex = 0, hasNextEnabled, hasPreviousEnabled;

        // If an index is passed to target an indropdownidual drop down option
        if((typeof index).toLowerCase() === "number") {

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `enable-option` custom event on the original select box and passes the enabled option
            self.triggerEvent("enable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.removeAttr("disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "false").

            // Applies disabled styling for the drop down option
            removeClass(self.disabledClasses);

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Keyboard Navigation Module
    // ==========================

    // Move Down
    // --------
    //      Handles the down keyboard navigation logic

    $.selectBox.selectBoxIt.prototype.moveDown = function(callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus += 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).attr("data-disabled") === "true" ? true: false,

            hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === self.listItems.length) {

            // Does not allow the user to continue to go up the list
            self.currentFocus -= 1;

        }

        // If the option the user is trying to go to is disabled, but there is another enabled option
        else if (disabled && hasNextEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus - 1).blur();

           // Call the `moveDown` method again
            self.moveDown();

            // Exit the method
            return;

        }

        // If the option the user is trying to go to is disabled, but there is not another enabled option
        else if (disabled && !hasNextEnabled) {

            self.currentFocus -= 1;

        }

        // If the user has not reached the bottom of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(self.currentFocus - 1).blur().end().

            // Focuses the currently focused list item
            eq(self.currentFocus).focusin();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("down");

            // Triggers the custom `moveDown` event on the original select box
            self.triggerEvent("moveDown");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Move Up
    // ------
    //      Handles the up keyboard navigation logic
    $.selectBox.selectBoxIt.prototype.moveUp = function(callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus -= 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).attr("data-disabled") === "true" ? true: false,

            hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === -1) {

            // Does not allow the user to continue to go up the list
            self.currentFocus += 1;

        }

        // If the option the user is trying to go to is disabled and the user is not trying to go up after the user has reached the top of the list
        else if (disabled && hasPreviousEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus + 1).blur();

            // Call the `moveUp` method again
            self.moveUp();

            // Exits the method
            return;

        }

        else if (disabled && !hasPreviousEnabled) {

            self.currentFocus += 1;

        }

        // If the user has not reached the top of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(this.currentFocus + 1).blur().end().

            // Focuses the currently focused list item
            eq(self.currentFocus).focusin();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("up");

            // Triggers the custom `moveDown` event on the original select box
            self.triggerEvent("moveUp");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Keyboard Search Module
    // ======================

    // _Set Current Search Option
    // -------------------------
    //      Sets the currently selected dropdown list search option

    $.selectBox.selectBoxIt.prototype._setCurrentSearchOption = function(currentOption) {

        var self = this;

        // Does not change the current option if `showFirstOption` is false and the matched search item is the hidden first option.
        // Otherwise, the current option value is updated
        if ((self.options["aggressiveChange"] || self.options["selectWhenHidden"] || self.listItems.eq(currentOption).is(":visible")) && self.listItems.eq(currentOption).data("disabled") !== true) {

            // Calls the `blur` event of the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).blur();

            // Sets `currentIndex` to the currently selected dropdown list option
            self.currentIndex = currentOption;

            // Sets `currentFocus` to the currently selected dropdown list option
            self.currentFocus = currentOption;

            // Focuses the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).focusin();

            // Updates the scrollTop so that the currently selected dropdown list option is visible to the user
            self._scrollToView("search");

            // Triggers the custom `search` event on the original select box
            self.triggerEvent("search");

        }

        // Maintains chainability
        return self;

    };

    // _Search Algorithm
    // -----------------
    //      Uses regular expressions to find text matches
    $.selectBox.selectBoxIt.prototype._searchAlgorithm = function(currentIndex, alphaNumeric) {

        var self = this,

            // Boolean to determine if a pattern match exists
            matchExists = false,

            // Iteration variable used in the outermost for loop
            x,

            // Iteration variable used in the nested for loop
           y,

            // Variable used to cache the length of the text array (Small enhancement to speed up traversing)
            arrayLength;

        // Loops through the text array to find a pattern match
        for (x = currentIndex, arrayLength = self.textArray.length; x < arrayLength; x += 1) {

            // Nested for loop to help search for a pattern match with the currently traversed array item
            for (y = 0; y < arrayLength; y += 1) {

                // Searches for a match
                if (self.textArray[y].search(alphaNumeric) !== -1) {

                    // `matchExists` is set to true if there is a match
                    matchExists = true;

                    // Exits the nested for loop
                    y = arrayLength;

                }

            } // End nested for loop

            // If a match does not exist
            if (!matchExists) {

                // Sets the current text to the last entered character
                self.currentText = self.currentText.charAt(self.currentText.length - 1).

                // Escapes the regular expression to make sure special characters are seen as literal characters instead of special commands
                replace(/[|()\[{.+*?$\\]/g, "\\$0");

                // Resets the regular expression with the new value of `self.currentText`
                alphaNumeric = new RegExp(self.currentText, "gi");

            }

            // Searches based on the first letter of the dropdown list options text if the currentText < 2 characters
            if (self.currentText.length < 3) {

                alphaNumeric = new RegExp(self.currentText.charAt(0), "gi");

                // If there is a match based on the first character
                if ((self.textArray[x].charAt(0).search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    // Increments the current index by one
                    self.currentIndex += 1;

                    // Exits the search
                    return false;

                }

            }

            // If `self.currentText` > 1 character
            else {

                // If there is a match based on the entire string
                if ((self.textArray[x].search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    // Exits the search
                    return false;

                }

            }

            // If the current text search is an exact match
            if (self.textArray[x].toLowerCase() === self.currentText.toLowerCase()) {

                // Sets properties of that dropdown list option to make it the currently selected option
                self._setCurrentSearchOption(x);

                // Resets the current text search to a blank string to start fresh again
               self.currentText = "";

                // Exits the search
                return false;

            }

        }

       // Returns true if there is not a match at all
        return true;

    };

    // Search
    // ------
    //      Calls searchAlgorithm()
    $.selectBox.selectBoxIt.prototype.search = function(alphaNumericKey, rememberPreviousSearch, callback) {

        var self = this;

        if(self.currentText === undefined) {

            self.currentText = "";

        }

        // If the search method is being called internally by the plugin, and not externally as a method by a user
        if (rememberPreviousSearch) {

            // Continued search with history from past searches.  Properly escapes the regular expression
            self.currentText += alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        else {

            // Brand new search.  Properly escapes the regular expression
            self.currentText = alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        // Searches globally
        var notFound = self._searchAlgorithm(self.currentIndex, self.currentText);

        // Searches the list again if a match is not found.  This is needed, because the first search started at the array indece of the currently selected dropdown list option, and does not search the options before the current array indece.
        // If there are many similar dropdown list options, starting the search at the indece of the currently selected dropdown list option is needed to properly traverse the text array.
        if (notFound) {

            // Searches the dropdown list values starting from the beginning of the text array
            self._searchAlgorithm(0, self.currentText);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Mobile Module
    // =============

    // Apply Native Select
    // -------------------
    //      Applies the original select box directly over the new drop down

    $.selectBox.selectBoxIt.prototype._applyNativeSelect = function() {

        // Stores the plugin context inside of the self variable
        var self = this,
            currentOption;

        self.dropdownContainer.css({

            "position": "static"

        });

        // Positions the original select box directly over top the new dropdown list using position absolute and "hides" the original select box using an opacity of 0.  This allows the mobile browser "wheel" interface for better usability.
        self.selectBox.css({

            "display": "block",

            "width": self.dropdown.outerWidth(),

            "height": self.dropdown.outerHeight(),

            "opacity": "0",

            "position": "absolute",

            "top": self.dropdown.position().top,

            "bottom": self.dropdown.position().bottom,

            "left": self.dropdown.position().left,

            "right": self.dropdown.position().right,

            "cursor": "pointer",

            "z-index": "999999"

        }).bind({

            "changed.selectBoxIt": function() {

                currentOption = self.selectBox.find("option").filter(":selected");

                // Sets the new dropdown list text to the value of the original dropdown list
               self.dropdownText.text(currentOption.text());

                if(self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

                   self.dropdownImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

                }

            }

        });

    };

    // Mobile
    // ------
    //      Applies the native "wheel" interface when a mobile user is interacting with the dropdown

    $.selectBox.selectBoxIt.prototype._mobile = function(callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

            if(self.options["isMobile"]()) {

                self._applyNativeSelect();

            }

            // Maintains chainability
            return this;

    };

    // Select Option Module
    // ====================

    // Select Option
    // -------------
    //      Programatically selects a drop down option by either index or value

    $.selectBox.selectBoxIt.prototype.selectOption = function(val, callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Makes sure the passed in position is a number
        if((typeof val).toLowerCase() === "number") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(self.selectBox.find("option").eq(val).val()).change();

        }

        else if((typeof val).toLowerCase() === "string") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(val).change();

        }

        // Calls the callback function
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Set Option Module
    // =================

    // Set Option
    // ----------
    //      Accepts an string key, a value, and a callback function to replace a single
    //      property of the plugin options object

    $.selectBox.selectBoxIt.prototype.setOption = function(key, value, callback) {

        var self = this;

        // If a user sets the `showFirstOption` to false
        if (key === "showFirstOption" && !value) {

            // Hides the first option in the dropdown list
            self.listItems.eq(0).hide();

        }

        // If a user sets the `showFirstOption` to true
        else if (key === "showFirstOption" && value) {

            // Shows the first option in the dropdown list
            self.listItems.eq(0).show();

        }

        else if(key === "defaultIcon" && value) {

            self.dropdownImage.attr("class", value + " selectboxit-arrow");

        }

        else if(key === "downArrowIcon" && value) {

            self.downArrow.attr("class", value + " selectboxit-arrow");

        }

        // If a user sets the defaultText option
        else if (key === "defaultText") {

            // Sets the new dropdown list default text
            self.dropdownText.text(value);

        }

        $.Widget.prototype._setOption.apply(self, arguments);

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Set Options Module
    // ==================

    // Set Options
    // ----------
    //      Accepts an object to replace plugin options
    //      properties of the plugin options object

    $.selectBox.selectBoxIt.prototype.setOptions = function(newOptions, callback) {

        var self = this;

        $.Widget.prototype._setOptions.apply(self, arguments);

        // If the `showFirstOption` option is true
        if (self.options["showFirstOption"]) {

            // Shows the first option in the dropdown list
            self.listItems.eq(0).show();

        }

        // If the `showFirstOption` option is false
        else {

            // Hides the first option in the dropdown list
            self.listItems.eq(0).hide();

        }

        if(self.options["defaultIcon"]) {

            self.dropdownImage.attr("class", self.options["defaultIcon"] + " selectboxit-arrow");

        }

        if(self.options["downArrowIcon"]) {

            self.downArrow.attr("class", self.options["downArrowIcon"] + " selectboxit-arrow");

        }

        // If the defaultText option is set, make sure the dropdown list default text reflects this value
        if (self.options["defaultText"]) {

            self.dropdownText.text(self.options["defaultText"]);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Wait Module
    // ===========

    // Wait
    // ----
    //    Delays execution by the amount of time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.wait = function(time, callback) {

        var self = this,

            // The timeout variable stores a Deferred Object, which will be resolved after the time specified in the parameter
            timeout = this.returnTimeout(time);

        // Once the Deferred object is resolved, call the callback function
        timeout.then(function() {

            // Provide callback function support
            self._callbackSupport(callback);

        });
        
        // Maintains chainability
        return self;

    };

    // Return timeout
    // -------------
    //    Returns a Deferred Object after the time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.returnTimeout = function(time) {

        // Returns a Deferred Object
        return $.Deferred(function(dfd) {

            // Call the JavaScript `setTimeout function and resolve the Deferred Object
            setTimeout(dfd.resolve, time);

        });

    };
})); // End of all modules