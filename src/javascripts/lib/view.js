

var _ = require('lodash');
var Radio = require('backbone.radio');
var Backbone = require('backbone');


module.exports = Backbone.View.extend({


  /**
   * Connect to channels.
   */
  constructor: function() {

    // Connect to channels.
    var channels = {};
    _.each(this.channels, _.bind(function(name) {
      channels[name] = Radio.channel(name);
    }, this));

    // Replace the array.
    this.channels = channels;
    Backbone.View.apply(this, arguments);

  }


});
