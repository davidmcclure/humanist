

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
    var domain = this.xd > this.yd ?
      [this.xmin, this.xmax]:
      [this.ymin, this.ymax];

  },


  /**
   * Bind a debounced resize listener.
   */
  _initResize: function() {

    // Debounce the resizer.
    var debounced = _.debounce(
      _.bind(this.fitToWindow, this), 500
    );

    // Bind to window resize.
    $(window).resize(debounced);
    this.fitToWindow();

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
      .range(0, w);

    // Y-axis scale.
    this.yScale = d3.scale.linear()
      .domain(this.domain)
      .range(h, 0);

    var zoom = d3.behavior.zoom()
      .x(this.xScale)
      .y(this.yScale)
      .scaleExtent([0.01, 100])
      .on('zoom', this.zoomNodes);

    this.zoom = this.svg.append('g')
      .call()

  }


});


request
.get('data.json')
.end(function(error, res) {

  new Network({ data: res.body });

  //// X/Y pairs for nodes.
  //var nodes = _.map(res.body.nodes, function(n) {
    //return [n.graphics.x, n.graphics.y];
  //});

  //// X-axis coordinates.
  //var xs = _.pluck(nodes, 0);

  //// TODO: Always fullscreen?
  //var h = 1000;
  //var w = 1000;

  //// X scale.
  //var x = d3.scale.linear()
    //.domain([_.min(xs), _.max(xs)])
    //.range([0, w]);

  //// Y scale.
  //var y = d3.scale.linear()
    //.domain([_.min(xs), _.max(xs)])
    //.range([h, 0]);

  //// Zoomable container.
  //var svg = d3.select('#primary')
    //.append('svg')
    //.attr('width', w)
    //.attr('height', h)
    //.append('g')
    //.call(
      //d3.behavior.zoom()
        //.x(x)
        //.y(y)
        //.scaleExtent([0.01, 100])
        //.on('zoom', zoom)
    //);

  //// Nodes.
  //var nodes = svg.selectAll('circle')
    //.data(nodes)
    //.enter()
    //.append('circle')
    //.classed({ node: true })
    //.attr('r', 1)
    //.attr('transform', transform);

  //// Overlay.
  //svg.append("rect")
    //.attr("class", "overlay")
    //.attr("width", w)
    //.attr("height", h);

  //// Zoom circles.
  //function zoom() {
    //nodes.attr('transform', transform);
  //};

  //// Position element.
  //function transform(d) {
    //return 'translate('+x(d[0])+','+y(d[1])+')';
  //};

});
