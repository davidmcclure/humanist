

var $ = require('jquery');
var Controller = require('radio.controller');
var Search = require('./search.view');


module.exports = Controller.extend({


  /**
   * Start the view.
   *
   * @param {Object} data
   */
  initialize: function(data) {
    this.view = new Search(data);
  }


});
