import React from 'react';
import PropTypes from 'prop-types';

import './ListSeparator.scss';

class ListSeparator extends React.PureComponent {
  static propTypes = {
    renderContent: PropTypes.func.isRequired
  }

  render() {
    return <div className="ListSeparator">{this.props.renderContent()}</div>;
  }
}

export default ListSeparator;