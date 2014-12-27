

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Cocktail = require('backbone.cocktail');
var ScalesMixin = require('../mixins/scales.mixin');
var Radio = require('backbone.radio');
var d3 = require('d3-browserify');
var rbush = require('rbush');
var View = require('../lib/view');


var Network = module.exports = View.extend({


  el: '#network',

  options: {
    padding: 50,
    fontExtent: [5, 70],
    zoomExtent: [0.1, 50],
    baselineWidth: 1700,
    edgeCount: 1000,
    nodeCount: 50,
    maxNodeSize: 40,
    panDuration: 800,
    focusScale: 10
  },

  channels: ['network', 'global'],


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options;

    this._initMarkup();
    this._initZoom();
    this._initResize();
    this._initLabels();
    this._initNodes();
    this._initEdges();

    this.triggerZoom();

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

    // Labels <g>.
    this.labelGroup = this.outer.append('g')
      .classed({ labels: true });

  },


  /**
   * Attach a zoom handler to the outer <g>.
   */
  _initZoom: function() {

    // Construct the zoom handler.
    this.zoom = d3.behavior.zoom()
      .on('zoom', _.bind(this.renderZoom, this))
      .scaleExtent(this.options.zoomExtent);

    // Add zoom to <g>.
    this.outer.call(this.zoom);

    // Prevent accidental selections.
    this.outer.on('mousedown', function() {
      d3.event.preventDefault();
    });

    // Zoom -> font size scale.
    this.fontScale = d3.scale.linear()
      .domain(this.options.zoomExtent)
      .range(this.options.fontExtent);

    // Debounce a zoom-end callback.
    this.debouncedZoomEnd = _.debounce(
      this.onZoomEnd, 200
    );

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {

    // Debounce the resizer.
    var resize = _.debounce(_.bind(function() {
      this.fitWindow();
      this.resizeLabels();
      this.triggerZoom();
    }, this), 500);

    // Bind to window resize.
    $(window).resize(resize);
    this.fitWindow();

  },


  /**
   * Render the labels.
   */
  _initLabels: function() {

    this.termToLabel = {};
    this.selected = null;

    // Iterate over nodes.
    _.map(this.data.nodes, _.bind(function(n) {

      // Inject the label.
      var label = this.labelGroup
        .append('text')
        .datum(n)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .classed({ node: true })
        .text(n.label);

      // Map label -> element.
      this.termToLabel[n.label] = label;

    }, this));

    // Select the labels.
    this.labels = this.labelGroup.selectAll('text');

    // Highlight on focus.
    this.labels.on('mouseenter', _.bind(function(d) {
      this.publishHighlight(d.label);
    }, this));

    // Select when a label is clicked.
    this.labels.on('click', _.bind(function(d) {
      if (d3.event.defaultPrevented) return;
      d3.event.preventDefault();
      this.publishSelect(d.label);
    }, this));

    // Unhighlight on blur.
    this.labels.on('mouseleave', _.bind(function() {
      this.publishUnhighlight();
    }, this));

    // Unselect when container is clicked.
    this.outer.on('click', _.bind(function() {
      if (d3.event.defaultPrevented) return;
      this.publishUnselect();
    }, this));

  },


  /**
   * Initialize the node index, render starting nodes.
   */
  _initNodes: function() {
    this.nodeIndex = new rbush();
    this.nodeIndex.load(this.data.nodeIndex);
    this.filterNodesByExtent();
  },


  /**
   * Initialize the edge index.
   */
  _initEdges: function() {
    this.edgeIndex = new rbush();
    this.edgeIndex.load(this.data.edgeIndex);
    this.filterEdgesByExtent();
  },


  /**
   * Get the current [x1, y1, x2, y2] viewport bounding box.
   */
  _getBoundingBox: function() {
    var x1 = this.xScale.invert(0);
    var y1 = this.yScale.invert(this.h);
    var x2 = this.xScale.invert(this.w);
    var y2 = this.yScale.invert(0);
    return [x1, y1, x2, y2];
  },


  /**
   * Programmatically trigger a `zoom` event.
   */
  triggerZoom: function() {
    this.zoom.event(this.outer);
  },


  /**
   * Apply the current zoom level to the nodes/edges.
   */
  renderZoom: function() {

    this.positionNodes();

    // Hide the edges.
    this.edgeGroup.style('display', 'none');

    // Get current focus.
    var x = this.xScale.invert(this.w/2);
    var y = this.yScale.invert(this.h/2);
    var z = this.zoom.scale();

    // Get current extent.
    var x1 = this.xScale.invert(0);
    var y1 = this.yScale.invert(0);
    var x2 = this.xScale.invert(this.w);
    var y2 = this.yScale.invert(this.h);

    // On zoom, update the font sizes.
    if (!this.center || z != this.center.z) {
      this.resizeLabels();
    }

    // Set the new extent and center.
    this.extent = { x1:x1, y1:y1, x2:x2, y2:y2 };
    this.center = { x:x, y:y, z:z };

    // Publish the extent.
    this.channels.network.trigger('extent', this.extent);

    // Notify zoom end.
    this.debouncedZoomEnd();

  },


  /**
   * After a zoom, query for new edges and update the route.
   */
  onZoomEnd: function() {
    this.filterEdgesByExtent();
    this.filterNodesByExtent();
    this.updateRouteXYZ();
  },


  /**
   * Render the node positions.
   */
  positionNodes: function() {

    this.labels.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d.graphics.x)+','+
        this.yScale(d.graphics.y)+
      ')';
    }, this));

    this.nodes.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d.cx)+','+
        this.yScale(d.cy)+
      ')';
    }, this));

  },


  /**
   * Resize the node labels.
   */
  resizeLabels: function() {
    var r = this.w / this.options.baselineWidth;
    var size = this.fontScale(this.zoom.scale()) * r;
    this.labelGroup.style('font-size', size+'px');
  },


  /**
   * Update the edge selection and re-render.
   */
  refreshEdges: function() {
    this.selectEdges();
    this.positionEdges();
  },


  /**
   * Cache the edge selection.
   */
  selectEdges: function() {
    this.edges = this.edgeGroup.selectAll('line');
  },


  /**
   * Render the edge positions.
   *
   * @param {Selection} edges
   */
  positionEdges: function(edges) {

    var self = this;
    edges = edges || this.edges;

    edges.each(function(d) {
      d3.select(this).attr({
        x1: self.xScale(d.x1),
        y1: self.yScale(d.y1),
        x2: self.xScale(d.x2),
        y2: self.yScale(d.y2)
      })
    });

  },


  /**
   * Clear the current background edges and render a new set of edges that
   * fall within the current viewport extent.
   */
  filterEdgesByExtent: function() {

    // Query for visible edges.
    var edges = this.edgeIndex.search(
      this._getBoundingBox()
    );

    // Sort by edge weight.
    var edges = _.sortBy(edges, function(e) {
      return 1-e[4].weight
    });

    // Take the X heaviest edges.
    var edges = _.first(edges, this.options.edgeCount);

    // Clear current edges.
    this.edgeGroup
      .selectAll('line.background')
      .remove();

    // Walk the heaviest edges.
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

    // Show the edges.
    this.edgeGroup.style('display', null);
    this.refreshEdges();

  },


  /**
   * Render a new set of node circles, scaled by PageRank.
   */
  filterNodesByExtent: function() {

    // Query for visible nodes.
    var nodes = this.nodeIndex.search(
      this._getBoundingBox()
    );

    // Sort by PageRank.
    var nodes = _.sortBy(nodes, function(n) {
      return 1-n[4].rank
    });

    // Take the X heaviest edges.
    var nodes = _.first(nodes, this.options.nodeCount);

    // Clear current nodes.
    this.nodeGroup
      .selectAll('circle.node')
      .remove();

    // Walk the heaviest nodes.
    _.each(nodes, _.bind(function(n) {

      // Render the new nodes.
      this.nodeGroup.append('circle')
        .classed({ node: true })
        .attr('r', n[4].rank)
        .datum({ cx: n[0], cy: n[1] });

    }, this));

    // Select and position the nodes.
    this.nodes = this.nodeGroup.selectAll('circle');
    this.positionNodes();

  },


  /**
   * Point the route to current XYZ location.
   */
  updateRouteXYZ: function() {

    if (this.selected) return;

    // Round off the coordinates.
    var x = this.center.x.toFixed(2);
    var y = this.center.y.toFixed(2);
    var z = this.center.z.toFixed(2);

    // Update the route.
    Backbone.history.navigate(x+'/'+y+'/'+z, {
      replace: true
    });

  },


  /**
   * Point the route to a specific term.
   *
   * @param {String} label
   */
  updateRouteTerm: function(label) {
    Backbone.history.navigate(label, {
      replace: true
    });
  },


  /**
   * Fill the window with the network.
   */
  fitWindow: function() {

    // Measure the window.
    this.h = $(window).height();
    this.w = $(window).width();

    // Fit the scales to the node extent.
    this.fitScales(this.data.extent, this.h, this.w);

    // Size the SVG container.
    this.svg
      .attr('height', this.h)
      .attr('width', this.w);

    // Size the overlay.
    this.zoomOverlay
      .attr('height', this.h)
      .attr('width', this.w);

    // Update the zoom handler.
    this.zoom
      .size([this.w, this.h])
      .x(this.xScale)
      .y(this.yScale);

    // Reset the current focus.
    if (this.center) {
      this.focusOnXYZ(this.center);
    }

  },


  /**
   * Apply a :x/:y/:z focus position.
   *
   * @param {Object} center
   * @param {Boolean} animate
   */
  focusOnXYZ: function(center, animate) {

    z = center.z || this.center.z;

    // Reset the focus, apply zoom.
    this.zoom.translate([0, 0]).scale(z);

    // X/Y coordinate of the centroid.
    var x = this.xScale(center.x);
    var y = this.yScale(center.y);

    // Distance from viewport center.
    var dx = this.w/2 - x;
    var dy = this.h/2 - y;

    // Apply the new translation.
    this.zoom.translate([dx, dy]);

    // Animate if duration.
    if (animate === true) {
      this.outer.transition()
        .duration(this.options.panDuration)
        .call(this.zoom.event);
    }

    // Else, apply now.
    else this.triggerZoom();

  },


  /**
   * Focus on an individual word.
   *
   * @param {String} word
   * @param {Boolean} animate
   */
  focusOnWord: function(word, animate) {

    // Get the coordinates.
    var d = this.data.nodes[word];

    var center = {
      x: d.graphics.x,
      y: d.graphics.y,
      z: this.options.focusScale
    };

    // Apply the center.
    this.focusOnXYZ(center, animate);

  },


  /**
   * Publish a node highlight.
   *
   * @param {String} label
   */
  publishHighlight: function(label) {
    this.channels.global.trigger('highlight', label);
  },


  /**
   * Publish a node selection.
   *
   * @param {String} label
   */
  publishSelect: function(label) {
    this.channels.global.trigger('select', label, this.cid);
  },


  /**
   * Publish a node unhighlight.
   */
  publishUnhighlight: function() {
    this.channels.global.trigger('unhighlight');
  },


  /**
   * Publish a node unselect.
   */
  publishUnselect: function() {
    this.channels.global.trigger('unselect');
  },


  /**
   * Highlight a node.
   *
   * @param {String} label
   */
  renderHighlight: function(label) {

    // Get the source coordinates.
    var sourceDatum = this.data.nodes[label];
    var sx = sourceDatum.graphics.x;
    var sy = sourceDatum.graphics.y;

    // Highlight the source <text>.
    this.termToLabel[label]
      .classed({ highlight: true, source: true });

    // Iterate over the targets.
    _.each(sourceDatum.targets, _.bind(function(label) {

      // Highlight the target <text>'s.
      this.termToLabel[label]
        .classed({ highlight: true })

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

    // Render new edges.
    this.positionEdges(
      this.edgeGroup.selectAll('line.highlight')
    );

  },


  /**
   * Select a node, update the route.
   */
  renderSelect: function(label) {

    this.renderUnselect();
    this.selected = label;

    this.termToLabel[label]
      .classed({ select: true });

  },


  /**
   * Unhighlight all nodes.
   */
  renderUnhighlight: function() {

    var self = this;

    // Remove highlight classes.
    this.labels
      .filter('.highlight')
      .classed({ highlight: false, source: false });

    // Remove the highlight lines.
    this.edgeGroup
      .selectAll('line.highlight')
      .remove();

  },


  /**
   * Unselect nodes, update the route.
   */
  renderUnselect: function() {

    this.labels
      .filter('.select')
      .classed({ select: false });

    this.selected = null;

  }


});


// Mixins:
Cocktail.mixin(Network, ScalesMixin);
