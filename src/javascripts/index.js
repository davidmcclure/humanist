

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Network = require('./network/network.ctl');
var Minimap = require('./minimap/minimap.ctl');
var Timeline = require('./timeline/timeline.ctl');
var Router = require('./router');


// Load the data file.
$.getJSON('data.json', _.bind(function(data) {

  // Views:
  new Minimap({ data: data });
  new Timeline({ data: data });
  new Network({ data: data });

  // Routes:
  new Router();

}, this));
