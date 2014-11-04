

var Controller = require('radio.controller');
var Timeline = require('./timeline.view');


module.exports = Controller.extend({


  events: {
    network: {
      extent: 'focus'
    }
  },


  /**
   * Start the view.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.view = new Timeline(options);
  },


  /**
   * Update the date interval.
   *
   * @param {String} cid
   */
  focus: function(extent, cid) {
    this.view.renderExtent(extent);
  }


});
