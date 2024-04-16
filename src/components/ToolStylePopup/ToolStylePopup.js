import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';
import classNames from 'classnames';

import core from 'core';
import StylePopup from 'components/StylePopup';
import SignatureStylePopup from 'components/SignatureStylePopup';
import setToolStyles from 'helpers/setToolStyles';
import { getOpenedWarningModal, getOpenedColorPicker, getAllOpenedModals } from 'helpers/getElements';
import getTextDecoration from 'helpers/getTextDecoration';
import { mapToolNameToKey, getDataWithKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import { isDesktopSize, isMobileSize, isTabletSize } from 'helpers/getDeviceSize';
import HorizontalDivider from 'components/HorizontalDivider';
import RubberStampStylePopup from 'components/RubberStampOverlay';

import './ToolStylePopup.scss';
import getToolStyles from 'helpers/getToolStyles';
import DataElements from 'constants/dataElement';
import getRootNode from 'helpers/getRootNode';

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
    isInDesktopOnlyMode: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.popup = React.createRef();
    this.state = {
      left: 0,
      top: 0,
    };
  }

  handleClickOutside = (e) => {
    // can have multiple toolsOverlays because of mobile mode
    const toolsOverlays = Array.from(getRootNode().querySelectorAll(
      '[data-element="toolsOverlay"]',
    ));
    const pageNavOverlays = Array.from(getRootNode().querySelectorAll(
      '[data-element="pageNavOverlay"]',
    ));
    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();
    const openedModal = Array.from(getAllOpenedModals());

    const target = e.composedPath()[0];

    const clickedOnToolsOverlay = toolsOverlays.some((toolsOverlay) => {
      return toolsOverlay?.contains(target);
    });
    const clickedOnPageNavOverlay = pageNavOverlays.some((pageNavOverlay) => {
      return pageNavOverlay?.contains(target);
    });
    const clickedOnCreateStampModal = openedModal.some((pageModal) => {
      return pageModal.classList.contains('CustomStampModal');
    });

    if (!clickedOnToolsOverlay && !clickedOnPageNavOverlay && !clickedOnCreateStampModal && !warningModal && !colorPicker) {
      this.props.closeElement('toolStylePopup');
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && !this.props.isDisabled) {
      this.props.closeElements([
        DataElements.VIEW_CONTROLS_OVERLAY,
        DataElements.MENU_OVERLAY,
        DataElements.SIGNATURE_OVERLAY,
        DataElements.ZOOM_OVERLAY,
        DataElements.REDACTION_OVERLAY,
      ]);
    }
  }

  handleStyleChange = (property, value) => {
    const { activeToolName } = this.props;
    const tool = core.getTool(activeToolName);
    if (typeof tool.complete === 'function') {
      tool.complete();
    }
    setToolStyles(activeToolName, property, value, true);
  };

  handleRichTextStyleChange = (property, value) => {
    const { activeToolName, activeToolStyle } = this.props;
    const tool = core.getTool(activeToolName);
    const activeToolRichTextStyle = activeToolStyle['RichTextStyle'][0];

    if (typeof tool.complete === 'function') {
      tool.complete();
    }

    if (property === 'underline' || property === 'line-through') {
      value = getTextDecoration({ [property]: value }, activeToolRichTextStyle);
      property = 'text-decoration';
    }

    const richTextStyle = {
      0: {
        ...activeToolRichTextStyle,
        [property]: value,
      }
    };

    setToolStyles(activeToolName, 'RichTextStyle', richTextStyle);
  }

  handleLineStyleChange = (section, value) => {
    const { activeToolName } = this.props;
    if (section === 'start') {
      setToolStyles(activeToolName, 'StartLineStyle', value);
    } else if (section === 'end') {
      setToolStyles(activeToolName, 'EndLineStyle', value);
    } else if (section === 'middle') {
      setToolStyles(activeToolName, 'StrokeStyle', value);
    }
  };

  handleAutoSize = () => {
    const { activeToolName, activeToolStyle } = this.props;
    setToolStyles(activeToolName, 'isAutoSizeFont', !activeToolStyle.isAutoSizeFont);
  }

  render() {
    const { activeToolGroup, isDisabled, activeToolName, activeToolStyle } = this.props;
    const isFreeText = activeToolName.includes('FreeText') || activeToolName.includes('Callout');
    let properties = {};
    const colorMapKey = mapToolNameToKey(activeToolName);
    const isRedaction = activeToolName.includes('AnnotationCreateRedaction');
    const isEllipse = activeToolName.includes('AnnotationCreateEllipse');

    const showLineStyleOptions = getDataWithKey(colorMapKey).hasLineEndings;

    if (isDisabled) {
      return null;
    }

    if (activeToolStyle['StrokeStyle']) {
      properties = {
        StrokeStyle: activeToolStyle['StrokeStyle'],
      };
    }

    if (isRedaction) {
      properties = {
        OverlayText: activeToolStyle['OverlayText'],
        Font: activeToolStyle['Font'],
        FontSize: activeToolStyle['FontSize'],
        TextAlign: activeToolStyle['TextAlign']
      };
    }


    if (isFreeText) {
      properties = {
        Font: activeToolStyle.Font,
        FontSize: activeToolStyle.FontSize,
        TextAlign: activeToolStyle.TextAlign,
        TextVerticalAlign: activeToolStyle.TextVerticalAlign,
        bold: activeToolStyle['RichTextStyle'][0]['font-weight'] === 'bold',
        italic: activeToolStyle['RichTextStyle'][0]['font-style'] === 'italic',
        underline: activeToolStyle['RichTextStyle'][0]['text-decoration']?.includes('underline') || activeToolStyle['text-decoration']?.includes('word'),
        strikeout: activeToolStyle['RichTextStyle'][0]['text-decoration']?.includes('line-through'),
        isAutosizeFont: activeToolStyle.isAutoSizeFont,
        StrokeStyle: activeToolStyle['StrokeStyle']
      };
    }

    if (showLineStyleOptions) {
      const toolStyles = getToolStyles(activeToolName);
      properties = {
        StartLineStyle: toolStyles.StartLineStyle,
        EndLineStyle: toolStyles.EndLineStyle,
        StrokeStyle: toolStyles.StrokeStyle,
      };
    }

    const isEllipseMeasurementTool = activeToolName.includes('AnnotationCreateEllipseMeasurement');

    let Component = (
      <StylePopup
        key={activeToolName}
        toolName={activeToolName}
        colorMapKey={colorMapKey}
        style={activeToolStyle}
        isFreeText={isFreeText}
        isEllipse={isEllipse}
        isFreeTextAutoSize={properties.isAutosizeFont}
        onFreeTextSizeToggle={this.handleAutoSize}
        hideSnapModeCheckbox={isEllipseMeasurementTool || !core.isFullPDFEnabled()}
        onPropertyChange={this.handleStyleChange}
        onStyleChange={this.handleStyleChange}
        onSliderChange={this.handleStyleChange}
        onRichTextStyleChange={this.handleRichTextStyleChange}
        onLineStyleChange={this.handleLineStyleChange}
        properties={properties}
        isRedaction={isRedaction}
        showLineStyleOptions={showLineStyleOptions}
      />
    );

    if (activeToolGroup === 'signatureTools') {
      Component = (
        <React.Fragment>
          <HorizontalDivider />
          <SignatureStylePopup />
        </React.Fragment>
      );
    } else if (activeToolGroup === 'rubberStampTools') {
      Component = (
        <React.Fragment>
          <HorizontalDivider />
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

const mapStateToProps = (state) => {
  const activeToolName = selectors.getActiveToolName(state);
  const toolButtonDataElement = selectors.getToolButtonDataElement(state, activeToolName);

  return {
    activeToolName,
    activeToolGroup: selectors.getActiveToolGroup(state),
    toolButtonDataElement,
    activeToolStyle: selectors.getActiveToolStyles(state),
    isDisabled: selectors.isElementDisabled(state, 'toolStylePopup'),
    isOpen: selectors.isElementOpen(state, 'toolStylePopup'),
    toolButtonObjects: selectors.getToolButtonObjects(state),
    isInDesktopOnlyMode: selectors.isInDesktopOnlyMode(state)
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

const connectedComponent = (props) => {
  const isMobile = isMobileSize();

  const isTablet = isTabletSize();

  const isDesktop = isDesktopSize();

  return (
    <ConnectedToolStylePopup {...props} isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
  );
};

export default connectedComponent;
