import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Dropdown from 'components/Dropdown';
import { defaultStartLineStyles, defaultStrokeStyles, defaultEndLineStyles } from 'constants/strokeStyleIcons';
import { getLineStyleDropdownEntries } from 'helpers/customLineStyleUtils';
import selectors from 'selectors';

import './LineStyleOptions.scss';

function LineStyleOptions({ properties, onLineStyleChange }) {
  const [t] = useTranslation();
  const [selectedStartLineStyle, setSelectedStartLineStyle] = useState(properties.StartLineStyle);
  const [selectedEndLineStyle, setSelectedEndLineStyle] = useState(properties.EndLineStyle);
  const [selectedMiddleLineStyle, setSelectedMiddleLineStyle] = useState(properties.StrokeStyle);
  const customLineStyles = useSelector(selectors.getCustomLineStyles);

  const startLineStyles = [
    ...defaultStartLineStyles,
    ...getLineStyleDropdownEntries(customLineStyles.start, 'line'),
  ];
  const middleLineStyles = [
    ...defaultStrokeStyles,
    ...getLineStyleDropdownEntries(customLineStyles.middle, 'line'),
  ];
  const endLineStyles = [
    ...defaultEndLineStyles,
    ...getLineStyleDropdownEntries(customLineStyles.end, 'line'),
  ];

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
          id="startLineStyleDropdown"
          dataElement="startLineStyleDropdown"
          images={startLineStyles}
          width={lineEndingDropdownWidth}
          onClickItem={onClickStartLineStyle}
          currentSelectionKey={selectedStartLineStyle}
        />

        <Dropdown
          id="middleLineStyleDropdown"
          dataElement="middleLineStyleDropdown"
          images={middleLineStyles}
          width={lineEndingDropdownWidth}
          onClickItem={onClickMiddleLineStyle}
          currentSelectionKey={selectedMiddleLineStyle}
        />

        <Dropdown
          id="endLineStyleDropdown"
          dataElement="endLineStyleDropdown"
          images={endLineStyles}
          width={lineEndingDropdownWidth}
          onClickItem={onClickEndLineStyle}
          currentSelectionKey={selectedEndLineStyle}
        />
      </div>
    </div>
  );
}

export default LineStyleOptions;