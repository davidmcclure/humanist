

module.exports = {

  options: {
    transform: [require('grunt-react').browserify],
    watch: true
  },

  dist: {
    src: 'src/javascripts/index.js',
    dest: '_site/script.js'
  }

};
