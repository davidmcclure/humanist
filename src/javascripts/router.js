

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var View = require('./view');


module.exports = Backbone.Router.extend({


  routes: {
    ':x/:y/:z': 'xyz'
  },


  /**
   * Load the data file, inistantiate the view.
   */
  initialize: function() {

    // Query for the JSON data.
    $.getJSON('data.json', _.bind(function(data) {

      // Start the view.
      this.view = new View({ data: data });
      window.view = this.view;

    }, this));

  },


  /**
   * Focus on an XYZ location.
   *
   * @param {String} x
   * @param {String} y
   * @param {String} z
   */
  xyz: function(x, y, z) {
    this.view.applyXYZ(Number(x), Number(y), Number(z));
  }


});
