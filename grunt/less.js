

module.exports = {

  options: {
    paths: ['node_modules', 'bower_components'],
    sourceMap: true,
    sourceMapBasepath: '<%= site %>',
    sourceMapRootpath: '..'
  },

  dist: {
    src: 'src/stylesheets/index.less',
    dest: '<%= site %>/style.css'
  }

};
