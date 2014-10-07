

module.exports = {

  options: {
    transform: [require('grunt-react').browserify],
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
