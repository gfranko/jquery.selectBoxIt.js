
    // Mobile Module
    // =============

    // Apply Native Select
    // -------------------
    //      Applies the original select box directly over the new drop down

    selectBoxIt._applyNativeSelect = function() {

        // Stores the plugin context inside of the self variable
        var self = this,
            currentOption;

        self.dropdownContainer.css({

            "position": "static"

        });

        // Positions the original select box directly over top the new dropdown list using position absolute and "hides" the original select box using an opacity of 0.  This allows the mobile browser "wheel" interface for better usability.
        self.selectBox.css({

            "display": "block",

            "width": self.dropdown.outerWidth(),

            "height": self.dropdown.outerHeight(),

            "opacity": "0",

            "position": "absolute",

            "top": self.dropdown.position().top,

            "bottom": self.dropdown.position().bottom,

            "left": self.dropdown.position().left,

            "right": self.dropdown.position().right,

            "cursor": "pointer",

            "z-index": "999999"

        }).bind({

            "changed.selectBoxIt": function() {

                currentOption = self.selectBox.find("option").filter(":selected");

                // Sets the new dropdown list text to the value of the original dropdown list
               self.dropdownText.text(currentOption.text());

                if(self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

                   self.dropdownImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

                }

            }

        });

    };

    // Mobile
    // ------
    //      Applies the native "wheel" interface when a mobile user is interacting with the dropdown

    selectBoxIt._mobile = function(callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

            if(self.options["isMobile"]()) {

                self._applyNativeSelect();

            }

            // Maintains chainability
            return this;

    };