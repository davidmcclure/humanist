

var _ = require('lodash');
var Backbone = require('backbone');
var Radio = require('backbone.radio');
var d3 = require('d3-browserify');


module.exports = Backbone.View.extend({


  el: '#minimap',


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initRadio();
    this._initMarkup();
    this._initAxes();
    this._initNodes();

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

    // SVG container.
    this.svg = d3.select(this.el);

    // Nodes <g>.
    this.nodeGroup = this.svg.append('g')
      .classed({ nodes: true });

  },


  /**
   * Initialize the X/Y axes.
   */
  _initAxes: function() {

    var e = this.data.extent;

    // Measure the container.
    this.h = this.$el.height();
    this.w = this.$el.width();

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
   * Render the nodes.
   */
  _initNodes: function() {

    this.labelToNode = {};

    // Iterate over nodes.
    _.map(this.data.nodes, _.bind(function(n) {

      // Inject the label.
      var node = this.nodeGroup
        .append('circle')
        .datum(n)
        .classed({ node: true })
        .attr('cx', this.xScale(n.graphics.x))
        .attr('cy', this.yScale(n.graphics.y))
        .attr('r', 1);

      // Map label -> element.
      this.labelToNode[n.label] = node;

    }, this));

    // Select the collection.
    this.nodes = this.nodeGroup
      .selectAll('circle');

    // Highlight on hover.
    this.nodes.on('mouseenter', _.bind(function(d) {
      this.highlight(d.label);
      this.radio.trigger('highlight', d.label, this.cid);
    }, this));

    // Unhighlight on blur.
    this.nodes.on('mouseleave', _.bind(function(d) {
      this.unhighlight();
      this.radio.trigger('unhighlight', this.cid);
    }, this));

  },


  /**
   * Highlight a node and all its siblings.
   *
   * @param {String} label
   */
  highlight: function(label) {

    // Get the source data.
    var sourceDatum = this.data.nodes[label];

    // Highlight the source <text>.
    this.labelToNode[label]
      .classed({ highlighted: true });

    // Highlight the target <text>'s.
    _.each(sourceDatum.targets, _.bind(function(label) {
      this.labelToNode[label]
        .classed({ highlighted: true })
        .attr('r', 2);
    }, this));

  },


  /**
   * Unhighlight nodes.
   */
  unhighlight: function() {

    // Unhighlight the nodes.
    this.nodes
      .classed({ highlighted: false })
      .attr('r', 1);

  }


});
