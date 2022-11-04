import React, { useState } from 'react';
import { Input } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon';

const IncrementNumberInput = ({ min, onChange, value, fillWidth }) => {
  const [number, setNumber] = useState(value);

  const incrementNumber = () => {
    onChange(number + 1);
    setNumber(number + 1);
  };

  const decrementNumber = () => {
    onChange(number - 1);
    setNumber(number - 1);
  };

  const handleChange = (e) => {
    onChange(parseInt(e.target.value));
    setNumber(parseInt(e.target.value));
  };

  return (
    <div className="increment-number-input">
      <Input type="number" min={min} onChange={handleChange} value={number} fillWidth={fillWidth} />
      <div className="increment-buttons">
        <button className="increment-arrow-button" onClick={incrementNumber}>
          <Icon className="up-arrow" glyph={'icon-chevron-up'} />
        </button>
        <button className="increment-arrow-button" onClick={decrementNumber}>
          <Icon className="down-arrow" glyph={'icon-chevron-down'} />
        </button>
      </div>
    </div>
  );
};

export default IncrementNumberInput;
