describe('selectBoxIt jQuery Plugin', function () {
    var selectBoxIt;

    beforeEach(function() {

        setFixtures('<select id="test" data-icon="ui-icon ui-icon-power" data-text="Testing"><option value="Select a Month">Select a Month</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option><option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option><option value="September" data-icon="ui ui-icon-power">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option></select>');

        spyOnEvent($("select#test"), "create");

        selectBoxIt = $("select#test").selectBoxIt().data("selectBoxIt");

    });

    describe("create()", function() {

        describe("Creating the new select box HTML", function () {

            it("should hide the original select box", function() {

                expect(selectBoxIt.originalElem).toBeHidden();

            });

            it("should create a new div element to replace the original select box", function() {

                expect(selectBoxIt.div).toExist();

                expect(selectBoxIt.div).toBe("div");

                expect(selectBoxIt.div).toBeVisible();

            });

            it("should add a css class to the new div container element", function() {

                expect(selectBoxIt.divContainer).toHaveClass("selectboxit-container");

            });

            it("should add a css class to the new span text element", function() {

                expect(selectBoxIt.divText).toHaveClass("selectboxit-text");

            });

            it("should add a css class to the new span icon element", function() {

                expect(selectBoxIt.divImage).toHaveClass("selectboxit-default-icon");

            });

            it("should add a css class to the new span arrow element", function() {

                expect(selectBoxIt.downArrowContainer).toHaveClass("selectboxit-arrow-container");

            });

            it("should add a css class to the new span arrow container element", function() {

                expect(selectBoxIt.downArrow).toHaveClass("selectboxit-arrow");

            });

            it("should add a css class to the new div element", function() {

                expect(selectBoxIt.div).toHaveClass("selectboxit");

            });

            it("should create a new div element to nest inside of the top level div element", function() {

                expect(selectBoxIt.divText).toExist();

                expect(selectBoxIt.divText).toBe("span");

                expect(selectBoxIt.div).toContain(selectBoxIt.divText);

            });

            it("should set the new select box text to the original select box value if the default text option is not set", function() {

                if(!selectBoxIt.defaultText && !selectBoxIt.selectBox.data("text")) {

                    expect(selectBoxIt.divText).toHaveText(selectBoxIt.selectBox.val());

                }

                else {

                    expect(selectBoxIt.divText).toHaveText(selectBoxIt.options.defaultText);

                }

            });

            it("should create a hidden unordered list that contains list items", function() {

                expect(selectBoxIt.list).toExist();

                expect(selectBoxIt.list).toBe("ul");

                expect(selectBoxIt.list).toContain(selectBoxIt.listItems);

            });

            it("should create list items containing select box option values from the original select box", function() {

                expect(selectBoxIt.listItems).toExist();

                expect(selectBoxIt.listItems).toBe("li");

                expect(selectBoxIt.list.text()).toEqual(selectBoxIt.selectItems.text());

            });

            it("should create a down arrow div container that holds the actual down arrow div element", function() {

                expect(selectBoxIt.downArrowContainer).toExist();

                expect(selectBoxIt.downArrowContainer).toBe("span");

                expect(selectBoxIt.downArrowContainer).toContain(selectBoxIt.downArrow);

            });

            it("should create a down arrow div that holds the down arrow image", function() {

                if(selectBoxIt.options.jqueryUI) {

                    expect(selectBoxIt.downArrow).toExist();

                    expect(selectBoxIt.downArrow).toBe("span");

                }

            });

            it("should trigger the custom 'create' event", function() {

                expect("create").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

            });

            it("should not allow a disabled option to be set as the currentFocus", function() {

                expect(selectBoxIt.currentFocus).not.toHaveClass("ui-widget-disabled");

            });
        });

        describe('Setting the correct CSS and HTML attributes for the new select box', function () {

            it("should set the DIV element 'tabindex' attribute to '0'", function() {

                expect(selectBoxIt.div).toHaveAttr("tabindex", 0);

            });

            it("should set the UL element tabindex attribute to -1", function() {

                expect(selectBoxIt.list).toHaveAttr("tabindex", -1);

            });

            it("should set the correct jQueryUI classes if jQueryUI is being used", function() {

                expect(selectBoxIt.div).toHaveClass("ui-widget");

                expect(selectBoxIt.div).toHaveClass("ui-state-default");

                expect(selectBoxIt.list).toHaveClass("ui-widget");

                expect(selectBoxIt.list).toHaveClass("ui-widget-content");

            });

        });

    });

    describe("open()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt.selectBox, "open");

            selectBoxIt.open();

        });

        it("should trigger a custom 'open' event on the original select box", function() {

            expect("open").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

        });

        it("should make the select box options list visible", function() {

            expect(selectBoxIt.list).toBeVisible();

        });

    });

    describe("close()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt.selectBox, "close");

            selectBoxIt.open().close();

        });

        it("should trigger a custom 'close' event on the original select box", function() {

            expect("close").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

        });

        it("should hide the select box options list", function() {

            expect(selectBoxIt.list).toBeHidden();

        });

    });

    describe("moveDown()", function() {

        beforeEach(function() {

            spyOnEvent($("select#test"), "moveDown");

        });

        it("should trigger focus and blur events, and update the select box current value", function() {

            selectBoxIt.selectItems.each(function(index) {

                //Cache the previous and next list elements
                var previous = selectBoxIt.listItems.eq(selectBoxIt.currentFocus),

                next = selectBoxIt.listItems.eq(selectBoxIt.currentFocus + 1);

                //Spy on the blur event for the previous list item element to be focused
                spyOnEvent(previous, "blur");

                //Spy on the focus event for the next list item element to be focused
                spyOnEvent(next, "focus");

                //Call the moveUp() method
                selectBoxIt.moveDown();

                //Check to make sure the blur and focus events were properly triggered on the correct elements

                expect("blur").toHaveBeenTriggeredOn(previous);

                expect("focus").toHaveBeenTriggeredOn(next);

                expect("moveDown").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

                //Check to make sure the original select box value is set to the currently selected option
                expect(selectBoxIt.selectBox).toHaveValue(selectBoxIt.listItems.eq(selectBoxIt.currentFocus).text());

                //Check to make sure the select box text is updated to the currently selected option
                expect(selectBoxIt.divText).toHaveText(selectBoxIt.listItems.eq(selectBoxIt.currentFocus).text());

            });

        });

    });

    describe("moveUp()", function() {

        beforeEach(function() {

            spyOnEvent($("select#test"), "moveUp");

        });

        it("should trigger focus and blur events, and update the select box current value", function() {

            //Sets the select box value to the last select box option
            selectBoxIt.currentFocus = +selectBoxIt.listItems.last().attr("id");

            selectBoxIt.selectItems.each(function(index) {

                //Cache the previous and next list elements
                var previous = selectBoxIt.listItems.eq(selectBoxIt.currentFocus),

                next = selectBoxIt.listItems.eq(selectBoxIt.currentFocus - 1);

                //Spy on the blur event for the previous list item element to be focused
                spyOnEvent(previous, "blur");

                //Spy on the focus event for the next list item element to be focused
                spyOnEvent(next, "focus");

                //Call the moveUp() method
                selectBoxIt.moveUp();

                //Check to make sure the blur and focus events were properly triggered on the correct elements
                expect("blur").toHaveBeenTriggeredOn(previous);

                expect("focus").toHaveBeenTriggeredOn(next);

                expect("moveUp").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

                //Check to make sure the original select box value is set to the currently selected option

                expect(selectBoxIt.selectBox).toHaveValue(selectBoxIt.listItems.eq(selectBoxIt.currentFocus).attr("data-val"));

                //Check to make sure the select box text is updated to the currently selected option
                expect(selectBoxIt.divText).toHaveText(selectBoxIt.listItems.eq(selectBoxIt.currentFocus).text());
            });

        });

    });

    describe("search()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt.selectBox, "search");

            selectBoxIt.search("December");

        });

        it("should update the original select box value to the currently selected option", function() {

            //The custom 'search' event to be called on the original select box
            expect("search").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

            //The current focus instance variable should be set to the currently selected option
            expect(selectBoxIt.currentFocus).toEqual(12);

            //The value of the original select box should be set to the currently selected option
            expect(selectBoxIt.selectBox).toHaveValue("December");

            //The select box text should be updated to the currently selected option
            expect(selectBoxIt.divText).toHaveText("December");

        });

    });

    describe("getOption()", function() {

        it("should return the proper plugin option for each key", function() {

            for(var x in selectBoxIt.options) {

                var key = x,

                value = selectBoxIt.options[x];

                expect(value).toEqual(selectBoxIt.option(key));

            }

        });

    });

    describe("getOptions()", function() {

        it("should return an object containing all of the plugin options", function() {

            var options = selectBoxIt.options;

            for(var x in selectBoxIt.options) {

                expect(selectBoxIt.options[x]).toEqual(options[x]);

            }

        });

    });

    describe("setOption()", function() {

        it("should update an existing plugin option", function() {

            var key = "showEffect", value="slide";

            selectBoxIt.setOption(key, value);

            expect(selectBoxIt.option(key)).toEqual(value);

        });

    });

    describe("setOptions()", function() {

        it("should update multiple plugin options", function() {

            var newOptions = { showEffect: "fadeIn", showEffectSpeed: "medium" };

            selectBoxIt.setOptions(newOptions);

            expect(selectBoxIt.option("showEffect")).toEqual("fadeIn");

            expect(selectBoxIt.option("showEffectSpeed")).toEqual("medium");

        });

    });

    describe("disable()", function() {

        beforeEach(function() {

            spyOnEvent(selectBoxIt.selectBox, "disable");

            selectBoxIt.disable();

        });

        it("should trigger a custom 'disable' event", function() {

            expect("disable").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

        });

        it("should disable the original select box", function() {

            expect(selectBoxIt.selectBox).toBeDisabled();

        });

        it("should remove the 'tabindex' html attribute from the select box", function() {

            expect(selectBoxIt.div).not.toHaveAttr("tabindex");

        });

    });

    describe("enable()", function() {

        beforeEach(function() {

            selectBoxIt.disable();

            spyOnEvent(selectBoxIt.selectBox, "enable");

            selectBoxIt.enable();

        });

        it("should trigger a custom 'enable' event on the original select box", function() {

            expect("enable").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

        });

        it("should disable the original select box", function() {

            expect(selectBoxIt.selectBox).not.toBeDisabled();

        });

        it("should set the 'tabindex' html attribute for the select box to 0", function() {

            expect(selectBoxIt.div).toHaveAttr("tabindex", 0);

        });

    });

    describe("destroy()", function() {

        beforeEach(function() {

            spyOn($.fn, "unbind").andCallThrough();

            spyOn($.fn, "undelegate").andCallThrough();

            spyOn($.fn, "remove").andCallThrough();

            spyOnEvent(selectBoxIt.div, "destroy");

            spyOnEvent(selectBoxIt.selectBox, "destroy");

            selectBoxIt.destroy();

        });

        it("should unbind all of the event handlers associated with the selectBoxIt plugin", function() {

            expect($.fn.unbind).toHaveBeenCalledWith(".selectBoxIt");

        });

        it("should undelegate all of the event handlers attached via event delegation with the selectBoxIt plugin", function() {

            expect($.fn.undelegate).toHaveBeenCalledWith(".selectBoxIt");

        });

        it("should trigger a custom 'destroy' event on the select box", function() {

            expect("destroy").toHaveBeenTriggeredOn(selectBoxIt.div);

        });

        it("should trigger a custom 'destroy' event on the original select box", function() {

            expect("destroy").toHaveBeenTriggeredOn(selectBoxIt.selectBox);

        });

        it("should remove all of the DOM elements created by the selectBoxIt plugin", function() {

            expect($.fn.remove).toHaveBeenCalled();

        });

        it("should make the original select box visible", function() {

            expect(selectBoxIt.selectBox).toBeVisible();

        });

    });

    describe("Custom pseudo selector", function() {

        it("should create a custom pseudo selector that returns every select box DOM element that has called the plugin", function() {

            expect($(":selectBox-selectBoxIt")).toBe("select");

            expect($(":selectBox-selectBoxIt")).toHaveId("test");

        });

    });

    describe("Custom Icons", function() {

        it("should set the default icon if the HTML5 data-icon is specified", function() {

            expect(selectBoxIt.divImage).toHaveClass("ui-icon ui-icon-power");

        });

        it("should set the default icon if the defaultIcon option is set using setOption()", function() {

            selectBoxIt.setOption("defaultIcon", "ui-icon ui-icon-info");

            expect(selectBoxIt.divImage).toHaveClass("ui-icon ui-icon-info");

        });

        it("should set the default icon if the defaultIcon option is set using setOptions()", function() {

            selectBoxIt.setOptions({ defaultIcon: "ui-icon ui-icon-info" });

            expect(selectBoxIt.divImage).toHaveClass("ui-icon ui-icon-info");

        });

        it("should set the correct icon for each dropdown option", function() {

            selectBoxIt.selectItems.each(function(index) {

                if($(this).data("icon")) {

                    expect(selectBoxIt.listItems.eq(index).find("span")).toHaveClass($(this).data("icon"));

                }

            });

        });

    });

    describe("Setting custom text", function() {

        it("should set the default text if the select box has the HTML5 data-text attribute", function() {

            if(selectBoxIt.selectBox.data("text")) {

                expect(selectBoxIt.divText.text()).toEqual(selectBoxIt.selectBox.data("text"));

            }

        });

        it("should set the default text if the setOption() method sets the defaultText", function() {

            selectBoxIt.setOption("defaultText", "Testing");

            expect(selectBoxIt.divText.text()).toEqual("Testing");

        });

        it("should set the default text if the setOptions() method sets the defaultText", function() {

            selectBoxIt.setOptions({ defaultText: "Testing" });

            expect(selectBoxIt.divText.text()).toEqual("Testing");

        });

    });

});