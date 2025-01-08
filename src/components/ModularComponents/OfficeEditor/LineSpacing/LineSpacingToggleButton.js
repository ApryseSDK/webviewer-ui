import React from 'react';
import ToggleElementButton from '../../ToggleElementButton';
import LineSpacingFlyout from './LineSpacingFlyout';

const LineSpacingToggleButton = () => {
  return (
    <div>
      <ToggleElementButton
        dataElement="line-spacing-toggle-button"
        className="lineSpacingToggleButton"
        title="officeEditor.lineSpacing"
        disabled={false}
        img="icon-office-editor-line-spacing"
        toggleElement="lineSpacingFlyout"
      />
      <LineSpacingFlyout />
    </div>
  );
};

export default LineSpacingToggleButton;

