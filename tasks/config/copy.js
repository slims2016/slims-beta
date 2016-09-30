/**
 * `copy`
 *
 * ---------------------------------------------------------------
 *
 * Copy files and/or folders from your `assets/` directory into
 * the web root (`.tmp/public`) so they can be served via HTTP,
 * and also for further pre-processing by other Grunt tasks.
 *
 * #### Normal usage (`sails lift`)
 * Copies all directories and files (except CoffeeScript and LESS)
 * from the `assets/` folder into the web root -- conventionally a
 * hidden directory located `.tmp/public`.
 *
 * #### Via the `build` tasklist (`sails www`)
 * Copies all directories and files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-copy
 *
 */
module.exports = function(grunt) {

  grunt.config.set('copy', {
    dev: {
      files: [{
        expand: true,
        cwd: './assets',
        src: ['**/*.!(coffee|less)'],
        dest: '.tmp/public'
      }]
    },
    build: {
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['**/*'],
        dest: 'www'
      }]
    },
    jsDeps: {
      files: [{
        '.tmp/public/js/dependencies/angular.js': 'bower_components/angular/angular.js',
        '.tmp/public/js/dependencies/angular-ui-router.js': 'bower_components/angular-ui-router/release/angular-ui-router.js',
        '.tmp/public/js/dependencies/angular-resource.js': 'bower_components/angular-resource/angular-resource.js',
        '.tmp/public/js/dependencies/angular-permission.js': 'bower_components/angular-permission/dist/angular-permission.js',
        '.tmp/public/js/dependencies/angular-permission-ui.js': 'bower_components/angular-permission/dist/angular-permission-ui.js',
        '.tmp/public/js/dependencies/angular-animate.js': 'bower_components/angular-animate/angular-animate.js',
        '.tmp/public/js/dependencies/angular-aria.js': 'bower_components/angular-aria/angular-aria.js',
        '.tmp/public/js/dependencies/angular-messages.js': 'bower_components/angular-messages/angular-messages.js',
        '.tmp/public/js/dependencies/angular-material.js': 'bower_components/angular-material/angular-material.js',
        '.tmp/public/js/dependencies/md-data-table.js': 'bower_components/angular-material-data-table/dist/md-data-table.js',
        '.tmp/public/js/dependencies/fixed-table-header.js': 'bower_components/angular-fixed-table-header/src/fixed-table-header.js',
        '.tmp/public/js/dependencies/http-auth-interceptor.js': 'bower_components/angular-http-auth/src/http-auth-interceptor.js',
        '.tmp/public/js/dependencies/jquery.js': 'bower_components/jquery/jquery.js'
      }]
    },
    cssDeps: {
      files: [{
        '.tmp/public/styles/angular-material/angular-material.css': 'bower_components/angular-material/angular-material.css',
        '.tmp/public/styles/angular-material-data-table/md-data-table.css': 'bower_components/angular-material-data-table/dist/md-data-table.css'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};
