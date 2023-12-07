import React from 'react';
import ToggleElementButton from '../ToggleElementButton';

const ViewControlsToggleButton = () => {
  return (
    <div>
      <ToggleElementButton
        dataElement="view-controls-toggle-button"
        className="viewControlsToggleButton"
        title="component.viewControlsOverlay"
        disabled={false}
        img="icon-header-page-manipulation-line"
        toggleElement="viewControlsFlyout"
      />
    </div>
  );
};

export default ViewControlsToggleButton;
