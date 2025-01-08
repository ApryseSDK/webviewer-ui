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
 * @name newSheetDocumentButton
 * @memberof UI.Components.PresetButton
 */
const NewSheetDocumentButton = React.forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const isDisabled = !useSelector(selectors.isSheetEditorMode);

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The new sheet document preset button is only available if the Sheet Editor mode is enabled.');
  }

  const onClick = async () => { };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={onClick} />
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.NEW_SHEET_DOCUMENT, isDisabled, onClick)
  );
});

NewSheetDocumentButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
NewSheetDocumentButton.displayName = 'NewSheetDocumentButton';

export default NewSheetDocumentButton;