import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import openOfficeEditorFilePicker from 'helpers/openOfficeEditorFilePicker';
import OfficeEditorImageFilePickerHandler from 'components/OfficeEditorImageFilePickerHandler';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

const OfficeEditorInsertImageButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const { dataElement, icon, title, label } = menuItems[PRESET_BUTTON_TYPES.INSERT_IMAGE];

  const handleClick = () => {
    openOfficeEditorFilePicker();
  };

  return (
    <>
      {isFlyoutItem ?
        <FlyoutItemContainer {...props} label={label} ref={ref} onClickHandler={() => handleClick} />
        : (
          <ActionButton
            className='button-text-icon'
            dataElement={dataElement}
            title={title}
            img={icon}
            label={label}
            onClick={handleClick}
          />
        )}
      <OfficeEditorImageFilePickerHandler />
    </>
  );
});

OfficeEditorInsertImageButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
OfficeEditorInsertImageButton.displayName = 'InsertImageButton';

export default OfficeEditorInsertImageButton;