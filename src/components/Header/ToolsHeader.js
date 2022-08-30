import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions';
import classNames from 'classnames';

import HeaderItems from 'components/HeaderItems';
import useMedia from 'hooks/useMedia';

import selectors from 'selectors';

import './Header.scss';

class ToolsHeader extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
    isToolGroupReorderingEnabled: PropTypes.bool,
    isInDesktopOnlyMode: PropTypes.bool
  }

  render() {
    const { isDisabled, activeHeaderItems, isOpen, currentToolbarGroup, isToolGroupReorderingEnabled, isInDesktopOnlyMode } = this.props;

    const isVisible = !isDisabled && isOpen && currentToolbarGroup !== 'toolbarGroup-View';

    return (
      <div
        className={classNames({
          'HeaderToolsContainer': true,
          'closed': !isVisible,
        })}
        data-element="toolsHeader"
      >
        <div
          className="Header Tools"
        >
          <HeaderItems items={activeHeaderItems} isToolGroupReorderingEnabled={isToolGroupReorderingEnabled} isInDesktopOnlyMode={isInDesktopOnlyMode} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentToolbarGroup: selectors.getCurrentToolbarGroup(state),
  isDisabled: selectors.isElementDisabled(state, 'toolsHeader'),
  isOpen: selectors.isElementOpen(state, 'toolsHeader'),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
  isToolsOverlayOpen: selectors.isElementOpen(state, 'toolsOverlay'),
  isToolsOverlayDisabled: selectors.isElementDisabled(state, 'toolsOverlay'),
  isSignatureOverlayOpen: selectors.isElementOpen(state, 'signatureOverlay'),
  isSignatureOverlayDisabled: selectors.isElementDisabled(state, 'signatureOverlay'),
  isToolGroupReorderingEnabled: selectors.isToolGroupReorderingEnabled(state),
  isInDesktopOnlyMode: selectors.isInDesktopOnlyMode(state)
});

const mapDispatchToProps = {
  setActiveToolGroup: actions.setActiveToolGroup,
};

const ConnectedToolsHeader = connect(mapStateToProps, mapDispatchToProps)(ToolsHeader);

const connectedComponent = (props) => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedToolsHeader {...props} isMobile={isMobile} isTabletAndMobile={isTabletAndMobile} />
  );
};

export default connectedComponent;
