

var _ = require('lodash');
var Backbone = require('backbone');
var Radio = require('backbone.radio');
var d3 = require('d3-browserify');


module.exports = Backbone.View.extend({


  el: '#timeline',


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initRadio();
    this._initMarkup();
    this._initResize();

  },


  /**
   * Connect to event channels.
   */
  _initRadio: function() {

    this.radio = Radio.channel('network');

    // Draw line to date.
    this.radio.on('highlight', _.bind(function(label, cid) {
      // TODO
    }, this));

    // Remove date line.
    this.radio.on('unhighlight', _.bind(function(cid) {
      // TODO
    }, this));

    // Update the focus.
    this.radio.on('extent', _.bind(function(extent, cid) {
      // TODO
    }, this));

  },


  /**
   * Inject the top-level containers.
   */
  _initMarkup: function() {

    // SVG container.
    this.svg = d3.select(this.el);

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {
    // TODO
  }


});
