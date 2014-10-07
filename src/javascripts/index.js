

var d3 = require('d3-browserify');
var request = require('superagent');
var _ = require('lodash');


request
.get('data.json')
.end(function(error, res) {

  var nodes = _.map(res.body.nodes, function(n) {
    return [n.graphics.x, n.graphics.y];
  });

  // TODO: Always fullscreen?
  var h = 1000;
  var w = 1000;

  // X scale.
  var x = d3.scale.linear()
    .domain([0, w])
    .range([0, w]);

  // Y scale.
  var y = d3.scale.linear()
    .domain([0, h])
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
        .scaleExtent([0.1, 10])
        .on('zoom', zoom)
    );

  // Overlay.
  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", w)
    .attr("height", h);

  // Nodes.
  var nodes = svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .classed({ node: true })
    .attr('r', 2)
    .attr('transform', transform);

  // Zoom circles.
  function zoom() {
    nodes.attr('transform', transform);
  };

  // Position element.
  function transform(d) {
    return 'translate('+x(d[0])+','+y(d[1])+')';
  };

});
