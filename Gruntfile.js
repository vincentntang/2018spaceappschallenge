"use strict";

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concurrent: {
            dev: [
                // 'jshint',
                'watch'
            ],
            options: {
                logConcurrentOutput: true
            }
        },
        sass: {
          dist: {
            files: {
              'public/styles/styles.css': 'public/styles/scss/main.scss'
            }
          }
        },
        watch: {
            files: ["**/*.js", "**/*.html", "**/*.scss"],
            tasks: [
                // 'jshint',
                'sass',
            ]
        }
    });
    
    // grunt.loadNpmTasks('grunt-concurrent');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.event.on('watch', function(action, filepath, target) {
      grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    // Default task(s).
    grunt.registerTask("default", [ "sass", "watch"]);

    grunt.loadNpmTasks('grunt-browser-sync');
};
