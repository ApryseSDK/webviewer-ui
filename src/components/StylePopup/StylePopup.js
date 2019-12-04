import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import MeasurementOption from 'components/MeasurementOption';

import { circleRadius } from 'constants/slider';

import selectors from 'selectors';

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
    } = this.props;
    const lineStart = circleRadius;
    const sliderProps = [
      {
        property: 'Opacity',
        displayProperty: 'opacity',
        value: Opacity,
        displayValue: `${Math.round(Opacity * 100)}%`,
        getCirclePosition: lineLength => Opacity * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition => circlePosition,
      },
      {
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
      {
        property: 'FontSize',
        displayProperty: 'text',
        value: FontSize,
        displayValue: `${Math.round(parseInt(FontSize, 10))}pt`,
        getCirclePosition: lineLength =>
          ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition =>
          `${circlePosition * 40 + 5}pt`,
      },
    ];

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
    const { currentPalette, style, colorMapKey, onStyleChange } = this.props;
    const { Scale, Precision } = style;

    const circleCenter = 0;

    return (
      <div
        className="grid-container"
        data-element="stylePopup"
      >
        <div className="cell-123">1</div>
        <div className="cell-123">2</div>
        <div className="cell-123">3</div>
        <div className="cell-123">4</div>
        <div className="cell-123">5</div>
        <div className="cell-123">6</div>
        <div className="cell-123">7</div>
        {/* {currentPalette && (
          <div className="colors-container">
            <div className="inner-wrapper">
              <ColorPaletteHeader
                colorPalette={currentPalette}
                colorMapKey={colorMapKey}
                style={style}
              />
              {this.renderColorPalette()}
            </div>
          </div>
        )} */}
        {/* {!this.props.hideSlider &&
          <div
            className="sliders-container"
            onMouseDown={e => e.preventDefault()}
          >
            <div className="sliders">
              {this.renderSliders()}
            </div>
          </div>
        } */}
        {/* <svg width="10%" data-element="slider">
          <line x1={circleRadius} y1="50%" x2={circleCenter} y2="50%" strokeWidth="2" stroke="#00a5e4" strokeLinecap="round" />
          <line x1={circleCenter} y1="50%" x2={0 + circleRadius} y2="50%" strokeWidth="2" stroke="#e0e0e0" strokeLinecap="round" />
          <circle cx={circleCenter} cy="50%" r={circleRadius} fill="#00a5e4" />
        </svg> */}
        {/* {Scale && Precision && (
          <MeasurementOption
            scale={Scale}
            precision={Precision}
            onStyleChange={onStyleChange}
          />
        )} */}
      </div>
    );
  }
}

const mapStateToProps = (state, { colorMapKey }) => ({
  currentPalette: selectors.getCurrentPalette(state, colorMapKey),
});

export default connect(mapStateToProps)(StylePopup);
