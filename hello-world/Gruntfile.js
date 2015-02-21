module.exports = function(grunt) {
    var folderMount = function(connect, point) {
        return connect.static(path.resolve(point + '/style-guide/'));
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            default: {
                options: {
                    port: 8020,
                    hostname: '0.0.0.0'
                    // ,
                    // middleware: function(connect, options) {
                    //     return connect.static(path.resolve(point + '/style-guide/'));
                    // }
                }
            }
        },
        watch: {
            files: [
                '**/*.html',
                '**/*.js',
                // except these
                '!Gruntfile.js',
                '!node_modules/**/*'
            ],
            tasks: []
        },
        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['**/*.jsx'],
                        dest: 'build/jsx',
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
                src: ['build/jsx/**/*.js'],
                dest: 'dist/<%= pkg.name %>-components.js'
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
                cwd: 'dist'
            }
        },
    });

    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsmin-sourcemap');

    grunt.registerTask('default', ['connect', 'react', 'concat', 'jsmin-sourcemap', 'watch']);

};