

var $ = require('jquery');
var _ = require('lodash');
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
    this.xmin = _.min(this.xs);
    this.xmax = _.max(this.xs);
    this.ymin = _.min(this.ys);
    this.ymax = _.max(this.ys);

    // Deltas on X/Y axes.
    this.dx = this.xmax-this.xmin;
    this.dy = this.ymax-this.ymin;

    // TODO|dev
    this.xDomain = [this.xmin, this.xmax];
    this.yDomain = [this.ymin, this.ymax];

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
   */
  _initNodes: function() {

    // Render the nodes.
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
   * Fill the window with the network.
   */
  fitToWindow: function() {

    var h = $(window).height();
    var w = $(window).width();

    // Size the SVG container.
    this.svg.attr('width', w).attr('height', h);

    // X-axis scale.
    this.xScale = d3.scale.linear()
      .domain(this.xDomain)
      .range([0, w]);

    // Y-axis scale.
    this.yScale = d3.scale.linear()
      .domain(this.yDomain)
      .range([h, 0]);

    var zoomHandler = d3.behavior.zoom()
      .x(this.xScale)
      .y(this.yScale)
      .scaleExtent([0.01, 100])
      .on('zoom', this.zoomNodes);

    // Add zoomable <g>.
    this.outer.call(zoomHandler);
    //this.zoomNodes();

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
$.getJSON('data.json', function(data) {
  new Network({ data: data });
});
