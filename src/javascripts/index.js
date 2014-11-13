

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Network = require('./network/network.ctl');
var Minimap = require('./minimap/minimap.ctl');
var Timeline = require('./timeline/timeline.ctl');
var Search = require('./search/search.ctl');
var Router = require('./router');


// Load the data file.
$.getJSON('data.json', _.bind(function(data) {

  // Widgets:
  new Minimap({ data: data });
  new Timeline({ data: data });
  new Search({ data: data });

  // Network:
  new Network({ data: data });

  // Routes:
  new Router();

}, this));
