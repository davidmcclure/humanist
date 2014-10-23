

var Controller = require('radio.controller');
var Network = require('./network.view');


module.exports = Controller.extend({


  radio: {

    minimap: {
      events: [
        'highlight',
        'unhighlight',
        'focus'
      ]
    }

  },


  /**
   * Start the view.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.view = new Network(options);
    window.view = this.view;
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
   * Apply a new focus position.
   *
   * @param {Object} center
   * @param {Boolean} animate
   */
  focus: function(center, animate) {
    this.view.focusOnXYZ(center, animate);
  }


});
