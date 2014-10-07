

module.exports = {

  livereload: {
    files: '<%= site %>/*',
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
