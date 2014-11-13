

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Network = require('./network/network.ctl');
var Minimap = require('./minimap/minimap.ctl');
var Timeline = require('./timeline/timeline.ctl');
var Search = require('./search/search.ctl');
var Router = require('./router');


$.getJSON('data.json', _.bind(function(data) {

  // Modules:
  new Minimap(data);
  new Timeline(data);
  new Search(data);
  new Network(data);

  // Router:
  new Router();

}, this));
