import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import './Slider.scss';
import useIsRTL from 'hooks/useIsRTL';
import DataElementWrapper from '../DataElementWrapper';

const propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayProperty: PropTypes.string.isRequired,
  getDisplayValue: PropTypes.func.isRequired,
  onSliderChange: PropTypes.func.isRequired,
  dataElement: PropTypes.string,
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
  const isRightToLeft = useIsRTL();

  const isThereSteps = steps.length !== 0;

  let defaultDisplayValue = value;

  let index = value;
  if (isThereSteps) {
    index = steps.findIndex((i) => i >= value);
    defaultDisplayValue = steps[index];
  }
  const [position, setPosition] = useState(index);
  const [displayValue, setDisplayValue] = useState(defaultDisplayValue);
  const [inputValue, setInputValue] = useState(value);

  const updateParent = (text, mouseUp) => {
    const payload = (getLocalValue) ? getLocalValue(text) : text;
    onSliderChange(property, payload, mouseUp);
  };

  const handleChange = (e, mouseUp = false) => {
    let targetValue = parseFloat(e.target.value);
    if (isRightToLeft) {
      targetValue = max - (targetValue - min);
    }
    const newValue = isThereSteps ? steps[targetValue] : targetValue;

    setDisplayValue(newValue);
    setInputValue(newValue);
    setPosition(targetValue);
    updateParent(newValue, mouseUp);
  };

  const handleDragEnd = (e) => {
    handleChange(e, true);
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
    updateParent(targetValue, true);
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
    if (sliderRef.current) {
      sliderRef.current.style.background = isRightToLeft
        ? `linear-gradient(to left, var(--slider-filled) ${percentage}%, var(--slider-background) ${percentage}%)`
        : `linear-gradient(to right, var(--slider-filled) ${percentage}%, var(--slider-background) ${percentage}%)`;
      sliderRef.current.style.direction = isRightToLeft ? 'ltr' : '';
    }
  }, [position, isRightToLeft, min, max]);


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
    const ariaLabel = `${text} ${getDisplayValue(displayValue)}`;
    return (isEditingInputField && inputFieldType === 'number') ? (
      <div className="slider-input-wrapper">
        <input
          ref={inputRef}
          className="slider-input-field is-editing"
          aria-label={ariaLabel}
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
        value={getDisplayValue(displayValue)}
        onFocus={setIsEditingInputField}
      />
    );
  }

  const displayedPosition = isRightToLeft ? max - (position - min) : position;

  return (
    <DataElementWrapper
      dataElement={dataElement}
      className="slider"
    >
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
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={displayValue}
            aria-valuetext={`${label} ${getDisplayValue(displayValue)}`}
            type='range'
            onChange={handleChange}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            min={min}
            max={max}
            step={step}
            value={displayedPosition}
          />
        </div>
        {!shouldHideSliderValue && (
          (withInputField)
            ? (renderInputElement())
            : (<div className="slider-value">{getDisplayValue(displayValue)}</div>)
        )}
      </div>
    </DataElementWrapper>
  );
}

Slider.propTypes = propTypes;


export default Slider;