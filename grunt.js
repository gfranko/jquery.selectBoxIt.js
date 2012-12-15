/*global module:false*/
module.exports = function(grunt) {

  var min = {};
  [
    'ariaAccessibility',
    'core',
    'disable',
    'dynamicPositioning',
    'enable',
    'keyboardNavigation',
    'keyboardSearch',
    'mobile',
    'selectOption',
    'setOption',
    'setOptions',
    'wait'
  ].forEach(function(name) {
    min[name] = {
      src: 'src/javascripts/jquery.selectBoxIt.' + name + '.js',
      dest: 'src/javascripts/jquery.selectBoxIt.' + name + '.min.js'
    };
  });

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      minified: {
        src: ['src/javascripts/jquery.selectBoxIt.core.min.js', 'src/javascripts/jquery.selectBoxIt.ariaAccessibility.min.js', 'src/javascripts/jquery.selectBoxIt.disable.min.js', 'src/javascripts/jquery.selectBoxIt.dynamicPositioning.min.js', 'src/javascripts/jquery.selectBoxIt.enable.min.js', 'src/javascripts/jquery.selectBoxIt.keyboardNavigation.min.js', 'src/javascripts/jquery.selectBoxIt.keyboardSearch.min.js', 'src/javascripts/jquery.selectBoxIt.mobile.min.js', 'src/javascripts/jquery.selectBoxIt.selectOption.min.js', 'src/javascripts/jquery.selectBoxIt.setOption.min.js', 'src/javascripts/jquery.selectBoxIt.setOptions.min.js', 'src/javascripts/jquery.selectBoxIt.wait.min.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.min.js'
      },
      unminified: {
        src: ['src/javascripts/jquery.selectBoxIt.core.js', 'src/javascripts/jquery.selectBoxIt.ariaAccessibility.js', 'src/javascripts/jquery.selectBoxIt.disable.js', 'src/javascripts/jquery.selectBoxIt.dynamicPositioning.js', 'src/javascripts/jquery.selectBoxIt.enable.js', 'src/javascripts/jquery.selectBoxIt.keyboardNavigation.js', 'src/javascripts/jquery.selectBoxIt.keyboardSearch.js', 'src/javascripts/jquery.selectBoxIt.mobile.js', 'src/javascripts/jquery.selectBoxIt.selectOption.js', 'src/javascripts/jquery.selectBoxIt.setOption.js', 'src/javascripts/jquery.selectBoxIt.setOptions.js', 'src/javascripts/jquery.selectBoxIt.wait.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.js'
      }
    },

    min: min,

    jasmine: {
      all: {
        src:['test/SpecRunner.html'],
        timeout: 150000 //in milliseconds
      }
    },
    lint: {
      files: ['grunt.js','src/javascripts/jquery.selectBoxIt.ariaAccessibility.js', 'src/javascripts/jquery.selectBoxIt.core.js', 'src/javascripts/jquery.selectBoxIt.disable.js', 'src/javascripts/jquery.selectBoxIt.dynamicPositioning.js', 'src/javascripts/jquery.selectBoxIt.enable.js', 'src/javascripts/jquery.selectBoxIt.keyboardNavigation.js', 'src/javascripts/jquery.selectBoxIt.keyboardSearch.js', 'src/javascripts/jquery.selectBoxIt.mobile.js', 'src/javascripts/jquery.selectBoxIt.selectOption.js', 'src/javascripts/jquery.selectBoxIt.setOption.js', 'src/javascripts/jquery.selectBoxIt.setOptions.js', 'src/javascripts/jquery.selectBoxIt.wait.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-jasmine-task');

  // Default task.
  grunt.registerTask('default', 'lint jasmine min concat');

  // Travis CI task.
  grunt.registerTask('travis', 'lint jasmine');

};