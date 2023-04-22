import React, { useState } from 'react';
import { isIE11 } from 'helpers/device';
import classNames from 'classnames';

import './DimensionInput.scss';

const DimensionInput = ({ className, label, initialValue, onChange, unit, maxLength = 10, disabled }) => {
  const [value, setValue] = useState(initialValue);

  const handleDimensionChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  // Resizes number input boxes so that units of measurement can be shown next to them as if they are also in the same box
  const resizeInput = (input) => {
    let length = input.toString().length;
    let decimalSize = 0.3;
    if (isIE11) {
      const IE_ADJUSTMENT = 1.25;
      length *= IE_ADJUSTMENT;
      maxLength *= IE_ADJUSTMENT;
      decimalSize *= IE_ADJUSTMENT;
    }
    if (input.toString().includes('.')) {
      length -= decimalSize;
    } else {
      length += decimalSize;
    }
    if (length > maxLength) {
      return maxLength;
    }
    return length;
  };

  return (
    <div className={classNames({
      dimensionInput: true,
      [className]: !!className,
    })}>
      <label className="dimension-input-label">
        {label}
        <div className="dimension-input-container">
          <input
            className="dimension-input"
            type="number"
            min="0"
            step={0.01}
            onChange={handleDimensionChange}
            disabled={disabled}
            style={{ width: `${resizeInput(value)}ch` }}
            value={value}
          />
          <span className="dimension-unit">
            {value > 0 && unit}
          </span>
        </div>
      </label>
    </div>
  );
};

export default DimensionInput;
