

module.exports = {

  livereload: {
    files: '_site/*',
    options: { livereload: true }
  },

  jade: {
    files: 'index.jade',
    tasks: 'jade'
  },

  less: {
    files: 'src/**/*.less',
    tasks: 'less'
  }

};
