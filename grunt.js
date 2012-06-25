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
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      accessibility: {
        src: ['src/javascripts/jquery.selectBoxIt.ariaAccessibility.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.ariaAccessibility.min.js'
      },
      disable: {
        src: ['src/javascripts/jquery.selectBoxIt.disable.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.disable.min.js'
      },
      enable: {
        src: ['src/javascripts/jquery.selectBoxIt.enable.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.enable.min.js'
      },
      destroy: {
        src: ['src/javascripts/jquery.selectBoxIt.destroy.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.destroy.min.js'
      },
      selectBoxIt: {
        src: ['src/javascripts/jquery.selectBoxIt.enable.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.enable.min.js'
      },
      setOption: {
        src: ['src/javascripts/jquery.selectBoxIt.setOption.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.setOption.min.js'
      },
      setOptions: {
        src: ['src/javascripts/jquery.selectBoxIt.setOptions.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.setOptions.min.js'
      },
      wait: {
        src: ['src/javascripts/jquery.selectBoxIt.wait.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.wait.min.js'
      }
    },
    jasmine: {
      all: {
        src:['test/SpecRunner.html'],
        timeout: 150000 //in milliseconds
      }
    },
    lint: {
      files: ['grunt.js', 'src/javascripts/jquery.selectBoxIt.js']
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
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-jasmine-task');
  
  // Default task.
  grunt.registerTask('default', 'lint jasmine min');

};
