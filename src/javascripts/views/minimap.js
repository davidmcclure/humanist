

var _ = require('lodash');
var Backbone = require('backbone');
var d3 = require('d3-browserify');


module.exports = Backbone.View.extend({


  el: '#minimap',

  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initMarkup();
    this._initNodes();

    this.applyZoom(); // Initial zoom.

  },


  /**
   * Inject the top-level containers.
   */
  _initMarkup: function() {

    // SVG container.
    this.svg = d3.select(this.el);

    // Nodes <g>.
    this.nodeGroup = this.svg.append('g')
      .classed({ nodes: true });

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
    this.nodes = this.nodeGroup.selectAll('text');

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

  },


  /**
   * Apply the current zoom level to the nodes/edges.
   */
  applyZoom: function() {

    this.nodes.attr('transform', _.bind(function(d) {
      return 'translate('+
        this.xScale(d.graphics.x)+','+
        this.yScale(d.graphics.y)+
      ')';
    }, this));

  },


  /**
   * Highlight a node and all its siblings.
   *
   * @param {Object} data
   */
  highlight: function(data) {

    // Get the source data.
    var sourceDatum = this.data.nodes[data.label];

    // Highlight the source <text>.
    this.labelToNode[data.label].classed({ highlighted: true });

    // Highlight the target <text>'s.
    _.each(sourceDatum.targets, _.bind(function(label) {
      this.labelToNode[label].classed({ highlighted: true })
    }, this));

  },


  /**
   * Unhighlight nodes, remove highlight edges.
   */
  unhighlight: function() {
    this.nodes.classed({ highlighted: false })
  }


});
