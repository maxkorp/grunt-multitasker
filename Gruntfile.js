(function () {
  'use strict';

  module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var files = [
      'src/pre.js',
      'src/default-target.js',
      'src/register-multi.js',
      'src/post.js'
    ];

    grunt.initConfig({
      clean: ['dist'],
      concat: {
        default: {
          src: files,
          dest: 'dist/grunt-multitasker.js'
        }
      },
      jsbeautifier: {
        files: ['dist/grunt-multitasker.js'],
        options: {
          js: {
            braceStyle: 'end-expand',
            maxPreserveNewlines: 2,
            preserveNewlines: true,
            indentSize: 2,
            indentChar: ' ',
          }
        }
      },
      jshint: {
        source: ['Gruntfile.js', 'src/*.js', '!src/pre.js', '!src/post.js'],
        compiled: ['dist/grunt-multitasker.js']
      }
    });

    grunt.registerTask('default', ['clean', 'concat', 'jsbeautifier', 'jshint:compiled']);
  };
}());
