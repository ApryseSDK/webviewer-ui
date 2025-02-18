import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that creates a new sheet document.
 * @ignore
 * @name newSpreadsheetButton
 * @memberof UI.Components.PresetButton
 */
const NewSpreadsheetButton = React.forwardRef((props, ref) => {
  const { isFlyoutItem, className, style } = props;
  const isDisabled = !useSelector(selectors.isSpreadsheetEditorModeEnabled);

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The new spreadsheet preset button is only available if the Sheet Editor mode is enabled.');
  }

  const onClick = async () => { };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={onClick} />
      :
      getPresetButtonDOM({ buttonType: PRESET_BUTTON_TYPES.NEW_SPREADSHEET, isDisabled, onClick, className, style })
  );
});

NewSpreadsheetButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
NewSpreadsheetButton.displayName = 'NewSpreadsheetButton';

export default NewSpreadsheetButton;