

/** @jsx React.DOM */
var $ = require('jquery');
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
    this.view = React.renderComponent(
      <Search data={data} />,
      $('#search').get(0)
    );
  }


});
