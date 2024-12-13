import React from 'react';
import ToggleElementButton from '../ToggleElementButton';

const ViewControlsToggleButton = (props) => {
  return (
    <ToggleElementButton
      {...props}
      className="viewControlsToggleButton"
      title="component.viewControls"
      disabled={false}
      img="icon-header-page-manipulation-line"
      toggleElement="viewControlsFlyout"
    />
  );
};

export default ViewControlsToggleButton;
