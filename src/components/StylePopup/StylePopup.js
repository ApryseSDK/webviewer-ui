import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import ColorPalettePicker from 'components/ColorPalettePicker';
import Slider from 'components/Slider';
import StyleOption from 'components/StyleOption';
import Icon from 'components/Icon';
import TextStylePicker from 'components/TextStylePicker';
import LabelTextEditor from 'components/LabelTextEditor';
import LineStyleOptions from 'components/LineStyleOptions';
import Choice from 'components/Choice/Choice';

import { circleRadius } from 'constants/slider';
import DataElements from 'constants/dataElement';
import { workerTypes } from 'constants/types';
import selectors from 'selectors';
import actions from 'actions';
import pickBy from 'lodash/pickBy';
import useMedia from 'hooks/useMedia';
import classNames from 'classnames';
import { isMobile } from 'helpers/device';
import getMeasurementTools from 'helpers/getMeasurementTools';
import core from 'core';

import './StylePopup.scss';

class StylePopup extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    onPropertyChange: PropTypes.func.isRequired,
    onSliderChange: PropTypes.func.isRequired,
    onRichTextStyleChange: PropTypes.func,
    onLineStyleChange: PropTypes.func,
    isFreeText: PropTypes.bool,
    isEllipse: PropTypes.bool,
    isMeasure: PropTypes.bool,
    colorMapKey: PropTypes.string.isRequired,
    currentStyleTab: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    isColorPaletteDisabled: PropTypes.bool,
    isOpacitySliderDisabled: PropTypes.bool,
    isStrokeThicknessSliderDisabled: PropTypes.bool,
    isFontSizeSliderDisabled: PropTypes.bool,
    isStyleOptionDisabled: PropTypes.bool,
    isStylePopupDisabled: PropTypes.bool,
    hideSnapModeCheckbox: PropTypes.bool,
    closeElement: PropTypes.func,
    openElement: PropTypes.func,
    onSnapModeChange: PropTypes.func,
    properties: PropTypes.object,
    isRedaction: PropTypes.bool,
    fonts: PropTypes.array,
    isSnapModeEnabled: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      document: core.getDocument(),
      documentType: core.getDocument()?.getType()
    };
  }

  componentDidMount() {
    core.addEventListener('documentLoaded', this.onDocumentLoaded);
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.onDocumentLoaded);
  }

  onDocumentLoaded = () => {
    this.setState({
      document: core.getDocument(),
      documentType: core.getDocument().getType()
    });
  };

  onSnappingChange = (event) => {
    if (!core.isFullPDFEnabled()) {
      return;
    }

    const enableSnapping = event.target.checked;
    const mode = enableSnapping ? core.getDocumentViewer().SnapMode.e_DefaultSnapMode | core.getDocumentViewer().SnapMode.POINT_ON_LINE : null;
    const measurementTools = getMeasurementTools();

    measurementTools.forEach((tool) => {
      tool.setSnapMode?.(mode);
    });
    if (this.props.onSnapModeChange) {
      this.props.onSnapModeChange(enableSnapping);
    }
  };

  renderSliders = () => {
    const {
      style: { Opacity, StrokeThickness, FontSize },
      onStyleChange,
      onSliderChange,
      isFreeText,
      isMeasure = false,
      // TODO: Actually disable these elements
      isOpacitySliderDisabled,
      isStrokeThicknessSliderDisabled,
      isFontSizeSliderDisabled,
      currentStyleTab,
    } = this.props;
    const lineStart = circleRadius;
    const sliderProps = {};
    if (!isOpacitySliderDisabled) {
      sliderProps.Opacity = {
        property: 'Opacity',
        displayProperty: 'opacity',
        value: Opacity,
        getDisplayValue: (Opacity) => `${Math.round(Opacity * 100)}%`,
        dataElement: DataElements.OPACITY_SLIDER,
        getCirclePosition: (lineLength, Opacity) => Opacity * lineLength + lineStart,
        convertRelativeCirclePositionToValue: (circlePosition) => circlePosition,
        withInputField: true,
        inputFieldType: 'number',
        min: 0,
        max: 100,
        step: 1,
        getLocalValue: (opacity) => parseInt(opacity) / 100,
      };
    }
    if (!isStrokeThicknessSliderDisabled) {
      sliderProps.StrokeThickness = {
        property: 'StrokeThickness',
        displayProperty: 'thickness',
        value: StrokeThickness,
        getDisplayValue: (strokeThickness) => {
          const placeOfDecimal = Math.floor(strokeThickness) !== strokeThickness ? strokeThickness.toString().split('.')[1].length || 0 : 0;
          if (StrokeThickness === 0 || StrokeThickness >= 1 && (placeOfDecimal > 2 || placeOfDecimal === 0)) {
            return `${Math.round(strokeThickness)}pt`;
          }
          return `${parseFloat(strokeThickness).toFixed(2)}pt`;
        },
        dataElement: DataElements.STROKE_THICKNESS_SLIDER,
        getCirclePosition: (lineLength, strokeThickness) => (strokeThickness / 20) * lineLength + lineStart,
        convertRelativeCirclePositionToValue: (circlePosition) => {
          if (circlePosition >= 1 / 20) {
            return circlePosition * 20;
          }
          if (circlePosition >= 0.75 / 20 && circlePosition < 1 / 20) {
            return 0.75;
          }
          if (circlePosition >= 0.5 / 20 && circlePosition < 0.75 / 20) {
            return 0.5;
          }
          if (circlePosition >= 0.25 / 20 && circlePosition < 0.5 / 20) {
            return 0.25;
          }
          if (circlePosition >= 0.08 / 20 && circlePosition < 0.25 / 20) {
            return 0.1;
          }
          return isFreeText ? 0 : 0.1;
        },
        withInputField: true,
        inputFieldType: 'number',
        min: isFreeText ? 0 : 0.1,
        max: 20,
        step: 1,
        getLocalValue: (strokeThickness) => parseFloat(strokeThickness).toFixed(2)
      };
    }
    if (!isFontSizeSliderDisabled) {
      sliderProps.FontSize = {
        property: 'FontSize',
        displayProperty: 'text',
        value: FontSize,
        getDisplayValue: (FontSize) => `${Math.round(parseInt(FontSize, 10))}pt`,
        dataElement: DataElements.FONT_SIZE_SLIDER,
        getCirclePosition: (lineLength, FontSize) => ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
        convertRelativeCirclePositionToValue: (circlePosition) => `${circlePosition * 40 + 5}pt`,
      };
    }

    // default sliders
    let sliders = { Opacity, StrokeThickness, FontSize };
    if (currentStyleTab === 'TextColor') {
      sliders = { Opacity, FontSize };
    } else if (currentStyleTab === 'StrokeColor') {
      sliders = { Opacity, StrokeThickness };
    } else if (currentStyleTab === 'FillColor') {
      sliders = { Opacity };
    }

    if (isMeasure) {
      sliders.FontSize = FontSize;
    }

    if (isOpacitySliderDisabled) {
      delete sliders.Opacity;
    }

    if (isStrokeThicknessSliderDisabled || this.props.colorMapKey === 'markInsertText' || this.props.colorMapKey === 'markReplaceText') {
      delete sliders.StrokeThickness;
    }

    if (isFontSizeSliderDisabled) {
      delete sliders.FontSize;
    }

    // we still want to render a slider if the value is 0
    sliders = pickBy(sliders, (slider) => slider !== null && slider !== undefined);

    const sliderComponents = Object.keys(sliders).map((key) => {
      const props = sliderProps[key];

      return <Slider {...props} key={key} onStyleChange={onStyleChange} onSliderChange={onSliderChange} />;
    });

    return (
      <React.Fragment>
        {sliderComponents.length > 0 && (
          <div className="sliders-container">
            {sliderComponents}
          </div>
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      toolName,
      isColorPaletteDisabled,
      currentStyleTab,
      style,
      colorMapKey,
      onStyleChange,
      isStyleOptionDisabled,
      disableSeparator,
      hideSnapModeCheckbox,
      isFreeText,
      isEllipse,
      isTextStyleContainerActive,
      isColorsContainerActive,
      isLabelTextContainerActive,
      isLabelTextContainerDisabled,
      openElement,
      closeElement,
      properties,
      onPropertyChange,
      onRichTextStyleChange,
      isRedaction,
      fonts,
      showLineStyleOptions,
      onLineStyleChange,
      isSnapModeEnabled
    } = this.props;

    // We do not have sliders to show up for redaction annots
    if (isRedaction) {
      style.Opacity = null;
      style.StrokeThickness = null;
    }

    const { Scale, Precision, Style } = style;

    const textMenuItems = {
      [DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER]: isTextStyleContainerActive,
      [DataElements.STYLE_POPUP_COLORS_CONTAINER]: isColorsContainerActive,
      [DataElements.STYLE_POPUP_LABEL_TEXT_CONTAINER]: isLabelTextContainerActive
    };

    const openTextMenuItem = (dataElement) => {
      if (!textMenuItems[dataElement]) {
        openElement(dataElement);
        if (isMobile()) {
          for (const element in textMenuItems) {
            if (element !== dataElement) {
              closeElement(element);
            }
          }
        }
      } else {
        closeElement(dataElement);
      }
    };
    const openLabelText = () => openTextMenuItem(DataElements.STYLE_POPUP_LABEL_TEXT_CONTAINER);
    const openTextStyle = () => openTextMenuItem(DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER);
    const openColors = () => openTextMenuItem(DataElements.STYLE_POPUP_COLORS_CONTAINER);

    const className = classNames({
      Popup: true,
      StylePopup: true,
    });

    const showTextStyle = (currentStyleTab === 'TextColor' && (isFreeText || isRedaction));
    const showColorsMenu = (currentStyleTab === 'TextColor' && (isFreeText || isRedaction));
    const showColorPicker = !(showColorsMenu && !isColorsContainerActive);
    const showLabelText = (currentStyleTab === 'TextColor' && isRedaction);
    const showSliders = isColorPaletteDisabled || showColorPicker;
    const hideStylePicker = (currentStyleTab !== 'StrokeColor' && (isFreeText || isRedaction));
    const wasDocumentSwappedToClientSide = (
      this.state.documentType === workerTypes.WEBVIEWER_SERVER &&
      !this.state.document.isWebViewerServerDocument()
    );
    const isEligibleDocumentForSnapping = this.state.documentType === workerTypes.PDF || wasDocumentSwappedToClientSide;

    const showMeasurementSnappingOption = (
      Scale &&
      Precision &&
      isEligibleDocumentForSnapping &&
      !hideSnapModeCheckbox
    );

    return (
      <div className={className} data-element="stylePopup">
        {currentStyleTab && !isColorPaletteDisabled && (
          <>
            <ColorPaletteHeader
              colorPalette={currentStyleTab}
              colorMapKey={colorMapKey}
              style={style}
              toolName={toolName}
              disableSeparator={disableSeparator}
            />
            {showLabelText && !isLabelTextContainerDisabled && (
              <>
                <div className="collapsible-menu" onClick={openLabelText} onTouchStart={openLabelText} role={'toolbar'}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.labelText')}
                  </div>
                  <Icon glyph={`icon-chevron-${isLabelTextContainerActive ? 'up' : 'down'}`} />
                </div>
                {isLabelTextContainerActive && (
                  <div className="menu-items">
                    <LabelTextEditor
                      properties={properties}
                      onPropertyChange={onPropertyChange}
                    />
                  </div>
                )}
                <div className="divider" />
              </>
            )}
            {showTextStyle && (
              <>
                <div className="collapsible-menu" onClick={openTextStyle} onTouchStart={openTextStyle} role={'toolbar'}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.textStyle')}
                  </div>
                  <Icon glyph={`icon-chevron-${isTextStyleContainerActive ? 'up' : 'down'}`} />
                </div>
                {isTextStyleContainerActive && (
                  <div className="menu-items">
                    <TextStylePicker
                      fonts={fonts}
                      onPropertyChange={onPropertyChange}
                      onRichTextStyleChange={onRichTextStyleChange}
                      properties={properties}
                      isRedaction={isRedaction}
                    />
                  </div>
                )}
                <div className="divider" />
              </>
            )}
            {showColorsMenu && (
              <>
                <div className="collapsible-menu" onClick={openColors} onTouchStart={openColors} role={'toolbar'}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.colors')}
                  </div>
                  <Icon glyph={`icon-chevron-${isColorsContainerActive ? 'up' : 'down'}`} />
                </div>
              </>
            )}
            {showColorPicker && (
              <>
                <ColorPalette
                  color={style[currentStyleTab]}
                  property={currentStyleTab}
                  onStyleChange={onStyleChange}
                  colorMapKey={colorMapKey}
                  useMobileMinMaxWidth
                />
                <ColorPalettePicker
                  color={style[currentStyleTab]}
                  property={currentStyleTab}
                  onStyleChange={onStyleChange}
                  enableEdit
                />
              </>
            )}
          </>
        )}
        {showSliders && this.renderSliders()}
        {showMeasurementSnappingOption && (
          <div className="snapping-option">
            <Choice
              dataElement="measurementSnappingOption"
              id="measurement-snapping"
              type="checkbox"
              label={i18next.t('option.shared.enableSnapping')}
              checked={isSnapModeEnabled}
              onChange={this.onSnappingChange}
            />
          </div>
        )}
        {showLineStyleOptions && (
          <LineStyleOptions
            properties={properties}
            onLineStyleChange={onLineStyleChange}
          />
        )}
        {!isStyleOptionDisabled &&
          !showLineStyleOptions &&
          !hideStylePicker &&
          currentStyleTab === 'StrokeColor' &&
          <StyleOption
            borderStyle={Style}
            properties={properties}
            isEllipse={isEllipse}
            onLineStyleChange={onLineStyleChange}/>}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey, isFreeText, isRedaction }) => ({
  currentStyleTab: selectors.getcurrentStyleTab(state, colorMapKey),
  isStylePopupDisabled: selectors.isElementDisabled(state, DataElements.STYLE_POPUP),
  isColorPaletteDisabled: selectors.isElementDisabled(state, DataElements.COLOR_PALETTE),
  isOpacitySliderDisabled: selectors.isElementDisabled(state, DataElements.OPACITY_SLIDER),
  isStrokeThicknessSliderDisabled: selectors.isElementDisabled(state, DataElements.STROKE_THICKNESS_SLIDER),
  isFontSizeSliderDisabled: selectors.isElementDisabled(state, DataElements.FONT_SIZE_SLIDER) || isFreeText || isRedaction,
  isStyleOptionDisabled: selectors.isElementDisabled(state, DataElements.STYLE_OPTION),
  isTextStyleContainerActive: selectors.isElementOpen(state, DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER),
  isColorsContainerActive: selectors.isElementOpen(state, DataElements.STYLE_POPUP_COLORS_CONTAINER),
  isLabelTextContainerActive: selectors.isElementOpen(state, DataElements.STYLE_POPUP_LABEL_TEXT_CONTAINER),
  isLabelTextContainerDisabled: selectors.isElementDisabled(state, DataElements.STYLE_POPUP_LABEL_TEXT_CONTAINER),
  fonts: selectors.getFonts(state),
  isSnapModeEnabled: selectors.isSnapModeEnabled(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  openElement: actions.openElement,
  onSnapModeChange: actions.setEnableSnapMode
};
const ConnectedStylePopup = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StylePopup);

const connectedComponent = (props) => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedStylePopup {...props} isMobile={isMobile} />
  );
};

export default connectedComponent;
