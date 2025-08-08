import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES, VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import core from 'core';

const EDIT_MODE = window.Core.SpreadsheetEditor.SpreadsheetEditorEditMode;

/**
 * A button that creates a new sheet document.
 * @ignore
 * @name newSpreadsheetButton
 * @memberof UI.Components.PresetButton
 */
const NewSpreadsheetButton = React.forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title
  } = props;

  const currentUIConfiguration = useSelector(selectors.getUIConfiguration);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);

  const isSpreadsheetEditorModeEnabled = currentUIConfiguration === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR;
  const [isDisabled, setIsDisabled] = useState(!isSpreadsheetEditorModeEnabled || spreadsheetEditorEditMode === EDIT_MODE.VIEW_ONLY);

  useEffect(() => {
    const isSpreadsheetEditorModeEnabled = currentUIConfiguration === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR;
    const shouldDisableButton = !isSpreadsheetEditorModeEnabled || spreadsheetEditorEditMode === EDIT_MODE.VIEW_ONLY;
    if (shouldDisableButton) {
      console.warn('The new spreadsheet preset button is only available if the Spreadsheet Editor mode is enabled in editing mode.');
    }
    setIsDisabled(shouldDisableButton);
  }, [currentUIConfiguration, spreadsheetEditorEditMode]);


  const onClick = async () => {
    core.loadBlankSpreadsheet();
  };

  if (isDisabled) {
    return null;
  }

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={onClick} />
      :
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.NEW_SPREADSHEET,
        isDisabled,
        onClick,
        dataElement,
        className,
        style,
        icon,
        title,
      })
  );
});

NewSpreadsheetButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
NewSpreadsheetButton.displayName = 'NewSpreadsheetButton';

export default NewSpreadsheetButton;