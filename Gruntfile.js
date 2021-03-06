module.exports = grunt => {

  const isDev = process.env.NODE_ENV !== 'production'
    ? true
    : false

  const files = {
    clientJs: [
      [ 'client/js/**/*.js', 'common/js/**/*.js', 'client/_build/tags.js' ],
      'client/_build/bundle.js'
    ],
    serverJs: [ [ 'server/**/*.js' ] ],
    css: [
      [ 'client/css/*.css' ],
      'client/_build/bundle.css'
    ],
    tags: [
      [ 'client/tags/**/*.tag' ],
      'client/_build/tags.js'
    ]
  }

  grunt.initConfig({
    watch: {
      css: {
        files: files.css[0],
        tasks: ['postcss']
      },
      clientJs: {
        files: files.clientJs[0],
        tasks: ['browserify', 'standard']
      },
      serverJs: {
        files: files.serverJs[0],
        tasks: ['standard']
      },
      tags: {
        files: files.tags[0],
        tasks: ['riot']
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    riot: {
      options: {
        concat: true
      },
      dist: {
        src: files.tags[0],
        dest: files.tags[1]
      }
    },

    browserify: {
      options: {
        transform: [
          [ 'babelify', { presets: 'es2015' } ],
        ],
        browserifyOptions: {
          debug: isDev
        }
      },
      dist: { files: { [ files.clientJs[1] ]: files.clientJs[0] } }
    },

    uglify: {
      dist: { files: { [ files.clientJs[1] ]: files.clientJs[1] } }
    },

    standard: {
      dist: { src: files.clientJs[0].slice(0, -1).concat(files.serverJs[0]) }
    },

    postcss: {
      options: {
        map: isDev,
        processors: [
          require('level4')(),
          require('postcss-import')(),
          require('autoprefixer')(),
          require('cssnano')()
        ]
      },
      dist: { dest: files.css[1], src: files.css[0] }
    }
  })

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-standard');
  grunt.loadNpmTasks('grunt-riot');
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['postcss', 'browserify', 'riot', 'watch']);
  grunt.registerTask('build', ['postcss', 'browserify', 'riot', 'uglify']);
}

