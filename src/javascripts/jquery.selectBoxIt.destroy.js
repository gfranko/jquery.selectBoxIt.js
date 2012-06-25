$(function() {

    //Destroy
    // ------
    //    Delays execution by the amount of time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.destroy = function(callback) {

        //Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
        this.div.unbind(".selectBoxIt").

        //Undelegates all of the dropdown list event handlers with the `selectBoxIt` namespace
        undelegate(".selectBoxIt");

        //Remove all of the `selectBoxIt` DOM elements from the page
        this.divContainer.remove();

        //Triggers the custom `destroy` event on the original select box and then shows the original dropdown list
        this.selectBox.trigger("destroy").show();

        // Calls the jQueryUI Widget Factory destroy method
        $.Widget.prototype.destroy.call(this);

        //Provides callback function support
        this._callbackSupport(callback);

        //Maintains chainability
        return this;

    };

});