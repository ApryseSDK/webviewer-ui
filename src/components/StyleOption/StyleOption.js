import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import './StyleOption.scss';

function StyleOption(props) {
  const style = props.borderStyle ? props.borderStyle : 'solid';
  const styleOptions = ['solid', 'cloudy'];
  const [t] = useTranslation();

  const onChange = value => {
    props.onStyleChange('Style', value);
  };

  return (
    <div className="StyleOption">
      <div className="styles-container">
        <label className="styles-title" for="styleOptions">{t('option.styleOption.style')}</label>
        <div className="styles-layout">
          <select
            id="styleOptions"
            className="styles-input"
            value={style}
            onChange={e => onChange(e.target.value)}
          >
            {styleOptions.map(option => (
              <option key={option} value={option}>
                {t(`option.styleOption.${option}`)}
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
  borderStyle: PropTypes.string,
};

export default StyleOption;
