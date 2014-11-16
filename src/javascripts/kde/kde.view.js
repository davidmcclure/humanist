

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var data_graphic = require('mg');
var config = require('../config');


module.exports = Backbone.View.extend({


  el: '#kde',


  /**
   * Render a KDE plot.
   *
   * @param {String} label
   */
  show: function(label) {
    $.getJSON('kde/'+label+'.json', _.bind(function(kde) {

      // Cast ISO strings -> dates.
      kde = _.map(kde, function(datum) {
        datum.date = new Date(datum.date);
        return datum;
      });

      // Update chart.
      data_graphic({
        target: '#kde',
        data: kde,
        x_accessor: 'date',
        y_accessor: 'value'
      });

    }, this));
  }


});
