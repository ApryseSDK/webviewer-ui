import React from 'react';
import PropTypes from 'prop-types';

import ColorPaletteHeader from 'components/ColorPaletteHeader';
import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';

import { circleRadius } from 'constants/slider';

import './StylePopup.scss';

class StylePopup extends React.PureComponent { 
  static propTypes = {
    style: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    isFreeText: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const {  TextColor, StrokeColor, FillColor } = this.props.style;

    return { 
      colorPalette: TextColor ? 'text' : StrokeColor ? 'border' : FillColor ? 'fill' : ''
    };
  }

  handleHeaderChange = colorPalette => {
    this.setState({ colorPalette });
  }

  renderColorPalette = () => {
    const { colorPalette } = this.state;

    if (!colorPalette) {
      return null;
    }

    const { 
      style: { FillColor, StrokeColor, TextColor }, 
      onStyleChange 
    } = this.props;
    const map = {
      text: {
        color: TextColor,
        property: 'TextColor'
      },
      border: {
        color: StrokeColor,
        property: 'StrokeColor'
      },
      fill: {
        color: FillColor,
        property: 'FillColor'
      }
    };
    const { color, property } = map[colorPalette];

    return <ColorPalette color={color} property={property} onStyleChange={onStyleChange} />;
  }

  renderSliders = () => {
    const { 
      style: { Opacity, StrokeThickness, FontSize }, 
      onStyleChange,
      isFreeText
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
        getCirclePosition: lineLength => isFreeText ? StrokeThickness / 20 * lineLength + lineStart : (StrokeThickness - 1) / 19 * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition => isFreeText ? circlePosition * 20 : circlePosition * 19 + 1,
      },
      {
        property: 'FontSize',  
        displayProperty: 'text',
        value: FontSize,
        displayValue: `${Math.round(parseInt(FontSize, 10))}pt`,
        getCirclePosition: lineLength => (parseInt(FontSize, 10) - 5) / 40 * lineLength + lineStart,
        convertRelativeCirclePositionToValue: circlePosition => circlePosition * 40 + 5 + 'pt',
      }
    ];

    return [Opacity, StrokeThickness, FontSize].map((value, index) => {
      if (value === null || value === undefined) { // we still want to render a slider if the value is 0
        return null;
      }

      const props = sliderProps[index];
      const key = props.property;

      return <Slider {...props} key={key} onStyleChange={onStyleChange} />;
    });
  }

  render() {
    return (
      <div className="Popup StylePopup" data-element="stylePopup" onClick={e => e.stopPropagation()} onScroll={e => e.stopPropagation()}>
        <div className="colors-container">
          <div className="inner-wrapper">
            <ColorPaletteHeader colorPalette={this.state.colorPalette} style={this.props.style} onHeaderChange={this.handleHeaderChange} />
            {this.renderColorPalette()}
          </div>
        </div>
        <div className="sliders-container" onMouseDown={e => e.preventDefault()}>
          <div className="sliders">
            {this.renderSliders()}
          </div>
        </div>
      </div>
    );
  }
}

export default StylePopup;