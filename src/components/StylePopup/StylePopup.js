import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18next from "i18next";

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import ColorPalettePicker from 'components/ColorPalettePicker';
import Slider from 'components/Slider';
import MeasurementOption from 'components/MeasurementOption';
import StyleOption from 'components/StyleOption';
import LineStyleOptions from 'components/LineStyleOptions';
import Icon from "components/Icon";
import TextStylePicker from "components/TextStylePicker";
import LabelTextEditor from "components/LabelTextEditor";

import { circleRadius } from 'constants/slider';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';
import actions from 'actions';
import pickBy from 'lodash/pickBy';
import useMedia from 'hooks/useMedia';
import classNames from 'classnames';
import { isMobile } from "helpers/device";

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
    isMeasure: PropTypes.bool,
    colorMapKey: PropTypes.string.isRequired,
    currentPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    isColorPaletteDisabled: PropTypes.bool,
    isOpacitySliderDisabled: PropTypes.bool,
    isStrokeThicknessSliderDisabled: PropTypes.bool,
    isFontSizeSliderDisabled: PropTypes.bool,
    isStyleOptionDisabled: PropTypes.bool,
    isStylePopupDisabled: PropTypes.bool,
    hideSnapModeCheckbox: PropTypes.bool,
    closeElement: PropTypes.func,
    openElement: PropTypes.func,
    properties: PropTypes.object,
    isRedaction: PropTypes.bool,
    fonts: PropTypes.array,
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
      currentPalette,
    } = this.props;
    const lineStart = circleRadius;
    const sliderProps = {};

    if (!isOpacitySliderDisabled) {
      sliderProps.Opacity = {
        property: 'Opacity',
        displayProperty: 'opacity',
        value: Opacity,
        getDisplayValue: Opacity => `${Math.round(Opacity * 100)}%`,
        dataElement: DataElements.OPACITY_SLIDER,
        getCirclePosition: (lineLength, Opacity) => Opacity * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition => circlePosition,
        withInputField: true,
        inputFieldType: 'number',
        min: 0,
        max: 100,
        step: 1,
        getLocalValue: opacity => parseInt(opacity) / 100,
      };
    }
    if (!isStrokeThicknessSliderDisabled) {
      sliderProps.StrokeThickness = {
        property: 'StrokeThickness',
        displayProperty: 'thickness',
        value: StrokeThickness,
        getDisplayValue: strokeThickness => {
          const placeOfDecimal = Math.floor(strokeThickness) !== strokeThickness ? strokeThickness.toString().split(".")[1].length || 0 : 0;
          if (StrokeThickness === 0 || StrokeThickness >= 1 && (placeOfDecimal > 2 || placeOfDecimal === 0)) {
            return `${Math.round(strokeThickness)}pt`;
          } else {
            return `${parseFloat(strokeThickness).toFixed(2)}pt`
          }
        },
        dataElement: DataElements.STROKE_THICKNESS_SLIDER,
        getCirclePosition: (lineLength, strokeThickness) => (strokeThickness / 20) * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition => {
          if (circlePosition >= 1 / 20) {
            return circlePosition * 20;
          }
          else if (circlePosition >= 0.75 / 20 && circlePosition < 1 / 20) {
            return 0.75;
          }
          else if (circlePosition >= 0.5 / 20 && circlePosition < 0.75 / 20) {
            return 0.5;
          }
          else if (circlePosition >= 0.25 / 20 && circlePosition < 0.5 / 20) {
            return 0.25;
          }
          else if (circlePosition >= 0.08 / 20 && circlePosition < 0.25 / 20) {
            return 0.1;
          }
          else {
            return isFreeText ? 0 : 0.1;
          }
        },
        withInputField: true,
        inputFieldType: 'number',
        min: isFreeText ? 0 : 0.1,
        max: 20,
        step: 1,
        getLocalValue: strokeThickness => parseFloat(strokeThickness).toFixed(2)
      };
    }
    if (!isFontSizeSliderDisabled) {
      sliderProps.FontSize = {
        property: 'FontSize',
        displayProperty: 'text',
        value: FontSize,
        getDisplayValue: FontSize => `${Math.round(parseInt(FontSize, 10))}pt`,
        dataElement: DataElements.FONT_SIZE_SLIDER,
        getCirclePosition: (lineLength, FontSize) =>
          ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition =>
          `${circlePosition * 40 + 5}pt`,
      };
    }

    // default sliders
    let sliders = { Opacity, StrokeThickness, FontSize };
    if (currentPalette === 'TextColor') {
      sliders = { Opacity, FontSize };
    } else if (currentPalette === 'StrokeColor') {
      sliders = { Opacity, StrokeThickness };
    } else if (currentPalette === 'FillColor') {
      sliders = { Opacity };
    }

    if (isMeasure) {
      sliders.FontSize = FontSize;
    }

    if (isOpacitySliderDisabled) {
      delete sliders.Opacity;
    }

    if (isStrokeThicknessSliderDisabled) {
      delete sliders.StrokeThickness;
    }

    if (isFontSizeSliderDisabled) {
      delete sliders.FontSize;
    }

    // we still want to render a slider if the value is 0
    sliders = pickBy(sliders, slider => slider !== null && slider !== undefined);

    const sliderComponents = Object.keys(sliders).map(key => {
      const props = sliderProps[key];

      return <Slider {...props} key={key} onStyleChange={onStyleChange} onSliderChange={onSliderChange}/>;
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
      currentPalette,
      style,
      colorMapKey,
      onStyleChange,
      isStyleOptionDisabled,
      disableSeparator,
      hideSnapModeCheckbox,
      isFreeText,
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
      onLineStyleChange
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
          for (let element in textMenuItems) {
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

    const showTextStyle = (currentPalette === "TextColor" && (isFreeText || isRedaction));
    const showColorsMenu = (currentPalette === "TextColor" && (isFreeText || isRedaction));
    const showColorPicker = !(showColorsMenu && !isColorsContainerActive);
    const showLabelText = (currentPalette === "TextColor" && isRedaction);
    const showSliders = isColorPaletteDisabled || showColorPicker;

    return (
      <div className={className} data-element="stylePopup">
        {currentPalette && !isColorPaletteDisabled && (
          <>
            <ColorPaletteHeader
              colorPalette={currentPalette}
              colorMapKey={colorMapKey}
              style={style}
              toolName={toolName}
              disableSeparator={disableSeparator}
            />
            {showLabelText && !isLabelTextContainerDisabled && (
              <>
                <div className="collapsible-menu" onClick={openLabelText} onTouchStart={openLabelText} role={"toolbar"}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.labelText')}
                  </div>
                  <Icon glyph={`icon-chevron-${isLabelTextContainerActive ? "up" : "down"}`} />
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
                <div className="collapsible-menu" onClick={openTextStyle} onTouchStart={openTextStyle} role={"toolbar"}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.textStyle')}
                  </div>
                  <Icon glyph={`icon-chevron-${isTextStyleContainerActive ? "up" : "down"}`} />
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
                <div className="collapsible-menu" onClick={openColors} onTouchStart={openColors} role={"toolbar"}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.colors')}
                  </div>
                  <Icon glyph={`icon-chevron-${isColorsContainerActive ? "up" : "down"}`} />
                </div>
              </>
            )}
            {showColorPicker && (
              <>
                <ColorPalette
                  color={style[currentPalette]}
                  property={currentPalette}
                  onStyleChange={onStyleChange}
                  colorMapKey={colorMapKey}
                  useMobileMinMaxWidth
                />
                <ColorPalettePicker
                  color={style[currentPalette]}
                  property={currentPalette}
                  onStyleChange={onStyleChange}
                  enableEdit
                />
              </>
            )}
          </>
        )}
        {showSliders && this.renderSliders()}
        {Scale && Precision && (
          <>
            <MeasurementOption
              scale={Scale}
              precision={Precision}
              hideSnapModeCheckbox={hideSnapModeCheckbox}
              onStyleChange={onStyleChange}
            />
          </>
        )}
        {showLineStyleOptions && (
          <LineStyleOptions
            properties={properties}
            onLineStyleChange={onLineStyleChange}
          />
        )}
        {!isStyleOptionDisabled && colorMapKey === 'rectangle' && <StyleOption onStyleChange={onStyleChange} borderStyle={Style} />}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey, isFreeText, isRedaction }) => ({
  currentPalette: selectors.getCurrentPalette(state, colorMapKey),
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
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  openElement: actions.openElement,
};
const ConnectedStylePopup = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StylePopup);

export default props => {
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
