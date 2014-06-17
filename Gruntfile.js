module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    
    // jekyll: {
    //     options: {
    //         bundleExec: true,
    //     },
    //     dev : {
    //         options: {
    //             serve: false,
    //             watch: false,
    //             src: '.',
    //             // server_port: 4000,
    //         }
    //     },
    // },

    compass: {
        dev: {
            options: {
                config: 'assets/config.rb',
                bundleExec: true,
                sassDir: 'assets/scss',
                cssDir: 'assets/stylesheets',
                require: [
                  'breakpoint',
                  'susy'
                ]
            }
        },
    },

    // connect: {
    //     server: {
    //         options: {
    //             hostname: 'localhost',
    //             port: 4000,
    //             base: '',
    //             livereload: true
    //         },
    //     }
    // },

    watch: {
        options: {
            livereload: true,
        },
        sass: {
            files: ['assets/scss/**/*.scss'],
            tasks: ['compass:dev']
        },
        js: {
            files: ['js/**/*.js'],
            tasks: ['jshint'],
        },
    },
    sassdown: {
      styleguide: {
        options: {
            assets: [],
            theme: '',
            template: '',
            readme: '',
            highlight: 'monokai',
            excludeMissing: true
        },
        files: [{
            expand: true,
            cwd: 'assets/sass/components/',
            src: [
              '*.scss',
            ],
            dest: '_site/styleguide/'
        }]
      }
    },
	});
  // Default task.
  grunt.registerTask('default', ['watch']);

  // Plugin tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-compass');
  // grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('sassdown');
};