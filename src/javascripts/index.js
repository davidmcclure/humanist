

var $ = require('jquery');
var _ = require('lodash');
var NProgress = require('nprogress');
var Backbone = require('backbone');
Backbone.$ = $;

var Network = require('./network/network.ctl');
var Timeline = require('./timeline/timeline.ctl');
var Search = require('./search/search.ctl');
var Minimap = require('./minimap/minimap.ctl');
var KDE = require('./kde/kde.ctl');
var Router = require('./router');


NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100
});

// Start loader.
NProgress.start();

$.getJSON('data.json', _.bind(function(data) {

  // Modules:
  new Minimap(data);
  new Search(data);
  //new Timeline(data);
  new Network(data);
  //new KDE();

  // Router:
  new Router();

  // End loader.
  $('#spinner').hide();
  $('body').removeClass('loading');
  NProgress.done();

}, this));
