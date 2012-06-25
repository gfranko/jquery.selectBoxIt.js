$(function() {

    //Set Option
    // ----------
    //      Accepts an string key, a value, and a callback function to replace a single
    //      property of the plugin options object

    $.selectBox.selectBoxIt.prototype.setOption = function(key, value, callback) {

            //If a user sets the `showFirstOption` to false
            if (key === "showFirstOption" && !value) {

                //Hides the first option in the dropdown list
                this.listItems.eq(0).hide();

            }

            //If a user sets the `showFirstOption` to true
            else if (key === "showFirstOption" && value) {

                //Shows the first option in the dropdown list
                this.listItems.eq(0).show();

            }

            else if(key === "defaultIcon" && value) {

                this.divImage.attr("class", value);

            }

            else if(key === "downArrowIcon" && value) {

                this.downArrow.attr("class", value);

            }

            //If a user sets the defaultText option
            else if (key === "defaultText") {

                //Sets the new dropdown list default text
                this.divText.text(value);

            }

            $.Widget.prototype._setOption.apply(this, arguments);

            //Provides callback function support
            this._callbackSupport(callback);

            //Maintains chainability
            return this;
        };

});