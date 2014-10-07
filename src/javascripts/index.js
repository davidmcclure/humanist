

var d3 = require('d3-browserify');
var request = require('superagent');
var _ = require('lodash');


request
.get('data.json')
.end(function(error, res) {

  var data = _.map(res.body.nodes, function(n) {
    return [n.graphics.x, n.graphics.y];
  });

  var svg = d3.select('#network');

  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('transform', function(d) {
      return 'translate('+d+')';
    });

});
