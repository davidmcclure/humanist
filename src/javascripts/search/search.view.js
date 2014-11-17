

var $ = require('jquery');
var _ = require('lodash');
var Selectize = require('selectize');
var Backbone = require('backbone');
var template = require('./search.tpl');


module.exports = Backbone.View.extend({


  /**
   * Render the select template.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    console.log(template({ who: 'David' }));
  }


});
