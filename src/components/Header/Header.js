import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import core from 'core';

import HeaderItems from 'components/HeaderItems';
import TabsHeader from 'components/TabsHeader';

import selectors from 'selectors';
import classNames from 'classnames';

import './Header.scss';

class Header extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
    isToolGroupReorderingEnabled: PropTypes.bool,
    isInDesktopOnlyMode: PropTypes.bool,
    isToolsHeaderOpen: PropTypes.bool,
    isMultiTab: PropTypes.bool,
    isOfficeEditorMode: PropTypes.bool,
    isOfficeEditorHeaderEnabled: PropTypes.bool,
    currentToolbarGroup: PropTypes.string,
  };

  render() {
    const {
      isDisabled,
      activeHeaderItems,
      isOpen,
      isToolsHeaderOpen,
      currentToolbarGroup,
      isMultiTab,
      isToolGroupReorderingEnabled,
      isInDesktopOnlyMode,
      isOfficeEditorMode,
      isOfficeEditorHeaderEnabled,
    } = this.props;

    if (isDisabled || !isOpen) {
      return null;
    }

    if (isOfficeEditorHeaderEnabled && core.getDocument() === null) {
      return null;
    }

    return (
      <>
        <TabsHeader />
        <div
          className={classNames({
            Header: true,
            MainHeader: true,
          })}
          data-element="header"
        >
          <HeaderItems
            items={activeHeaderItems}
            isToolGroupReorderingEnabled={isToolGroupReorderingEnabled}
            isInDesktopOnlyMode={isInDesktopOnlyMode}
            isOfficeEditorMode={isOfficeEditorMode}
          />
          {(!isToolsHeaderOpen || currentToolbarGroup === 'toolbarGroup-View') && !isMultiTab
          && <div className="view-header-border" />}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isMultiTab: selectors.getIsMultiTab(state),
  currentToolbarGroup: selectors.getCurrentToolbarGroup(state),
  isToolsHeaderOpen: selectors.isElementOpen(state, 'toolsHeader'),
  isDisabled: selectors.isElementDisabled(state, 'header'),
  isOpen: selectors.isElementOpen(state, 'header'),
  activeHeaderItems: selectors.getActiveHeaderItems(state),
  isToolGroupReorderingEnabled: selectors.isToolGroupReorderingEnabled(state),
  isInDesktopOnlyMode: selectors.isInDesktopOnlyMode(state),
  isOfficeEditorMode: selectors.getIsOfficeEditorMode(state),
  isOfficeEditorHeaderEnabled: selectors.getIsOfficeEditorHeaderEnabled(state),
});

export default connect(mapStateToProps)(Header);
