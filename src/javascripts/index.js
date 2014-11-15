

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Network = require('./network/network.ctl');
var Timeline = require('./timeline/timeline.ctl');
var Minimap = require('./minimap/minimap.ctl');
var KDE = require('./kde/kde.ctl');
var Router = require('./router');


$.getJSON('data.json', _.bind(function(data) {

  // Modules:
  new Minimap(data);
  new Timeline(data);
  new Network(data);
  new KDE();

  // Router:
  new Router();

}, this));
