module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/javascripts/jquery.selectBoxIt.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        },
        sub: true
      }
    },
    concat: {
      dist: {
        src: ['src/javascripts/jquery.selectBoxIt.core.js', 'src/javascripts/jquery.selectBoxIt.add.js', 'src/javascripts/jquery.selectBoxIt.ariaAccessibility.js', 'src/javascripts/jquery.selectBoxIt.copyAttributes.js', 'src/javascripts/jquery.selectBoxIt.destroy.js', 'src/javascripts/jquery.selectBoxIt.disable.js', 'src/javascripts/jquery.selectBoxIt.dynamicPositioning.js', 'src/javascripts/jquery.selectBoxIt.enable.js', 'src/javascripts/jquery.selectBoxIt.keyboardNavigation.js', 'src/javascripts/jquery.selectBoxIt.keyboardSearch.js', 'src/javascripts/jquery.selectBoxIt.mobile.js', 'src/javascripts/jquery.selectBoxIt.remove.js', 'src/javascripts/jquery.selectBoxIt.selectOption.js', 'src/javascripts/jquery.selectBoxIt.setOption.js', 'src/javascripts/jquery.selectBoxIt.setOptions.js', 'src/javascripts/jquery.selectBoxIt.wait.js', 'src/javascripts/jquery.selectBoxIt.endClosure.js'],
        dest: 'src/javascripts/jquery.selectBoxIt.js'
      }
    },
    uglify: {
      my_target: {
        files: {
          'src/javascripts/jquery.selectBoxIt.min.js': ['src/javascripts/jquery.selectBoxIt.js']
        }
      },
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
        '<%= pkg.homepage ? "* " + pkg.homepage : "" %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>*/\n'
      }
    },
  jasmine: {
    customRunner: {
      src: 'src/javascripts/jquery.selectBoxIt.js',
      options: {
        specs: 'test/spec/selectBoxItSpec.js',
        helpers: ['libs/jquery/jquery.js', 'libs/jqueryUI/jquery-ui.js', 'libs/jasmine/jasmine-jquery.js']
      }
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('test', ['concat', 'jshint', 'jasmine']);
  // Travis CI task.
  grunt.registerTask('travis', 'test');
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['test', 'build']);

};