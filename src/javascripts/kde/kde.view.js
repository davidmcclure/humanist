

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');


module.exports = Backbone.View.extend({


  el: '#kde',


  /**
   * Render a KDE plot.
   *
   * @param {String} label
   */
  show: function(label) {
    $.getJSON('kde/'+label+'.json', _.bind(function(kde) {
      console.log(kde);
    }, this));
  }


});
