import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import SpreadsheetFontSizeDropdown from 'components/ModularComponents/SpreadsheetEditor/SpreadsheetFontSizeDropdown';
import OfficeEditorFontSizeDropdown from 'components/ModularComponents/OfficeEditor/OfficeEditorFontSizeDropdown';

const FontSizeDropdownContainer = forwardRef((props, ref) => {
  const uiConfiguration = useSelector(selectors.getUIConfiguration);

  switch (uiConfiguration) {
    case VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR:
      return <SpreadsheetFontSizeDropdown {...props} ref={ref} />;
    case VIEWER_CONFIGURATIONS.DOCX_EDITOR:
      return <OfficeEditorFontSizeDropdown {...props} ref={ref}  />;
    default:
      return null;
  }
});

FontSizeDropdownContainer.displayName = 'FontSizeDropdownContainer';
export default FontSizeDropdownContainer;