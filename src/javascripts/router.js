

var Backbone = require('backbone');


module.exports = Backbone.Router.extend({


  routes: {
    ':x/:y/:z': 'xyz',
    ':word': 'word'
  },


  /**
   * Initialize channels.
   */
  initialize: function() {
    Backbone.history.start();
  },


  /**
   * Focus on an XYZ location.
   *
   * @param {String} x
   * @param {String} y
   * @param {String} z
   */
  xyz: function(x, y, z) {
    console.log(x, y, z);
  },


  /**
   * Focus on a word.
   *
   * @param {String} word
   */
  word: function(word) {
    console.log(word);
  }


});
