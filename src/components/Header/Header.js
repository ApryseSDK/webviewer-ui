import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderItems from 'components/HeaderItems';

import selectors from 'selectors';
import classNames from 'classnames';

import './Header.scss';

class Header extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
    isToolGroupReorderingEnabled: PropTypes.bool,
    isInDesktopOnlyMode: PropTypes.bool
  }

  render() {
    const { isDisabled, activeHeaderItems, isOpen, isToolsHeaderOpen, currentToolbarGroup, isToolGroupReorderingEnabled, isInDesktopOnlyMode } = this.props;

    if (isDisabled || !isOpen) {
      return null;
    }

    return (
      <React.Fragment>
        <div
          className={classNames({
            Header: true,
          })}
          data-element="header"
        >
          <HeaderItems items={activeHeaderItems} isToolGroupReorderingEnabled={isToolGroupReorderingEnabled} isInDesktopOnlyMode={isInDesktopOnlyMode} />
          {(!isToolsHeaderOpen || currentToolbarGroup === 'toolbarGroup-View')
            && <div className="view-header-border" />}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentToolbarGroup: selectors.getCurrentToolbarGroup(state),
  isToolsHeaderOpen: selectors.isElementOpen(state, 'toolsHeader'),
  isDisabled: selectors.isElementDisabled(state, 'header'),
  isOpen: selectors.isElementOpen(state, 'header'),
  activeHeaderItems: selectors.getActiveHeaderItems(state),
  isToolGroupReorderingEnabled: selectors.isToolGroupReorderingEnabled(state),
  isInDesktopOnlyMode: selectors.isInDesktopOnlyMode(state),
});

export default connect(mapStateToProps)(Header);
