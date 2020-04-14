import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';
import classNames from 'classnames';

import core from 'core';
import StylePopup from 'components/StylePopup';
import SignatureStylePopup from 'components/SignatureStylePopup';
import getToolStylePopupPositionBasedOn from 'helpers/getToolStylePopupPositionBasedOn';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import { mapToolNameToKey, getDataWithKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import ToolButton from 'components/ToolButton';
import defaultTool from 'constants/defaultTool';

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

  componentDidMount() {
    // window.addEventListener('resize', this.close);
    this.positionToolStylePopup();
  }

  componentDidUpdate(prevProps) {
    this.positionToolStylePopup();
    if (!prevProps.isOpen && this.props.isOpen && !this.props.isDisabled) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
        'menuOverlay',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.close);
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
    const { activeToolName } = this.props;
    const documentContainer = document.querySelector(
      '[data-element="documentContainer"]',
    );
    // const toolsOverlay = document.querySelector(
    //   '[data-element="toolsOverlay"]',
    // );
    // const header = document.querySelector('[data-element="header"]');
    const clickedDocumentContainer= documentContainer?.contains(e.target);
    // const clickedHeader = header?.contains(e.target);

    if (clickedDocumentContainer) {
      this.close();
      if (activeToolName === 'AnnotationCreateRubberStamp') {
        core.setToolMode(defaultTool);
        // this.props.setActiveToolGroup('');
      }
    }
  };

  close = () => {
    this.props.closeElement('toolStylePopup');
  };

  handleStyleChange = (property, value) => {
    const { activeToolName } = this.props;
    const tool = core.getTool(activeToolName);
    if (typeof tool.complete === 'function') {
      tool.complete();
    }
    setToolStyles(this.props.activeToolName, property, value);
  };

  positionToolStylePopup = () => {
    const { activeToolName } = this.props;

    const toolButton = activeToolName === 'AnnotationCreateRubberStamp' ?
      document.querySelector(`[data-element="rubberStampToolButton"]`) :
      document.querySelector(`[data-element="styling-button"]`);

    if (toolButton) {
      const { left, top } = getToolStylePopupPositionBasedOn(
        toolButton,
        this.popup,
      );

      this.setState({ left: left + 10, top: top + 8 });
    }
  };

  render() {
    const { swapableToolNames, isDisabled, activeToolName, activeToolStyle, isMobile, isTablet, isDesktop } = this.props;
    const { left, top } = this.state;
    const isFreeText = activeToolName.includes('AnnotationCreateFreeText');
    const colorMapKey = mapToolNameToKey(activeToolName);

    if (isDisabled) {
      return null;
    }
    const hideSlider = activeToolName === 'AnnotationCreateRedaction';

    let style = {};
    if (isTablet) {
      style = { left, top };
    }

    const { availablePalettes } = getDataWithKey(colorMapKey);

    let Component = (
      <React.Fragment>
        <div
          className="swap-tools-container"
        >
          {swapableToolNames.map((toolName, i) =>
            <ToolButton
              key={`${toolName}-${i}`}
              toolName={toolName}
              isSwap
            />)}
        </div>
        <StylePopup
          key={activeToolName}
          toolName={activeToolName}
          colorMapKey={colorMapKey}
          style={activeToolStyle}
          isFreeText={isFreeText}
          hideSlider={hideSlider}
          onStyleChange={this.handleStyleChange}
        />
      </React.Fragment>
    );

    if (activeToolName === 'AnnotationCreateSignature') {
      Component = (
        <SignatureStylePopup/>
      );
    }

    return (
      <div
        className={classNames({
          ToolStylePopup: true,
        })}
        data-element="toolStylePopup"
        ref={this.popup}
        style={style}
      >
        {isMobile && <div className="swipe-indicator" />}
        {isDesktop && (swapableToolNames.length > 0 || availablePalettes.length === 1)
          &&
          (<div className="divider-container">
            <div className="divider-horizontal" />
          </div>)}
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
    toolButtonDataElement,
    activeToolStyle: selectors.getActiveToolStyles(state),
    isDisabled: selectors.isElementDisabled(state, 'toolStylePopup'),
    isOpen: selectors.isElementOpen(state, 'toolStylePopup'),
    swapableToolNames: selectors.getSwapableToolNamesForActiveToolGroup(state),
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
