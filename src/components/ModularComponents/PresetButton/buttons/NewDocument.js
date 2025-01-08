import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import loadDocument from 'helpers/loadDocument';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that creates a new document.
 * @name newDocumentButton
 * @memberof UI.Components.PresetButton
 */
const NewDocumentButton = React.forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const isDisabled = !isOfficeEditorMode();
  const dispatch = useDispatch();

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The new document preset button is only available if the Office Editor mode is enabled.');
  }

  const handleNewDocumentClick = async () => {
    loadDocument(dispatch, null, {
      filename: 'Untitled.docx',
      enableOfficeEditing: true
    });
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleNewDocumentClick} />
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.NEW_DOCUMENT, isDisabled, handleNewDocumentClick)
  );
});

NewDocumentButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
NewDocumentButton.displayName = 'NewDocumentButton';

export default NewDocumentButton;