

/** @jsx React.DOM */
var React = require('react');


var Network = React.createClass({

  /**
   * The top-level SVG container.
   */
  render: function() {
    return <svg id="network">{this.props.children}</svg>;
  }

});


// Root component.
var humanist = React.renderComponent(
  <Network />,
  document.getElementById('primary')
);
