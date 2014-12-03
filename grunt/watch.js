

module.exports = {

  livereload: {
    files: '<%= site %>/*',
    options: { livereload: true }
  },

  templates: {
    files: ['src/templates/*'],
    tasks: 'jade'
  },

  stylesheets: {
    files: 'src/**/*.less',
    tasks: 'less'
  }

};
