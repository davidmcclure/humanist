

/** @jsx React.DOM */
var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var Controller = require('radio.controller');
var Cortex = require('cortexjs');
var Search = require('./components/search');


module.exports = Controller.extend({


  events: {

    network: {
      highlight: 'highlight',
      unhighlight: 'unhighlight',
      select: 'select',
      unselect: 'unselect'
    },

    minimap: {
      highlight: 'highlight',
      unhighlight: 'unhighlight'
    }

  },


  /**
   * Start the view.
   *
   * @param {Object} data
   */
  initialize: function(data) {

    // Shared data object.
    this.selection = new Cortex({
      highlight: null, select: null
    });

    // Render the root component.
    this.view = React.renderComponent(
      <Search data={data} selection={this.selection} />,
      $('#search').get(0)
    );

    // Apply new selection.
    this.selection.on('update', _.bind(function(updated) {
      this.view.setProps({ selection: updated });
    }, this));

  },


  /**
   * Render a highlight.
   *
   * @param {String} label
   */
  highlight: function(label) {
    this.selection.highlight.set(label);
  },


  /**
   * Clear the highlighted word.
   */
  unhighlight: function() {
    this.selection.highlight.set(null);
  },


  /**
   * Render a selection.
   *
   * @param {String} label
   */
  select: function(label) {
    this.selection.select.set(label);
  },


  /**
   * Clear the selected word.
   *
   * @param {String} label
   */
  unselect: function(label) {
    this.selection.select.set(null);
  }


});
