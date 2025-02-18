import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import classNames from 'classnames';

/**
 * A button that toggles form field edit mode.
 * @name formFieldEditButton
 * @memberof UI.Components.PresetButton
 */
const FormFieldEditButton = forwardRef((props, ref) => {
  const { isFlyoutItem, dataElement, style, className } = props;
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
          className={classNames({
            PresetButton: true,
            formFieldEditButton: true,
            [className]: true,
          })}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          isActive={core.getFormFieldCreationManager().isInFormFieldCreationMode()}
          style={style}
        />
      )
  );
});

FormFieldEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};
FormFieldEditButton.displayName = 'FormFieldEditButton';

export default FormFieldEditButton;