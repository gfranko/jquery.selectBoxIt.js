$(function() {

    // Mobile
    // ------
    //      Supports mobile browsers

    $.selectBox.selectBoxIt.prototype._mobile = function(callback) {

        var self = this,
            currentOption;

        if(this.options.isMobile()) {

            // Positions the original select box directly over top the new dropdown list using position absolute and "hides" the original select box using an opacity of 0.  This allows the mobile browser "wheel" interface for better usability.
            this.selectBox.css({

                "display": "block",

                "width": this.div.width(),

                "opacity": "0",

                "position": "absolute"

            }).bind({

                "changed": function() {

                    currentOption = self.selectBox.find("option").filter(":selected");

                    // Sets the new dropdown list text to the value of the original dropdown list
                    self.divText.text(currentOption.text());

                    if(self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

                        self.divImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

                    }

                }

            });

        }

        //Maintains chainability
        return this;

    };

});