

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var d3 = require('d3-browserify');


module.exports = Backbone.View.extend({


  el: '#network',


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initMarkup();
    this._initData();
    this._initResize();
    this._initNodes();

  },


  /**
   * Inject the top-level containers.
   */
  _initMarkup: function() {

    // d3-wrap the container.
    this.svg = d3.select(this.el);

    // Zoomable container.
    this.outer = this.svg.append('g');

    // Pointer events overlay.
    this.overlay = this.outer.append('rect')
      .classed({ overlay: true });

  },


  /**
   * Parse the raw network data.
   * TODO: Precompute as much of this as possible.
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

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {

    // Debounce the resizer.
    var resize = _.debounce(_.bind(function() {
      this.fitToWindow();
      this.renderNodes();
    }, this), 500);

    // Bind to window resize.
    $(window).resize(resize);
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
    this.renderNodes();

  },


  /**
   * Fill the window with the network.
   */
  fitToWindow: function() {

    var h = $(window).height();
    var w = $(window).width();

    // Size the SVG container.
    this.svg.attr('width', w).attr('height', h);

    // Size the overlay.
    this.overlay.attr('width', w).attr('height', h);

    // Get the X/Y-axis domains.
    if (this.dx > this.dy) {
      var r = h/w;
      var d = (this.dx-this.dy)/2;
      var yd = [r*(this.ymin-d), r*(this.ymax+d)];
      var xd = [this.xmin, this.xmax];
    } else {
      var r = w/h;
      var d = (this.dy-this.dx)/2;
      var xd = [r*(this.xmin-d), r*(this.xmax+d)];
      var yd = [this.ymin, this.ymax];
    }

    // X-axis scale.
    this.xScale = d3.scale.linear()
      .domain(xd)
      .range([0, w]);

    // Y-axis scale.
    this.yScale = d3.scale.linear()
      .domain(yd)
      .range([h, 0]);

    this.zoom = d3.behavior.zoom()
      .x(this.xScale)
      .y(this.yScale)
      .scaleExtent([0.01, 100])
      .on('zoom', _.bind(this.renderNodes, this))
      .size([w, h]);

    // Add zoom to <g>.
    this.outer.call(this.zoom);

  },


  /**
   * Apply the current axis scales to the nodes.
   */
  renderNodes: function() {

    // Render the new node positions.
    this.nodes.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d[0])+','+
        this.yScale(d[1])+
      ')';
    }, this));

  }


});
