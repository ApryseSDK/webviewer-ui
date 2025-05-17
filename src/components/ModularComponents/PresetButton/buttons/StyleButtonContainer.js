import React, { forwardRef, lazy } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

const CellDecoratorButton = lazy(() => import('./SheetEditor/CellDecoratorButton'));
const FontStyleToggleButton = lazy(() => import('./OfficeEditor/FontStyleToggleButton'));

const StyleButtonContainer = forwardRef((props, ref) => {
  const uiConfiguration = useSelector((state) => selectors.getUIConfiguration(state));

  switch (uiConfiguration) {
    case VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR:
      return  <CellDecoratorButton {...props} ref={ref} />;
    case VIEWER_CONFIGURATIONS.DOCX_EDITOR:
      return <FontStyleToggleButton {...props} ref={ref} />;
    default:
      return null;
  }
});

StyleButtonContainer.displayName = 'StyleButtonContainer';

export default StyleButtonContainer;