import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import OfficeEditorFontFamilyDropdown from 'components/ModularComponents/OfficeEditor/OfficeEditorFontFamilyDropdown';
import SpreadsheetFontFamilyDropdown from 'components/ModularComponents/SpreadsheetEditor/SpreadsheetFontFamilyDropdown';

const FontFamilyDropdownContainer = forwardRef((props, ref) => {
  const uiConfiguration = useSelector(selectors.getUIConfiguration);

  switch (uiConfiguration) {
    case VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR:
      return <SpreadsheetFontFamilyDropdown {...props} ref={ref} />;
    case VIEWER_CONFIGURATIONS.DOCX_EDITOR:
      return <OfficeEditorFontFamilyDropdown {...props} ref={ref}  />;
    default:
      return null;
  }
});

FontFamilyDropdownContainer.displayName = 'FontFamilyDropdownContainer';
export default FontFamilyDropdownContainer;