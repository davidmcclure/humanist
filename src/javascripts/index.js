

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Network = require('./network/network.view');
var Timeline = require('./timeline/timeline.view');
var Minimap = require('./minimap/minimap.view');
Backbone.$ = $;


// TODO|dev
$.getJSON('data.json', _.bind(function(data) {
  new Minimap({ data: data });
  new Timeline({ data: data });
  new Network({ data: data });
}, this));
