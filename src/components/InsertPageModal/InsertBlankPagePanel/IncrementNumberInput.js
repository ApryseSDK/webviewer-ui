import React, { useState } from 'react';
import { Input } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const IncrementNumberInput = ({ id, className, min, onChange, value, fillWidth }) => {
  const [number, setNumber] = useState(value);

  const incrementNumber = () => {
    onChange(number + 1);
    setNumber(number + 1);
  };

  const decrementNumber = () => {
    const newNumber = number - 1;
    if (newNumber < min) {
      return;
    }
    onChange(newNumber);
    setNumber(newNumber);
  };

  const handleChange = (e) => {
    onChange(parseInt(e.target.value));
    setNumber(parseInt(e.target.value));
  };

  const handleBlur = (e) => {
    let inputValue = parseInt(e.target.value);
    if (!inputValue) {
      inputValue = parseInt(min);
      onChange(inputValue);
      setNumber(inputValue);
    }
  };

  return (
    <div className={classNames({
      incrementNumberInput: true,
      [className]: !!className,
    })}>
      <Input id={id} type="number" min={min} onChange={handleChange} value={number} fillWidth={fillWidth} onBlur={handleBlur} />
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

IncrementNumberInput.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  min: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  fillWidth: PropTypes.bool,
};

export default IncrementNumberInput;
