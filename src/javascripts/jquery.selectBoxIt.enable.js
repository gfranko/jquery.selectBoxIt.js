$(function() {

    //Enable
    // -----
    //      Enables the new dropdown list

    $.selectBox.selectBoxIt.prototype.enable = function(callback) {

        var self = this;

        if(self.options.disabled) {

            // Triggers a `enable` custom event on the original select box
            self.selectBox.trigger("enable").

            // Removes the `disabled` attribute from the original dropdown list
            removeAttr("disabled");

            // Make the dropdown list focusable
            self.div.attr("tabindex", 0)

            // Disables styles for the disabled state
            .toggleClass('selectboxit-disabled', false);

            $.Widget.prototype.enable.call(self);

            // Provide callback function support
            self._callbackSupport(callback);

            }

            //Maintains chainability
            return self;

        };

});