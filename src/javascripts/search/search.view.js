

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');

// Hack to get Typeahead working.
window.jQuery = $;
require('typeahead.js');


module.exports = Backbone.View.extend({


  /**
   * TODO|dev
   */
  initialize: function(options) {
    console.log('search');
  }


});
