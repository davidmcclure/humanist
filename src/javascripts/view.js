

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var d3 = require('d3-browserify');
var Path = require('paths-js/path');


module.exports = Backbone.View.extend({


  el: '#network',

  options: {
    zoomExtent: [0.1, 50],
    fontExtent: [6, 60]
  },


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initMarkup();
    this._initZoom();
    this._initResize();
    this._initNodes();

    // Initial zoom.
    this.applyZoom();

  },


  /**
   * Inject the top-level containers.
   */
  _initMarkup: function() {

    // Top-level SVG element.
    this.svg = d3.select(this.el);

    // Zoomable container.
    this.outer = this.svg.append('g');

    // Pointer events overlay.
    this.zoomOverlay = this.outer.append('rect')
      .classed({ overlay: true });

    // Nodes <g>.
    this.nodeGroup = this.outer.append('g')
      .classed({ nodes: true });

    // Edges <g>.
    this.edgeGroup = this.outer.append('g')
      .classed({ edges: true });

  },


  /**
   * Attach a zoom handler to the outer <g>.
   */
  _initZoom: function() {

    // Construct the zoom handler.
    this.zoom = d3.behavior.zoom()
      .on('zoom', _.bind(this.applyZoom, this))
      .scaleExtent(this.options.zoomExtent);

    // Add zoom to <g>.
    this.outer.call(this.zoom);

    // Zoom -> font size scale.
    this.fontScale = d3.scale.linear()
      .domain(this.options.zoomExtent)
      .range([6, 60]);

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {

    // Debounce the resizer.
    var resize = _.debounce(_.bind(function() {
      this.fitToWindow();
      this.applyZoom();
    }, this), 500);

    // Bind to window resize.
    $(window).resize(resize);
    this.fitToWindow();

  },


  /**
   * Render the nodes.
   */
  _initNodes: function() {

    var self = this;

    // Inject the nodes.
    this.nodes = this.nodeGroup
      .selectAll('text')
      .data(_.values(this.data.nodes))
      .enter()
      .append('text')
      .classed({ node: true })
      .text(function(n) {
        return n.label;
      });

    // Hover.
    this.nodes.on('mouseenter', function(data) {
      self.highlightNode(data.label);
    });

  },


  /**
   * Fill the window with the network.
   */
  fitToWindow: function() {

    var e = this.data.extent;

    // Measure the window.
    this.h = $(window).height();
    this.w = $(window).width();

    // Size the SVG container.
    this.svg
      .attr('height', this.h)
      .attr('width', this.w);

    // Size the overlay.
    this.zoomOverlay
      .attr('height', this.h)
      .attr('width', this.w);

    // Get the X/Y-axis domains.
    if (e.dx > e.dy) {
      var r = this.h/this.w;
      var d = (e.dx-e.dy)/2;
      var yd = [r*(e.ymin-d), r*(e.ymax+d)];
      var xd = [e.xmin, e.xmax];
    } else {
      var r = this.w/this.h;
      var d = (e.dy-e.dx)/2;
      var xd = [r*(e.xmin-d), r*(e.xmax+d)];
      var yd = [e.ymin, e.ymax];
    }

    // X-axis scale.
    this.xScale = d3.scale.linear()
      .domain(xd)
      .range([0, this.w]);

    // Y-axis scale.
    this.yScale = d3.scale.linear()
      .domain(yd)
      .range([this.h, 0]);

    // Update the zoom handler.
    this.zoom
      .size([this.w, this.h])
      .x(this.xScale)
      .y(this.yScale);

    if (this.focus) {
      this.focusOnXYZ.apply(this, this.focus);
    }

  },


  /**
   * Apply the current zoom level to the nodes/edges.
   */
  applyZoom: function() {

    this.renderNodes();

    var x = this.xScale.invert(this.w/2);
    var y = this.yScale.invert(this.h/2);
    var z = this.zoom.scale();

    // Save the new focus.
    this.focus = [x, y, z];

    // Update the font sizes.
    this.nodes.style('font-size', this.fontScale(z));

  },


  /**
   * Render the node positions.
   */
  renderNodes: function() {

    // Render the new node positions.
    this.nodes.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d.graphics.x)+','+
        this.yScale(d.graphics.y)+
      ')';
    }, this));

  },


  /**
   * Apply a :x/:y/:z focus position.
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  focusOnXYZ: function(x, y, z) {

    // Reset the focus, apply zoom.
    this.zoom.translate([0, 0]).scale(z);

    // X/Y coordinate of the centroid.
    var x = this.xScale(x);
    var y = this.yScale(y);

    // Distance from viewport center.
    var dx = this.w/2 - x;
    var dy = this.h/2 - y;

    this.zoom.translate([dx, dy]);
    this.applyZoom();

  },


  /**
   * Highlight a node and all its siblings.
   *
   * @param {String} label
   */
  highlightNode: function(label) {
    console.log(label);
  }


});
