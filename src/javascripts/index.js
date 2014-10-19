

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Network = require('./network/network.ctl');
var Timeline = require('./timeline/timeline.ctl');
var Minimap = require('./minimap/minimap.ctl');


// TODO|dev
$.getJSON('data.json', _.bind(function(data) {
  new Minimap({ data: data });
  new Timeline({ data: data });
  new Network({ data: data });
}, this));
