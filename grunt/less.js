

module.exports = {

  options: {
    paths: 'node_modules',
    sourceMap: true,
    sourceMapBasepath: '<%= site %>',
    sourceMapRootpath: '..'
  },

  dist: {
    src: 'src/stylesheets/index.less',
    dest: '<%= site %>/style.css'
  }

};
