

var Controller = require('radio.controller');
var Minimap = require('./minimap.view');


module.exports = Controller.extend({


  radio: {

    network: {
      events: [
        'highlight',
        'unhighlight',
        'move'
      ]
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
   * Update the extent preview.
   *
   * @param {Object} extent
   */
  move: function(extent, cid) {
    this.view.renderExtent(extent);
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
  }


});
