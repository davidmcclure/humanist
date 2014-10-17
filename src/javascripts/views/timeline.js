

var $ = require('jquery');
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
    this._initTicks();
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

    // Axis <g>.
    this.ticks = this.svg.append('g')
      .classed({ ticks: true });

  },


  /**
   * Initialize the time axis.
   */
  _initTicks: function() {

    // X-axis renderer.
    this.xAxis = d3.svg.axis()
      .orient('bottom');

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {

    // Debounce the resizer.
    var resize = _.debounce(_.bind(function() {
      this.fitToWindow();
    }, this), 500);

    // Bind to window resize.
    $(window).resize(resize);
    this.fitToWindow();

  },


  /**
   * Fill the width with the timeline.
   */
  fitToWindow: function() {

    // Measure the window.
    this.w = $(window).width();

    // Size the SVG container.
    this.svg.attr('width', this.w);

    // X-axis scale.
    this.xScale = d3.time.scale()
      .domain([new Date(2000, 0, 1), new Date(2002, 0, 0)])
      .range([0, this.w]);

    // Re-scale the ticks.
    this.xAxis.scale(this.xScale);
    this.ticks.call(this.xAxis);

    // Get year ticks.
    var years = this.ticks
      .selectAll('g')
      .filter(function(d) {
        return d3.time.year(d) >= d;
      });

    // Add custom class.
    years.classed('year', true);

  }


});
