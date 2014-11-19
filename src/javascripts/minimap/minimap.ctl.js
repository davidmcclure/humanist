

var Controller = require('radio.controller');
var Minimap = require('./minimap.view');


module.exports = Controller.extend({


  events: {

    global: {
      highlight: 'highlight',
      select: 'select',
      unhighlight: 'unhighlight',
      unselect: 'unselect'
    },

    network: {
      extent: 'focus'
    }

  },


  /**
   * Start the view.
   *
   * @param {Object} data
   */
  initialize: function(data) {
    this.view = new Minimap(data);
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
   * Render selects.
   *
   * @param {String} label
   */
  select: function(label) {
    this.view.renderSelect(label);
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
   * Render unselects.
   *
   * @param {String} label
   */
  unselect: function() {
    this.view.renderUnselect();
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
