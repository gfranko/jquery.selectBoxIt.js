$(function() {

    //Enable
    // -----
    //      Enables the new dropdown list

    $.selectBox.selectBoxIt.prototype.enable = function(callback) {

            if(this.options.disabled) {

                //Triggers a `enable` custom event on the original select box
                this.selectBox.trigger("enable")

                //Removes the `disabled` attribute from the original dropdown list
                .removeAttr("disabled");

                //Make the dropdown list focusable
                this.div.attr("tabindex", 0).css("cursor", "pointer");

                $.Widget.prototype.enable.call(this);

                //Provide callback function support
                this._callbackSupport(callback);

            }

            //Maintains chainability
            return this;

        }

});