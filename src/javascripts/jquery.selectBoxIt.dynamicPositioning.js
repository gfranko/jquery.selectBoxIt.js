
    // Dynamic Positioning Module
    // ==========================

    // _Dynamic positioning
    // --------------------
    //      Dynamically positions the dropdown list options list

    selectBoxIt._dynamicPositioning = function() {

        var self = this,

            abs = Math.abs,

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            listOffsetTop = self.dropdown.offset().top,

            listPositionTop = self.dropdown.position().top,

            // The height of the dropdown list options list
            listHeight = self.list.data("max-height") || self.list.outerHeight(true),

            // The height of the dropdown list DOM element
            selectBoxHeight = self.dropdown.outerHeight(true),

            viewport = self.options["viewport"],

            viewportHeight = viewport.height(),

            viewportScrollTop = $.isWindow(viewport.get(0)) ? viewport.scrollTop() : viewport.offset().top,

            topToBottom = listOffsetTop + selectBoxHeight + listHeight <= viewportHeight + viewportScrollTop,

            bottomReached = !topToBottom,

            outsideBottomViewport,

            outsideTopViewport;

        // If there is room on the bottom of the viewport to display the drop down options
        if (!bottomReached) {

            // Removes the max-height on the drop down list
            self.list.css("max-height", "none");

            // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
            self.list.css("top", "auto");

        }

        // If there is room on the top of the viewport
        else if((listOffsetTop - viewportScrollTop) >= listHeight) {

            self.list.css("max-height", listHeight);

            // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
            self.list.css("top", (listPositionTop - listHeight));

        }

        // If there is not enough room on the top or the bottom
        else {

            outsideBottomViewport = abs((listOffsetTop + selectBoxHeight + listHeight) - (viewportHeight + viewportScrollTop));

            outsideTopViewport = abs((listOffsetTop - viewportScrollTop) - listHeight);

            // If there is more room on the bottom
            if(outsideBottomViewport < outsideTopViewport) {

                self.list.css("max-height", listHeight - outsideBottomViewport - (selectBoxHeight/2));

                self.list.css("top", "auto");

            }

            // If there is more room on the top
            else {

                self.list.css("max-height", listHeight - outsideTopViewport - (selectBoxHeight/2));

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (listPositionTop - listHeight));

            }

        }

        if(!self.list.data("max-height")) {

            self.list.data("max-height", self.list.outerHeight(true));

        }

        // Maintains chainability
        return self;

    };