$(function() {

    //Move Down
    // --------
    //      Handles the down keyboard navigation logic

    $.selectBox.selectBoxIt.prototype.moveDown = function(callback) {

        //Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        this.currentFocus += 1;

        //Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = this.listItems.eq(this.currentFocus).data("disabled"),

            hasNextEnabled = this.listItems.eq(this.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

        //If the user has reached the top of the list
        if (this.currentFocus === this.listItems.length) {

            //Does not allow the user to continue to go up the list
            this.currentFocus -= 1;

        }

        //If the option the user is trying to go to is disabled, but there is another enabled option
        else if (disabled && hasNextEnabled) {

            //Blur the previously selected option
            this.listItems.eq(this.currentFocus - 1).blur();

            //Call the `moveDown` method again
            this.moveDown();

            //Exit the method
            return;

        }

        //If the option the user is trying to go to is disabled, but there is not another enabled option
        else if (disabled && !hasNextEnabled) {

            this.currentFocus -= 1;

        }

        //If the user has not reached the bottom of the unordered list
        else {

            //Blurs the previously focused list item
            //The jQuery `end()` method allows you to continue chaining while also using a different selector
            this.listItems.eq(this.currentFocus - 1).blur().end().

            //Focuses the currently focused list item
            eq(this.currentFocus).focus();

            //Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            this._scrollToView("down");

            //Triggers the custom `moveDown` event on the original select box
            this.selectBox.trigger("moveDown");

        }

        //Provide callback function support
        this._callbackSupport(callback);

        //Maintains chainability
        return this;
    };

    //Move Up
    // ------
    //      Handles the up keyboard navigation logic
    $.selectBox.selectBoxIt.prototype.moveUp = function(callback) {

        //Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        this.currentFocus -= 1;

        //Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = this.listItems.eq(this.currentFocus).data("disabled"),

            hasPreviousEnabled = this.listItems.eq(this.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

        //If the user has reached the top of the list
        if (this.currentFocus === -1) {

            //Does not allow the user to continue to go up the list
            this.currentFocus += 1;
        }

        //If the option the user is trying to go to is disabled and the user is not trying to go up after the user has reached the top of the list
        else if (disabled && hasPreviousEnabled) {

            //Blur the previously selected option
            this.listItems.eq(this.currentFocus + 1).blur();

            //Call the `moveUp` method again
            this.moveUp();

            //Exit the method
            return;
        }

        else if (disabled && !hasPreviousEnabled) {

            this.currentFocus += 1;

        }

        //If the user has not reached the top of the unordered list
        else {

            //Blurs the previously focused list item
            //The jQuery `end()` method allows you to continue chaining while also using a different selector
            this.listItems.eq(this.currentFocus + 1).blur().end().

            //Focuses the currently focused list item
            eq(this.currentFocus).focus();

            //Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            this._scrollToView("up");

            //Triggers the custom `moveDown` event on the original select box
            this.selectBox.trigger("moveUp");

        }

        //Provide callback function support
        this._callbackSupport(callback);

        //Maintains chainability
        return this;
    };

});