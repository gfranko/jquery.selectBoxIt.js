jquery.selectBoxIt.js - Setting up your development environment
---------------------------------------------------------------

These are instructions for setting up your build environment for the _jquery.selectBoxIt.js_ plugin.  

Note that you don't actually need to do a build to use SelectBoxIt... you can just uses the JS code as-is.  These instructions exist for
developers and anyone who wants to delve into the code.

If you just want to use SelectBoxIt, then visit the [SelectBoxIt home page](http://gregfranko.com/jquery.selectBoxIt.js/) 
or go to the [ReadMe](https://github.com/gfranko/jquery.selectBoxIt.js/blob/master/README.markdown) on GitHub.

Developers might want to start with the [annotated source code](http://www.gregfranko.com/jquery.selectBoxIt.js/docs/jQuery.selectBoxIt.html).

**Developer tools**

SelectBoxIt uses the following development tools:

   - [Node.js](http://nodejs.org): For package management and builds.

   - [Grunt](http://gruntjs.com): to run the build script.

   - [Jasmine](http://pivotal.github.com/jasmine/): testing framework

   - [PhantomJS](http://phantomjs.org): headless WebKit browser for testing


##Setting up the developement environment

Note that all of the `npm` installations below are global (the `-g` flag.)  For global installations you will probably have to `sudo` these commands.
(Apologies that these instructions are Unix/OSX-centric.)

1. Install Node.js.  Luckily the [Node web site](http://nodejs.org) makes this fairly straightforward, 
   with installers for the major platforms.

2. Install [Grunt](http://gruntjs.com) using the `npm` package manager that comes with Node. To install, type the following into your command shell:
    
          npm install -g grunt

3. Install [Jasmine](http://pivotal.github.com/jasmine/) via the [`jasmine-node` package](https://github.com/mhevery/jasmine-node):
   
          npm install -g jasmine-node

4. Install the [Grunt Jasmine task](https://github.com/jasmine-contrib/grunt-jasmine-task) to enable Grunt to invoke Jasmine:
          npm install -g grunt-jasmine-task

5. You also have to manually install the [`temporary`](https://npmjs.org/package/temporary) package.  (It is required by the grunt jasmine task, but for some reason doesn't get installed correctly):
        
          npm install -g temporary

6. Install PhantomJS from its [home page](http://phantomjs.org).  This means downloading the appropriate file, uncompressing it, and then copying the `phantomjs` file to a location in your path.  On MacOSX, this looks _something_ like the following after downloading:

          cd /usr/local/bin
          sudo cp ~/Downloads/phantomjs-1.8.1-macosx/bin/phantomjs .

##Contributing
Take care to maintain the existing coding style. Add Jasmine unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

If you plan to contribute to `SelectBoxIt` in the future, keep in mind that you should make sure your code passes the Grunt checks.

To set up the SelectBoxIt grunt/node.js dependencies, first make sure you have [PhantomJS](http://phantomjs.org/) installed, which is a headless browser. Unfortunately PhantomJS cannot be installed automatically.

Next, navigate to within the **jquery.selectBoxIt.js** folder and type `npm install' (this should install grunt and a few other node.js libraries).

**Note:** If you are on Windows, remember you need to run the grunt command using `grunt.cmd`.  Also, if you have trouble getting the Jasmine Unit Tests to work with PhantomJS 1.5 (the current release), install PhantomJS 1.3.

After you have verified your code, send a pull request to the `SelectBoxIt` dev branch.  After you send a pull request, you will hear back from me shortly after I review your code.


##Build Instructions Change Log

`1.0.0` - 10 Feb 2013

- Initial instructions, based on my building SelectBoxIt for the first time.

**Contributors**

Greg Franko - [@gfranko](https://github.com/gfranko)

Thomas von Deyen - [@tvdeyen](https://github.com/tvdeyen)

Ron 'coyote' Lussier - [@tlenscraft](https://github.com/ronlussier)

## License
Copyright (c) 2012 Greg Franko  
Licensed under the MIT license.
