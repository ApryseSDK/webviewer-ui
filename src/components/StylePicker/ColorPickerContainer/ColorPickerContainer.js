import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import SpreadsheetColorPicker from '../ColorPicker/SpreadsheetColorPicker';
import ColorPicker from '../ColorPicker/ColorPicker';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

const ColorPickerContainer = (props) => {
  const uiConfiguration = useSelector(selectors.getUIConfiguration);

  if (uiConfiguration === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR) {
    return <SpreadsheetColorPicker {...props} />;
  }
  return <ColorPicker {...props} />;
};

export default ColorPickerContainer;