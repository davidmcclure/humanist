

var Controller = require('radio.controller');
var Minimap = require('./minimap.view');


module.exports = Controller.extend({


  radio: {

    network: {
      events: [
        'move',
        'highlight',
        'unhighlight',
        'select',
        'unselect'
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
   * @param {String} cid
   */
  move: function(extent, cid) {
    if (cid != this.view.cid) {
      this.view.renderExtent(extent);
    }
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
   * Render unhighlights.
   *
   * @param {String} label
   * @param {String} cid
   */
  select: function(label, cid) {
    if (cid != this.view.cid) {
      this.view.select(label);
    }
  },


  /**
   * Render unselects.
   *
   * @param {String} cid
   */
  unselect: function(label, cid) {
    if (cid != this.view.cid) {
      this.view.unselect();
    }
  },


});
