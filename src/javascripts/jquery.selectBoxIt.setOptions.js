$(function() {

    //Set Options
    // ----------
    //      Accepts an object to replace plugin options
    //      properties of the plugin options object

    $.selectBox.selectBoxIt.prototype.setOptions = function(newOptions, callback) {

            $.Widget.prototype._setOptions.apply(this, arguments);

            //If the `showFirstOption` option is true
            if (this.options.showFirstOption) {

                //Shows the first option in the dropdown list
                this.listItems.eq(0).show();

            }

            //If the `showFirstOption` option is false
            else {

                //Hides the first option in the dropdown list
                this.listItems.eq(0).hide();

            }

            if(this.options.defaultIcon) {

                this.divImage.attr("class", this.options.defaultIcon);

            }

            if(this.options.downArrowIcon) {

                this.downArrow.attr("class", this.options.downArrowIcon);

            }

            //If the defaultText option is set, make sure the dropdown list default text reflects this value
            if (this.options.defaultText) {

                this.divText.text(this.options.defaultText);

            }

            //Provide callback function support
            this._callbackSupport(callback);

            return this;

        };

});