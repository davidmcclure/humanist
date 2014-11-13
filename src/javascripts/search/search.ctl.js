

/** @jsx React.DOM */
var $ = require('jquery');
var React = require('react');
var Controller = require('radio.controller');
var Search = require('./components/search');


module.exports = Controller.extend({


  /**
   * Start the view.
   *
   * @param {Object} options
   */
  initialize: function(options) {
    this.view = React.renderComponent(
      <Search />,
      $('#search').get(0)
    );
  }


});
