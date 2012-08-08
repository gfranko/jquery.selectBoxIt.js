$(function() {

     // _jqueryui
     // ---------
     //      Adds SelectBoxIt CSS classes

    $.selectBox.selectBoxIt.prototype._jqueryui = function() {
        var self = this,

            focusClass = "ui-state-focus",

            hoverClass = "ui-state-hover";

        this.downArrow.addClass(this.selectBox.data("downarrow") || this.options.downArrowIcon || "ui-icon ui-icon-triangle-1-s");

        // Adds the default styling to the dropdown list
        this.div.addClass("ui-widget ui-state-default");

        // Adds the default styling for the dropdown list options
        this.list.addClass("ui-widget ui-widget-content");

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

        // Adds the jqueryUI down arrow icon CSS class to the down arrow div
        this.downArrow.css({ "margin-top": this.downArrowContainer.height()/3 });

        // Maintains chainability
        return this;

    };

});