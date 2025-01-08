import React from 'react';
import PropTypes from 'prop-types';

import './ListSeparator.scss';

const propTypes = {
  renderContent: PropTypes.func,
  children: PropTypes.node,
};

const ListSeparator = (function(props) {
  const content = props.renderContent ? props.renderContent() : props.children;
  return <h4 className="ListSeparator">{content}</h4>;
});

ListSeparator.propTypes = propTypes;

export default React.memo(ListSeparator);
