/**
 * A button that aligns text to the left.
 * @name alignLeftButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that aligns text to the center.
 * @name alignCenterButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that aligns text to the right.
 * @name alignRightButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that justifies text alignment.
 * @name justifyBothButton
 * @memberof UI.Components.PresetButton
 */

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