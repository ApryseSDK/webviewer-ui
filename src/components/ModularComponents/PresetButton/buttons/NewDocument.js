import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import loadDocument from 'helpers/loadDocument';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';

/**
 * A button that creates a new document.
 * @name newDocumentButton
 * @memberof UI.Components.PresetButton
 */
const NewDocumentButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.newDocumentButton;
  const isDisabled = !isOfficeEditorMode();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      innerItemToFlyoutItem({
        isDisabled,
        icon: iconDOMElement,
        label: t(label),
      }, handleNewDocumentClick)
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.NEW_DOCUMENT, isDisabled, handleNewDocumentClick)
  );
};

NewDocumentButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default NewDocumentButton;