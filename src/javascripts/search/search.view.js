

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var template = require('./search.tpl');
require('selectize');


module.exports = Backbone.View.extend({


  el: '#search',


  /**
   * Render the template, start Selectize.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    var terms = _.keys(options.nodes).sort();
    this.$el.html(template({ words: terms }));
    this.$el.find('select').selectize();
  }


});
