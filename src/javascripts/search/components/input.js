

/** @jsx React.DOM */
var _ = require('lodash');
var Radio = require('backbone.radio');
var React = require('react/addons');


module.exports = React.createClass({


  /**
   * Connect to the radio channel.
   */
  componentWillMount: function() {
    this.radio = Radio.channel('search');
  },


  /**
   * By default, invalid.
   */
  getInitialState: function() {
    return { valid: false };
  },


  /**
   * Render the text input.
   */
  render: function() {

    var cx = React.addons.classSet(this.state);

    return <input
      type="text"
      className={cx}
      placeholder="search words"
      onKeyUp={this.onKeyUp} />;

  },


  /**
   * When a key is pressed.
   *
   * @param {Object} event
   */
  onKeyUp: function(event) {

    var value = event.target.value;

    // Select on <Enter>.
    if (event.key == 'Enter') {
      this.radio.trigger('select', value);
    }

    // Set the `valid` class.
    var valid = _.has(this.props.nodes, value);
    this.setState({ valid: valid });

  }


});
