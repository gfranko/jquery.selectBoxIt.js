//      jQuery.selectBoxIt.js 0.2.0


//		(c) 2012 Greg Franko

//		SelectBoxIt may be freely distributed
//		under the MIT license

//Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript
(function ($, window, document, undefined) {
    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    //SelectBox Object
    // ---------------
    //**Convention:** Methods or properties starting with `_` are private
    var SelectBox = function(element, options, dataName) {
        //Local object that stores all of the `SelectBox` object instance variables
        var self = {
            //The original select box DOM element
            originalElem : element,
            //The original select box DOM element wrapped in a jQuery object
            selectBox : $(element),
            //All of the original select box options
            selectItems : $(element).find("option"),
            //The first option in the original select box
            firstSelectItem : $(element).find("option").slice(0, 1),
            //The index of the currently selected dropdown list option
            currentFocus : 0,
            //Keeps track of which blur events will hide the dropdown list options
            blur : true,
            //The html document height
            documentHeight : $(document).height(),
            //Array holding all of the original select box options text
            textArray : [],
            //Maintains search order in the `search` method
            currentIndex : 0,
            //Text of the currently selected dropdown list option
            currentText : "",
            //Plugin options object
            options : options,
            //The div that contains all of the new dropdown list DOM elements
            divContainer : null,
            //The div element that acts as the new dropdown list that replaces the original select box
            div : null,
            //The nested span element that contains the dropdown list text
            divText : null,
            //The unordered list element that contains the dropdown list options
            list : null,
            //The list item elements that each contain a dropdown list option
            listItems : null,
            //The span that holds the down arrow for the dropdown list
            downArrow:  null,
            //The span that holds `downArrow`
            downArrowContainer : null,
            //Whether or not the dropdown list opens up or down (depending on how much room is on the page)
            flipped : false },
        //_Create Div
        // ---------
        //      Creates new div and span elements to replace 
        //      the original select box with a dropdown list
        _createDiv = function() {
            //Creates a span element that contains the dropdown list text value
            self.divText = $("<span/>", { 
                //Dynamically sets the span `id` attribute
                id : self.originalElem.id + "SelectBoxItText",
                //IE specific attribute to not allow the element to be selected
                unselectable: "on",
                //Sets the span `text` to equal the original select box default value
                text : self.firstSelectItem.text() }).
                //Sets the HTML5 data attribute on the divText `span` element
                attr("data-val", self.originalElem.value);
            //Creates a div to act as the new dropdown list
            self.div = $("<div/>", { 
                //Dynamically sets the div `id` attribute
                id : self.originalElem.id + "SelectBoxIt",
                //Sets the div `name` attribute to be the same name as the original select box
                name: self.originalElem.name,
                //IE specific attribute to not allow the element to be selected
                unselectable: "on",
                //Sets the div `tabindex` attribute to 0 to allow the div to be focusable 
                tabindex : 0 }).
            //Appends the default text to the inner dropdown list div element
            append(self.divText);
            //Create the div container that will hold all of the dropdown list dom elements
            self.divContainer = $("<div/>", {
                id : self.originalElem.id + "SelectBoxItContainer"
            })
            //Appends the inner dropdown list div element to the dropdown list container div element
            .append(self.div);
            //Maintains chainability
            return this;
        },
        //_Create Unordered List
        // --------------------
        //      Creates an unordered list element to hold the 
        //		new dropdown list options that directly match 
        //		the values of the original select box options
        _createUnorderedList = function() {
            //Declaring the variable that will hold all of the dropdown list option elements
            var currentItem = "",
            //Creates an unordered list element
            createdList = $("<ul/>", {
                //Sets the unordered list `id` attribute
                id: self.originalElem.id + "SelectBoxItOptions",
                //Sets the unordered list `tabindex` attribute to -1 to prevent the unordered list from being focusable
                tabindex: -1 });
            //Checks `showFirstOption` plugin option to determine if the first dropdown list option should be shown in the options list.
            if(!self.options.showFirstOption) {
                //Excludes the first dropdown list option from the options list
                self.selectItems = self.selectBox.find("option").slice(1);
            }
            //Loops through the original select box options list and copies the text of each 
            //into new list item elements of the new dropdown list
            self.selectItems.each(function(index) {
                //Uses string concatenation instead of append for speed since the number of dropdown list options is unknown.
                currentItem += '<li id="' + index + '" data-val="' + this.value + '">' + $(this).text() + '</li>';
                //Stores all of the original select box options text inside of an array
                // (Used later in the `searchAlgorithm` method)
                self.textArray[index] = $(this).text();
                //Checks the original select box option for the `selected` attribute
                if(this.selected) {
                    //Replace the default text with the selected option
                    self.divText.text($(this).text());
                    //Set the currently selected option
                    self.currentFocus = index;
                }
            });
            //Append the list item to the unordered list
            createdList.append(currentItem);
            //Stores the dropdown list options list inside of the `list` instance variable
            self.list = createdList;
            //Append the dropdown list options list to the div container element
            self.divContainer.append(self.list);
            //Stores the individual dropdown list options inside of the `listItems` instance variable
            self.listItems = self.list.find("li");
            //Maintains chainability
            return this;
        },
        //_Replace Select Box
        // -----------------
        //      Hides the original dropdown list and inserts 
        //		the new DOM elements
        _replaceSelectBox = function() {
            //Hides the original select box
            self.selectBox.css("display", "none")
            //Adds the new dropdown list to the page directly after the hidden original select box element
            .after(self.divContainer);
            //The height of the dropdown list
            var height = self.div.height();
            //The down arrow element of the dropdown list
            self.downArrow = $("<span/>", { 
                //Dynamically sets the span `id` attribute of the dropdown list down arrow
                id: self.originalElem.id + "SelectBoxItArrow",
                //IE specific attribute to not allow the dropdown list text to be selected
                unselectable: "on",
                //The dynamic CSS of the dropdown list down arrow div element
                style: "margin-top:" + height/2 + ";" });
            //The down arrow container element of the dropdown list
            self.downArrowContainer = $("<span/>", { 
                //Dynamically sets the span `id` attribute for the down arrow container element
                id: self.originalElem.id + "SelectBoxItArrowContainer",
                //IE specific attribute to not allow the dropdown list text to be selected
                unselectable: "on",
                //The dynamic CSS of the down arrow container element
                style: "height:" + height + "px;" }).
            //Inserts the down arrow element inside of the down arrow container element
            append(self.downArrow);
            //Appends the down arrow element to the dropdown list
            self.div.append(self.downArrowContainer);
            //Dynamically adds the `max-width` and `line-height` CSS styles of the dropdown list text element
            self.divText.css({"line-height": self.div.css("height"), "max-width": self.div.width() - self.downArrowContainer.width() - 5 });
            //Maintains chainability
            return this;
        },
        //_Scroll-To-View
        // -------------
        //      Updates the dropdown list scrollTop value
        _scrollToView = function(type) {
            //The current scroll positioning of the dropdown list options list
            var listScrollTop = self.list.scrollTop(),
            //The height of the currently selected dropdown list option
            currentItemHeight = self.listItems.eq(self.currentFocus).height(),
            //The relative distance from the currently selected dropdown list option to the the top of the dropdown list options list
            currentTopPosition = self.listItems.eq(self.currentFocus).position().top,
            //The height of the dropdown list option list
            listHeight = self.list.height();
            //Scrolling logic for a text search
            if(type === "search") {
                //Increases the dropdown list options `scrollTop` if a user is searching for an option 
                //below the currently selected option that is not visible
                if(listHeight - currentTopPosition < currentItemHeight) {
                    //The selected option will be shown at the very bottom of the visible options list
                    self.list.scrollTop(listScrollTop + (currentTopPosition - (listHeight - currentItemHeight)));
                }
                //Decreases the dropdown list options `scrollTop` if a user is searching for an option above the
                //currently selected option that is not visible
                else if(currentTopPosition < -1) {
                    self.list.scrollTop(currentTopPosition - currentItemHeight);
                }
            }
            //Scrolling logic for the `up` keyboard navigation
            else if(type === "up") {
                //Decreases the dropdown list option list `scrollTop` if a user is navigating to an element that is not 
                //visible
                if(currentTopPosition < -1) {
                    //Decreases the dropdown list option `scrollTop` by the height of the current option item.
                    self.list.scrollTop(listScrollTop - currentItemHeight);
                }
            }
            //Scrolling logic for the `down` keyboard navigation
            else if(type === "down") {
                //Increases the dropdown list options `scrollTop` if a user is navigating to an element that is 
                //not fully visible
                if(listHeight - currentTopPosition < currentItemHeight) {
                    //Increases the dropdown list options `scrollTop` by the height of the current option item.
                    self.list.scrollTop((listScrollTop + currentItemHeight));
                }
            }
            //maintains chainability
            return this;
        },
        //_Dynamic positioning
        // ------------------
        //      Dynamically positions the dropdown list options list
        _dynamicPositioning = function() {
            //Returns the x and y coordinates of the dropdown list options list relative to the document
            var listOffsetTop = self.div.offset().top,
            //The height of the dropdown list options list
            listHeight = self.list.height(),
            //The height of the dropdown list DOM element
            selectBoxHeight = self.div.height();
            //Places the dropdown list options list on top of the dropdown list if the dropdown list options list does not fit on the page when opened
            if((listOffsetTop + selectBoxHeight + listHeight >= $(window).height() + $(window).scrollTop()) && (listOffsetTop - listHeight >= 0)){
                //If the dropdown list currently opens downward
                if(!self.flipped) {
                    //Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                    self.list.css("top", (self.divContainer.position().top - self.list.height()) - 2);
                    //Sets the `flipped` instance variable to false to reflect that the dropdown list opens upward
                    self.flipped = true;
                }
            }
            //If the dropdown list options have enough room on the page to open downward
            else {
                //If the dropdown list is currently opening upward
                if(self.flipped) {
                    //Sets custom CSS properties to place the dropdown list options directly below the dropdown list
                    self.list.css("top", (self.divContainer.position().top + self.div.height()) + 2);
                    //Sets the `flipped` instance variable to false to reflect that the dropdown list opens downward
                    self.flipped = false;
                }
            }
        },
        //_Callback
        // -------
        //      Call the function passed into the method
        _callbackSupport = function(callback) {
            //Checks to make sure the parameter passed in is a function
            if($.isFunction(callback)) {
                //Calls the method passed in as a parameter and sets the current `SelectBoxIt` object that is stored in the jQuery data method as the context 
                //(allows for `this` to reference the SelectBoxIt API Methods in the callback function
                //The `div` DOM element that acts as the new dropdown list is also passed as the only parameter to the callback
                callback.call($(self.originalElem).data(dataName), self.div);
            }
        },
        //Open
        // ---
        //      Opens the dropdown list options list
        open = function(callback) {
            //Triggers a custom "open" event on the original select box
            self.selectBox.trigger("open");
            //Dynamically positions the dropdown list options list
            _dynamicPositioning();
            //Determines what jQuery effect to use when opening the dropdown list options list
            switch(self.options.showEffect) {
                //Uses `no effect`
                case "none":
                    //Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.show();
                    //Updates the list `scrollTop` attribute
                    _scrollToView("search");
                    break;
                //Uses the jQuery `show` special effect
                case "show":
                    //Requires a callback function to determine when the `show` animation is complete
                    self.list.show(self.options.showEffectSpeed, function() {
                        //Updates the list `scrollTop` attribute
                        _scrollToView("search");    
                    });
                    break;
                //Uses the jQuery `slideDown` special effect
                case "slideDown":
                    //Requires a callback function to determine when the `slideDown` animation is complete
                    self.list.slideDown(self.options.showEffectSpeed, function() {
                        //Updates the list `scrollTop` attribute
                        _scrollToView("search");
                    });
                    break;
                //Uses the jQuery `fadeIn` special effect
                case "fadeIn":
                    //Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.fadeIn(self.options.showEffectSpeed);
                    //Updates the list `scrollTop` attribute
                    _scrollToView("search");
                    break;
                //If none of the above options were passed, then a `jqueryUI show effect` is expected
                default:
                    //Makes sure the dropdown list options list is not visible
                    if(!self.list.is(":visible")) {
                        //Allows for custom show effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/show/)
                        self.list.show(self.options.showEffect, self.options.showEffectOptions, self.options.showEffectSpeed, function() { 
                            //Updates the list `scrollTop` attribute
                            _scrollToView("search"); 
                        });
                    }
                    break;
            }
            //Provide callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //Close
        // ----
        //      Closes the dropdown list options list
        close = function(callback) {
            //Triggers a custom "close" event on the original select box
            self.selectBox.trigger("close");
            //Determines what jQuery effect to use when closing the dropdown list options list
            switch(self.options.hideEffect) {
                //Uses `no effect`
                case "none":
                    //Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.hide();
                    //Updates the list `scrollTop` attribute
                    _scrollToView("search");
                    break;
                //Uses the jQuery `hide` special effect 
                case "hide":
                    self.list.hide(self.options.hideEffectSpeed);
                    break;
                //Uses the jQuery `slideUp` special effect
                case "slideUp":
                    self.list.slideUp(self.options.hideEffectSpeed);
                    break;
                //Uses the jQuery `fadeOut` special effect
                case "fadeOut":
                    self.list.fadeOut(self.options.hideEffectSpeed);
                    break;
                //If none of the above options were passed, then a `jqueryUI hide effect` is expected
                default:
                    //Makes sure the dropdown list options list is visible
                    if(self.list.is(":visible")) {
                        //Allows for custom hide effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/hide/)
                        self.list.hide(self.options.hideEffect, self.options.hideEffectOptions, self.options.hideEffectSpeed, function() { 
                            //Updates the list `scrollTop` attribute
                            _scrollToView("search"); 
                        });
                    }
                    break;
            }
            //Provide callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //Move Down
        // --------
        //      Handles the down keyboard navigation logic
        moveDown = function(callback) {
            //Increments `currentFocus`, which represents the currently focused list item `id` attribute.
            self.currentFocus +=  1;
            //Sets the `currentFocus` to the previously focused item (the last list item in the list)
            //if the user has reached the bottom of the dropdown list options list and is trying to go down again 
            if(self.currentFocus === self.listItems.length) {
                self.currentFocus -= 1;
            }
            //If the user has not reached the bottom of the unordered list
            else {
                //Blurs the previously focused list item
                //The jQuery `end()` method allows you to continue chaining while also using a different selector
                self.listItems.eq(self.currentFocus - 1).blur().end().
                //Focuses the currently focused list item
                eq(self.currentFocus).focus();
                //Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action 
                //gets passed to `scrollToView`.             
                _scrollToView("down");
                //Triggers the custom `moveDown` event on the original select box
                self.selectBox.trigger("moveDown");
            }
            //Provide callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //Move Up
        // ------
        //      Handles the up keyboard navigation logic
        moveUp = function(callback) {
            //Decrements `currentFocus`, which represents the currently focused list item `id` 
            //attribute.
            self.currentFocus -= 1;
            //Set `currentFocus` to the previously focused item (the first list item in the list)
            //if the user has reached the top of the dropdown list options list and is trying to go up again.
            if(self.currentFocus < 0 || (self.currentFocus === 0 && !self.options.showFirstOption)) { 
                self.currentFocus += 1;
            }
            //If the user has not reached the top of the unordered list
            else {
                //Blurs the previously focused list item
                //The jQuery `end()` method allows you to continue chaining while also using a different selector
                self.listItems.eq(self.currentFocus + 1).blur().end().
                //Focuses the currently selected list item
                eq(self.currentFocus).focus();
                //Calls `scrollToView` to make sure the `scrollTop` is correctly updated.  The `up` user action 
                //gets passed to `scrollToView`.  
                _scrollToView("up");
                //Triggers the custom `moveUp` event on the original select box
                self.selectBox.trigger("moveUp");
            }
            //Provide callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //_Set Current Search Option
        // ------------------------
        //      Sets the currently selected dropdown list search option
        _setCurrentSearchOption = function(currentOption) {
            //Does not change the current option if `showFirstOption` is false and the matched search item is the hidden first option.  Otherwise, the current option value is updated
            if(!(currentOption === 0 && !self.options.showFirstOption)) {
                //Updates the default dropdown list text
                self.divText.text(self.textArray[currentOption]);
                //Calls the `blur` event of the currently selected dropdown list option
                self.listItems.eq(self.currentFocus).blur();
                //Sets `currentIndex` to the currently selected dropdown list option
                self.currentIndex = currentOption;
                //Sets `currentFocus` to the currently selected dropdown list option
                self.currentFocus = currentOption;
                //Focuses the currently selected dropdown list option
                self.listItems.eq(self.currentFocus).focus();
                //Updates the scrollTop so that the currently selected dropdown list option is visible to the user
                _scrollToView("search");
                //Maintains chainability
            }
            return this;
            
        },
        //_Search Algorithm
        // ---------------
        //      Uses regular expressions to find text matches
        _searchAlgorithm = function(currentIndex, alphaNumeric) {
            //Boolean to determine if a pattern match exists
            var matchExists = false,
            //Iteration variable used in the outermost for loop
            x,
            //Iteration variable used in the nested for loop
            y,
            //Variable used to cache the length of the text array (Small enhancement to speed up traversing)
            arrayLength;
            //Loops through the text array to find a pattern match
            for(x = currentIndex, arrayLength = self.textArray.length; x < arrayLength; x += 1) {
                //Nested for loop to help search for a pattern match with the currently traversed array item
                for(y = 0; y < arrayLength; y += 1) {
                    //Searches for a match
                    if(self.textArray[y].search(alphaNumeric) !== -1) {
                        //`matchExists` is set to true if there is a match
                        matchExists = true;
                        //Exits the nested for loop
                        y = arrayLength;
                    }
                }//End nested for loop
                //If a match does not exist
                if(!matchExists) {
                    //Sets the current text to the last entered character
                    self.currentText = self.currentText.charAt(self.currentText.length - 1).
                    //Escapes the regular expression to make sure special characters are seen as literal characters instead of special commands
                    replace(/[|()\[{.+*?$\\]/g,"\\$0");
                    //Resets the regular expression with the new value of `self.currentText`
                    alphaNumeric = new RegExp(self.currentText, "gi");                  
                }
                //Searches based on the first letter of the dropdown list options text if the `self.currentText`
                //< 2 characters
                if(self.currentText.length < 2) {
                    //If there is a match based on the first character
                    if((self.textArray[x].charAt(0).search(alphaNumeric) !== -1)) {
                        //Sets properties of that dropdown list option to make it the currently selected option
                        _setCurrentSearchOption(x);
                        //Increments the current index by one
                        self.currentIndex += 1;
                        //Triggers the custom `search` event on the original select box
                        self.selectBox.trigger("search");
                        //Exits the search
                        return false;
                    }
                }
                //If `self.currentText` > 1 character
                else {
                    //If there is a match based on the entire string
                    if((self.textArray[x].search(alphaNumeric) !== -1)) {
                        //Sets properties of that dropdown list option to make it the currently selected option
                        _setCurrentSearchOption(x);
                        //Triggers the custom `search` event on the original select box
                        self.selectBox.trigger("search");
                        //Exits the search
                        return false;
                    }
                }
                //If the current text search is an exact match
                if(self.textArray[x].toLowerCase() === self.currentText.toLowerCase()) {
                    //Sets properties of that dropdown list option to make it the currently selected option
                    _setCurrentSearchOption(x);
                    //Resets the current text search to a blank string to start fresh again
                    self.currentText = "";
                    //Triggers the custom `search` event on the original select box
                    self.selectBox.trigger("search");
                    //Exits the search
                    return false;
                }
            }
            //Returns true if there is not a match at all
            return true;
        },
        //Search
        // -----
        //      Calls searchAlgorithm()
        search = function(alphaNumericKey, rememberPreviousSearch, callback) {
            //If the search method is being called internally by the plugin, and not externally as a method by a user
            if(rememberPreviousSearch) {
                //Continued search with history from past searches.  Properly escapes the regular expression
                self.currentText += alphaNumericKey.replace(/[|()\[{.+*?$\\]/g,"\\$0");            
            }
            else {
                //Brand new search.  Properly escapes the regular expression
                self.currentText = alphaNumericKey.replace(/[|()\[{.+*?$\\]/g,"\\$0");  
            }
            //Wraps the current user text search in a regular expression that is case insensitive and searches 
            //globally
            var alphaNumeric = new RegExp(self.currentText, "gi"),

            //Calls `searchAlgorithm` which searches an array that contains all of the dropdown list option 
            //values.
            notFound = _searchAlgorithm(self.currentIndex, alphaNumeric);
            //Searches the list again if a match is not found.  This is needed, because the first search started at the array indece of the currently selected dropdown list option, and does not search the options before the current array indece.
            //If there are many similar dropdown list options, starting the search at the indece of the currently 
            //selected dropdown list option is needed to properly traverse the text array.
            if(notFound) {
                //Searches the dropdown list values starting from the beginning of the text array
                _searchAlgorithm(0, alphaNumeric); 
            }
            //Provide callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //_Event Handlers
        // -------------
        //      Adds event handlers to the new dropdown list
        _eventHandlers = function() {
            //Stores the correct keyboard values in local variables
            var upKey = 38, downKey = 40,enterKey = 13, backspaceKey = 8, tabKey = 9, spaceKey = 32;
            //Select Box events
            self.div.bind({
                //`click` event with the `selectBoxIt` namespace
                "click.selectBoxIt" : function() {
                    //The `click` handler logic will only be applied if the dropdown list is enabled
                    if(!self.originalElem.disabled) {
                        //Triggers the `click` event on the original select box
                        self.selectBox.trigger("click");
                        //If the dropdown list options list is visible when a user clicks on the dropdown list
                        if(self.list.is(":visible")) {
                            //Closes the dropdown list options list
                            close();
                        }
                        //If the dropdown list options list is not visible when a user clicks on the dropdown list
                        else {
                            //Shows the dropdown list options list
                            open();
                        }
                    }
                },
                //`mousedown` event with the `selectBoxIt` namespace
                "mousedown.selectBoxIt" : function() {
                    //Stores data in the jQuery `data` method to help determine if the dropdown list
                    //gains focus from a click or tabstop.  The mousedown event fires before the focus
                    //event.
                    $(this).data("mdown",true);
                },
                //`blur` event with the `selectBoxIt` namespace.  Uses special blur logic to make sure the dropdown list closes correctly
                "blur.selectBoxIt" : function() {
                    //If `self.blur` is true
                    if(self.blur) {
                        //Triggers both the `blur` and `focusout` events on the original select box.
                        //The `focusout` event was also triggered because the event bubbles
                        //This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        //Popular open source projects such as Backbone.js utilize event delegation to bind events,
                        //so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.selectBox.trigger("blur").trigger("focusout");
                        //If the dropdown options list is visible
                        if(self.list.is(":visible")) {
                            //Closes the dropdown list options list
                            close();
                        }
                    }
                },
                "focus.selectBoxIt" : function(event, data) {
                    //Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");
                    //Removes the jQuery data associated with the mousedown event
                    $(this).removeData('mdown');
                    //If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if(!data && !mdown) {
                        //Triggers the `tabFocus` custom event on the original select box
                        self.selectBox.trigger("tabFocus");
                    }
                    //If no data was passed to the focus event (this correctly triggers the focus event)
                    if(!data) {
                        //Triggers the `focus` default event on the original select box
                        self.selectBox.trigger("focus").trigger("focusin");
                    }
                },
                //`keydown` event with the `selectBoxIt` namespace.  Catches all user keyboard navigations
                "keydown.selectBoxIt": function(e) {
                    //Stores the `keycode` value in a local variable
                    var currentKey = e.keyCode;
                    //Performs keyboard events if the dropdown list is focused
                    if(self.div.is(":focus")) {
                        //Supports keyboard navigation
                        switch(currentKey) {
                            //If the user presses the `down key`
                            case downKey:
                                //Prevents the page from moving down
                                e.preventDefault();
                                //If the plugin options allow keyboard navigation        
                                if(self.options.keyboardNavigation) {
                                    //Moves the focus down to the dropdown list option directly beneath the currently selected selectbox option
                                    moveDown();
                                }
                                break;
                            //If the user presses the `up key`
                            case upKey:
                                //Prevents the page from moving up 
                                e.preventDefault();
                                //If the plugin options allow keyboard navgiation
                                if(self.options.keyboardNavigation) {
                                    //Moves the focus up to the dropdown list option directly above the currently selected selectbox option
                                    moveUp();
                                }
                                break;
                            //If the user presses the `enter key`
                            case enterKey:
                                e.preventDefault();
                                //Checks to see if the dropdown list options list is open
                                if(self.list.is(":visible")) {
                                    //Closes the dropdown list options list
                                    close();
                                }
                                //If the first dropdown list option is not shown in the options list,
                                //and the dropdown list has not been interacted with, then
                                //update the dropdown list value when the enter key is pressed
                                if(!self.options.showFirstOption && self.div.text() === self.firstSelectItem.text() && self.currentFocus === 0) {
                                    //Updates the dropdown list value
                                    self.selectBox.val(self.listItems.eq(self.currentFocus).attr("data-val")).
                                    //Triggers a `change` event on the original select box
                                    trigger("change");
                                }
                                //Triggers the `enter` events on the original select box
                                self.selectBox.trigger("enter");
                                break;
                            //If the user presses the `tab key`
                            case tabKey:
                                //Triggers the custom `tabBlur` events on the original select box
                                self.selectBox.trigger("tabBlur");
                                break;
                            //If the user presses the `backspace key`
                            case backspaceKey:
                                //Prevents the browser from navigating to the previous page in its history 
                                e.preventDefault();
                                //Triggers the custom `backspace` event on the original select box
                                self.selectBox.trigger("backspace");
                                break;
                            //Default is to break out of the switch statement
                            default:
                                break;
                        }
                    }
                },
                //`keypress` event with the `selectBoxIt` namespace.  Catches all user keyboard text searches since you can only reliably 
                //get character codes using the `keypress` event
                "keypress.selectBoxIt": function(e) {
                    //Performs a text search if the dropdown list is focused
                    if(self.div.is(":focus")) {
                        //Sets the current key to the `keyCode` value if `charCode` does not exist.  Used for cross 
                        //browser support since IE uses `keyCode` instead of `charCode`.
                        var currentKey = e.charCode || e.keyCode,
                        //Converts unicode values to characters
                        alphaNumericKey = String.fromCharCode(currentKey);
                        //If the user presses the `space bar`
                        if(currentKey === spaceKey) {
                            //Prevents the browser from scrolling to the bottom of the page
                            e.preventDefault();
                        }
                        //If the plugin options allow text searches
                        if(self.options.keyboardSearch) {
                            //Calls `search` and passes the character value of the user's text search
                            search(alphaNumericKey, true, "");      
                        }
                    }
                },
                //`mousenter` event with the `selectBoxIt` namespace .The mouseenter JavaScript event is proprietary to Internet Explorer. 
                //Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser. 
                "mouseenter.selectBoxIt": function() {
                    //Trigger the `mouseenter` event on the original select box
                    self.selectBox.trigger("mouseenter");
                },
                //`mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. 
                //Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser. 
                "mouseleave.selectBoxIt": function() {
                    //Trigger the `mouseleave` event on the original select box
                    self.selectBox.trigger("mouseleave");
                },                
                //Custom `destroy` event used internally in the plugin to remove any plugin data associated with the original select box
                "destroy": function() {
                    //Removes the `selectBoxIt` object from the calling element's jQuery `data` object
                    $.removeData(self.selectBox[0], dataName);
                }
            });
            //Properly focuses the dropdown list (removes focus flicker in IE).
            // The jQuery `add` method is used to bind the focus event for three elements.
            // The `add` method adds a jQuery object to the set of matched selectors 
            self.div.add(self.divText).add(self.downArrow).add(self.downArrowContainer).bind({
                //`click` event with the `selectBoxIt` namespace
                "click.selectBoxIt" : function() {
                    //If the dropdown list is not focused
                    if(!self.div.is(":focus")) {
                        //Focuses the dropdown list
                        self.div.trigger("focus", true);
                    }
                }
            });
            //Select box options events that set the dropdown list blur logic (decides when the dropdown list gets 
            //closed)
            self.list.bind({
                //`mouseover` event with the `selectBoxIt` namespace
                "mouseover.selectBoxIt" : function() {
                    //Prevents the dropdown list options list from closing
                    self.blur = false;
                },
                //`mouseout` event with the `selectBoxIt` namespace
                "mouseout.selectBoxIt" : function() {
                    //Allows the dropdown list options list to close
                    self.blur = true;        
                },
                //`focusin` event with the `selectBoxIt` namespace
                "focusin.selectBoxIt" : function() {
                    //Prevents the default browser outline border to flicker, which results because of the `blur` event
                    self.div.trigger("focus", true);
                }
            })
            //Select box individual options events bound with the jQuery `delegate` method.  `Delegate` was used because binding individual
            //events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to
            //the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`).
            //This greatly increases page performance because we only have to bind an event to one element instead of x number of elements.

            //Delegates the `click` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "click.selectBoxIt", function() {
                //Sets the original dropdown list value and triggers the `change` event on the original select box
                self.originalElem.value = $(this).attr("data-val");
                //Sets `currentFocus` to the currently focused dropdown list option.
                //The unary `+` operator casts the string to a number 
                //[James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                self.currentFocus = +this.id;
                //Closes the list after selecting an option
                close();
                //Triggers the dropdown list `change` event if a value change occurs
                if(self.originalElem.value !== self.divText.attr("data-val")) {
                    self.selectBox.trigger("change");
                }
            })
            //Delegates the `focus` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "focus.selectBoxIt", function() {
                //Sets the original select box current value and triggers the change event
                self.originalElem.value = $(this).attr("data-val");
                //Triggers a `change` event on the original select box
                self.selectBox.trigger("change");              
            });
            //Original dropdown list events
            self.selectBox.bind({
                //`change` event handler with the `selectBoxIt` namespace
                "change.selectBoxIt": function() {
                    //Sets the new dropdown list text to the value of the original dropdown list
                    self.divText.text(self.listItems.eq(self.currentFocus).text()).attr("data-val", self.originalElem.value);
                },
                //`disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function() {
                    //Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.div.addClass("ui-state-disabled");
                },
                //`enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function() {
                    //Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.div.removeClass("ui-state-disabled");
                }
            });
            //Maintains chainability
            return this;
        },
        //_ARIA Accessibility
        // ----------------
        //      Adds ARIA (Accessible Rich Internet Applications)
        //      Accessibility Tags to the Select Box
        _ariaAccessibility = function() {
            //Adds `ARIA attributes` to the dropdown list
            self.div.attr({
                //W3C `combobox` description: A presentation of a select; usually similar to a textbox where users can type ahead to select an option.
                "role": "combobox",
                //W3C `aria-autocomplete` description: Indicates whether user input completion suggestions are provided. 
                "aria-autocomplete": "list",
                //W3C `aria-expanded` description: Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
                "aria-expanded": "false",
                //W3C `aria-owns` description: The value of the aria-owns attribute is a space-separated list of IDREFS that reference one or more elements in the document by ID. The reason for adding aria-owns is to expose a parent/child contextual relationship to assistive technologies that is otherwise impossible to infer from the DOM.
                "aria-owns": self.list.attr("id"),
                //W3C `aria-activedescendant` description: This is used when a composite widget is responsible for managing its current active child to reduce the overhead of having all children be focusable. Examples include: multi-level lists, trees, and grids.
                "aria-activedescendant": self.listItems.eq(self.currentFocus).attr("id"),
                //W3C `aria-label` description:  It provides the user with a recognizable name of the object.
                "aria-label": $("label[for='" + self.originalElem.id + "']").text() || "",
                //W3C `aria-live` description: Indicates that an element will be updated.
                //Use the assertive value when the update needs to be communicated to the user more urgently.
                "aria-live": "assertive" }).
            //Dynamically adds `ARIA attributes` if the new dropdown list is enabled or disabled
            bind({
                //Select box custom `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt" : function() {
                    //W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                    self.div.attr("aria-disabled", "true");
                },
                //Select box custom `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt" : function() {
                    //W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                    self.div.attr("aria-disabled", "false");
                }
            });
            //Adds ARIA attributes to the dropdown list options list
            self.list.attr({
                //W3C `listbox` description: A widget that allows the user to select one or more items from a list of choices.
                "role": "listbox",
                //Indicates that the dropdown list options list is currently hidden
                "aria-hidden": "true" });
            //Adds `ARIA attributes` to the dropdown list options
            self.listItems.attr({
                //This must be set for each element when the container element role is set to `listbox`
                "role": "option" });
            //Dynamically updates the new dropdown list `aria-label` attribute after the original dropdown list value changes
            self.selectBox.bind({
                //Custom `change` event with the `selectBoxIt` namespace
                "change.selectBoxIt": function() {
                    //Provides the user with a recognizable name of the object.
                    self.divText.attr("aria-label", self.originalElem.value);
                },
                //Custom `open` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function() {
                    //Indicates that the dropdown list options list is currently visible
                    self.list.attr("aria-hidden", "false");
                    //Indicates that the dropdown list is currently expanded
                    self.div.attr("aria-expanded", "true");
                },
                //Custom `close` event with the `selectBoxIt` namespace
                "close.selectBoxIt": function() {
                    //Indicates that the dropdown list options list is currently hidden
                    self.list.attr("aria-hidden", "true");
                    //Indicates that the dropdown list is currently collapsed
                    self.div.attr("aria-expanded", "false");
                }
            });
            //Maintains chainability
            return this;
        },
        //Get Option
        // ---------
        //      Returns a single plugin option
        getOption = function(key, callback) {
            //Provides callback function support
            _callbackSupport(callback);
            //Returns the plugin option if it exists, and returns undefined if the option does not exist
            return self.options[key] || undefined;    
        },
        //Get Options
        // ----------
        //      Returns all of the dropdown list options      
        getOptions = function(callback) {
            //Provide callback function support
            _callbackSupport(callback);
            //Returns an object of all of the plugin's options
            return self.options || undefined;
        },
        //Set Option
        // ---------
        //      Replaces an existing plugin option on the 
        //      plugin options object
        setOption = function(key, value, callback) {
            //If the plugin contains the specified option
            if(self.options[key] !== undefined) {
                //Sets the plugin option to the new value provided by the user
                self.options[key] = value;    
            }
            //If a user sets the `showFirstOption` to false
            if(key === "showFirstOption" && !value) {
                //Hides the first option in the dropdown list
                self.listItems.eq(0).hide();
            }
            //If a user sets the `showFirstOption` to true
            else if(key === "showFirstOption" && value) {
                //Shows the first option in the dropdown list
                self.listItems.eq(0).show();
            }
            //Provides callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //Set Options
        // ----------
        //      Accepts an object to replace plugin options
        //      properties to the plugin options object
        setOptions = function(newOptions, callback) {
            //If the passed in parameter is an object literal
            if($.isPlainObject(newOptions)) {
                //Uses the jQuery `extend` method to merge the user specified options object with the `self.options`
                //object to create a new object.  The options variable is set to the newly created object.
                self.options = $.extend({}, self.options, newOptions);
                //Maintains chainability
            }
            //If the `showFirstOption` option is true
            if(self.options.showFirstOption) {
                //Shows the first option in the dropdown list
                self.listItems.eq(0).show();
            }
            //If the `showFirstOption` option is false
            else {
                //Hides the first option in the dropdown list
                self.listItems.eq(0).hide();
            }
            //Provide callback function support
            _callbackSupport(callback);
            return this;
        },
        //Disable
        // ------
        //      Disables the new dropdown list
        disable = function(callback) {
            //Makes sure the dropdown list is closed
            close();
            //Triggers a `disable` custom event on the original select box
            self.selectBox.trigger("disable")
            //Sets the `disabled` attribute on the original select box
            .attr("disabled", "disabled");
            //Makes the dropdown list not focusable by removing the `tabindex` attribute
            self.div.removeAttr("tabindex").css("cursor", "default");
            //Provides callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //_Is Disabled
        // ---------
        //      Checks the original select box for the 
        //		disabled attribute
        _isDisabled = function() {
            //If the original select box is disabled
            if(self.originalElem.disabled) {
                //Disables the dropdown list
                disable();
            }
            //Maintains chainability
            return this;
        },
        //Enable
        // -----
        //      Enables the new dropdown list
        enable = function(callback) {
            var e, i;
            //Triggers a `enable` custom event on the original select box
            self.selectBox.trigger("enable")
            //Removes the `disabled` attribute from the original dropdown list
            .removeAttr("disabled");
            //Make the dropdown list focusable
            self.div.attr("tabindex", 0).css("cursor", "pointer");
            //Provide callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //Destroy
        // ------
        //      Removes any data associated with the
        //		dropdown list plugin
        destroy = function(callback) {
            //Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
            self.div.unbind(".selectBoxIt").
            //Undelegates all of the dropdown list event handlers with the `selectBoxIt` namespace
            undelegate(".selectBoxIt");
            //Triggers the custom `destroy` event handler and then removes the dropdown list div and unordered list elements from the DOM
            self.div.trigger("destroy");
            //Remove all of the `selectBoxIt` DOM elements from the page
            self.divContainer.remove();
            //Triggers the custom `destroy` event on the original select box and then shows the original dropdown list
            self.selectBox.trigger("destroy").show();
            //Provides callback function support
            _callbackSupport(callback);
            //Maintains chainability
            return this;
        },
        //_jQueryUI
        // --------
        //      Adds jQueryUI CSS classes
        _jqueryUI = function() {
            //Adds the default styling to the dropdown list
            self.div.addClass("ui-widget ui-state-default");
            //Adds the default styling for the dropdown list options
            self.list.addClass("ui-widget ui-widget-content");
            //Select box individual option events
            self.listItems.bind({
                //`focus` event with the `selectBoxIt` namespace
                "focus.selectBoxIt": function() {
                    //Adds the focus CSS class to the currently focused dropdown list option
                    $(this).addClass("ui-state-focus");
                },
                //`blur` event with the `selectBoxIt` namespace
                "blur.selectBoxIt": function() {
                    //Removes the focus CSS class from the previously focused dropdown list option
                    $(this).removeClass("ui-state-focus");
                }
            });
            //Select box events
            self.selectBox.bind({
                //`click` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function() {
                    //Removes the jQueryUI hover class from the dropdown list and adds the jQueryUI focus class for both the dropdown list and the currently selected dropdown list option
                    self.div.removeClass("ui-state-hover").add(self.listItems.eq(self.currentFocus)).
                    addClass("ui-state-focus");
                },
                "blur.selectBoxIt": function() {
                    self.div.removeClass("ui-state-focus");
                },
                //`mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function() {
                    self.div.addClass("ui-state-hover");
                },
                //`mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function() {
                    //Removes the hover CSS class on the previously hovered dropdown list option
                    self.div.removeClass("ui-state-hover");
                }
            });

            self.listItems.bind({
                "mouseenter.selectBoxIt": function() {
                    //Sets the dropdown list individual options back to the default state and sets the hover CSS class on the currently hovered option
                    self.listItems.removeClass("ui-state-focus ui-state-hover");
                    $(this).addClass("ui-state-hover");
                },
                "mouseleave.selectBoxIt": function() {
                    $(this).removeClass("ui-state-hover");
                }
            });
            //Adds the jqueryUI down arrow icon CSS class to the down arrow div
            self.downArrow.addClass("ui-icon ui-icon-triangle-1-s").
            //Center positions the down arrow icon
            css({ "margin-top": self.downArrowContainer.height()/3 });
            //Maintains chainability
            return this;
        },
        //Wait
        // ---
        //		Delays execution by the amount of time
        //		specified by the parameter
        wait = function(time, callback) {
            //The timeout variable stores a Deferred Object, which will be resolved after the time specified in the parameter
            var timeout = returnTimeout(time);
            //Once the Deferred object is resolved, call the callback function
            timeout.then(function() {
                //Provide callback function support
                _callbackSupport(callback);
            });
            //Maintains chainability
            return this;
        },
        //Return timeout
        // -------------
        //		Returns a Deferred Object after the time 
        //		specified by the parameter
        returnTimeout = function(time) {
            //Returns a Deferred Object
            return $.Deferred(function(dfd) {
                //Call the JavaScript `setTimeout function and resolve the Deferred Object 
                setTimeout(dfd.resolve, time);
            });
        },
        //Create
        // -----
        //      Constructs the dropdown list plugin
        create = function(callback) {
            //If the original select box element is visible, then you know the plugin is not currently being called
            if ($(element).is(":visible")) {
                //Creates the new div element that acts as the dropdown list
                _createDiv();
                //Creates the new unordered list element to hold the dropdown list options
                _createUnorderedList();
                //Replaces the old dropdown list with the new div and unordered list elements
                _replaceSelectBox();
                //Adds event handlers to the new dropdown list
                _eventHandlers();
                //Disables the dropdown list if the original dropdown list had the `disabled` attribute
                _isDisabled();
                //Adds ARIA accessibillity tags to the dropdown list
                _ariaAccessibility();
                //Adds jQueryUI classes to the dropdown list if the jqueryUI option is set to true
                _jqueryUI();
                //Triggers a custom `create` event on the original dropdown list
                self.selectBox.trigger("create");
                //Provide callback function support
                _callbackSupport(callback);
            }
            //Maintains chainability
            return this;
        };
        //Public API
        // ---------
        return {
            //**version**: The current version of the `selectBoxIt` plugin
            version: "0.1.0",
            //**self**: The object that contains all of the `selectBoxIt` instance properties
            self: self,
            //**open**: Opens the dropdown list options list
            open: open,
            //**close**: Closes the dropdown list options list
            close: close,
            //**moveDown**: Selects the dropdown list option directly beneath the 
            //currently selected dropdown list option
            moveDown: moveDown,
            //**moveUp**: Selects the dropdown list option directly above the 
            //currently selected dropdown list option
            moveUp: moveUp,
            //**search**: Selects the dropdown list option that best matches the
            //text passed into the method  If a pattern match is found, that option is made the currently selected option. 
            //If a pattern match is not found, then the dropdown list currently select option is not updated.
            //Accepts one parameter (String searchTerm)  
            search: search,
            //**getOption**: Returns a dropdown list option.  Accepts one parameter (String key)
            getOption: getOption,
            //**getOptions**: Returns an object containing all of the current plugin 
            //option settings
            getOptions: getOptions,
            //**setOption**: Sets a single plugin option.  Accepts two parameters (String key, String value)
            setOption: setOption,
            //**setOptions**: Sets or adds new plugin option settings.  Accepts one parameter (Object newOptions)
            setOptions: setOptions,
            //**disable**: Disables the dropdown list
            disable: disable,
            //**enable**: Enables the dropdown list
            enable: enable,
            //**destroy**: Removes the dropdown list plugin from the DOM
            destroy: destroy,
            //**wait**: Delays execution by the amount of time specified by the user passed parameter
            wait: wait,
            //**create**: Adds the dropdown list plugin to the DOM
            create: create
        };
    };
    //SELECTBOXIT PLUGIN DEFINITION
    // ----------------------------
    //Adds the `selectBox` method to the jQuery prototype object
    $.fn.selectBoxIt = function (options) {
        //Maintains chainability for all calling elements
        return this.each(function () {
            //Stores the calling element and the data name into local variables
            var element = $(this), selectBox, dataName = "selectBoxIt";
            // Returns early if the calling element already has a plugin instance
            //associated with it inside of the jQuery `data` method
            if ($.data(element[0], dataName)) { 
                return;
            }
            //Uses the jQuery `extend` method to merge the user specified options object with the `self.options`
            //object to create a new object.  The options variable is set to the newly created object.
            options = $.extend({}, $.fn.selectBoxIt.options, options);
            // Instantiates a new `SelectBox` object
            selectBox = new SelectBox(this, options, dataName).
            //**Creates the plugin**
            create();
            //Stores the new `SelectBox` object in the calling element's jQuery `data` method
            $.data(element[0], dataName, selectBox);
            //Adds custom jQuery pseudo selectors
            $.extend($.expr[":"], {
                //Adds a custom pseudo selector for the `selectBoxIt` plugin that returns all plugin instances
                //It will return all DOM elements that have been called with the `selectBoxIt` plugin
                selectBoxIt: function(elem) {
                     return $(elem).data(dataName) !== undefined;
                }
            }); //end extending jQuery pseudo selectors
        }); //end return statement
    }; //end plugin
    //Default selectBoxIt Options
    // --------------------------
    $.fn.selectBoxIt.options = {
        //**showEffect**: Accepts String: "none", "fadeIn", "show", "slideDown", or any of the jQueryUI show effects (i.e. "bounce")
        showEffect: "none",
        //**showEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
        showEffectOptions: {},
        //**showEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
        showEffectSpeed: "medium",
        //**hideEffect**: Accepts String: "none", "fadeOut", "hide", "slideUp", or any of the jQueryUI hide effects (i.e. "explode")
        hideEffect: "none",
        //**hideEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
        hideEffectOptions: {},
        //**hideEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
        hideEffectSpeed: "medium",
        //**keyboardSearch**: Allows users to search for dropdown list options.  Accepts Boolean: true or false
        keyboardSearch: true,
        //**keyboardNavigation**: Allows keyboard navigation using the `up` and `down` keyboard arrow keys.
        // Accepts Boolean: true or false
        keyboardNavigation: true,
        //**showFirstOption**: Shows the first dropdown list option within the dropdown list options list
        showFirstOption: true };
//      End of Plugin
})(jQuery, window, document); //passes in the jQuery, window, and document global objects to allow the plugin to use these objects locally