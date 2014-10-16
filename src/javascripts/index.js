

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var Network = require('./view');
Backbone.$ = $;


// TODO|dev
$.getJSON('data.json', _.bind(function(data) {
  window.view = new Network({ data: data });
}, this));
