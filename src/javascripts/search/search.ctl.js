

/** @jsx React.DOM */
var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var Controller = require('radio.controller');
var Search = require('./components/search');


module.exports = Controller.extend({


  /**
   * Start the view.
   *
   * @param {Object} data
   */
  initialize: function(data) {

    // Render the root component.
    this.view = React.renderComponent(
      <Search data={data} />,
      $('#search').get(0)
    );

  }


});
