"use strict";



module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // jshint: {
        //     files: ["*.js", "public/libs/earth/**/*.js"],
        //     options: {
        //         // ignores: [""],
        //         globals: {
        //             Buffer: false,
        //             console: false,
        //             exports: false,
        //             module: false,
        //             process: false,
        //             require: false,
        //             __dirname: false
        //         },
        //         globalstrict: true
        //     }
        // },
        sass: {                              // Task
            dist: {                            // Target
                // options: {                       // Target options
                //     style: 'expanded'
                // },
                files: {                         // Dictionary of files
                    'public/styles/styles.css': 'public/styles/scss/main.scss',       // 'destination': 'source'
                }
            }
        }
    });

    // Load the plugin that provides the "jshint" task.
    // grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task(s).
    grunt.registerTask("default", ["sass"]);

};
