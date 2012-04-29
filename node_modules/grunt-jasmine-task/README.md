[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
[plugin_docs]: https://github.com/cowboy/grunt/blob/master/docs/plugins.md

# grunt-jasmine-task

Grunt task for running jasmine specs.

__Status: stable__

## Getting Started

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-jasmine-task`

(ie. the plugin is installed locally. If you want to install it globally - which is not recommended - check out the official [grunt documentation][plugin_docs])

Then add this line to your project's `grunt.js` gruntfile at the bottom:

```javascript
grunt.loadNpmTasks('grunt-jasmine-task');
```

Also add this to the ```grunt.initConfig``` object in the same file:

```javascript
jasmine: {
  index: ['specs/index.html']
},
```
Obviously you need to replace ```specs/index.html``` with the location of your jasmine spec running html file.
Now you can run the jasmine task with:

```grunt jasmine```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. 
Add unit tests for any new or changed functionality. 
Lint and test your code using [grunt][grunt].

More info on creating grunt plugins

## Release History

* v0.1.1: stable
* v0.1.0: broken

## License
Copyright (c) 2012 Camille Reynders  
Licensed under the MIT license.
