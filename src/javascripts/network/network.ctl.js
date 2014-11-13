

var Controller = require('radio.controller');
var Network = require('./network.view');


module.exports = Controller.extend({


  events: {

    minimap: {
      highlight: 'highlight',
      unhighlight: 'unhighlight',
      center: 'minimapFocus'
    },

    search: {
      select: 'select'
    },

    router: {
      word: 'select',
      xyz: 'routerFocus'
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
   * Render selections.
   *
   * @param {String} label
   */
  select: function(label) {
    this.view.publishSelect(label);
    this.view.focusOnWord(label, true);
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
   * Apply a :x/:y/:z route.
   *
   * @param {Object} center
   */
  routerFocus: function(center) {
    this.view.focusOnXYZ(center, true);
  }


});
