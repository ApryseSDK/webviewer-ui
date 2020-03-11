import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

import HeaderItems from 'components/HeaderItems';
import ToolsOverlay from 'components/ToolsOverlay';
import SignatureOverlay from 'components/SignatureOverlay';

import selectors from 'selectors';

import './Header.scss';

class ToolsHeader extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
  }

  componentWillUnmount() {
    core.setToolMode(defaultTool);
    this.props.setActiveToolGroup('');
  }

  render() {
    const { isDisabled, activeHeaderItems, isOpen, isToolsOverlayOpen, isToolsOverlayDisabled, isSignatureOverlayOpen, isSignatureOverlayDisabled } = this.props;

    if (isDisabled || !isOpen) {
      return null;
    }

    return (
      <div>
        <div
          className="Header Tools"
          data-element="toolsHeader"
        >
          <HeaderItems items={activeHeaderItems} />
        </div>
        {isToolsOverlayOpen && !isToolsOverlayDisabled && <ToolsOverlay />}
        {<SignatureOverlay />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'toolsHeader'),
  isOpen: selectors.isElementOpen(state, 'toolsHeader'),
  activeHeaderItems: selectors.getToolsHeaderItems(state),
  isToolsOverlayOpen: selectors.isElementOpen(state, 'toolsOverlay'),
  isToolsOverlayDisabled: selectors.isElementDisabled(state, 'toolsOverlay'),
  isSignatureOverlayOpen: selectors.isElementOpen(state, 'signatureOverlay'),
  isSignatureOverlayDisabled: selectors.isElementDisabled(state, 'signatureOverlay'),
});

const mapDispatchToProps = {
  setActiveToolGroup: actions.setActiveToolGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsHeader);
