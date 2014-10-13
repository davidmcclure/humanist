

var $ = require('jquery');
var _ = require('lodash');
var request = require('superagent');
var d3 = require('d3-browserify');
var Backbone = require('backbone');
Backbone.$ = $;


var Network = Backbone.View.extend({


  el: '#network',


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    // d3-wrap the container.
    this.svg = d3.select(this.el);

    this._initData();
    this._initResize();
    this._initNodes();
    this._initOverlay();

  },


  /**
   * Parse the raw network data.
   */
  _initData: function() {

    // Bare X/Y coordinates.
    this.coords = _.map(this.data.nodes, function(n) {
      return [n.graphics.x, n.graphics.y];
    });

    // X and Y coordinates.
    this.xs = _.pluck(this.coords, 0);
    this.ys = _.pluck(this.coords, 1);

    // Min/max values on axes.
    this.xmax = _.max(this.xs);
    this.xmin = _.min(this.xs);
    this.ymax = _.max(this.ys);
    this.ymin = _.min(this.ys);

    // Deltas on X/Y axes.
    this.xd = this.xmax-this.xmin;
    this.yd = this.ymax-this.ymin;

    // Domain for axes.
    this.domain = this.xd > this.yd ?
      [this.xmin, this.xmax]:
      [this.ymin, this.ymax];

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {

    // Zoomable container.
    this.outer = this.svg.append('g');

    // Debounce the resizer.
    var debounced = _.debounce(
      _.bind(this.fitToWindow, this), 500
    );

    // Bind to window resize.
    $(window).resize(debounced);
    this.fitToWindow();

  },


  /**
   * Render the nodes.
   * TODO: Render words, not just dots.
   */
  _initNodes: function() {

    // Append the nodes.
    this.nodes = this.outer.selectAll('circle')
      .data(this.coords)
      .enter()
      .append('circle')
      .classed({ node: true })
      .attr('r', 1);

    // Apply zoom.
    this.zoomNodes();

  },


  /**
   * Inject an overlay to catch zoom events.
   */
  _initOverlay: function() {
    // TODO
  },


  /**
   * Fill the window with the network.
   */
  fitToWindow: function() {

    // Size the SVG container.
    var h = $(window).height();
    var w = $(window).width();
    this.svg.attr('width', w).attr('height', h);

    // X-axis scale.
    this.xScale = d3.scale.linear()
      .domain(this.domain)
      .range([0, w]);

    // Y-axis scale.
    this.yScale = d3.scale.linear()
      .domain(this.domain)
      .range([h, 0]);

    var zoomHandler = d3.behavior.zoom()
      .x(this.xScale)
      .y(this.yScale)
      .scaleExtent([0.01, 100])
      .on('zoom', this.zoomNodes);

    // Add zoomable <g>.
    this.outer.call(zoomHandler);

  },


  /**
   * Apply the current axis scales to the nodes.
   */
  zoomNodes: function() {
    this.nodes.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d[0])+','+
        this.yScale(d[1])+
      ')';
    }, this));
  }


});


// TODO|dev
request
.get('data.json')
.end(function(error, res) {
  new Network({ data: res.body });
});
