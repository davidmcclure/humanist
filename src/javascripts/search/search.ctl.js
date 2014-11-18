

var $ = require('jquery');
var Controller = require('radio.controller');
var Search = require('./search.view');


module.exports = Controller.extend({


  events: {

    global: {
      select: 'select',
      unselect: 'unselect'
    }

  },


  /**
   * Start the view.
   *
   * @param {Object} data
   */
  initialize: function(data) {
    this.view = new Search(data);
  },


  /**
   * Render a selection.
   *
   * @param {String} label
   */
  select: function(label) {
    this.view.renderSelect(label);
  },


  /**
   * Clear the input.
   */
  unselect: function() {
    this.view.renderUnselect();
  }


});
