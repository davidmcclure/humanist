

/** @jsx React.DOM */
var React = require('react');
var Radio = require('backbone.radio');


module.exports = React.createClass({


  /**
   * Connect to the radio channel.
   */
  componentWillMount: function() {
    this.radio = Radio.channel('search');
  },


  /**
   * Render the text input.
   */
  render: function() {
    return <input
      type="text"
      onKeyPress={this.onKeyPress} />;
  },


  /**
   * Select word on <Enter>.
   *
   * @param {Object} event
   */
  onKeyPress: function(event) {
    if (event.key == 'Enter') {
      this.radio.trigger('select', event.target.value);
    }
  }


});
