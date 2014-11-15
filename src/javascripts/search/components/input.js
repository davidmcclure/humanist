

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
   * Apply a highlight/select query.
   *
   * @param {Object} props
   */
  componentWillReceiveProps: function(props) {
    this.setState({ query: props.query });
  },


  /**
   * By default, invalid.
   */
  getInitialState: function() {
    return {
      query: this.props.query,
      valid: false
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
      value={this.state.query}
      onChange={this.onChange}
      onKeyUp={this.onKeyUp} />;

  },


  /**
   * When the query is modified.
   *
   * @param {Object} event
   */
  onChange: function(event) {

    var value = event.target.value;

    // Render the new query.
    this.setState({ query: value });

    // Set the `valid` class.
    var valid = _.has(this.props.nodes, value);
    this.setState({ valid: valid });

    // TODO: Search.

  },


  /**
   * When a key is pressed.
   *
   * @param {Object} event
   */
  onKeyUp: function(event) {

    // Select on <Enter>.
    if (event.key == 'Enter') {
      this.radio.trigger('select', event.target.value);
    }

  }


});
