/**
 * The preset button for inserting an image in the Office Editor
 * @name insertImageButton
 * @memberof UI.Components.PresetButton
 */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import InsertImageButton from 'components/InsertImageButton';
import { menuItems } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import addImageToOfficeEditorDocument from 'src/helpers/addImageToOfficeEditorDocument';
import { OFFICE_EDITOR_ACCEPTED_IMAGE_FORMATS } from 'src/constants/officeEditor';

const OfficeEditorInsertImageButton = forwardRef((props, ref) => {
  const menuItem = menuItems[PRESET_BUTTON_TYPES.INSERT_IMAGE];
  const { label } = menuItem;
  const {
    dataElement = menuItem.dataElement,
    title = menuItem.title,
    icon = menuItem.icon,
  } = props;

  const dispatch = useDispatch();
  const activeFlyout = useSelector(selectors.getActiveFlyout);

  const handleFileInputChange = async (e) => {
    await addImageToOfficeEditorDocument(dispatch, actions, e, activeFlyout);
  };

  return (
    <InsertImageButton
      {...props}
      label={label}
      onFileInputChange={handleFileInputChange}
      acceptedFormats={OFFICE_EDITOR_ACCEPTED_IMAGE_FORMATS}
      dataElement={dataElement}
      title={title}
      ref={ref}
      icon={icon}
      filePickerId="office-editor-file-picker"
      className="button-text-icon"
    />
  );
});

OfficeEditorInsertImageButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
OfficeEditorInsertImageButton.displayName = 'InsertImageButton';

export default OfficeEditorInsertImageButton;