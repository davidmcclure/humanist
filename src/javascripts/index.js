

var $ = require('jquery');
var _ = require('lodash');
var request = require('superagent');
var d3 = require('d3-browserify');


request
.get('data.json')
.end(function(error, res) {

  // X/Y pairs for nodes.
  var nodes = _.map(res.body.nodes, function(n) {
    return [n.graphics.x, n.graphics.y];
  });

  // X-axis coordinates.
  var xs = _.pluck(nodes, 0);

  // TODO: Always fullscreen?
  var h = 1000;
  var w = 1000;

  // X scale.
  var x = d3.scale.linear()
    .domain([_.min(xs), _.max(xs)])
    .range([0, w]);

  // Y scale.
  var y = d3.scale.linear()
    .domain([_.min(xs), _.max(xs)])
    .range([h, 0]);

  // Zoomable container.
  var svg = d3.select('#primary')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .call(
      d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0.01, 100])
        .on('zoom', zoom)
    );

  // Nodes.
  var nodes = svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .classed({ node: true })
    .attr('r', 1)
    .attr('transform', transform);

  // Overlay.
  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", w)
    .attr("height", h);

  // Zoom circles.
  function zoom() {
    nodes.attr('transform', transform);
  };

  // Position element.
  function transform(d) {
    return 'translate('+x(d[0])+','+y(d[1])+')';
  };

});
