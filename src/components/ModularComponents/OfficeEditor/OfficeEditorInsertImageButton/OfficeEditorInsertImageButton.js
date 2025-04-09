import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import openOfficeEditorFilePicker from 'helpers/openOfficeEditorFilePicker';
import OfficeEditorImageFilePickerHandler from 'components/OfficeEditorImageFilePickerHandler';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { EditingStreamType } from 'constants/officeEditor';

const OfficeEditorInsertImageButton = forwardRef((props, ref) => {
  const { isFlyoutItem, style, className } = props;
  const { dataElement, icon, title, label } = menuItems[PRESET_BUTTON_TYPES.INSERT_IMAGE];

  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);
  const isDisabled = activeStream !== EditingStreamType.BODY;

  const handleClick = () => {
    openOfficeEditorFilePicker();
  };

  return (
    <>
      {isFlyoutItem
        ?
        <FlyoutItemContainer
          {...props}
          ref={ref}
          label={label}
          disabled={isDisabled}
          onClickHandler={() => handleClick}
        />
        :
        <ActionButton
          className={classNames({
            'button-text-icon': true,
            [className]: true,
          })}
          dataElement={dataElement}
          title={title}
          img={icon}
          label={label}
          disabled={isDisabled}
          style={style}
          onClick={handleClick}
        />
      }
      <OfficeEditorImageFilePickerHandler />
    </>
  );
});

OfficeEditorInsertImageButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};
OfficeEditorInsertImageButton.displayName = 'InsertImageButton';

export default OfficeEditorInsertImageButton;