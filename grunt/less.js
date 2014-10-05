

module.exports = {

  options: {
    paths: 'node_modules',
    sourceMap: true,
    sourceMapBasepath: '_site',
    sourceMapRootpath: '..'
  },

  dist: {
    src: 'src/stylesheets/index.less',
    dest: '_site/style.css'
  }

};
