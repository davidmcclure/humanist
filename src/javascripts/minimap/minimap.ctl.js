

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
   * Render highlights.
   *
   * @param {String} label
   * @param {String} cid
   */
  highlight: function(label, cid) {
    if (cid != this.view.cid) {
      this.view.highlight(label);
    }
  },


  /**
   * Render unhighlights.
   *
   * @param {String} label
   * @param {String} cid
   */
  unhighlight: function(label, cid) {
    if (cid != this.view.cid) {
      this.view.unhighlight(label);
    }
  },


  /**
   * Update the extent preview.
   *
   * @param {String} cid
   */
  move: function(extent, cid) {
    if (cid != this.view.cid) {
      this.view.renderExtent(extent);
    }
  }


});
