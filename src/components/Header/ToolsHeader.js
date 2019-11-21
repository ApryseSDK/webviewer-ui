import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderItems from 'components/HeaderItems';

import selectors from 'selectors';

import './Header.scss';

class ToolsHeader extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
  }

  render() {
    const { isDisabled, activeHeaderItems, isOpen } = this.props;

    if (isDisabled || !isOpen) {
      return null;
    }

    return (
      <div
        className="Header Dark"
        data-element="toolsHeader"
      >
        <HeaderItems items={activeHeaderItems} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'toolsHeader'),
  isOpen: selectors.isElementOpen(state, 'toolsHeader'),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
});

export default connect(mapStateToProps)(ToolsHeader);
