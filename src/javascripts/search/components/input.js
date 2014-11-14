

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
    return {
      valid: false,
      active: false
    };
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
      onKeyUp={this.onKeyUp}
      onFocus={this.onFocus}
      onBlur={this.onBlur} />;

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
    var valid = _.has(this.props.data.nodes, value);
    this.setState({ valid: valid });

  },


  /**
   * When the input is focused.
   */
  onFocus: function() {
    this.setState({ active: true });
  },


  /**
   * When the input is blurred.
   */
  onBlur: function() {
    this.setState({ active: false });
  }


});
