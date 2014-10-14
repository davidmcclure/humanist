

var $ = require('jquery');
var Backbone = require('backbone');
var Network = require('./view');
Backbone.$ = $;


// TODO|dev
$.getJSON('data.json', function(data) {
  new Network({ data: data });
  Backbone.history.start();
});
