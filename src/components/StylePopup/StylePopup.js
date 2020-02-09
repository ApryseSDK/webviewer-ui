import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import MeasurementOption from 'components/MeasurementOption';
import StyleOption from 'components/StyleOption';
import StampOverlay from 'components/StampOverlay';

import { circleRadius } from 'constants/slider';
import selectors from 'selectors';
import pickBy from 'lodash/pickBy';

import './StylePopup.scss';

class StylePopup extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    isFreeText: PropTypes.bool.isRequired,
    hideSlider: PropTypes.bool,
    colorMapKey: PropTypes.string.isRequired,
    currentPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
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
      currentPalette,
    } = this.props;
    const lineStart = circleRadius;
    const sliderProps = {
      Opacity: {
        property: 'Opacity',
        displayProperty: 'opacity',
        value: Opacity,
        displayValue: `${Math.round(Opacity * 100)}%`,
        getCirclePosition: lineLength => Opacity * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition => circlePosition,
      },
      StrokeThickness: {
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
      },
      FontSize: {
        property: 'FontSize',
        displayProperty: 'text',
        value: FontSize,
        displayValue: `${Math.round(parseInt(FontSize, 10))}pt`,
        getCirclePosition: lineLength =>
          ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition =>
          `${circlePosition * 40 + 5}pt`,
      },
    };

    // default sliders
    let sliders = { Opacity, StrokeThickness, FontSize };
    if (currentPalette === 'TextColor') {
      sliders = { Opacity, FontSize };
    } else if (currentPalette === 'StrokeColor') {
      sliders = { Opacity, StrokeThickness };
    } else if (currentPalette === 'FillColor') {
      sliders = { Opacity };
    }

    // we still want to render a slider if the value is 0
    sliders = pickBy(sliders, slider => slider !== null && slider !== undefined);

    const sliderComponents = Object.keys(sliders).map(key => {
      const props = sliderProps[key];

      return <Slider {...props} key={key} onStyleChange={onStyleChange} />;
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
    const { currentPalette, style, colorMapKey, onStyleChange, toolName } = this.props;
    const { Scale, Precision, Style } = style;

    if (toolName === 'AnnotationCreateRubberStamp') {
      return (
        <div className="Popup StylePopup" data-element="stylePopup">
          {!this.props.hideSlider && this.renderSliders()}
          <StampOverlay />
        </div>
      );
    }

    console.log('toolName', toolName);
    if (toolName.includes('AnnotationCreateSignature')) {
      return (
        <div>
          jsldfkjsdlkfjklsdf
        </div>
      )
    }

    return (
      <div className="Popup StylePopup" data-element="stylePopup">
        {currentPalette && (
          <div className="colors-container">
            <ColorPaletteHeader
              colorPalette={currentPalette}
              colorMapKey={colorMapKey}
              style={style}
            />
            {this.renderColorPalette()}
          </div>
        )}
        {!this.props.hideSlider && this.renderSliders()}
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
});

export default connect(mapStateToProps)(StylePopup);
