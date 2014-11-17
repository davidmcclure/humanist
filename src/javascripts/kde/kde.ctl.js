

var Controller = require('radio.controller');
var KDE = require('./kde.view');


module.exports = Controller.extend({


  events: {
    network: {
      select: 'select',
      unselect: 'unselect'
    }
  },


  /**
   * Start the view.
   */
  initialize: function() {
    this.view = new KDE();
  },


  /**
   * Show a term KDE.
   *
   * @param {String} label
   */
  select: function(label) {
    this.view.show(label);
  },


  /**
   * Hide the KDE.
   */
  unselect: function() {
    this.view.hide();
  }


});
