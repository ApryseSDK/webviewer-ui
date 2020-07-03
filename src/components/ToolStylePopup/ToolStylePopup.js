import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';
import classNames from 'classnames';

import core from 'core';
import StylePopup from 'components/StylePopup';
import SignatureStylePopup from 'components/SignatureStylePopup';
import setToolStyles from 'helpers/setToolStyles';
import { mapToolNameToKey, getDataWithKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import HorizontalDivider from 'components/HorizontalDivider';
import RubberStampStylePopup from 'components/RubberStampOverlay';

import './ToolStylePopup.scss';

class ToolStylePopup extends React.PureComponent {
  static propTypes = {
    activeToolName: PropTypes.string,
    activeToolStyle: PropTypes.object,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    toolButtonObjects: PropTypes.object.isRequired,
    colorMapKey: PropTypes.string,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.popup = React.createRef();
    this.state = {
      left: 0,
      top: 0,
    };
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && !this.props.isDisabled) {
      this.props.closeElements([
        'viewControlsOverlay',
        'menuOverlay',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
    }
  }

  handleClick = e => {
    // in the mobile version, this component is viewport height minus the header height
    // with the sub component stylePopup being 100% height so handleClickOutside won't get called
    // when we click outside because we are always clicking on this component
    // as a result we have this handler to specifically close this component
    // if this comment is removed, please also remove the comment in handleClick, AnnotationStylePopup.js
    if (isMobile() && e.target === e.currentTarget) {
      this.props.closeElement('toolStylePopup');
    }
  };

  handleClickOutside = e => {
    // can have multiple toolsOverlays because of mobile mode
    const toolsOverlays = Array.from(document.querySelectorAll(
      '[data-element="toolsOverlay"]',
    ));
    const pageNavOverlays = Array.from(document.querySelectorAll(
      '[data-element="pageNavOverlay"]',
    ));
    const clickedOnToolsOverlay = toolsOverlays.some(toolsOverlay => {
      return toolsOverlay?.contains(e.target);
    });
    const clickedONPageNavOverlay = pageNavOverlays.some(pageNavOverlay => {
      return pageNavOverlay?.contains(e.target);
    });
    if (!clickedOnToolsOverlay && !clickedONPageNavOverlay) {
      this.props.closeElement('toolStylePopup');
    }
  };

  handleStyleChange = (property, value) => {
    const { activeToolName } = this.props;
    const tool = core.getTool(activeToolName);
    if (typeof tool.complete === 'function') {
      tool.complete();
    }
    setToolStyles(this.props.activeToolName, property, value);
  };

  render() {
    const { activeToolGroup, isDisabled, activeToolName, activeToolStyle, isMobile } = this.props;
    const isFreeText = activeToolName.includes('AnnotationCreateFreeText');
    const colorMapKey = mapToolNameToKey(activeToolName);

    if (isDisabled) {
      return null;
    }

    const { availablePalettes } = getDataWithKey(colorMapKey);

    let Component = (
      <StylePopup
        key={activeToolName}
        toolName={activeToolName}
        colorMapKey={colorMapKey}
        style={activeToolStyle}
        isFreeText={isFreeText}
        onStyleChange={this.handleStyleChange}
      />
    );

    if (activeToolGroup === 'signatureTools') {
      Component = (
        <React.Fragment>
          <HorizontalDivider/>
          <SignatureStylePopup/>
        </React.Fragment>
      );
    } else if (activeToolGroup === 'rubberStampTools') {
      Component = (
        <React.Fragment>
          <HorizontalDivider/>
          <RubberStampStylePopup />
        </React.Fragment>
      );
    }

    return (
      <div
        className={classNames({
          ToolStylePopup: true,
        })}
        data-element="toolStylePopup"
        ref={this.popup}
      >
        {/* {isMobile && <div className="swipe-indicator" />} */}
        {Component}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const activeToolName = selectors.getActiveToolName(state);
  const toolButtonDataElement = selectors.getToolButtonDataElement(state, activeToolName);

  return {
    activeToolName,
    activeToolGroup: selectors.getActiveToolGroup(state),
    toolButtonDataElement,
    activeToolStyle: selectors.getActiveToolStyles(state),
    isDisabled: selectors.isElementDisabled(state, 'toolStylePopup'),
    isOpen: selectors.isElementOpen(state, 'toolStylePopup'),
  };
};

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
};

const ConnectedToolStylePopup = connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(ToolStylePopup));

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTablet = useMedia(
    // Media queries
    ['(min-width: 641px) and (max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const isDesktop = useMedia(
    // Media queries
    ['(min-width: 901px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedToolStylePopup {...props} isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
  );
};
