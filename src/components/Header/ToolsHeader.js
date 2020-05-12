import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions';

import HeaderItems from 'components/HeaderItems';
import ToolsOverlay from 'components/ToolsOverlay';
import SignatureOverlay from 'components/SignatureOverlay';
import useMedia from 'hooks/useMedia';

import selectors from 'selectors';

import { motion, AnimatePresence } from "framer-motion";

import './Header.scss';

class ToolsHeader extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
  }

  render() {
    const { isTabletAndMobile, isDisabled, activeHeaderItems, isOpen, isToolsOverlayOpen, isToolsOverlayDisabled } = this.props;

    const isVisible = !isDisabled && isOpen;

    return (
      <React.Fragment>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="HeaderToolsContainer"
              data-element="toolsHeader"
              initial={{ height: '0px' }}
              animate={{ height: 'auto' }}
              exit={{ height: '0px' }}
              transition={{ ease: "easeOut", duration: 0.25 }}
            >
              <div
                className="Header Tools"
              >
                <HeaderItems items={activeHeaderItems} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isTabletAndMobile && <ToolsOverlay />}
      </React.Fragment>
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

// export default connect(mapStateToProps, mapDispatchToProps)(ToolsHeader);

const ConnectedToolsHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToolsHeader);


export default props => {
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