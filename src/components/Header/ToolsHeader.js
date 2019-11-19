import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderItems from 'components/HeaderItems';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './ToolsHeader.scss';

class ToolsHeader extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
  }

  render() {
    const { isDisabled, activeHeaderItems } = this.props;
    const className = getClassName('Tools-Header', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} data-element="header">
        <HeaderItems items={activeHeaderItems} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'header'),
  isOpen: selectors.isElementOpen(state, 'header'),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
});

export default connect(mapStateToProps)(ToolsHeader);
