

var $ = require('jquery');
var _ = require('lodash');
var Radio = require('backbone.radio');
var Backbone = require('backbone');
var template = require('./search.tpl');
var View = require('../lib/view');
require('selectize');


module.exports = View.extend({


  el: '#search',

  channels: ['global'],


  /**
   * Render the template, start Selectize.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.data = options;
    this._initInput();
    this._bindEvents();
  },


  /**
   * Start Selectize.
   */
  _initInput: function() {

    // Get terms, with empty option.
    var terms = _.keys(this.data.nodes).sort();
    terms.unshift(null);

    // Render the <select>.
    this.$el.html(template({ words: terms }));
    this.select = this.$el.find('select');

    // Start Selectize.
    this.select.selectize();
    this.selectize = this.select[0].selectize;

  },


  /**
   * Bind selection change events.
   */
  _bindEvents: function() {

    // When a word is selected.
    this.selectize.on(
      'item_add',
      _.bind(this.publishSelect, this)
    );

    // When the input is cleared.
    this.selectize.on(
      'item_remove',
      _.bind(this.publishUnselect, this)
    );

  },


  /**
   * Mutate Selectize without triggering events.
   *
   * @param {Function} render
   */
  _renderSilent: function(render) {
    this.selectize.off();
    render.apply(this);
    this._bindEvents();
  },


  /**
   * When a term is selected.
   *
   * @param {String} label
   */
  publishSelect: function(label) {
    this.channels.global.trigger('select', label);
  },


  /**
   * When the input is cleared.
   */
  publishUnselect: function() {
    this.channels.global.trigger('unselect');
  },


  /**
   * Set the current term.
   *
   * @param {String} label
   */
  renderSelect: function(label) {
    this._renderSilent(function() {
      this.selectize.setValue(label);
    });
  },


  /**
   * Clear the input.
   */
  renderUnselect: function(label) {
    this._renderSilent(function() {
      this.selectize.clear();
    });
  }


});
