

var _ = require('lodash');
var Backbone = require('backbone');
var Cocktail = require('backbone.cocktail');
var ScalesMixin = require('../mixins/scales.mixin');
var Radio = require('backbone.radio');
var d3 = require('d3-browserify');


var Minimap = module.exports = Backbone.View.extend({


  el: '#minimap',

  options: {
    r: { off: 1, on: 1.5, src: 4 },
    padding: 20
  },


  /**
   * Spin up the network.
   */
  initialize: function(options) {

    this.data = options.data;

    this._initRadio();
    this._initMarkup();
    this._initScales();
    this._initDrag();
    this._initClick();
    this._initNodes();

  },


  /**
   * Connect to event channels.
   */
  _initRadio: function() {
    this.radio = Radio.channel('network');
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

    // Extent <rect>.
    this.extent = this.svg.append('rect')
      .classed({ extent: true });

  },


  /**
   * Initialize the X/Y scales.
   */
  _initScales: function() {

    // Measure the container.
    this.h = this.$el.height();
    this.w = this.$el.width();

    // Fit the scales to the node extent.
    this.fitScales(this.data.extent, this.h, this.w);

  },


  /**
   * Initialize extent dragging.
   */
  _initDrag: function() {

    var self = this;

    // Construct the drag handler.
    this.drag = d3.behavior.drag()
      .on('dragstart', function() {
        d3.event.sourceEvent.stopPropagation();
      })
      .on('drag', function() {
         self.publishFocus(d3.mouse(this));
      });

    // Add drag to the <rect>.
    this.extent.call(this.drag);

  },


  /**
   * Initialize click panning.
   */
  _initClick: function() {

    var self = this;

    // Bind the click listener.
    this.svg.on('click', function() {
      if (d3.event.defaultPrevented) return;
      self.publishFocus(d3.mouse(this), true);
    });

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
        .attr('r', this.options.r.off);

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
    this.nodes.on('mouseleave', _.bind(function() {
      this.unhighlight();
      this.radio.trigger('unhighlight', this.cid);
    }, this));

  },


  /**
   * Position the extent preview.
   *
   * @param {Array} focus
   */
  renderExtent: function(extent) {

    // Scale the BBOX.
    var x1 = this.xScale(extent.x1);
    var y1 = this.yScale(extent.y1);
    var x2 = this.xScale(extent.x2);
    var y2 = this.yScale(extent.y2);

    // Keep preview inside container.
    x1 = x1 > 0 ? x1 : 1;
    y1 = y1 > 0 ? y1 : 1;
    x2 = x2 < this.w ? x2 : this.w-1;
    y2 = y2 < this.h ? y2 : this.h-1;

    // Don't set negative dimensions.
    var height = y2-y1 > 0 ? y2-y1 : 0;
    var width  = x2-x1 > 0 ? x2-x1 : 0;

    this.extent.attr({
      x:      x1,
      y:      y1,
      height: height,
      width:  width
    });

  },


  /**
   * Publish a new focus position.
   *
   * @param {Array} mouse
   * @param {Boolean} animate
   */
  publishFocus: function(mouse, animate) {

    // Get current focus.
    var x = this.xScale.invert(mouse[0]);
    var y = this.yScale.invert(mouse[1]);

    // Pan the map.
    this.radio.trigger(
      'focus', { x:x, y:y }, animate
    );

  },


  /**
   * Highlight a node and all its siblings.
   *
   * @param {String} label
   */
  highlight: function(label) {

    var datum = this.data.nodes[label];

    // Highlight the source <text>.
    this.labelToNode[label]
      .classed({ highlight: true, source: true })
      .attr('r', this.options.r.src);

    // Highlight the target <text>'s.
    _.each(datum.targets, _.bind(function(label) {
      this.labelToNode[label]
        .classed({ highlight: true })
        .attr('r', this.options.r.on);
    }, this));

  },


  /**
   * Unhighlight nodes.
   */
  unhighlight: function() {
    this.nodes
      .filter('.highlight')
      .classed({ highlight: false, source: false })
      .attr('r', this.options.r.off);
  }


});


// Mixins:
Cocktail.mixin(Minimap, ScalesMixin);
