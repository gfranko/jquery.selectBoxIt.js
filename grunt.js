/*global module:false*/
module.exports = function(grunt) {

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
      unminified: {
        src: ['src/javascripts/jquery.selectBoxIt.core.js', 'src/javascripts/jquery.selectBoxIt.ariaAccessibility.js', 'src/javascripts/jquery.selectBoxIt.copyAttributes.js', 'src/javascripts/jquery.selectBoxIt.destroy.js', 'src/javascripts/jquery.selectBoxIt.disable.js', 'src/javascripts/jquery.selectBoxIt.dynamicPositioning.js', 'src/javascripts/jquery.selectBoxIt.enable.js', 'src/javascripts/jquery.selectBoxIt.keyboardNavigation.js', 'src/javascripts/jquery.selectBoxIt.keyboardSearch.js', 'src/javascripts/jquery.selectBoxIt.mobile.js', 'src/javascripts/jquery.selectBoxIt.selectOption.js', 'src/javascripts/jquery.selectBoxIt.setOption.js', 'src/javascripts/jquery.selectBoxIt.setOptions.js', 'src/javascripts/jquery.selectBoxIt.wait.js', 'src/javascripts/jquery.selectBoxIt.endClosure.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.js'
      }
    },

    min: {
      dist: {
        src: ['<banner:meta.banner>','src/javascripts/jquery.selectBoxIt.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.min.js'
      }
    },

    jasmine: {
      all: {
        src:['test/SpecRunner.html'],
        timeout: 150000 //in milliseconds
      }
    },
    lint: {
      files: ['grunt.js','src/javascripts/jquery.selectBoxIt.js']
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
    uglify: {
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-task');

  // Default task.
  grunt.registerTask('default', 'concat lint min jasmine');

  // Travis CI task.
  grunt.registerTask('travis', 'lint jasmine');

};