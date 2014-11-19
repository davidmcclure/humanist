

var Backbone = require('backbone');
var Radio = require('backbone.radio');


module.exports = Backbone.Router.extend({


  routes: {
    ':x/:y/:z': 'xyz',
    ':word': 'word'
  },


  /**
   * Get channel references, start history.
   */
  initialize: function() {

    this.channels = {
      router: Radio.channel('router'),
      global: Radio.channel('global')
    }

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
    this.channels.router.trigger('xyz', {
      x: Number(x), y: Number(y), z: Number(z)
    });
  },


  /**
   * Focus on a word.
   *
   * @param {String} word
   */
  word: function(word) {
    this.channels.global.trigger('select', word);
  }


});
