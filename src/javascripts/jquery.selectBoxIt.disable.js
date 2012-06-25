$(function() {

    //Disable
    // ------
    //      Disables the new dropdown list

    $.selectBox.selectBoxIt.prototype.disable = function(callback) {

            if(!this.options.disabled) {

                //Makes sure the dropdown list is closed
                this.close();

                //Triggers a `disable` custom event on the original select box
                this.selectBox.trigger("disable")

                //Sets the `disabled` attribute on the original select box
                .attr("disabled", "disabled");

                //Makes the dropdown list not focusable by removing the `tabindex` attribute
                this.div.removeAttr("tabindex").css("cursor", "default");

                // Calls the jQueryUI Widget Factory disable method to make sure all options are correctly synced
                $.Widget.prototype.disable.call(this);

                //Provides callback function support
                this._callbackSupport(callback);

                //Maintains chainability
                return this;

            }

    };

    //_Is Disabled
    // -----------
    //      Checks the original select box for the
    //    disabled attribute

    $.selectBox.selectBoxIt.prototype._isDisabled = function(callback) {

        //If the original select box is disabled
        if (this.originalElem.disabled) {

            //Disables the dropdown list
            this.disable();
        }

        //Maintains chainability
        return this;

    };

});