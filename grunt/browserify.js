

module.exports = {

  options: {
    transform: [['jstify', { engine: 'lodash' }]],
    watch: true,
    browserifyOptions: {
      debug: true
    }
  },

  dist: {
    src: 'src/javascripts/index.js',
    dest: '<%= site %>/script.js'
  }

};
