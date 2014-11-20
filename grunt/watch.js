

module.exports = {

  livereload: {
    files: '<%= site %>/*',
    options: { livereload: true }
  },

  templates: {
    files: ['index.jade', 'content/*.md'],
    tasks: 'jade'
  },

  stylesheets: {
    files: 'src/**/*.less',
    tasks: 'less'
  }

};
