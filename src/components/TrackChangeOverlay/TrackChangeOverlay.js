import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'components/Dropdown';

import './TrackChangeOverlay.scss';

const items = [
  {
    key: 'editing',
    description: 'editingDescription',
  },
  {
    key: 'reviewing',
    description: 'reviewingDescription',
  },
  {
    key: 'viewOnly',
    description: 'viewOnlyDescription',
  }
];
const translationPrefix = 'officeEditor.';

const TrackChangeOverlay = () => {
  const [t] = useTranslation();

  const [currentSelectionKey, setCurrentSelectionKey] = useState('editing');

  const renderDropdownItem = (item) => (
    <div className='Dropdown__item-TrackChange'>
      <div className='Dropdown__item-mode'>{t(`${translationPrefix}${item.key}`)}</div>
      <div className='Dropdown__item-description'>{t(`${translationPrefix}${item.description}`)}</div>
    </div>
  );

  const onClickItem = (key) => {
    // Below is for testing, later need to call 'setCurrentSelectionKey()' only when mode changes in Core.
    setCurrentSelectionKey(key);
    // Need to hook up with Core APIs here
  };

  return (
    <div className="track-change-overlay">
      <Dropdown
        items={items}
        getCustomItemStyle={() => ({ width: '144px', height: '48px' })}
        applyCustomStyleToButton={false}
        currentSelectionKey={currentSelectionKey}
        onClickItem={onClickItem}
        getDisplayValue={(item) => t(`${translationPrefix}${item.key}`)}
        getKey={(item) => item.key}
        renderItem={renderDropdownItem}
      />
    </div>
  );
};

export default TrackChangeOverlay;
