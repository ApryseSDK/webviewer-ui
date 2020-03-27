import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import MeasurementOption from 'components/MeasurementOption';
import StyleOption from 'components/StyleOption';

import { circleRadius } from 'constants/slider';
import selectors from 'selectors';

import './StylePopup.scss';

const DATA_ELEMENTS = {
  COLOR_PALETTE: 'colorPalette',
  OPACITY_SLIDER: 'opacitySlider',
  STROKE_THICKNESS_SLIDER: 'strokeThicknessSlider',
  FONT_SIZE_SLIDER: 'fontSizeSlider'
};

class StylePopup extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    isFreeText: PropTypes.bool.isRequired,
    // TODO do something about this
    hideSlider: PropTypes.bool,
    colorMapKey: PropTypes.string.isRequired,
    currentPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    hideColorPalette: PropTypes.bool,
    hideOpacitySlider: PropTypes.bool,
    hideStrokeThicknessSlider: PropTypes.bool,
    hideFontSizeSlider: PropTypes.bool,
  };

  renderColorPalette = () => {
    const { style, onStyleChange, currentPalette } = this.props;

    return (
      <ColorPalette
        color={style[currentPalette]}
        property={currentPalette}
        onStyleChange={onStyleChange}
      />
    );
  };

  renderSliders = () => {
    const {
      style: { Opacity, StrokeThickness, FontSize },
      onStyleChange,
      isFreeText,
      hideOpacitySlider,
      hideStrokeThicknessSlider,
      hideFontSizeSlider,
    } = this.props;
    const lineStart = circleRadius;
    const sliderProps = [];
    if (!hideOpacitySlider) {
      sliderProps.push(
        {
          property: 'Opacity',
          displayProperty: 'opacity',
          value: Opacity,
          displayValue: `${Math.round(Opacity * 100)}%`,
          getCirclePosition: lineLength => Opacity * lineLength + lineStart,
          convertRelativeCirclePositionToValue: circlePosition => circlePosition,
          dataElement: DATA_ELEMENTS.OPACITY_SLIDER
        }
      );
    }
    if (!hideStrokeThicknessSlider) {
      sliderProps.push(
        {
          dataElement: DATA_ELEMENTS.STROKE_THICKNESS_SLIDER,
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
    if (!hideFontSizeSlider) {
      sliderProps.push(
        {
          dataElement: DATA_ELEMENTS.FONT_SIZE_SLIDER,
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
    // const sliderProps = [
    //   {
    //     property: 'Opacity',
    //     displayProperty: 'opacity',
    //     value: Opacity,
    //     displayValue: `${Math.round(Opacity * 100)}%`,
    //     getCirclePosition: lineLength => Opacity * lineLength + lineStart,
    //     convertRelativeCirclePositionToValue: circlePosition => circlePosition,
    //     dataElement: DATA_ELEMENTS.OPACITY_SLIDER
    //   },
    //   {
    //     dataElement: DATA_ELEMENTS.STROKE_THICKNESS_SLIDER,
    //     property: 'StrokeThickness',
    //     displayProperty: 'thickness',
    //     value: StrokeThickness,
    //     displayValue: `${Math.round(StrokeThickness)}pt`,
    //     // FreeText Annotations can have the border thickness go down to 0. For others the minimum is 1.
    //     getCirclePosition: lineLength =>
    //       (isFreeText
    //         ? (StrokeThickness / 20) * lineLength + lineStart
    //         : ((StrokeThickness - 1) / 19) * lineLength + lineStart),
    //     convertRelativeCirclePositionToValue: circlePosition =>
    //       (isFreeText ? circlePosition * 20 : circlePosition * 19 + 1),
    //   },
    //   {
    //     dataElement: DATA_ELEMENTS.FONT_SIZE_SLIDER,
    //     property: 'FontSize',
    //     displayProperty: 'text',
    //     value: FontSize,
    //     displayValue: `${Math.round(parseInt(FontSize, 10))}pt`,
    //     getCirclePosition: lineLength =>
    //       ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
    //     convertRelativeCirclePositionToValue: circlePosition =>
    //       `${circlePosition * 40 + 5}pt`,
    //   },
    // ];

    return [Opacity, StrokeThickness, FontSize].map((value, index) => {
      if (value === null || value === undefined) {
        // we still want to render a slider if the value is 0
        return null;
      }

      const props = sliderProps[index];
      const key = props.property;

      return <Slider {...props} key={key} onStyleChange={onStyleChange} />;
    });
  };

  render() {
    const { hideColorPalette, currentPalette, style, colorMapKey, onStyleChange } = this.props;
    const { Scale, Precision, Style } = style;

    return (
      <div
        className="Popup StylePopup"
        data-element="stylePopup"
      >
        {currentPalette && !hideColorPalette && (
          <div className="colors-container" data-element={DATA_ELEMENTS.COLOR_PALETTE}>
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
        <div
          className="sliders-container"
          onMouseDown={e => e.preventDefault()}
        >
          <div className="sliders">
            {!this.props.hideSlider && this.renderSliders()}
          </div>
        </div>
        {Scale && Precision && (
          <MeasurementOption
            scale={Scale}
            precision={Precision}
            onStyleChange={onStyleChange}
          />
        )}
        { colorMapKey === 'rectangle' && <StyleOption onStyleChange={onStyleChange} borderStyle={Style}/>}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey }) => ({
  currentPalette: selectors.getCurrentPalette(state, colorMapKey),
  hideColorPalette: selectors.isElementDisabled(state, DATA_ELEMENTS.COLOR_PALETTE),
  hideOpacitySlider: selectors.isElementDisabled(state, DATA_ELEMENTS.OPACITY_SLIDER),
  hideStrokeThicknessSlider: selectors.isElementDisabled(state, DATA_ELEMENTS.STROKE_THICKNESS_SLIDER),
  hideFontSizeSlider: selectors.isElementDisabled(state, DATA_ELEMENTS.FONT_SIZE_SLIDER),
});

export default connect(mapStateToProps)(StylePopup);