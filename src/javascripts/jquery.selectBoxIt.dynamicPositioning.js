$(function() {

    //_Dynamic positioning
    // ------------------
    //      Dynamically positions the dropdown list options list

    $.selectBox.selectBoxIt.prototype._dynamicPositioning = function() {

        var self = this,

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            listOffsetTop = self.div.offset().top,

            // The height of the dropdown list options list
            listHeight = self.list.height(),

            // The height of the dropdown list DOM element
            selectBoxHeight = self.div.height();

        // Places the dropdown list options list on top of the dropdown list if the dropdown list options list does not fit on the page when opened
        if ((listOffsetTop + selectBoxHeight + listHeight >= $(window).height() + $(window).scrollTop()) && (listOffsetTop - listHeight >= 0)) {

            // If the dropdown list currently opens downward
            if (!self.flipped) {

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (self.divContainer.position().top - self.list.height()) - 2);

                //Sets the `flipped` instance variable to false to reflect that the dropdown list opens upward
                self.flipped = true;

            }

        }

        // If the dropdown list options have enough room on the page to open downward
        else {

            // If the dropdown list is currently opening upward
            if (self.flipped) {

                // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
                self.list.css("top", (self.divContainer.position().top + self.div.height()) + 2);

                // Sets the `flipped` instance variable to false to reflect that the dropdown list opens downward
                self.flipped = false;

            }

        }

        // Maintains chainability
        return self;

    };

});