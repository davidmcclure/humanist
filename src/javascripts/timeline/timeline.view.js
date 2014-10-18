

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Radio = require('backbone.radio');
var d3 = require('d3-browserify');


module.exports = Backbone.View.extend({


  el: '#timeline',

  options: {
    dates: {
      t1: '1987-05-12',
      t2: '2014-09-26'
    }
  },


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;
    window.data = this.data;

    this._initRadio();
    this._initMarkup();
    this._initScales();
    this._initTicks();
    this._initResize();

  },


  /**
   * Connect to event channels.
   */
  _initRadio: function() {

    this.radio = Radio.channel('network');

    // Update the focus.
    this.radio.on('move', _.bind(function(extent, cid) {
      this.setExtent(extent);
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
      .attr('transform', 'translate(0,8)')
      .classed({ ticks: true });

  },


  /**
   * Initialize the scales to map coordinates -> dates.
   */
  _initScales: function() {

    // Coordinate extent.
    var xmin = this.data.extent.xmin;
    var xmax = this.data.extent.xmax;

    // Date extent.
    var t1 = new Date(this.options.dates.t1);
    var t2 = new Date(this.options.dates.t2);

    // Map coordinates -> dates.
    this.timeScale = d3.time.scale()
      .domain([xmin, xmax])
      .range([t1, t2]);

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
      .range([0, this.w]);

    this.renderTicks();

  },


  /**
   * Apply a new network extent.
   *
   * @param {Array} extent
   */
  setExtent: function(extent) {

    // Map start and end dates.
    var d1 = this.timeScale(extent[0]);
    var d2 = this.timeScale(extent[2]);

    // Apply the new domain.
    this.xScale.domain([new Date(d1), new Date(d2)]);
    this.renderTicks();

  },


  /**
   * (Re-)render the timeline ticks.
   */
  renderTicks: function() {

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
