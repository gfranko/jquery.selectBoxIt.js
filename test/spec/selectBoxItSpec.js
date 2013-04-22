describe('selectBoxIt jQuery Plugin', function () {
    var selectBoxIt;

    beforeEach(function() {

        setFixtures('<select id="test1" data-icon="ui-icon ui-icon-power" data-text="Testing" class="testClass1 testClass2"><option value="Select a Month">Select a Month</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option><option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option><option value="September" data-icon="ui ui-icon-power">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option></select>' +
                    '<select id="test2" data-icon="ui-icon ui-icon-power" data-text="Testing" class="testClass1 testClass2"><option value="Select a Month">Select a Month</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option><option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option><option value="September" data-icon="ui ui-icon-power">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option></select>' +
                    '<select id="test3" data-icon="ui-icon ui-icon-power" data-text="Testing" class="testClass1 testClass2"><option value="Select a Month">Select a Month</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option><option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option><option value="September" data-icon="ui ui-icon-power">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option></select>');

        spyOnEvent($("select#test1"), "create");

        /*
         * Simplest fixture.  Used to test basic functionality.
         */
        selectBoxIt1 = $("select#test1").selectBoxIt().data("selectBoxIt");

        /*
         * Fixture used to test option variants.
         */
        var    opts2 = {
                            copyClasses: 'container'
                       };
        selectBoxIt2 = $("select#test2").selectBoxIt(opts2).data("selectBoxIt");

        /*
         * Fixture used to test option variants.
         */
        var    opts3 = {
                            copyClasses: 'none'
                       };
        selectBoxIt3 = $("select#test3").selectBoxIt(opts3).data("selectBoxIt");

    });

    describe("create()", function() {

        describe("Creating the new select box HTML", function () {

            it("should hide the original select box", function() {

                expect(selectBoxIt1.originalElem).toBeHidden();

            });

            it("should create a new dropdown element to replace the original select box", function() {

                expect(selectBoxIt1.dropdown).toExist();

                expect(selectBoxIt1.dropdown).toBe("span");

                expect(selectBoxIt1.dropdown).toBeVisible();

            });

            it("should add a css class to the new dropdown container element", function() {

                expect(selectBoxIt1.dropdownContainer).toHaveClass("selectboxit-container");

            });

            it("should add a css class to the new dropdown text element", function() {

                expect(selectBoxIt1.dropdownText).toHaveClass("selectboxit-text");

            });

            it("should add a css class to the new dropdown icon element", function() {

                expect(selectBoxIt1.dropdownImage).toHaveClass("selectboxit-default-icon");

            });

            it("should add a css class to the new dropdown arrow element", function() {

                expect(selectBoxIt1.downArrowContainer).toHaveClass("selectboxit-arrow-container");

            });

            it("should add a css class to the new dropdown arrow container element", function() {

                expect(selectBoxIt1.downArrow).toHaveClass("selectboxit-arrow");

            });

            it("should add a css class to the new dropdown element", function() {

                expect(selectBoxIt1.dropdown).toHaveClass("selectboxit");

            });

            it("should add Twitter Bootstrap CSS classes by default", function() {

                /*
                expect(selectBoxIt1.dropdown).toHaveClass("btn");

                expect(selectBoxIt1.list).toHaveClass("dropdown-menu");
                */

            });

            it("should create a new dropdown element to nest inside of the top level dropdown element", function() {

                expect(selectBoxIt1.dropdownText).toExist();

                expect(selectBoxIt1.dropdownText).toBe("span");

                expect(selectBoxIt1.dropdown).toContain(selectBoxIt1.dropdownText);

            });

            it("should set the new select box text to the original select box value if the default text option is not set", function() {

                if(!selectBoxIt1.defaultText && !selectBoxIt1.selectBox.data("text")) {

                    expect(selectBoxIt1.dropdownText).toHaveText(selectBoxIt1.selectBox.val());

                }

                else {

                    expect(selectBoxIt1.dropdownText).toHaveText(selectBoxIt1.options.defaultText);

                }

            });

            it("should create a hidden unordered list that contains list items", function() {

                expect(selectBoxIt1.list).toExist();

                expect(selectBoxIt1.list).toBe("ul");

                expect(selectBoxIt1.list).toContain(selectBoxIt1.listItems);

            });

            it("should create list items containing select box option values from the original select box", function() {

                expect(selectBoxIt1.listItems).toExist();

                expect(selectBoxIt1.listItems).toBe("li");

                expect(selectBoxIt1.list.text()).toEqual(selectBoxIt1.selectItems.text());

            });

            it("should create a down arrow dropdown container that holds the actual down arrow dropdown element", function() {

                expect(selectBoxIt1.downArrowContainer).toExist();

                expect(selectBoxIt1.downArrowContainer).toBe("span");

                expect(selectBoxIt1.downArrowContainer).toContain(selectBoxIt1.downArrow);

            });

            it("should create a down arrow dropdown that holds the down arrow image", function() {

                if(selectBoxIt1.options.jqueryUI) {

                    expect(selectBoxIt1.downArrow).toExist();

                    expect(selectBoxIt1.downArrow).toBe("i");

                }

            });

            it("should trigger the custom 'create' event", function() {

                expect("create").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

            });

            it("should not allow a disabled option to be set as the currentFocus", function() {

                expect(selectBoxIt1.currentFocus).not.toHaveClass("ui-widget-disabled");

            });
        });

        describe('Setting the correct CSS and HTML attributes for the new select box', function () {

            it("should set the dropdown element 'tabindex' attribute to '0'", function() {

                expect(selectBoxIt1.dropdown).toHaveAttr("tabindex", 0);

            });

            it("should set the UL element tabindex attribute to -1", function() {

                expect(selectBoxIt1.list).toHaveAttr("tabindex", -1);

            });

            it("should have copied the classes from the source select to the button (copyClasses default value)", function() {

                expect(selectBoxIt1.dropdown).toHaveClass("testClass1");
                expect(selectBoxIt1.dropdown).toHaveClass("testClass2");

            });

            it("should NOT have copied the classes from the source select to the container (copyClasses default value)", function() {

                expect(selectBoxIt1.dropdownContainer).not.toHaveClass("testClass1");
                expect(selectBoxIt1.dropdownContainer).not.toHaveClass("testClass2");

            });

            it("should NOT have copied the classes from the source select to the button (copyClasses: 'container')", function() {

                expect(selectBoxIt2.dropdown).not.toHaveClass("testClass1");
                expect(selectBoxIt2.dropdown).not.toHaveClass("testClass2");

            });

            it("should have copied the classes from the source select to the container (copyClasses: 'container')", function() {

                expect(selectBoxIt2.dropdownContainer).toHaveClass("testClass1");
                expect(selectBoxIt2.dropdownContainer).toHaveClass("testClass2");

            });

            it("should NOT have copied the classes from the source select to the button (copyClasses: 'none')", function() {

                expect(selectBoxIt3.dropdown).not.toHaveClass("testClass1");
                expect(selectBoxIt3.dropdown).not.toHaveClass("testClass2");

            });

            it("should NOT have copied the classes from the source select to the container (copyClasses: 'none')", function() {

                expect(selectBoxIt3.dropdownContainer).not.toHaveClass("testClass1");
                expect(selectBoxIt3.dropdownContainer).not.toHaveClass("testClass2");

            });

        });

    });

    describe("open()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt1.selectBox, "open");

            selectBoxIt1.open();

        });

        it("should make the select box options list visible", function() {

            expect(selectBoxIt1.list).toBeVisible();

        });

    });

    describe("close()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt1.selectBox, "close");

            selectBoxIt1.open().close();

        });

        it("should trigger a custom 'close' event on the original select box", function() {

            expect("close").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

        });

        it("should hide the select box options list", function() {

            expect(selectBoxIt1.list).toBeHidden();

        });

    });

    describe("moveDown()", function() {

        beforeEach(function() {

            spyOnEvent($("select#test1"), "moveDown");

        });

        it("should trigger focus and blur events, and update the select box current value", function() {

            selectBoxIt1.selectItems.each(function(index) {

                //Cache the previous and next list elements
                var previous = selectBoxIt1.listItems.eq(selectBoxIt1.currentFocus),

                next = selectBoxIt1.listItems.eq(selectBoxIt1.currentFocus + 1);

                //Spy on the blur event for the previous list item element to be focused
                spyOnEvent(previous, "blur");

                //Spy on the focus event for the next list item element to be focused
                spyOnEvent(next, "focusin");

                //Call the moveUp() method
                selectBoxIt1.moveDown();

                //Check to make sure the blur and focus events were properly triggered on the correct elements

                expect("blur").toHaveBeenTriggeredOn(previous);

                expect("focusin").toHaveBeenTriggeredOn(next);

                expect("moveDown").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

            });

        });

    });

    describe("moveUp()", function() {

        beforeEach(function() {

            spyOnEvent($("select#test1"), "moveUp");

        });

        it("should trigger focus and blur events, and update the select box current value", function() {

            //Sets the select box value to the last select box option
            selectBoxIt1.currentFocus = +selectBoxIt1.listItems.last().attr("id");

            selectBoxIt1.selectItems.each(function(index) {

                //Cache the previous and next list elements
                var previous = selectBoxIt1.listItems.eq(selectBoxIt1.currentFocus),

                next = selectBoxIt1.listItems.eq(selectBoxIt1.currentFocus - 1);

                //Spy on the blur event for the previous list item element to be focused
                spyOnEvent(previous, "blur");

                //Spy on the focus event for the next list item element to be focused
                spyOnEvent(next, "focusin");

                //Call the moveUp() method
                selectBoxIt1.moveUp();

                //Check to make sure the blur and focus events were properly triggered on the correct elements
                expect("blur").toHaveBeenTriggeredOn(previous);

                expect("focusin").toHaveBeenTriggeredOn(next);

                expect("moveUp").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

            });

        });

    });

    describe("getOption()", function() {

        it("should return the proper plugin option for each key", function() {

            for(var x in selectBoxIt1.options) {

                var key = x,

                value = selectBoxIt1.options[x];

                expect(value).toEqual(selectBoxIt1.option(key));

            }

        });

    });

    describe("getOptions()", function() {

        it("should return an object containing all of the plugin options", function() {

            var options = selectBoxIt1.options;

            for(var x in selectBoxIt1.options) {

                expect(selectBoxIt1.options[x]).toEqual(options[x]);

            }

        });

    });

    describe("setOption()", function() {

        it("should update an existing plugin option", function() {

            var key = "showEffect", value="slide";

            selectBoxIt1.setOption(key, value);

            expect(selectBoxIt1.option(key)).toEqual(value);

        });

    });

    describe("setOptions()", function() {

        it("should update multiple plugin options", function() {

            var newOptions = { showEffect: "fadeIn", showEffectSpeed: "medium" };

            selectBoxIt1.setOptions(newOptions);

            expect(selectBoxIt1.option("showEffect")).toEqual("fadeIn");

            expect(selectBoxIt1.option("showEffectSpeed")).toEqual("medium");

        });

    });

    describe("disable()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt1.selectBox, "disable");

            selectBoxIt1.disable();

        });

        it("should trigger a custom 'disable' event", function() {

            expect("disable").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

        });

        it("should disable the original select box", function() {

            expect(selectBoxIt1.selectBox).toBeDisabled();

        });

        it("should remove the 'tabindex' html attribute from the select box", function() {

            expect(selectBoxIt1.dropdown).not.toHaveAttr("tabindex");

        });

    });

    describe("disableOption()", function() {

        beforeEach(function() {

            selectBoxIt1.disableOption(3);

        });

        it("should disable the fourth drop down option", function() {

            expect(selectBoxIt1.selectItems.eq(3)).toBeDisabled();

        });

    });

    describe("enable()", function() {

        beforeEach(function() {

            selectBoxIt1.disable();

            spyOnEvent(selectBoxIt1.selectBox, "enable");

            selectBoxIt1.enable();

        });

        it("should trigger a custom 'enable' event on the original select box", function() {

            expect("enable").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

        });

        it("should disable the original select box", function() {

            expect(selectBoxIt1.selectBox).not.toBeDisabled();

        });

        it("should set the 'tabindex' html attribute for the select box to 0", function() {

            expect(selectBoxIt1.dropdown).toHaveAttr("tabindex", 0);

        });

    });

    describe("enableOption()", function() {

        beforeEach(function() {

            selectBoxIt1.disableOption(3);

            selectBoxIt1.enableOption(3);

        });

        it("should enable the fourth drop down option", function() {

            expect(selectBoxIt1.selectItems.eq(3)).not.toBeDisabled();

        });

    });

    describe("destroy()", function() {

        beforeEach(function() {

            spyOn($.fn, "off").andCallThrough();

            spyOn($.fn, "remove").andCallThrough();

            spyOnEvent(selectBoxIt1.dropdown, "destroy");

            spyOnEvent(selectBoxIt1.selectBox, "destroy");

            selectBoxIt1.destroy();

        });

        it("should unbind all of the event handlers associated with the selectBoxIt plugin", function() {

            expect($.fn.off).toHaveBeenCalledWith(".selectBoxIt");

        });

        it("should trigger a custom 'destroy' event on the select box", function() {

            expect("destroy").toHaveBeenTriggeredOn(selectBoxIt1.dropdown);

        });

        it("should trigger a custom 'destroy' event on the original select box", function() {

            expect("destroy").toHaveBeenTriggeredOn(selectBoxIt1.selectBox);

        });

        it("should remove all of the DOM elements created by the selectBoxIt plugin", function() {

            expect($.fn.remove).toHaveBeenCalled();

        });

        it("should make the original select box visible", function() {

            expect(selectBoxIt1.selectBox).toBeVisible();

        });

    });

    describe("Custom pseudo selector", function() {

        it("should create a custom pseudo selector that returns every select box DOM element that has called the plugin", function() {

            expect($(":selectBox-selectBoxIt")).toBe("select");

            expect($(":selectBox-selectBoxIt:first")).toHaveId("test1");

        });

    });

    describe("Custom Icons", function() {

        it("should set the default icon if the HTML5 data-icon is specified", function() {

            expect(selectBoxIt1.dropdownImage).toHaveClass("ui-icon ui-icon-power");

        });

        it("should set the default icon if the defaultIcon option is set using setOption()", function() {

            selectBoxIt1.setOption("defaultIcon", "ui-icon ui-icon-info");

            expect(selectBoxIt1.dropdownImage).toHaveClass("ui-icon ui-icon-info");

        });

        it("should set the default icon if the defaultIcon option is set using setOptions()", function() {

            selectBoxIt1.setOptions({ defaultIcon: "ui-icon ui-icon-info" });

            expect(selectBoxIt1.dropdownImage).toHaveClass("ui-icon ui-icon-info");

        });

        it("should set the correct icon for each dropdown option", function() {

            selectBoxIt1.selectItems.each(function(index) {

                if($(this).data("icon")) {

                    expect(selectBoxIt1.listItems.eq(index).find("i")).toHaveClass($(this).data("icon"));

                }

            });

        });

    });

    describe("Setting custom text", function() {

        it("should set the default text if the select box has the HTML5 data-text attribute", function() {

            if(selectBoxIt1.selectBox.data("text")) {

                expect(selectBoxIt1.dropdownText.text()).toEqual(selectBoxIt1.selectBox.data("text"));

            }

        });

        it("should set the default text if the setOption() method sets the defaultText", function() {

            selectBoxIt1.setOption("defaultText", "Testing");

            expect(selectBoxIt1.dropdownText.text()).toEqual("Testing");

        });

        it("should set the default text if the setOptions() method sets the defaultText", function() {

            selectBoxIt1.setOptions({ defaultText: "Testing" });

            expect(selectBoxIt1.dropdownText.text()).toEqual("Testing");

        });

    });

    describe("selectOption()", function() {

        it("should set the correct dropdown value if an indece is passed", function() {

            selectBoxIt1.selectOption(3);

            expect(selectBoxIt1.dropdownText.attr("data-val")).toEqual(selectBoxIt1.selectBox.val());

        });

        it("should set the correct dropdown text if an indece is passed", function() {

            selectBoxIt1.selectOption(3);

            expect(selectBoxIt1.dropdownText.text()).toEqual(selectBoxIt1.selectBox.find("option:selected").text());

        });

        it("should set the correct dropdown value if a value is passed", function() {

            selectBoxIt1.selectOption("March");

            expect(selectBoxIt1.dropdownText.attr("data-val")).toEqual(selectBoxIt1.selectBox.val());

        });

        it("should set the correct dropdown text if a value is passed", function() {

            selectBoxIt1.selectOption("March");

            expect(selectBoxIt1.dropdownText.text()).toEqual(selectBoxIt1.selectBox.find("option:selected").text());

        });

    });

    describe("refresh()", function() {

        it("should dynamically add a drop down option", function() {

            var length = selectBoxIt1.selectBox.find("option").length;

            selectBoxIt1.selectBox.append("<option value='Fake Month'>Fake Month</option>");

            expect(selectBoxIt1.selectBox.find("option").length).toEqual(length + 1);

        });

        it("should update any drop down option text that changes", function() {

            var elem = selectBoxIt1.selectBox.find("option").eq(2);

            elem.text("New Text");

            selectBoxIt1.refresh();

            expect(selectBoxIt1.listItems.eq(2).text()).toEqual(elem.text());

        });

    });

    describe("copyAttributes", function() {

        beforeEach(function() {

            setFixtures('<select id="test1" data-icon="ui-icon ui-icon-power" data-text="Testing" rel="example" data-example="test" title="test"><option value="Select a Month">Select a Month</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option><option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option><option value="September" data-icon="ui ui-icon-power">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option></select>');

            selectBoxIt1 = $("select#test1").selectBoxIt().data("selectBoxIt");

        });

        it("should copy over the data-example HTML5 data attribute automatically", function() {

            expect(selectBoxIt1.dropdown).toHaveAttr("data-example");

        });

        it("should copy over the title attribute automatically", function() {

            expect(selectBoxIt1.dropdown).toHaveAttr("title");

        });

        it("should copy over the rel attribute automatically", function() {

            expect(selectBoxIt1.dropdown).toHaveAttr("rel");

        });

        beforeEach(function() {

            setFixtures('<select id="test1" data-icon="ui-icon ui-icon-power" data-text="Testing" rel="example" data-example="test" title="test" gregfranko="developer"><option value="Select a Month">Select a Month</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option><option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option><option value="September" data-icon="ui ui-icon-power">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option></select>');

            selectBoxIt2 = $("select#test1").selectBoxIt({ copyAttributes: ["gregfranko"] }).data("selectBoxIt");

        });

        it("should copy over the gregfranko custom attribute", function() {

            expect(selectBoxIt2.dropdown).toHaveAttr("gregfranko");

        });

        it("should no longer copy over the title attribute automatically", function() {

            expect(selectBoxIt2.dropdown).not.toHaveAttr("title");

        });

    });

    describe("selectOption", function() {

        beforeEach(function() {

            selectBoxIt1.selectOption(3);

        });

        it("should select the fourth drop down option", function() {

            expect(selectBoxIt1.selectBox).toHaveValue(selectBoxIt1.listItems.eq(3).attr("data-val"));

        });

    });

});