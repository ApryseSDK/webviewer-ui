import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import OfficeEditorAlignment from './OfficeEditor/AlignmentButton';
import SpreadsheetEditorAlignment from './SheetEditor/HorizontalAlignmentButton';
import selectors from 'selectors';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

const AlignmentButtonContainer = forwardRef((props, ref) => {
  const uiConfiguration = useSelector((state) => selectors.getUIConfiguration(state));

  switch (uiConfiguration) {
    case VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR:
      return <SpreadsheetEditorAlignment {...props} ref={ref} />;
    case VIEWER_CONFIGURATIONS.DOCX_EDITOR:
      return <OfficeEditorAlignment {...props} ref={ref}  />;
    default:
      return null;
  }
});

AlignmentButtonContainer.displayName = 'AlignmentButtonContainer';

export default AlignmentButtonContainer;