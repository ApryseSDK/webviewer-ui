import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import './Slider.scss';

const propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayProperty: PropTypes.string.isRequired,
  getDisplayValue: PropTypes.func.isRequired,
  onSliderChange: PropTypes.func.isRequired,
  dataElement: PropTypes.string,
  onStyleChange: PropTypes.func.isRequired,
  withInputField: PropTypes.bool,
  inputFieldType: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  getLocalValue: PropTypes.func,
  shouldHideSliderTitle: PropTypes.bool,
  shouldHideSliderValue: PropTypes.bool,
  steps: PropTypes.array,
};

function Slider(props) {
  const {
    step = 1,
    displayProperty,
    steps = [],
    dataElement,
    shouldHideSliderValue,
    shouldHideSliderTitle,
    getDisplayValue,
    withInputField,
    onStyleChange,
    onSliderChange,
    property,
    getLocalValue,
    inputFieldType = 'number',
    min = 0,
    max = 100,
  } = props;
  let {
    value,
  } = props;
  if (typeof value === 'string' || value instanceof String) {
    value = parseFloat(value, 10);
  }

  const inputRef = useRef(null);
  const sliderRef = useRef(null);
  const [t] = useTranslation();
  const [isEditingInputField, setIsEditingInputField] = useState(false);

  const isThereSteps = steps.length !== 0;

  let defaultDisplayValue = value;

  let index = value;
  if (isThereSteps) {
    index = steps.findIndex((i) => i >= value);
    defaultDisplayValue = steps[index];
  }
  const [position, setPosition] = React.useState(index);
  const [displayValue, setDisplayValue] = React.useState(defaultDisplayValue);
  const [inputValue, setInputValue] = React.useState(value);

  const updateParent = (text) => {
    const payload = (getLocalValue) ? getLocalValue(text) : text;
    onSliderChange(property, payload);
    onStyleChange(property, payload);
  };

  const onChange = (e) => {
    const targetValue = e.target.value;
    let newValue;
    if (isThereSteps) {
      newValue = steps[targetValue];
    } else {
      newValue = targetValue;
    }

    setDisplayValue(newValue);
    setInputValue(newValue);
    setPosition(targetValue);
    updateParent(newValue);
  };

  const onInputChange = (e) => {
    let minV = min;
    let maxV = max;
    if (isThereSteps) {
      minV = steps[0];
      maxV = steps[steps.length - 1];
    }

    if (isNaN(e.target.value) || e.target.value === '') {
      return;
    }

    if (e.target.value > maxV) {
      e.target.value = maxV;
    }
    let targetValue = e.target.value;
    if (e.target.value < minV) {
      targetValue = minV;
    }

    let position;
    if (isThereSteps) {
      const index = steps.findIndex((i) => i >= targetValue);
      position = index;
    } else {
      position = targetValue;
    }

    setDisplayValue(targetValue);
    setInputValue(targetValue);
    setPosition(position);
    updateParent(targetValue);
  };

  const onInputBlur = (isEditing) => {
    setIsEditingInputField(isEditing);
  };

  const onInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    const percentage = ((position - min) / (max - min)) * 100;
    sliderRef.current.style.background = `linear-gradient(to right, var(--slider-filled) ${percentage}%, var(--slider-background) ${percentage}%)`;
  }, [position]);

  useEffect(() => {
    const targetValue = value;
    let position = targetValue;
    if (isThereSteps) {
      const index = steps.findIndex((i) => i >= targetValue);
      position = index;
    }

    setDisplayValue(targetValue);
    setInputValue(targetValue);
    setPosition(position);
  }, [value]);

  const label = t(`option.slider.${displayProperty}`, displayProperty);

  function renderInputElement() {
    const text = t(`option.slider.${displayProperty}`);
    const ariaLabel = `${text} ${displayValue}pt`;
    return (isEditingInputField && inputFieldType === 'number') ? (
      <div className="slider-input-wrapper">
        <input
          ref={inputRef}
          className="slider-input-field is-editing"
          aria-label={ariaLabel}
          aria-labelledby={`slider-${label}`}
          autoFocus
          type="text"
          min={min}
          max={max}
          step={step}
          onChange={onInputChange}
          defaultValue={inputValue}
          onBlur={() => onInputBlur(false)}
          onKeyDown={onInputKeyDown}
        />
      </div>
    ) : (
      <input
        readOnly
        type="text"
        className="slider-input-field"
        aria-label={ariaLabel}
        aria-labelledby={`slider-${label}`}
        value={getDisplayValue(displayValue)}
        onFocus={setIsEditingInputField}
      />
    );
  }

  return (
    <div className="slider" data-element={dataElement}>
      {!shouldHideSliderTitle && (
        <div id={`slider-${label}`} className="slider-property" onMouseDown={(e) => e.preventDefault()}>
          {label}
        </div>
      )}
      <div className="slider-element-container">
        <div className='slider-input'>
          <input
            ref={sliderRef}
            style={{ width: '100%' }}
            aria-labelledby={`slider-${label}`}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={displayValue}
            aria-valuetext={`${label} ${getDisplayValue(displayValue)}`}
            type='range'
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            value={position}
          />
        </div>
        {!shouldHideSliderValue && (
          (withInputField)
            ? (renderInputElement())
            : (<div className="slider-value">{getDisplayValue(displayValue)}</div>)
        )}
      </div>
    </div>
  );
}

Slider.propTypes = propTypes;


export default Slider;