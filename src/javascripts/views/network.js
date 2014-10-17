

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Radio = require('backbone.radio');
var d3 = require('d3-browserify');
var rbush = require('rbush');


module.exports = Backbone.View.extend({


  el: '#network',

  options: {
    fontExtent: [6, 70],
    zoomExtent: [0.1, 50],
    edges: 500
  },


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initRadio();
    this._initMarkup();
    this._initZoom();
    this._initResize();
    this._initNodes();
    this._initEdges();

    this.applyZoom(); // Initial zoom.

  },


  /**
   * Connect to event channels.
   */
  _initRadio: function() {

    this.radio = Radio.channel('network');

    // Mirror highlights.
    this.radio.on('highlight', _.bind(function(label, cid) {
      if (cid != this.cid) this.highlight(label);
    }, this));

    // Mirror unhighlight.
    this.radio.on('unhighlight', _.bind(function(cid) {
      if (cid != this.cid) this.unhighlight();
    }, this));

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

    // Edges <g>.
    this.edgeGroup = this.outer.append('g')
      .classed({ edges: true });

    // Nodes <g>.
    this.nodeGroup = this.outer.append('g')
      .classed({ nodes: true });

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

    this.labelToNode = {};

    // Iterate over nodes.
    _.map(this.data.nodes, _.bind(function(n) {

      // Inject the label.
      var node = this.nodeGroup
        .append('text')
        .datum(n)
        .attr('text-anchor', 'middle')
        .classed({ node: true })
        .text(n.label);

      // Map label -> element.
      this.labelToNode[n.label] = node;

    }, this));

    // Select the collection.
    this.nodes = this.nodeGroup
      .selectAll('text');

    // Highlight on hover.
    this.nodes.on('mouseenter', _.bind(function(d) {
      this.highlight(d.label);
      this.radio.trigger('highlight', d.label, this.cid);
    }, this));

    // Unhighlight on blur.
    this.nodes.on('mouseleave', _.bind(function() {
      this.unhighlight();
      this.radio.trigger('unhighlight', this.cid);
    }, this));

  },


  /**
   * Initialize the edge index.
   */
  _initEdges: function() {

    // Load the index.
    this.edgeIndex = new rbush();
    this.edgeIndex.load(this.data.edges);

    // Debounce the query method.
    this.debouncedQueryEdges = _.debounce(
      this.queryEdges, 200
    );

    // Init selection.
    this.selectEdges();

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
    this.renderEdges();

    // Get current focus.
    var x = this.xScale.invert(this.w/2);
    var y = this.yScale.invert(this.h/2);
    var z = this.zoom.scale();

    // On zoom, update the font sizes.
    if (!this.focus || z != this.focus[2]) {
      this.nodes.style('font-size', this.fontScale(z));
    }

    // Save the new focus.
    this.focus = [x, y, z];

    // Update edges.
    this.debouncedQueryEdges();

  },


  /**
   * Render the node positions.
   */
  renderNodes: function() {

    this.nodes.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d.graphics.x)+','+
        this.yScale(d.graphics.y)+
      ')';
    }, this));

  },


  /**
   * Render the edge positions.
   */
  renderEdges: function() {

    var self = this;

    this.edges.each(function(d) {
      d3.select(this).attr({
        x1: self.xScale(d.x1),
        y1: self.yScale(d.y1),
        x2: self.xScale(d.x2),
        y2: self.yScale(d.y2)
      })
    });

  },


  /**
   * Cache the edge selection.
   */
  selectEdges: function() {
    this.edges = this.edgeGroup.selectAll('line');
  },


  /**
   * Update the edge selection and re-render.
   */
  updateEdges: function() {
    this.selectEdges();
    this.renderEdges();
  },


  /**
   * Render a fresh set of edges.
   */
  queryEdges: function() {

    // Get current BBOX.
    var x1 = this.xScale.invert(0);
    var y1 = this.yScale.invert(this.h);
    var x2 = this.xScale.invert(this.w);
    var y2 = this.yScale.invert(0);

    // Query for visible edges.
    var edges = this.edgeIndex.search([
      x1, y1, x2, y2
    ]);

    // Sort by edge weight.
    var edges = _.sortBy(edges, function(e) {
      return 1-e[4].weight
    });

    // Take the X heaviest edges.
    var edges = _.first(edges, this.options.edges);

    // Clear current edges.
    this.edgeGroup
      .selectAll('line.background')
      .remove();

    // Walk the 1000 heaviest edges.
    _.each(edges, _.bind(function(e) {

      // Render the new edges.
      this.edgeGroup.append('line')
        .classed({ background: true })
        .datum({
          x1: e[0],
          y1: e[1],
          x2: e[2],
          y2: e[3]
        });

    }, this));

    this.updateEdges();

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
  highlight: function(label) {

    // Get the source coordinates.
    var sourceDatum = this.data.nodes[label];
    var sx = sourceDatum.graphics.x;
    var sy = sourceDatum.graphics.y;

    // Highlight the source <text>.
    this.labelToNode[label]
      .classed({ highlighted: true });

    // Iterate over the targets.
    _.each(sourceDatum.targets, _.bind(function(label) {

      // Highlight the target <text>'s.
      this.labelToNode[label]
        .classed({ highlighted: true })

      // Get the target coordinates.
      var targetDatum = this.data.nodes[label]
      var tx = targetDatum.graphics.x;
      var ty = targetDatum.graphics.y;

      // Inject the edge.
      this.edgeGroup.append('line')
        .classed({ highlight: true })
        .datum({
          x1: sx,
          y1: sy,
          x2: tx,
          y2: ty
        });

    }, this));

    this.updateEdges();

  },


  /**
   * Unhighlight nodes, remove highlight edges.
   */
  unhighlight: function() {
    this.edgeGroup.selectAll('line.highlight').remove();
    this.nodes.classed({ highlighted: false })
  }


});
