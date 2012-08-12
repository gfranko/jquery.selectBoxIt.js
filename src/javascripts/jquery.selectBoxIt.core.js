/* jquery Selectboxit - v1.0.0 - 2012-08-12
* http://www.gregfranko.com/jQuery.selectBoxIt.js/
* Copyright (c) 2012 Greg Franko; Licensed MIT */

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calling the jQueryUI Widget Factory Method
    $.widget("selectBox.selectBoxIt", {

        // Plugin version

        version: "1.0.0",

        // These options will be used as defaults
        options: {

            // **showEffect**: Accepts String: "none", "fadeIn", "show", "slideDown", or any of the jQueryUI show effects (i.e. "bounce")
            showEffect: "none",

            // **showEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            showEffectOptions: {},

            // **showEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            showEffectSpeed: "medium",

            // **hideEffect**: Accepts String: "none", "fadeOut", "hide", "slideUp", or any of the jQueryUI hide effects (i.e. "explode")
            hideEffect: "none",

            // **hideEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            hideEffectOptions: {},

            // **hideEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            hideEffectSpeed: "medium",

            // **showFirstOption**: Shows the first dropdown list option within the dropdown list options list
            showFirstOption: true,

            // **defaultText**: Overrides the text used by the dropdown list selected option to allow a user to specify custom text.  Accepts a String.
            defaultText: "",

            // **defaultIcon**: Overrides the icon used by the dropdown list selected option to allow a user to specify a custom icon.  Accepts a String (CSS class name(s)).
            defaultIcon: "",

            // **downArrowIcon**: Overrides the default down arrow used by the dropdown list to allow a user to specify a custom image.  Accepts a String (CSS class name(s)).
            downArrowIcon: ""

        },

        // _Create
        // -------
        //      Sets the Plugin Instance variables and
        //      constructs the plugin.  Only called once.
        _create: function() {

            // The original select box DOM element
            this.originalElem = this.element[0];

            // The original select box DOM element wrapped in a jQuery object
            this.selectBox = this.element;

            // All of the original select box options
            this.selectItems = this.element.find("option");

            // The first option in the original select box
            this.firstSelectItem = this.element.find("option").slice(0, 1);

            // The index of the currently selected dropdown list option
            this.currentFocus = 0;

            // Keeps track of which blur events will hide the dropdown list options
            this.blur = true;

            // The html document height
            this.documentHeight = $(document).height();

            // Array holding all of the original select box options text
            this.textArray = [];

            // Maintains search order in the `search` method
            this.currentIndex = 0;

            // Whether or not the dropdown list opens up or down (depending on how much room is on the page)
            this.flipped = false;

            // Creates the div elements that will become the dropdown
            this._createDiv();

            // Creates the ul element that will become the dropdown options list
            this._createUnorderedList();

            // Hides the original select box and adds the new plugin DOM elements to the page
            this._replaceSelectBox();

            // Adds event handlers to the new dropdown list
            this._eventHandlers();

            if(this.originalElem.disabled && this.disable) {

                // Disables the dropdown list if the original dropdown list had the `disabled` attribute
                this.disable();

            }

            // If the Aria Accessibility Module has been included
            if(this._ariaAccessibility) {

                // Adds ARIA accessibillity tags to the dropdown list
                this._ariaAccessibility();

            }

            // Adds regular classes to the dropdown list
            this._addClasses();

            if(this._jqueryui) {

                // Adds jQueryUI classes to the dropdown list
                this._jqueryui();  

            }

            // Triggers a custom `create` event on the original dropdown list
            this.selectBox.trigger("create");

        },
        // _Create Div
        // -----------
        //      Creates new div and span elements to replace
        //      the original select box with a dropdown list
        _createDiv: function() {

            // Creates a span element that contains the dropdown list text value
            this.divText = $("<span/>", {

                // Dynamically sets the span `id` attribute
                "id": this.originalElem.id + "SelectBoxItText",

                "class": "selectboxit-text",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on",

                // Sets the span `text` to equal the original select box default value
                "text": this.firstSelectItem.text()

            }).

            // Sets the HTML5 data attribute on the divText `span` element
            attr("data-val", this.originalElem.value);

            // Creates a span element that contains the dropdown list text value
            this.divImage = $("<span/>", {

                // Dynamically sets the span `id` attribute
                "id": this.originalElem.id + "SelectBoxItDefaultIcon",

                "class": "selectboxit-default-icon",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            });

            // Creates a div to act as the new dropdown list
            this.div = $("<div/>", {

                // Dynamically sets the div `id` attribute
                "id": this.originalElem.id + "SelectBoxIt",

                "class": "selectboxit",

                // Sets the div `name` attribute to be the same name as the original select box
                "name": this.originalElem.name,

                // Sets the div `tabindex` attribute to 0 to allow the div to be focusable
                "tabindex": 0,

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            }).

            // Appends the default text to the inner dropdown list div element
            append(this.divImage).append(this.divText);

            // Create the div container that will hold all of the dropdown list dom elements
            this.divContainer = $("<div/>", {

                "id": this.originalElem.id + "SelectBoxItContainer",

                "class": "selectboxit-container"
            }).

            // Appends the inner dropdown list div element to the dropdown list container div element
            append(this.div);

            // Maintains chainability
            return this;
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

                optgroupClass = "",

                optgroupElement = "",

                iconClass,

                // Declaring the variable that will hold all of the dropdown list option elements
                currentItem = "",
                // Creates an unordered list element
                createdList = $("<ul/>", {

                    // Sets the unordered list `id` attribute
                    "id": this.originalElem.id + "SelectBoxItOptions",

                    "class": "selectboxit-options",

                    //Sets the unordered list `tabindex` attribute to -1 to prevent the unordered list from being focusable
                    "tabindex": -1

                });

            // Checks the `showFirstOption` plugin option to determine if the first dropdown list option should be shown in the options list.
            if (!this.options.showFirstOption) {

                // Excludes the first dropdown list option from the options list
                this.selectItems = this.selectBox.find("option").slice(1);
            }

            // Loops through the original select box options list and copies the text of each
            // into new list item elements of the new dropdown list
            this.selectItems.each(function(index) {

                dataDisabled = $(this).prop("disabled");

                iconClass = $(this).data("icon") || "";

                // If the current option being traversed is within an optgroup

                if($(this).parent().is("optgroup")) {

                    optgroupClass = "selectboxit-optgroup-option";

                    if($(this).index() === 0) {

                         optgroupElement = '<div class="selectboxit-optgroup-header" data-disabled="true">' + $(this).parent().first().attr("label") + '</div>';

                    }

                    else {

                        optgroupElement = "";

                    }

                }

                // If the current option being traversed is not within an optgroup

                else {

                    optgroupClass = "";

                }

                // Uses string concatenation instead of append for speed since the number of dropdown list options is unknown.
                currentItem += optgroupElement + '<li id="' + index + '" data-val="' + this.value + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + '"><span class="' + iconClass + '"></span>' + $(this).text() + '</li>';

                // Stores all of the original select box options text inside of an array
                // (Used later in the `searchAlgorithm` method)
                self.textArray[index] = $(this).text();

                // Checks the original select box option for the `selected` attribute
                if (this.selected) {

                    //Replace the default text with the selected option
                    self.divText.text($(this).text());

                    //Set the currently selected option
                    self.currentFocus = index;
                }

            });

            // If the `defaultText` option is being used
            if (self.options.defaultText) {

                //Overrides the current dropdown default text with the value the user specifies in the `defaultText` option
                self.divText.text(self.options.defaultText);
            }

            // If the `defaultText` HTML5 data attribute is being used
            if (self.selectBox.data("text")) {

                // Overrides the current dropdown default text with the value from the HTML5 `defaultText` value
                self.divText.text(self.selectBox.data("text"));
                self.options.defaultText = self.selectBox.data("text");

            }

            // Append the list item to the unordered list
            createdList.append(currentItem);

            // Stores the dropdown list options list inside of the `list` instance variable
            this.list = createdList;

            // Append the dropdown list options list to the div container element
            this.divContainer.append(this.list);

            // Stores the individual dropdown list options inside of the `listItems` instance variable
            this.listItems = this.list.find("li");

            // Set the disabled CSS class for select box options
            this.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass("ui-state-disabled");

            // If the first select box option is disabled, and the user has chosen to not show the first select box option
            if (this.currentFocus === 0 && !this.options.showFirstOption && this.listItems.eq(0).hasClass("ui-state-disabled")) {

                //Sets the default value of the dropdown list to the first option that is not disabled
                this.currentFocus = +this.listItems.not(".ui-state-disabled").first().attr("id");

            }

            this.divImage.addClass(this.selectBox.data("icon") || this.options.defaultIcon || this.listItems.eq(this.currentFocus).find("span").attr("class"));

            //Maintains chainability
            return this;
        },

        // _Replace Select Box
        // -------------------
        //      Hides the original dropdown list and inserts
        //        the new DOM elements
        _replaceSelectBox: function() {

            // Hides the original select box
            this.selectBox.css("display", "none").

            // Adds the new dropdown list to the page directly after the hidden original select box element
            after(this.divContainer);

            // The height of the dropdown list
            var height = this.div.height();

            // The down arrow element of the dropdown list
            this.downArrow = $("<span/>", {

                // Dynamically sets the span `id` attribute of the dropdown list down arrow
                "id": this.originalElem.id + "SelectBoxItArrow",

                "class": "selectboxit-arrow",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            });

            // The down arrow container element of the dropdown list
            this.downArrowContainer = $("<span/>", {

                // Dynamically sets the span `id` attribute for the down arrow container element
                "id": this.originalElem.id + "SelectBoxItArrowContainer",

                "class": "selectboxit-arrow-container",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on",

                // The dynamic CSS of the down arrow container element
                "style": "height:" + height + "px;"

            }).

            // Inserts the down arrow element inside of the down arrow container element
            append(this.downArrow);

            // Appends the down arrow element to the dropdown list
            this.div.append(this.downArrowContainer);

            // Dynamically adds the `max-width` and `line-height` CSS styles of the dropdown list text element
            this.divText.css({

                "line-height": this.div.css("height"),

                "max-width": this.div.width() - (this.downArrowContainer.width() + this.divImage.width()) - 5
            });

            this.divImage.css({

                "margin-top": height / 4

            });

            this.listItems.find("span").css({

                "margin-top": height / 4

            });

            // Maintains chainability
            return this;
        },

        // _Scroll-To-View
        // ---------------
        //      Updates the dropdown list scrollTop value
        _scrollToView: function(type) {

            // The current scroll positioning of the dropdown list options list
            var listScrollTop = this.list.scrollTop(),

                // The height of the currently selected dropdown list option
                currentItemHeight = this.listItems.eq(this.currentFocus).height(),

                // The relative distance from the currently selected dropdown list option to the the top of the dropdown list options list
                currentTopPosition = this.listItems.eq(this.currentFocus).position().top,

                // The height of the dropdown list option list
                listHeight = this.list.height();

            // Scrolling logic for a text search
            if (type === "search") {

                // Increases the dropdown list options `scrollTop` if a user is searching for an option
                // below the currently selected option that is not visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // The selected option will be shown at the very bottom of the visible options list
                    this.list.scrollTop(listScrollTop + (currentTopPosition - (listHeight - currentItemHeight)));

                }

                // Decreases the dropdown list options `scrollTop` if a user is searching for an option above the currently selected option that is not visible
                else if (currentTopPosition < -1) {

                    this.list.scrollTop(currentTopPosition - currentItemHeight);

                }
            }

            // Scrolling logic for the `up` keyboard navigation
            else if (type === "up") {

                // Decreases the dropdown list option list `scrollTop` if a user is navigating to an element that is not visible
                if (currentTopPosition < -1) {

                    this.list.scrollTop(listScrollTop - Math.abs(this.listItems.eq(this.currentFocus).position().top));

                }
            }

            // Scrolling logic for the `down` keyboard navigation
            else if (type === "down") {

                // Increases the dropdown list options `scrollTop` if a user is navigating to an element that is not fully visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // Increases the dropdown list options `scrollTop` by the height of the current option item.
                    this.list.scrollTop((listScrollTop + (Math.abs(this.listItems.eq(this.currentFocus).position().top) - listHeight + currentItemHeight)));

                }
            }

            // Maintains chainability
            return this;
        },

        // _Callback
        // ---------
        //      Call the function passed into the method
        _callbackSupport: function(callback) {

            // Checks to make sure the parameter passed in is a function
            if ($.isFunction(callback)) {

                // Calls the method passed in as a parameter and sets the current `SelectBoxIt` object that is stored in the jQuery data method as the context(allows for `this` to reference the SelectBoxIt API Methods in the callback function. The `div` DOM element that acts as the new dropdown list is also passed as the only parameter to the callback
                callback.call(this.element.data(this.widgetName), this.div);

            }
        },

        // Open
        // ----
        //      Opens the dropdown list options list
        open: function(callback) {

            if(!this.list.is(":visible")) {

                var self = this;

                // Triggers a custom "open" event on the original select box
                this.selectBox.trigger("open");

                if (this._dynamicPositioning) {
                    // Dynamically positions the dropdown list options list
                    this._dynamicPositioning();
                }

                // Determines what jQuery effect to use when opening the dropdown list options list
                switch (this.options.showEffect) {

                    // Uses `no effect`
                    case "none":

                        // Does not require a callback function because this animation will complete before the call to `scrollToView`
                        this.list.show();

                       // Updates the list `scrollTop` attribute
                       this._scrollToView("search");

                    break;

                    // Uses the jQuery `show` special effect
                    case "show":

                        // Requires a callback function to determine when the `show` animation is complete
                        this.list.show(this.options.showEffectSpeed, function() {

                            // Updates the list `scrollTop` attribute
                            self._scrollToView("search");

                        });

                    break;

                   // Uses the jQuery `slideDown` special effect
                   case "slideDown":

                       // Requires a callback function to determine when the `slideDown` animation is complete
                       this.list.slideDown(this.options.showEffectSpeed, function() {

                           // Updates the list `scrollTop` attribute
                           self._scrollToView("search");

                       });

                   break;

                  // Uses the jQuery `fadeIn` special effect
                  case "fadeIn":

                      // Does not require a callback function because this animation will complete before the call to `scrollToView`
                      this.list.fadeIn(this.options.showEffectSpeed);

                      // Updates the list `scrollTop` attribute
                      this._scrollToView("search");

                  break;

                  // If none of the above options were passed, then a `jqueryUI show effect` is expected
                  default:

                     // Allows for custom show effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/show/)
                     this.list.show(this.options.showEffect, this.options.showEffectOptions, this.options.showEffectSpeed, function() {

                         // Updates the list `scrollTop` attribute
                         self._scrollToView("search");

                     });

                 break;

                }

            }

            // Provide callback function support
            this._callbackSupport(callback);

            // Maintains chainability
            return this;
        },

        // Close
        // -----
        //      Closes the dropdown list options list
        close: function(callback) {

            if(this.list.is(":visible")) {

                var self = this;

                // Triggers a custom "close" event on the original select box
                this.selectBox.trigger("close");

                // Determines what jQuery effect to use when closing the dropdown list options list
                switch (this.options.hideEffect) {

                    // Uses `no effect`
                    case "none":

                        // Does not require a callback function because this animation will complete before the call to `scrollToView`
                        this.list.hide();

                        // Updates the list `scrollTop` attribute
                        this._scrollToView("search");

                    break;

                    // Uses the jQuery `hide` special effect
                    case "hide":

                        this.list.hide(this.options.hideEffectSpeed);

                    break;

                    // Uses the jQuery `slideUp` special effect
                    case "slideUp":

                    this.list.slideUp(this.options.hideEffectSpeed);

                    break;

                    // Uses the jQuery `fadeOut` special effect
                    case "fadeOut":

                        this.list.fadeOut(this.options.hideEffectSpeed);

                    break;

                    // If none of the above options were passed, then a `jqueryUI hide effect` is expected
                    default:

                        // Allows for custom hide effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/hide/)
                        this.list.hide(this.options.hideEffect, this.options.hideEffectOptions, this.options.hideEffectSpeed, function() {

                            //Updates the list `scrollTop` attribute
                            self._scrollToView("search");

                        });

                    break;
                }

            }

            // Provide callback function support
            this._callbackSupport(callback);

            // Maintains chainability
            return this;
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
            this.div.bind({

                // `click` event with the `selectBoxIt` namespace
                "click.selectBoxIt": function() {

                    if(!self.div.is(":focus")) {

                        $(this).focus();

                    }

                    // The `click` handler logic will only be applied if the dropdown list is enabled
                    if (!self.originalElem.disabled) {

                        // Triggers the `click` event on the original select box
                        self.selectBox.trigger("click");

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
                },

                // `blur` event with the `selectBoxIt` namespace.  Uses special blur logic to make sure the dropdown list closes correctly
                "blur.selectBoxIt": function() {

                    // If `self.blur` property is true
                    if (self.blur) {

                        // Triggers both the `blur` and `focusout` events on the original select box.
                        // The `focusout` event was also triggered because the event bubbles
                        // This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        // Popular open source projects such as Backbone.js utilize event delegation to bind events, so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.selectBox.trigger("blur").trigger("focusout");

                        //If the dropdown options list is visible
                        if (self.list.is(":visible")) {
                            //Closes the dropdown list options list
                            self.close();
                        }
                    }
                },

                "focus.selectBoxIt": function() {

                    // Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");

                    // Removes the jQuery data associated with the mousedown event
                    $(this).removeData('mdown');

                    // If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if (!mdown) {

                        // Triggers the `tabFocus` custom event on the original select box
                        self.selectBox.trigger("tab-focus");
                    }

                    // Only trigger the `focus` event on the original select box if the dropdown list is hidden (this verifies that only the correct `focus` events are used to trigger the event on the original select box
                    if(!self.list.is(":visible")) {

                        //Triggers the `focus` default event on the original select box
                        self.selectBox.trigger("focus").trigger("focusin");

                    }
                },

                // `keydown` event with the `selectBoxIt` namespace.  Catches all user keyboard navigations
                "keydown.selectBoxIt": function(e) {

                    // Stores the `keycode` value in a local variable
                    var currentKey = e.keyCode;

                    // Performs keyboard events if the dropdown list is focused
                    if (self.div.is(":focus")) {

                        // Supports keyboard navigation
                        switch (currentKey) {

                            // If the user presses the `down key`
                            case downKey:

                                // Prevents the page from moving down
                                e.preventDefault();

                                // If the plugin options allow keyboard navigation
                                if (self.moveDown) {

                                    // Moves the focus down to the dropdown list option directly beneath the currently selected selectbox option
                                    self.moveDown();

                                }

                                break;

                            //If the user presses the `up key`
                            case upKey:

                                // Prevents the page from moving up
                                e.preventDefault();

                                // If the plugin options allow keyboard navgiation
                                if (self.moveUp) {

                                    // Moves the focus up to the dropdown list option directly above the currently selected selectbox option
                                    self.moveUp();

                                }

                                break;

                            // If the user presses the `enter key`
                            case enterKey:

                                // Prevents the default event from being triggered
                                e.preventDefault();

                                // Checks to see if the dropdown list options list is open
                                if (self.list.is(":visible")) {

                                    // Closes the dropdown list options list
                                    self.close();
                                }

                                // If the first dropdown list option is not shown in the options list, and the dropdown list has not been interacted with, then update the dropdown list value when the enter key is pressed
                                if (!self.options.showFirstOption && self.div.text() === self.firstSelectItem.text() && self.currentFocus === 0 || (self.options.showFirstOption && self.options.defaultText) || (!self.options.showFirstOption && !self.listItems.eq(0).not("[data-disabled='true']"))) {

                                    // Updates the dropdown list value
                                    self.selectBox.val(self.listItems.eq(self.currentFocus).attr("data-val")).

                                    // Triggers a `change` event on the original select box
                                    trigger("change");
                                }

                                // Triggers the `enter` events on the original select box
                                self.selectBox.trigger("enter");

                                break;

                            // If the user presses the `tab key`
                            case tabKey:

                                // Triggers the custom `tab-blur` event on the original select box
                                self.selectBox.trigger("tab-blur");

                                break;

                            // If the user presses the `backspace key`
                            case backspaceKey:

                                // Prevents the browser from navigating to the previous page in its history
                                e.preventDefault();

                                // Triggers the custom `backspace` event on the original select box
                                self.selectBox.trigger("backspace");

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
                    }
                },

                // `keypress` event with the `selectBoxIt` namespace.  Catches all user keyboard text searches since you can only reliably get character codes using the `keypress` event
                "keypress.selectBoxIt": function(e) {

                    // Performs a text search if the dropdown list is focused
                    if (self.div.is(":focus")) {

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
                    }
                },

                // `mousenter` event with the `selectBoxIt` namespace .The mouseenter JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseenter.selectBoxIt": function() {

                    // Trigger the `mouseenter` event on the original select box
                    self.selectBox.trigger("mouseenter");
                },

                // `mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseleave.selectBoxIt": function() {

                    // Trigger the `mouseleave` event on the original select box
                    self.selectBox.trigger("mouseleave");
                }

            });

            // Select box options events that set the dropdown list blur logic (decides when the dropdown list gets
            // closed)
            this.list.bind({

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
                    self.div.focus();
                }

            })

            // Select box individual options events bound with the jQuery `delegate` method.  `Delegate` was used because binding individual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "click.selectBoxIt", function() {

                if (!$(this).data("disabled")) {

                    // Sets the original dropdown list value and triggers the `change` event on the original select box
                    self.originalElem.value = $(this).attr("data-val");

                    // Sets `currentFocus` to the currently focused dropdown list option.
                    // The unary `+` operator casts the string to a number
                    // [James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                    self.currentFocus = +this.id;

                    // Closes the list after selecting an option
                    self.close();

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.divText.attr("data-val")) {

                        self.selectBox.trigger("change");

                    }

                    // Triggers the custom option-click event on the original select box
                    self.selectBox.trigger("option-click");
                }
            })

            // Delegates the `focus` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "focus.selectBoxIt", function() {

                if (!$(this).data("disabled")) {

                    // Sets the original select box current value and triggers the change event
                    self.originalElem.value = $(this).attr("data-val");

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.divText.attr("data-val")) {

                        self.selectBox.trigger("change");

                    }
                }
            });

            // Original dropdown list events
            this.selectBox.bind({

                // `change` event handler with the `selectBoxIt` namespace
                "change.selectBoxIt": function() {

                    // Sets the new dropdown list text to the value of the original dropdown list
                    self.divText.text(self.listItems.eq(self.currentFocus).text()).attr("data-val", self.originalElem.value);

                    if(self.listItems.eq(self.currentFocus).find("span").attr("class")) {

                        self.divImage.attr("class", self.listItems.eq(self.currentFocus).find("span").attr("class")).addClass("selectboxit-default-icon");
                    }
                },

                // `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function() {

                    // Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.div.addClass("ui-state-disabled");
                },

                // `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function() {

                    // Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.div.removeClass("ui-state-disabled");
                }
            });

            // Maintains chainability
            return this;
        },

        // _addClasses
        // ---------
        //      Adds SelectBoxIt CSS classes
        _addClasses: function() {

            var self = this,

                focusClass = "selectboxit-focus",

                hoverClass = "selectboxit-hover";

            this.downArrow.addClass(this.selectBox.data("downarrow") || this.options.downArrowIcon || "");

            // Adds the default class to the dropdown list
            this.div.addClass("selectboxit-widget");

            // Adds the default styling for the dropdown list options
            this.list.addClass("selectboxit-widget selectboxit-widget-content");

            // Select box individual option events
            this.listItems.bind({

                // `focus` event with the `selectBoxIt` namespace
                "focus.selectBoxIt": function() {

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
            this.selectBox.bind({

                // `click` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function() {

                    // Removes the jQueryUI hover class from the dropdown list and adds the jQueryUI focus class for both the dropdown list and the currently selected dropdown list option
                    self.div.removeClass(hoverClass).add(self.listItems.eq(self.currentFocus)).

                    addClass(focusClass);
                },

                "blur.selectBoxIt": function() {

                    self.div.removeClass(focusClass);

                },

                // `mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function() {

                    self.div.addClass(hoverClass);

                },

                // `mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function() {

                    // Removes the hover CSS class on the previously hovered dropdown list option
                    self.div.removeClass(hoverClass);

                }

            });

            this.listItems.bind({

                "mouseenter.selectBoxIt": function() {

                    // Sets the dropdown list individual options back to the default state and sets the hover CSS class on the currently hovered option
                    self.listItems.removeClass(focusClass);

                    $(this).addClass(hoverClass);

                },

                "mouseleave.selectBoxIt": function() {

                    $(this).removeClass(hoverClass);

                }

            });

            // Maintains chainability
            return this;

        }

    });

})); // End of core module