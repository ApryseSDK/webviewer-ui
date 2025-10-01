import React from 'react';
import PropTypes from 'prop-types';

import './ListSeparator.scss';
import classNames from 'classnames';

const propTypes = {
  renderContent: PropTypes.func,
  children: PropTypes.node,
  isBoldHeader: PropTypes.bool,
};

const ListSeparator = (function(props) {
  const content = props.renderContent ? props.renderContent() : props.children;
  const isBoldHeader = props.isBoldHeader;
  return <h4 className={classNames(
    'ListSeparator',
    { 'bold-header': isBoldHeader },
  )}>{content}</h4>;
});

ListSeparator.propTypes = propTypes;

export default React.memo(ListSeparator);
