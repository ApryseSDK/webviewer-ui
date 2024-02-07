import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'components/Dropdown';
import { defaultStartLineStyles, defaultStrokeStyles, defaultEndLineStyles } from 'constants/strokeStyleIcons';

import './LineStyleOptions.scss';

const middleLineStyles = defaultStrokeStyles;

function LineStyleOptions({ properties, onLineStyleChange }) {
  const [t] = useTranslation();
  const [selectedStartLineStyle, setSelectedStartLineStyle] = useState(properties.StartLineStyle);
  const [selectedEndLineStyle, setSelectedEndLineStyle] = useState(properties.EndLineStyle);
  const [selectedMiddleLineStyle, setSelectedMiddleLineStyle] = useState(properties.StrokeStyle);

  function onClickStartLineStyle(key) {
    setSelectedStartLineStyle(key);
    onLineStyleChange('start', key);
  }

  function onClickMiddleLineStyle(key) {
    setSelectedMiddleLineStyle(key);
    onLineStyleChange('middle', key);
  }

  function onClickEndLineStyle(key) {
    setSelectedEndLineStyle(key);
    onLineStyleChange('end', key);
  }

  const lineEndingDropdownWidth = 62;

  return (
    <div className="LineStyleOptions">
      <div className="LayoutTitle">{t('option.lineStyleOptions.title')}</div>
      <div className="StyleContainer">
        <Dropdown
          dataElement="startLineStyleDropdown"
          images={defaultStartLineStyles}
          width={lineEndingDropdownWidth}
          onClickItem={onClickStartLineStyle}
          currentSelectionKey={selectedStartLineStyle}
        />

        <Dropdown
          dataElement="middleLineStyleDropdown"
          images={middleLineStyles}
          width={lineEndingDropdownWidth}
          onClickItem={onClickMiddleLineStyle}
          currentSelectionKey={selectedMiddleLineStyle}
        />

        <Dropdown
          dataElement="endLineStyleDropdown"
          images={defaultEndLineStyles}
          width={lineEndingDropdownWidth}
          onClickItem={onClickEndLineStyle}
          currentSelectionKey={selectedEndLineStyle}
        />
      </div>
    </div>
  );
}

export default LineStyleOptions;