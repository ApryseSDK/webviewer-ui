import React from 'react';
import PropTypes from 'prop-types';

import './ListSeparator.scss';

class ListSeparator extends React.PureComponent {
  static propTypes = {
    renderContent: PropTypes.func,
    children: PropTypes.node,
  }

  render() {
    const content = this.props.renderContent ? this.props.renderContent() : this.props.children;
    return <div className="ListSeparator">{content}</div>;
  }
}

export default ListSeparator;
