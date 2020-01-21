import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './StyleOption.scss';

function StyleOption(props) {
  const [style, setStyle] = useState(props.initialStyle);
  const styleOptions = ['regular', 'cloudy'];

  const onChange = value => {
    setStyle(value);
    props.onStyleChange('Style', value);
  };

  return (
    <div className="StyleOption">
      <div className="styles-container">
        <div className="styles-title">Style</div>
        <div className="styles-layout">
          <select
            className="styles-input"
            value={style}
            onChange={e => onChange(e.target.value)}
          >
            {styleOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}

StyleOption.propTypes = {
  onStyleChange: PropTypes.func.isRequired,
  initialStyle: PropTypes.string.isRequired,
};

export default StyleOption;