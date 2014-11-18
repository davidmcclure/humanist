

var Backbone = require('backbone');
var Radio = require('backbone.radio');


module.exports = Backbone.Router.extend({


  routes: {
    ':x/:y/:z': 'xyz',
    ':word': 'word'
  },


  /**
   * Initialize channel, start history.
   */
  initialize: function() {

    this.radio = {
      global: Radio.channel('global'),
      router: Radio.channel('router')
    };

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
    this.radio.router.trigger('xyz', {
      x: Number(x), y: Number(y), z: Number(z)
    });
  },


  /**
   * Focus on a word.
   *
   * @param {String} word
   */
  word: function(word) {
    this.radio.global.trigger('select', word);
  }


});
