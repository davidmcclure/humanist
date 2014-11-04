

var Controller = require('radio.controller');
var Network = require('./network.view');


module.exports = Controller.extend({


  events: {

    minimap: {
      highlight: 'highlight',
      unhighlight: 'unhighlight',
      center: 'focusOnXYZ'
    },

    router: {
      xyz: 'focusOnXYZ'
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
   * Apply an X/Y/Z focus.
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  focusOnXYZ: function(center, animate) {
    this.view.focusOnXYZ(center, animate);
  }


});
