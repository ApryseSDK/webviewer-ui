import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import InsertImageButton from 'components/InsertImageButton';
import { menuItems } from '../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import fileToBase64 from 'helpers/fileToBase64';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { SPREADSHEET_EDITOR_IMAGE_FORMATS } from 'src/constants/spreadsheetEditor';

const SpreadsheetEditorInsertImageButton = forwardRef((props, ref) => {
  const menuItem = menuItems[PRESET_BUTTON_TYPES.INSERT_IMAGE];
  const dispatch = useDispatch();
  const activeFlyout = useSelector(selectors.getActiveFlyout);

  const {
    dataElement = menuItem.dataElement,
    title = props.title || menuItem.title,
    icon
  } = props;

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        dispatch(actions.openElement(DataElements.LOADING_MODAL));
        const base64String = await fileToBase64(file);
        const workbook = core.getDocumentViewer().getDocument().getSpreadsheetEditorDocument().getWorkbook();
        const activeSheetIndex = workbook.activeSheetIndex;
        const activeSheet = workbook.getSheetAt(activeSheetIndex);
        activeSheet.addImage(base64String);
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        dispatch(actions.closeElement(activeFlyout));
      } catch (error) {
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
        dispatch(actions.closeElement(activeFlyout));
        dispatch(actions.showWarningMessage({
          title: 'Error',
          message: error.message || error,
        }));
      }
    }
  };

  return (
    <InsertImageButton
      {...props}
      label={undefined}
      onFileInputChange={handleFileInputChange}
      acceptedFormats={SPREADSHEET_EDITOR_IMAGE_FORMATS}
      dataElement={dataElement}
      title={title}
      ref={ref}
      icon={icon}
      filePickerId="spreadsheet-editor-insert-image-file-input"
    />
  );
});

SpreadsheetEditorInsertImageButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
SpreadsheetEditorInsertImageButton.displayName = 'SpreadsheetEditorInsertImageButton';

export default SpreadsheetEditorInsertImageButton;