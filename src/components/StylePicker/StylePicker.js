import React from 'react';
import './StylePicker.scss';
import ColorPicker from './ColorPicker';
import Slider from 'components/Slider';
import DataElements from 'constants/dataElement';
import { circleRadius } from 'constants/slider';
import LineStyleOptions from 'components/LineStyleOptions';
import StyleOption from 'components/StyleOption';
import SnapModeToggle from './SnapModeToggle';
import selectors from 'selectors';
import { useSelector } from 'react-redux';

const propTypes = {};

const MAX_STROKE_THICKNESS = 20;

const StylePicker = ({
  colorProperty,
  onStyleChange,
  sliderProperties = [],
  style,
  lineStyleProperties,
  isFreeText,
  isEllipse,
  isRedaction,
  onLineStyleChange,
  showLineStyleOptions,
  isInFormBuilderAndNotFreeText,
  hideSnapModeCheckbox,
}) => {
  // We do not have sliders to show up for redaction annots
  if (isRedaction) {
    style.Opacity = null;
    style.StrokeThickness = null;
  }

  const isSnapModeEnabled = useSelector((state) => selectors.isSnapModeEnabled(state));
  const isStyleOptionDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.STYLE_OPTION));

  const onColorChange = (color) => {
    onStyleChange && onStyleChange(colorProperty, color);
  };

  const onSliderChange = (property, value) => {
    onStyleChange && onStyleChange(property, value);
  };

  const getSliderProps = (type) => {
    const { Opacity, StrokeThickness } = style;
    const lineStart = circleRadius;
    switch (type.toLowerCase()) {
      case 'opacity':
        return {
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
      case 'strokethickness':
        return {
          property: 'StrokeThickness',
          displayProperty: 'thickness',
          value: StrokeThickness,
          getDisplayValue: (strokeThickness) => {
            const placeOfDecimal =
              Math.floor(strokeThickness) !== strokeThickness ? strokeThickness.toString().split('.')[1].length || 0 : 0;
            if (StrokeThickness === 0 || (StrokeThickness >= 1 && (placeOfDecimal > 2 || placeOfDecimal === 0))) {
              return `${Math.round(strokeThickness)}pt`;
            }
            return `${parseFloat(strokeThickness).toFixed(2)}pt`;
          },
          dataElement: DataElements.STROKE_THICKNESS_SLIDER,
          getCirclePosition: (lineLength, strokeThickness) => (strokeThickness / MAX_STROKE_THICKNESS) * lineLength + lineStart,
          convertRelativeCirclePositionToValue: (circlePosition) => {
            if (circlePosition >= 1 / MAX_STROKE_THICKNESS) {
              return Math.round(circlePosition * MAX_STROKE_THICKNESS);
            }
            if (circlePosition >= 0.75 / MAX_STROKE_THICKNESS && circlePosition < 1 / MAX_STROKE_THICKNESS) {
              return 0.75;
            }
            if (circlePosition >= 0.5 / MAX_STROKE_THICKNESS && circlePosition < 0.75 / MAX_STROKE_THICKNESS) {
              return 0.5;
            }
            if (circlePosition >= 0.25 / MAX_STROKE_THICKNESS && circlePosition < 0.5 / MAX_STROKE_THICKNESS) {
              return 0.25;
            }
            if (circlePosition >= 0.08 / MAX_STROKE_THICKNESS && circlePosition < 0.25 / MAX_STROKE_THICKNESS) {
              return 0.1;
            }
            return isFreeText ? 0 : 0.1;
          },
          withInputField: true,
          inputFieldType: 'number',
          min: isFreeText ? 0 : 0.1,
          max: MAX_STROKE_THICKNESS,
          step: 1,
          getLocalValue: (strokeThickness) => parseFloat(strokeThickness).toFixed(2),
        };
    }
  };

  const renderSliders = () => {
    return sliderProperties.map((property) => {
      const sliderProps = getSliderProps(property);
      return <Slider key={property} {...sliderProps} onStyleChange={onSliderChange} onSliderChange={onSliderChange}/>;
    });
  };

  return (
    <div className="StylePicker">
      <ColorPicker
        onColorChange={onColorChange}
      />
      {renderSliders()}
      {showLineStyleOptions &&
        <LineStyleOptions properties={lineStyleProperties} onLineStyleChange={onLineStyleChange} />}
      {
        !isStyleOptionDisabled &&
        !showLineStyleOptions &&
        !isInFormBuilderAndNotFreeText && (
          <StyleOption
            borderStyle={style.Style}
            properties={lineStyleProperties}
            isEllipse={isEllipse}
            onLineStyleChange={onLineStyleChange}
          />
        )
      }
      {!hideSnapModeCheckbox &&
        <SnapModeToggle Scale={style.Scale} Precision={style.Precision} isSnapModeEnabled={isSnapModeEnabled} />
      }
    </div>
  );
};

StylePicker.propTypes = propTypes;

export default StylePicker;