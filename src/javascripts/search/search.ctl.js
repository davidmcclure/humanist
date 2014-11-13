

/** @jsx React.DOM */
var React = require('react');
var Controller = require('radio.controller');
var $ = require('jquery');


module.exports = Controller.extend({


  /**
   * Start the view.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.view = React.renderComponent(
      <h1>Test</h1>,
      $('#search').get(0)
    );
  }


});
