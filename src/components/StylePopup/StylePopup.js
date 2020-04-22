import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import MeasurementOption from 'components/MeasurementOption';
import StyleOption from 'components/StyleOption';

import { circleRadius } from 'constants/slider';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';

import './StylePopup.scss';

class StylePopup extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    isFreeText: PropTypes.bool.isRequired,
    colorMapKey: PropTypes.string.isRequired,
    currentPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    isColorPaletteDisabled: PropTypes.bool,
    isOpacitySliderDisabled: PropTypes.bool,
    isStrokeThicknessSliderDisabled: PropTypes.bool,
    isFontSizeSliderDisabled: PropTypes.bool,
    isStyleOptionDisabled: PropTypes.bool,
    isStylePopupDisabled: PropTypes.bool,
  };

  renderColorPalette = () => {
    const { style, onStyleChange, currentPalette, colorMapKey } = this.props;

    return (
      <ColorPalette
        color={style[currentPalette]}
        property={currentPalette}
        onStyleChange={onStyleChange}
        colorMapKey={colorMapKey}
      />
    );
  };

  renderSliders = () => {
    const {
      style: { Opacity, StrokeThickness, FontSize },
      onStyleChange,
      isFreeText,
      isOpacitySliderDisabled,
      isStrokeThicknessSliderDisabled,
      isFontSizeSliderDisabled,
    } = this.props;
    const lineStart = circleRadius;
    const sliderProps = [];
    if (!isOpacitySliderDisabled) {
      sliderProps.push(
        {
          property: 'Opacity',
          displayProperty: 'opacity',
          value: Opacity,
          displayValue: `${Math.round(Opacity * 100)}%`,
          getCirclePosition: lineLength => Opacity * lineLength + lineStart,
          convertRelativeCirclePositionToValue: circlePosition => circlePosition,
          dataElement: DataElements.OPACITY_SLIDER
        }
      );
    }
    if (!isStrokeThicknessSliderDisabled) {
      sliderProps.push(
        {
          dataElement: DataElements.STROKE_THICKNESS_SLIDER,
          property: 'StrokeThickness',
          displayProperty: 'thickness',
          value: StrokeThickness,
          displayValue: `${Math.round(StrokeThickness)}pt`,
          // FreeText Annotations can have the border thickness go down to 0. For others the minimum is 1.
          getCirclePosition: lineLength =>
            (isFreeText
              ? (StrokeThickness / 20) * lineLength + lineStart
              : ((StrokeThickness - 1) / 19) * lineLength + lineStart),
          convertRelativeCirclePositionToValue: circlePosition =>
            (isFreeText ? circlePosition * 20 : circlePosition * 19 + 1),
        }
      );
    }
    if (!isFontSizeSliderDisabled) {
      sliderProps.push(
        {
          dataElement: DataElements.FONT_SIZE_SLIDER,
          property: 'FontSize',
          displayProperty: 'text',
          value: FontSize,
          displayValue: `${Math.round(parseInt(FontSize, 10))}pt`,
          getCirclePosition: lineLength =>
            ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
          convertRelativeCirclePositionToValue: circlePosition =>
            `${circlePosition * 40 + 5}pt`,
        },
      );
    }

    return [Opacity, StrokeThickness, FontSize].map((value, index) => {
      if (value === null || value === undefined || !sliderProps[index]) {
        // we still want to render a slider if the value is 0
        return null;
      }

      const props = sliderProps[index];
      const key = props.property;

      return <Slider {...props} key={key} onStyleChange={onStyleChange} />;
    });
  };

  render() {
    const { isColorPaletteDisabled,
      currentPalette,
      style,
      colorMapKey,
      onStyleChange,
      isOpacitySliderDisabled,
      isStrokeThicknessSliderDisabled,
      isFontSizeSliderDisabled,
      isStyleOptionDisabled,
      isStylePopupDisabled } = this.props;
    const { Scale, Precision, Style } = style;

    const hideAllSlider = isOpacitySliderDisabled && isStrokeThicknessSliderDisabled && isFontSizeSliderDisabled;
    if (isStylePopupDisabled) {
      return null;
    }
    return (
      <div
        className="Popup StylePopup"
        data-element={DataElements.STYLE_POPUP}
      >
        {currentPalette && !isColorPaletteDisabled && (
          <div className="colors-container" data-element={DataElements.COLOR_PALETTE}>
            <div className="inner-wrapper">
              <ColorPaletteHeader
                colorPalette={currentPalette}
                colorMapKey={colorMapKey}
                style={style}
              />
              {this.renderColorPalette()}
            </div>
          </div>
        )}
        {!hideAllSlider &&
          <div
            className="sliders-container"
            onMouseDown={e => e.preventDefault()}
          >
            <div className="sliders">
              {this.renderSliders()}
            </div>
          </div>
        }

        {Scale && Precision && (
          <MeasurementOption
            scale={Scale}
            precision={Precision}
            onStyleChange={onStyleChange}
          />
        )}
        { !isStyleOptionDisabled && colorMapKey === 'rectangle' && <StyleOption onStyleChange={onStyleChange} borderStyle={Style}/>}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey }) => ({
  currentPalette: selectors.getCurrentPalette(state, colorMapKey),
  isStylePopupDisabled: selectors.isElementDisabled(state, DataElements.STYLE_POPUP),
  isColorPaletteDisabled: selectors.isElementDisabled(state, DataElements.COLOR_PALETTE),
  isOpacitySliderDisabled: selectors.isElementDisabled(state, DataElements.OPACITY_SLIDER),
  isStrokeThicknessSliderDisabled: selectors.isElementDisabled(state, DataElements.STROKE_THICKNESS_SLIDER),
  isFontSizeSliderDisabled: selectors.isElementDisabled(state, DataElements.FONT_SIZE_SLIDER),
  isStyleOptionDisabled: selectors.isElementDisabled(state, DataElements.STYLE_OPTION)
});

export default connect(mapStateToProps)(StylePopup);