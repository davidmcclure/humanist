

var $ = require('jquery');
var d3 = require('d3-browserify');


module.exports = {


  /**
   * Set the X/Y-axis scales to frame the nodes.
   *
   * @param {Number} e
   * @param {Number} h
   * @param {Number} w
   */
  fitScales: function(e, h, w) {

    // Wide.
    if (e.dx > e.dy) {
      var r = h/w;
      var p = ((e.dx*r)-e.dy)/2;
      var xd = [e.xmin, e.xmax];
      var yd = [e.ymin-p, e.ymax+p];
      var xp = this.options.padding;
      var yp = this.options.padding*r;
    }

    // Tall.
    else {
      var r = w/h;
      var p = ((e.dy*r)-e.dx)/2;
      var xd = [e.xmin-p, e.xmax+p];
      var yd = [e.ymin, e.ymax];
      var xp = this.options.padding*r;
      var yp = this.options.padding;
    }

    // X-axis scale.
    this.xScale = d3.scale.linear()
      .domain(xd)
      .range([xp, w-xp]);

    // Y-axis scale.
    this.yScale = d3.scale.linear()
      .domain(yd)
      .range([h-yp, yp]);

  }


};
