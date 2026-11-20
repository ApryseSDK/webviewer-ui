import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Dropdown from 'components/Dropdown';
import './StyleOption.scss';
import { defaultStrokeStyles, cloudyStrokeStyle } from 'constants/strokeStyleIcons';


const withCloudyStyle = defaultStrokeStyles.concat(cloudyStrokeStyle);

function StyleOption(props) {
  const lineEndingDropdownWidth = 80;
  const { onLineStyleChange, properties, isEllipse } = props;
  const [selectedMiddleLineStyle, setSelectedMiddleLineStyle] = useState(properties?.StrokeStyle);
  const [t] = useTranslation();

  function onClickMiddleLineStyle(key) {
    setSelectedMiddleLineStyle(key);
    onLineStyleChange('middle', key);
  }

  if (!properties || !properties.hasOwnProperty('StrokeStyle')) {
    // if there is no StrokeStyle property, there is no point rendering <Dropdown>
    return null;
  }

  return (
    <div className="StyleOption">
      <div className="styles-container">
        <label className="styles-title" htmlFor="styleOptions">{t('option.styleOption.style')}</label>
        <Dropdown
          dataElement="borderStylePicker"
          images={(isEllipse) ? defaultStrokeStyles : withCloudyStyle}
          width={lineEndingDropdownWidth}
          onClickItem={onClickMiddleLineStyle}
          currentSelectionKey={selectedMiddleLineStyle ?? properties.StrokeStyle}
        />
      </div>
    </div>
  );
}

StyleOption.propTypes = {
  borderStyle: PropTypes.string,
  isEllipse: PropTypes.bool,
  properties: PropTypes.object,
  onLineStyleChange: PropTypes.func.isRequired,
};

export default StyleOption;
