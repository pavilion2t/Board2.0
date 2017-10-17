'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('jit-grunt')(grunt, {
    replace: 'grunt-text-replace',
    useminPrepare: 'grunt-usemin',
    nggettext_extract: 'grunt-angular-gettext',
    nggettext_compile: 'grunt-angular-gettext',
  });

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= config.app %>/app.js', '<%= config.app %>/modules/**/*.js', '<%= config.app %>/shared/**/*.js'],
        options: {
          livereload: true
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/**/*.css'],
        tasks: ['autoprefixer']
      },
      styles_sass: {
        files: ['<%= config.app %>/**/*.scss'],
        tasks: ['sass']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/**/*.html',
          '<%= config.app %>/{,*/}*.html',
          '<%= config.app %>/styles/**/*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // The actual grunt serve settings
    connect: {
      options: {
        port: 8000,
        open: true,
        // Change this to '0.0.0.0' to access the serve from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/lang', connect.static('./lang')),
              connect.static(config.app)
            ];
          }
        }
      },

      test: {
        options: {
          port: 8001,
          middleware: function(connect) {
            return [
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/lang', connect.static('./lang')),
              connect.static(config.app)
            ];
          }
        }
      },
      staging: {
        options: {
          open: false,
          port: 8001,
          livereload: true,
          middleware: function(connect) {
            return [
              modRewrite(['^[^\\.]*$ /index.html [L]']),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/lang', connect.static('./lang')),
              connect.static(config.app)
            ];
          }
        }
      },
      production: {
        options: {
          open: false,
          port: 8008,
          middleware: function(connect) {
            return [
              modRewrite(['^[^\\.]*$ /index.html [L]']),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/lang', connect.static('./lang')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          port: 8001,
          livereload: false
        }
      }
    },

    babel: {
      options: { blacklist: ["strict"] }, // TODO find the bug cause error in strict
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['shared/app.js', 'shared/**/*.js', 'modules/**/*.js'],
          dest: "<%= config.tmp %>",
        }]
      },
      build: {
        files: {
          '.tmp/concat/scripts/main.js': '.tmp/concat/scripts/main.js'
        }
      }

    },

    // Empties folders to start fresh
    clean: {
      options: {
        force: true
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      instrumented: {
        files: [{
          dot: true,
          src: [
            'instrumented/*',
            '!instrumented/.git*'
          ]
        }]
      },
      tmp: {
        src: ['<%= config.tmp %>']
      }
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    //sass
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.scss'],
          dest: '<%= config.app %>/',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/',
          src: '*.css',
          dest: '<%= config.app %>/'
        }]
      }
    },

    uglify: {
      options: {
        mangle: false
      }
    },
    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/**/*.js',
            '<%= config.dist %>/styles/**/*.css',
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images'],
        patterns:{
          html:[
            [/<img[^\>]*[^\>\S]+srcset=['"]([^"']+)["']/gm,'Update the HTML with the new img filenames'],
            [/<img[^\>]*[^\>\S]+src=['"]([^"']+)["']/gm,'Update the HTML with the new img filenames'],
            [/<link[^\>]*[^\>\S]+href=['"]([^"']+)["']/gm,'Update the HTML with the new css filenames'],
            [/<script[^\>]*[^\>\S]+src=['"]([^"']+)["']/gm,'Update the HTML with the new script filenames'],
            [/<meta[^\>]+content=['"]([^"']+)["']/gm,'Update the HTML with the new meta filenames'],
            [/(img_404\.png)/, 'Replacing reference to image.png'],
            [/(img_403\.png)/, 'Replacing reference to image.png'],
            [/(img_500\.png)/, 'Replacing reference to image.png'],
            [/(img_503\.png)/, 'Replacing reference to image.png']
          ]
        }
      },
      html: ['<%= config.dist %>/**/*.html'],
      css: ['<%= config.dist %>/**/*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '**/*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '**/*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.webp',
            '**/*.html',
            'assets/**/*.*',
            'lib/markerclusterer.js',
            'lib/richmarker.js',
            'lib/ckeditor/**/*.*'
          ],
          dest: '<%= config.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/font-awesome',
          src: ['fonts/*.*'],
          dest: '<%= config.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/angular-ui-grid',
          src: ['ui-grid.woff', 'ui-grid.ttf', 'ui-grid.eot'],
          dest: '<%= config.dist %>/styles'
        }]
      },

      test: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          src: [
            '**/*.*', '!**/*.js'
          ],
          dest: 'instrumented/app'
        },{
          expand: true,
          dot: true,
          cwd: 'bower_components',
          src: [
            '**/*.*'
          ],
          dest: 'instrumented/app/bower_components'
        }]
      }
    },
    githash: {
      main: {
        options: {},
      }
    },
    replace: {

      index: {
        src: ['app/index.html'],
        overwrite: true,
        replacements: [
          {from:'<!--@index only@',to:''},
          {from:'@index only@-->',to:''}
        ]
      },
      prod: {
        src: ['app/index.html'],
        overwrite: true,
        replacements: [
          {from:'<!--@prod only@',to:''},
          {from:'@prod only@-->',to:''},
          {from:'<body class="development">',to:'<body class="production">'}
        ]
      },
      staging: {
        src: ['app/index.html'],
        overwrite: true,
        replacements: [
          {from:'<!--@staging only@',to:''},
          {from:'@staging only@-->',to:''},
          {from:'<body class="development">',to:'<body class="staging">'}
        ]
      },
      demo :{
        src: ['app/demo.html'],
        overwrite: true,
        replacements: [
          {from:'<!--@demo only@',to:''},
          {from:'@demo only@-->',to:''}
        ]
      },
      imagepath :{
        src: ['dist/styles/main.css'],
        overwrite: true,
        replacements: [
          {from:'background-image:url(images/',to:'background-image:url(../images/'}
        ]
      },
      git: {
        src: ['<%= config.dist %>/index.html'],
        overwrite: true,
        replacements: [
          {
            from: '<base href="/" />',
            to: '<base href="/<%= githash.main.branch %>/" />'
          }
        ]
      }
    },
    includeSource: {
      options: {
        basePath: 'app',
        baseUrl: 'app'
      },
      includeSource_dev: {
        files: {
          'app/index.html': 'app/index.tmpl.html'
        }
      },
      includeSource_demo: {
        files: {
          'app/demo.html': 'app/index.tmpl.html'
        }
      }
    },

    exec: {
      webdriverupdate : 'node node_modules/protractor/bin/webdriver-manager update'
    },
    protractor_webdriver: {
      start: {
        options: {
        },
      },
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      dist: [
        'imagemin',
        'svgmin'
      ]
    },

    nggettext_extract: {
      pot: {
        files: {
          "src/lang/template.pot": ["src/app/**/*.html", "app/**/*.js"]
        }
      }
    },
    nggettext_compile: {
      all: {
        files: {
          "src/lang/translations.js": ["src/lang/*.po"]
        }
      }
    },
    protractor: {
      options: {
        configFile: "test/protractor/config.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      all: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
        options: {
          configFile: "test/protractor/config.js", // Target-specific config file
          keepAlive: false, // If false, the grunt process stops when the test fails.
          // args: {} // Target-specific arguments
        }
      },
    },

    instrument: {
      files: 'app/**/*.js',
      options: {
        lazy: true,
        basePath: "instrumented/"
      }
    },
    makeReport: {
      src: 'instrumented/*.json',
      options: {
        type: 'html',
        dir: 'instrumented/app/reports',
        print: 'detail'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      },
      build: {
        files: {
          '.tmp/concat/scripts/main.js': '.tmp/concat/scripts/main.js'
        }
      }
    },

    jshint: {
      options: {
        "asi": true,
        "browser": true,
        "esnext": true,
        "undef": true,
        "eqeqeq": false,

        "sub": true,
        "laxbreak": true,
        "smarttabs": true,
        "shadow": true,

        "-W099": false,  // disable: Mixed spaces and tabs.

        globals: {
          "$":        true,
          "_":        true,
          "app":      true,
          "Slick":    true,
          "slidr":    true,
          "moment":   true,
          "angular":  true,
          "google":   true,
          "validate":   true,
          "RichMarker": true,
          "console":  true,
          "confirm":  true,
          "alert":  true,
          "jsPDF": true,
          "jsPDFExtend": true,
          "DASHBOARD": true,
          "CKEDITOR": true,
          "BigNumber": true,
          "Papa": true,
          "JSZip": true,
          "w3color": true
        }
      },
      dist: {
        files: {
          src: ['<%= config.app %>/app.js', '<%= config.app %>/modules/**/*.js', '<%= config.app %>/shared/**/*.js'],
        },
      }
    },
  });
  // Full end to end test task
  grunt.registerTask('protest', function (target) {
    return grunt.task.run([
      'exec:webdriverupdate',
      'protractor_webdriver:start',
      // 'includeSource:includeSource_dev',
      // 'includeSource:includeSource_demo',
      // 'replace:index',
      // 'replace:demo',
      // 'sass',
      // 'autoprefixer',
      // 'connect:staging',
      'protractor'
    ]);
  });

  // Start local server
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['connect:dist:keepalive']);


    } else if(target === 'production') {
      return grunt.task.run([
        'includeSource:includeSource_dev',
        'includeSource:includeSource_demo',
        'replace:index',
        'replace:prod',
        'replace:demo',
        'sass',
        'autoprefixer',
        'connect:production',
        'watch'
      ]);

    } else if(target === 'staging') {
      return grunt.task.run([
        'includeSource:includeSource_dev',
        'includeSource:includeSource_demo',
        'replace:index',
        'replace:demo',
        'sass',
        'autoprefixer',
        'connect:staging',
        'watch'
      ]);

    } else {
      return grunt.task.run([
        'includeSource:includeSource_dev',
        'includeSource:includeSource_demo',
        'replace:index',
        'replace:demo',
        'sass',
        'autoprefixer',
        'connect:livereload',
        'watch'
      ]);
    }
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test',
      'karma'
    ]);
  });

  grunt.registerTask('test:unit', [
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('test:e2e', [
    'livereload-start',
    'connect:livereload',
    'karma:e2e'
  ]);


  // useminPrepare will generate concat, cssmin, uglify's config
  grunt.registerTask('build', [
    'jshint:dist',
    'clean:dist',
    'includeSource:includeSource_dev',
    'replace:index',
    'replace:staging',
    'sass',
    'autoprefixer',
    'concurrent:dist',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'replace:imagepath',
    'ngAnnotate:build',
    'babel:build',
    'uglify:generated',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin',
    'clean:tmp'
  ]);

  grunt.registerTask('build:prod', [
    'jshint:dist',
    'clean:dist',
    'includeSource:includeSource_dev',
    'replace:index',
    'replace:prod',
    'sass',
    'autoprefixer',
    'concurrent:dist',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'replace:imagepath',
    'ngAnnotate:build',
    'babel:build',
    'uglify:generated',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin',
    'clean:tmp'
  ]);

  grunt.registerTask('translate', function (action) {
    if(action==="pot") {
      grunt.task.run(['nggettext_extract']);
    }
    if(action==="po") {
      grunt.task.run(['nggettext_compile']);
    }
  });
  grunt.registerTask('default', [
    'serve:staging'
  ]);
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-githash');
};
