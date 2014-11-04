

var Controller = require('radio.controller');
var Minimap = require('./minimap.view');


module.exports = Controller.extend({


  events: {
    network: {
      highlight: 'highlight',
      unhighlight: 'unhighlight',
      extent: 'focus'
    }
  },


  /**
   * Start the view.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.view = new Minimap(options);
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
   *
   * @param {String} label
   */
  unhighlight: function(label) {
    this.view.renderUnhighlight(label);
  },


  /**
   * Update the extent preview.
   *
   * @param {Object} extent
   */
  focus: function(extent) {
    this.view.renderExtent(extent);
  }


});
