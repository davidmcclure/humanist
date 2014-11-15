

/** @jsx React.DOM */
var React = require('react');
var Input = require('./input');


module.exports = React.createClass({


  /**
   * Render the search component.
   */
  render: function() {
    return <Input
      nodes={this.props.data.nodes}
      query="test" />
  }


});
