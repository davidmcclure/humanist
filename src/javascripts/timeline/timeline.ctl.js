

var Controller = require('radio.controller');
var Timeline = require('./timeline.view');


module.exports = Controller.extend({


  radio: {

    network: {
      events: [
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
    this.view = new Timeline(options);
  },


  /**
   * Update the date interval.
   *
   * @param {String} cid
   */
  move: function(extent, cid) {
    if (cid != this.view.cid) {
      this.view.renderExtent(extent);
    }
  }


});
