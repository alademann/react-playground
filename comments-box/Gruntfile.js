module.exports = function(grunt) {
    var demoFolderMount = function folderMount(connect, point) {
        var path = require('path');
        return connect.static(path.resolve(point + '/public/'));
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // connect: {
        //     default: {
        //         options: {
        //             port: 8020,
        //             hostname: '0.0.0.0',
        //             middleware: function(connect, options) {
        //                 return [demoFolderMount(connect, options.base)];
        //             }
        //         }
        //     }
        // },
        express: {
            options: {
                // Override defaults here
            },
            web: {
                options: {
                    script: 'server.js',
                }
            },
        },
        watch: {
            files: [
                'public/src/**/*.html',
                'public/src/**/*.jsx',
                'public/src/**/*.js',
            ],
            tasks: []
        },
        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/src/scripts',
                        src: ['**/*.jsx'],
                        dest: 'public/build/jsx',
                        ext: '.js'
                    }
                ]
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/build/jsx/**/*.js'],
                dest: 'public/dist/<%= pkg.name %>-components.js'
            }
        },
        'jsmin-sourcemap': {
            // options: {
            //     banner: '/*! \n * <%= pkg.name %> Components \n\n * <%= grunt.template.today("dd-mm-yyyy") %> \n */\n'
            // },
            dist: {
                // Source files to concatenate and minify (also accepts a string and minimatch items)
                src: ['<%= pkg.name %>-components.js'],
                // Destination for concatenated/minified JavaScript
                dest: '<%= pkg.name %>-components.min.js',
                // Destination for sourcemap of minified JavaScript
                destMap: '<%= pkg.name %>-components.min.js.map',
                cwd: 'public/dist'
            }
        },
    });

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsmin-sourcemap');

    grunt.registerTask('default', ['express', 'react', 'concat', 'watch']);

};