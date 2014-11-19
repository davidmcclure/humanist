

var _ = require('lodash');
var Set = require('collections/set');
var path = require('path');

module.exports = function(grunt) {

  grunt.registerTask(
    'data',
    'Preprocess the data file.',
    function() {


      // Read the data file.
      var d1 = grunt.file.readJSON('data/build/graph.json');
      var d2 = {}; // New data.


      // Extent:
      // -------

      d2.extent = {};

      // Node X/Y coordinates.
      var coords = _.map(d1.nodes, function(n) {
        return [n.graphics.x, n.graphics.y];
      });

      // X and Y coordinates.
      var xs = _.pluck(coords, 0);
      var ys = _.pluck(coords, 1);

      // X/Y min/max values.
      d2.extent.xmin = _.min(xs);
      d2.extent.xmax = _.max(xs);
      d2.extent.ymin = _.min(ys);
      d2.extent.ymax = _.max(ys);

      // Deltas on X/Y axes.
      d2.extent.dx = d2.extent.xmax-d2.extent.xmin;
      d2.extent.dy = d2.extent.ymax-d2.extent.ymin;


      // Nodes:
      // ------

      d2.nodes = {};

      // Label -> node.
      _.each(d1.nodes, function(n) {
        n.targets = new Set();
        d2.nodes[n.label] = n;
      });

      // Cache sibling labels.
      _.each(d1.links, function(e) {

        var s = d1.nodes[e.source].label;
        var t = d1.nodes[e.target].label;

        // Register the link.
        d2.nodes[s].targets.add(t);
        d2.nodes[t].targets.add(s);

      });


      // Node index:
      // -----------

      d2.nodeIndex = [];

      // Node list for rbush.
      _.each(d1.nodes, function(n) {

        d2.nodeIndex.push([
          n.graphics.x,
          n.graphics.y,
          n.graphics.x,
          n.graphics.y,
          { rank: n.pagerank }
        ]);

      });


      // Edge index:
      // -----------

      d2.edgeIndex = [];

      // Edge list for rbush.
      _.each(d1.links, function(e) {

        var s = d1.nodes[e.source];
        var t = d1.nodes[e.target];

        d2.edgeIndex.push([
          s.graphics.x,
          s.graphics.y,
          t.graphics.x,
          t.graphics.y,
          { weight: e.value }
        ]);

      });


      // Write JSON.
      grunt.file.write(
        '_site/data.json', JSON.stringify(d2)
      );


    });

};
