import React from 'react';
import PropTypes from 'prop-types';

import './ListSeparator.scss';
import classNames from 'classnames';
import { isSpreadsheetEditorMode } from 'src/helpers/officeEditor';

const propTypes = {
  renderContent: PropTypes.func,
  children: PropTypes.node,
};

const ListSeparator = (function(props) {
  const content = props.renderContent ? props.renderContent() : props.children;
  return <h4 className={classNames(
    'ListSeparator',
    { 'sheet-name': isSpreadsheetEditorMode() }
  )}>{content}</h4>;
});

ListSeparator.propTypes = propTypes;

export default React.memo(ListSeparator);
