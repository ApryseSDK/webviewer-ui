import React from 'react';
import ToolsOverlayAddBtn from './ToolsOverlayAddBtn';
import ToolsDropdown from 'components/ToolsDropdown';

import './SelectedToolsOverlayItem.scss';

const SelectedToolsOverlayItem = ({ textTranslationKey, onClick }) => {
  return (
    <div
      className="selected-tools-overlay-item"
    >
      <ToolsOverlayAddBtn
        onClick={onClick}
        textTranslationKey={textTranslationKey}
      />
      <ToolsDropdown
        isDisabled
      />
    </div>
  );
};

export default SelectedToolsOverlayItem;