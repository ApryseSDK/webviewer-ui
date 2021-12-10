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

import { circleRadius } from 'constants/slider';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';
import actions from 'actions';
import pickBy from 'lodash/pickBy';
import useMedia from 'hooks/useMedia';
import classNames from 'classnames';

import './StylePopup.scss';
import Icon from "components/Icon";
import TextStylePicker from "components/TextStylePicker";
import { isMobile } from "helpers/device";

class StylePopup extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    onPropertyChange: PropTypes.func.isRequired,
    onRichTextStyleChange: PropTypes.func,
    isFreeText: PropTypes.bool,
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
    freeTextProperties: PropTypes.object,
  };

  renderSliders = () => {
    const {
      style: { Opacity, StrokeThickness, FontSize },
      onStyleChange,
      onPropertyChange,
      isFreeText,
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
      };
    }
    if (!isStrokeThicknessSliderDisabled) {
      sliderProps.StrokeThickness = {
        property: 'StrokeThickness',
        displayProperty: 'thickness',
        value: StrokeThickness,
        getDisplayValue: StrokeThickness => `${Math.round(StrokeThickness)}pt`,
        dataElement: DataElements.STROKE_THICKNESS_SLIDER,
        // FreeText Annotations can have the border thickness go down to 0. For others the minimum is 1.
        getCirclePosition: (lineLength, StrokeThickness) =>
          (isFreeText
            ? (StrokeThickness / 20) * lineLength + lineStart
            : ((StrokeThickness - 1) / 19) * lineLength + lineStart),
        convertRelativeCirclePositionToValue: circlePosition =>
          (isFreeText ? circlePosition * 20 : circlePosition * 19 + 1),
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

      return <Slider {...props} key={key} onStyleChange={onStyleChange} onSliderChange={onPropertyChange}/>;
    });

    return (
      <React.Fragment>
        {sliderComponents.length > 0 && (
          <div
            className="sliders-container"
            onMouseDown={e => e.preventDefault()}
          >
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
      isTextContainerActive,
      isColorContainerActive,
      openElement,
      closeElement,
      freeTextProperties,
      onPropertyChange,
      onRichTextStyleChange,
    } = this.props;

    const { Scale, Precision, Style } = style;

    const openTextStyle = () => {
      if (!isTextContainerActive) {
        openElement(DataElements.FREE_TEXT_STYLE_TEXT_CONTAINER);
        isMobile() && closeElement(DataElements.FREE_TEXT_STYLE_COLOR_CONTAINER);
      } else {
        closeElement(DataElements.FREE_TEXT_STYLE_TEXT_CONTAINER);
      }
    };

    const openColorStyle = () => {
      if (!isColorContainerActive) {
        openElement(DataElements.FREE_TEXT_STYLE_COLOR_CONTAINER);
        isMobile() && closeElement(DataElements.FREE_TEXT_STYLE_TEXT_CONTAINER);
      } else {
        closeElement(DataElements.FREE_TEXT_STYLE_COLOR_CONTAINER);
      }
    };

    const className = classNames({
      Popup: true,
      StylePopup: true,
    });
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
            {isFreeText && currentPalette === "TextColor" ? (
              <>
                <div className="collapsible-menu" onClick={openTextStyle} onTouchStart={openTextStyle} role={"toolbar"}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.textStyle')}
                  </div>
                  <Icon glyph={`icon-chevron-${isTextContainerActive ? "up" : "down"}`}/>
                </div>
                <div className={`menu-items ${!isTextContainerActive && "closed"}`}>
                  <TextStylePicker onPropertyChange={onPropertyChange} onRichTextStyleChange={onRichTextStyleChange} properties={freeTextProperties} />
                </div>

                <div className="divider"/>

                <div className="collapsible-menu" onClick={openColorStyle} onTouchStart={openColorStyle} role={"toolbar"}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.colorStyle')}
                  </div>
                  <Icon glyph={`icon-chevron-${isColorContainerActive ? "up" : "down"}`}/>
                </div>
                <div className={`menu-items ${!isColorContainerActive && "closed"}`}>
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
                </div>
              </>
            ) : (
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
        {(!isFreeText || currentPalette !== "TextColor" || isColorContainerActive) && this.renderSliders()}
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
        {!isStyleOptionDisabled && colorMapKey === 'rectangle' && <StyleOption onStyleChange={onStyleChange} borderStyle={Style} />}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey, isFontSizeSliderDisabled }) => ({
  currentPalette: selectors.getCurrentPalette(state, colorMapKey),
  isStylePopupDisabled: selectors.isElementDisabled(state, DataElements.STYLE_POPUP),
  isColorPaletteDisabled: selectors.isElementDisabled(state, DataElements.COLOR_PALETTE),
  isOpacitySliderDisabled: selectors.isElementDisabled(state, DataElements.OPACITY_SLIDER),
  isStrokeThicknessSliderDisabled: selectors.isElementDisabled(state, DataElements.STROKE_THICKNESS_SLIDER),
  isFontSizeSliderDisabled: isFontSizeSliderDisabled || selectors.isElementDisabled(state, DataElements.FONT_SIZE_SLIDER),
  isStyleOptionDisabled: selectors.isElementDisabled(state, DataElements.STYLE_OPTION),
  isTextStyleOpen: selectors.isElementDisabled(state, DataElements.STYLE_OPTION),
  isTextContainerActive: selectors.isElementOpen(state, DataElements.FREE_TEXT_STYLE_TEXT_CONTAINER),
  isColorContainerActive: selectors.isElementOpen(state, DataElements.FREE_TEXT_STYLE_COLOR_CONTAINER),
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
