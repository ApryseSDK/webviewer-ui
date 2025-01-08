import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that toggles form field edit mode.
 * @name formFieldEditButton
 * @memberof UI.Components.PresetButton
 */
const FormFieldEditButton = forwardRef((props, ref) => {
  const { isFlyoutItem, dataElement } = props;
  const { icon, title } = menuItems.formFieldEditButton;

  const handleClick = () => {
    const formFieldCreationManager = core.getFormFieldCreationManager();
    const isInFormFieldCreationMode = formFieldCreationManager.isInFormFieldCreationMode();
    if (isInFormFieldCreationMode) {
      formFieldCreationManager.endFormFieldCreationMode();
    } else {
      formFieldCreationManager.startFormFieldCreationMode();
    }
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      : (
        <ActionButton
          className={'PresetButton formFieldEditButton'}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          isActive={core.getFormFieldCreationManager().isInFormFieldCreationMode()}
        />
      )
  );
});

FormFieldEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
};
FormFieldEditButton.displayName = 'FormFieldEditButton';

export default FormFieldEditButton;