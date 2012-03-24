describe('selectBoxIt jQuery Plugin', function () {
    var pluginData, self;
    beforeEach(function() {
    	loadFixtures("selectBox.html");
        pluginData = $("select#test").selectBoxIt().data("selectBoxIt"),
        self = pluginData.self;
    });

    describe("create()", function() {

        describe("Creating the new select box HTML", function () {

    	    it("should hide the original select box", function() {
    	        expect(self.selectBox).toBeHidden();
            });

            it("should create a new div element to replace the original select box", function() {
    	        expect(self.div).toExist();
    	        expect(self.div.prop("tagName")).toEqual("DIV");
                expect(self.div).toBeVisible();
            });

            it("should create a new div element to nest inside of the top level div element", function() {
    	        expect(self.divText).toExist();
    	        expect(self.divText.prop("tagName")).toEqual("SPAN");
                expect(self.div).toContain(self.divText);
            });

            it("should set the new select box text to the original select box value", function() {
    	        expect(self.divText).toHaveText(self.selectBox.val());
            });

            it("should create a hidden unordered list that contains list items", function() {
                expect(self.list).toExist();
                expect(self.list.prop("tagName")).toEqual("UL");
                expect(self.list).toBeHidden();
                expect(self.list).toContain(self.listItems);
            });

            it("should create list items containing select box option values from the original select box", function() {
                expect(self.listItems).toExist();
                expect(self.listItems.prop("tagName")).toEqual("LI");
                expect(self.list.text()).toEqual(self.selectItems.text());
            });
                
            it("should create a down arrow div container that holds the actual down arrow div element", function() {
        	    expect(self.downArrowContainer).toExist();
                expect(self.downArrowContainer.prop("tagName")).toEqual("SPAN");
                expect(self.downArrowContainer).toContain(self.downArrow);
            });

            it("should create a down arrow div that holds the down arrow image", function() {
        	    if(self.options.jqueryUI) {
        		    expect(self.downArrow).toExist();
                    expect(self.downArrow.prop("tagName")).toEqual("SPAN");
                }
            });

            it("should trigger the custom 'create' event", function() {
            	spyOnEvent(self.selectBox, "create");
            	pluginData.create();
                expect("create").toHaveBeenTriggeredOn(self.selectBox);
            });
        });

        describe('Setting the correct CSS and HTML attributes for the new select box', function () {

            it("should set the DIV element 'tabindex' attribute to '0'", function() {
                expect(self.div).toHaveAttr("tabindex", 0);
            });

            it("should set the nested DIV element css 'overflow' attribute to 'hidden'", function() {
                expect(self.divText.css('overflow')).toEqual("hidden");
            });

            it("should set the UL element tabindex attribute to -1", function() {
                expect(self.list).toHaveAttr("tabindex", -1);
            });

            it("should set the UL element 'display' attribute to 'none'", function() {
                expect(self.list).toBeHidden();
            });

            it("should set the UL css 'position' attribute to 'absolute'", function() {
                expect(self.list.css('position')).toEqual("absolute");
            });

            it("should set the UL 'z-index' attribute to '9999'", function() {
                expect(self.list.css('z-index')).toEqual("99999");
            });

            it("should set the UL css 'overflow' attribute to 'auto'", function() {
                expect(self.list.css('overflow')).toEqual("auto");
            });

            it("should set the correct jQueryUI classes if jQueryUI is being used", function() {
                if(self.jqueryUI) {
                    expect(self.div).toHaveClass("ui-state-focus");
                    expect(self.list).toHaveClass("ui-widget-content");
                    expect(self.listItems.eq(self.currentFocus)).toHaveClass("ui-state-focus");
                }
            });
        });
    });
    
    describe("open()", function() {
        
        beforeEach(function() {
        	spyOnEvent(self.selectBox, "open");
            pluginData.open();
        });

        it("should trigger a custom 'open' event on the original select box", function() {
            expect("open").toHaveBeenTriggeredOn(self.selectBox);
        });

        it("should make the select box options list visible", function() {
            expect(self.list).toBeVisible();
        });

    });

    describe("close()", function() {
        
        beforeEach(function() {
            spyOnEvent(self.selectBox, "close");
            pluginData.close();
        });

        it("should trigger a custom 'close' event on the original select box", function() {
            expect("close").toHaveBeenTriggeredOn(self.selectBox);
        });

        it("should hide the select box options list", function() {
            expect(self.list).toBeHidden();
        });

    });

    describe("moveDown()", function() {
 
        it("should trigger focus and blur events, and update the select box current value", function() {
        	self.selectItems.each(function(index) {
        		//Cache the previous and next list elements
        		var previous = self.listItems.eq(self.currentFocus),
        		next = self.listItems.eq(self.currentFocus + 1);
        		//Spy on the blur event for the previous list item element to be focused 
        		spyOnEvent(previous, "blur");
        		//Spy on the focus event for the next list item element to be focused
                spyOnEvent(next, "focus");
                //Call the moveUp() method
        	    pluginData.moveDown();
        	    //Check to make sure the blur and focus events were properly triggered on the correct elements
        	    expect("blur").toHaveBeenTriggeredOn(previous);
        	    expect("focus").toHaveBeenTriggeredOn(next);
        	    //Check to make sure the original select box value is set to the currently selected option
        	    expect(self.selectBox).toHaveValue(self.listItems.eq(self.currentFocus).text());
        	    //Check to make sure the select box text is updated to the currently selected option
        	    expect(self.divText).toHaveText(self.listItems.eq(self.currentFocus).text());
        	});
            
        });
                
    });

    describe("moveUp()", function() {

        it("should trigger focus and blur events, and update the select box current value", function() {
        	//Sets the select box value to the last select box option
        	pluginData.search(self.listItems.last().text());
        	self.selectItems.each(function(index) {
        		//Cache the previous and next list elements
        		var previous = self.listItems.eq(self.currentFocus),
        		next = self.listItems.eq(self.currentFocus - 1);
        		//Spy on the blur event for the previous list item element to be focused 
        		spyOnEvent(previous, "blur");
        		//Spy on the focus event for the next list item element to be focused
                spyOnEvent(next, "focus");
                //Call the moveUp() method
        	    pluginData.moveUp();
        	    //Check to make sure the blur and focus events were properly triggered on the correct elements
        	    expect("blur").toHaveBeenTriggeredOn(previous);
        	    expect("focus").toHaveBeenTriggeredOn(next);
        	    //Check to make sure the original select box value is set to the currently selected option
        	    expect(self.selectBox).toHaveValue(self.listItems.eq(self.currentFocus).text());
        	    //Check to make sure the select box text is updated to the currently selected option
        	    expect(self.divText).toHaveText(self.listItems.eq(self.currentFocus).text());
        	});
            
        });
                
    });

    describe("search()", function() {
 
        beforeEach(function() {
            spyOnEvent(self.selectBox, "search");
        });

        it("should update the original select box value to the currently selected option", function() {
            self.listItems.each(function() {
            	//Call the search method
                pluginData.search($(this).text());
                //The custom 'search' event to be called on the original select box
                expect("search").toHaveBeenTriggeredOn(self.selectBox);
                //The current focus instance variable should be set to the currently selected option 
                expect(self.currentFocus).toEqual(parseInt($(this).attr("id")));
                //The value of the original select box should be set to the currently selected option
                expect(self.selectBox).toHaveValue($(this).text());
                //The select box text should be updated to the currently selected option
                expect(self.divText).toHaveText($(this).text());
            });
        });
                
    });

    describe("getOption()", function() {
        
        it("should return the proper plugin option for each key", function() {
            for(var x in self.options) {
                var key = x,
                value = pluginData.getOption(x);
                expect(value).toEqual(self.options[x]);
            }
        });

    });

    describe("getOptions()", function() {

        it("should return an object containing all of the plugin options", function() {
            var options = pluginData.getOptions();
            for(var x in self.options) {
                expect(self.options[x]).toEqual(options[x]);
            }
        });

    });

    describe("setOption()", function() {

        it("should update an existing plugin option", function() {
            var key = "showEffect", value="none";
            pluginData.setOption(key, value);
            expect(self.options[key]).toEqual(value);
        });

    });

    describe("setOptions()", function() {

        it("should update multiple plugin options", function() {
            var newOptions = { showEffect: "none", showEffectOptions: {}, showEffectSpeed: "medium", hideEffect: "none", hideEffectOptions: {}, hideEffectSpeed: "medium", keyboardSearch: false, keyboardNavigation: false, showFirstOption: false };
            pluginData.setOptions(newOptions);
            for(var x in self.options) {
                expect(self.options[x]).toEqual(newOptions[x]);
            }
        });

    });
 
    describe("disable()", function() {

        beforeEach(function() {
        	spyOnEvent(self.selectBox, "disable");
            pluginData.disable();
        });

        it("should trigger a custom 'disable' event", function() {
            expect("disable").toHaveBeenTriggeredOn(self.selectBox);
        });

        it("should disable the original select box", function() {
            expect(self.selectBox).toBeDisabled();
        });

        it("should remove the 'tabindex' html attribute from the select box", function() {
            expect(self.div).not.toHaveAttr("tabindex");
        });

    });

    describe("enable()", function() {

        beforeEach(function() {
        	pluginData.disable();
        	spyOnEvent(self.selectBox, "enable");
            pluginData.enable();
        });

        it("should trigger a custom 'enable' event on the original select box", function() {
            expect("enable").toHaveBeenTriggeredOn(self.selectBox);
        });

        it("should disable the original select box", function() {
            expect(self.selectBox).not.toBeDisabled();
        });

        it("should set the 'tabindex' html attribute for the select box to 0", function() {
            expect(self.div).toHaveAttr("tabindex", 0);
        });

    });

    describe("destroy()", function() {

        beforeEach(function() {
            spyOn($.fn, "unbind").andCallThrough();
            spyOn($.fn, "undelegate").andCallThrough();
            spyOnEvent(self.div, "destroy");
            spyOnEvent(self.selectBox, "destroy");
            pluginData.destroy();
        });

        it("should unbind all of the event handlers associated with the selectBoxIt plugin", function() {
            expect($.fn.unbind).toHaveBeenCalledWith(".selectBoxIt");
        });

        it("should undelegate all of the event handlers attached via event delegation with the selectBoxIt plugin", function() {
            expect($.fn.undelegate).toHaveBeenCalledWith(".selectBoxIt");
        });

        it("should trigger a custom 'destroy' event on the select box", function() {
            expect("destroy").toHaveBeenTriggeredOn(self.div);
        });

        it("should trigger a custom 'destroy' event on the original select box", function() {
            expect("destroy").toHaveBeenTriggeredOn(self.selectBox);
        });

        it("should remove all of the DOM elements created by the selectBoxIt plugin", function() {
            setTimeout(function() { 
	            expect(self.div).not.toExist(); 
                expect(self.divText).not.toExist();
                expect(self.downArrowContainer).not.toExist();
                expect(self.downArrow).not.toExist();
                expect(self.list).not.toExist();
                expect(self.selectItems).not.toExist();
            }, 0);
        });

        it("should make the original select box visible", function() {
            expect(self.selectBox).toBeVisible();
        });

    });

});