

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var data_graphic = require('mg');


module.exports = Backbone.View.extend({


  el: '#kde',


  /**
   * Render a KDE plot.
   *
   * @param {String} label
   */
  show: function(label) {
    $.getJSON('kde/'+label+'.json', _.bind(function(kde) {

      data_graphic({
        target: '#kde',
        data: kde
      });

    }, this));
  }


});
