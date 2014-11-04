

var Controller = require('radio.controller');
var Network = require('./network.view');


module.exports = Controller.extend({


  events: {

    minimap: {
      highlight: 'highlight',
      unhighlight: 'unhighlight',
      center: 'minimapFocus'
    },

    router: {
      word: 'routerFocusWord',
      xyz: 'routerFocusXYZ'
    }

  },


  /**
   * Start the view.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.view = new Network(options);
  },


  /**
   * Render highlights.
   *
   * @param {String} label
   */
  highlight: function(label) {
    this.view.renderHighlight(label);
  },


  /**
   * Render unhighlights.
   */
  unhighlight: function() {
    this.view.renderUnhighlight();
  },


  /**
   * Mirror the minimap position.
   *
   * @param {Object} center
   */
  minimapFocus: function(center, animate) {
    this.view.focusOnXYZ(center, animate);
  },


  /**
   * Apply a :word route.
   *
   * @param {String} word
   */
  routerFocusWord: function(word) {
    this.view.publishSelect(word);
    this.view.focusOnWord(word, true);
  },


  /**
   * Apply a :x/:y/:z route.
   *
   * @param {Object} center
   */
  routerFocusXYZ: function(center) {
    this.view.focusOnXYZ(center, true);
  }


});
