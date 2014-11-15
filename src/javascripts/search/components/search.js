

/** @jsx React.DOM */
var React = require('react');
var Input = require('./input');


module.exports = React.createClass({


  /**
   * Render the search component.
   */
  render: function() {
    return <Input
      selection={this.props.selection}
      nodes={this.props.data.nodes} />
  }


});
