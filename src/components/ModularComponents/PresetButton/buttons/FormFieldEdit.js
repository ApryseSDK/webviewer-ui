import React, { forwardRef, useState, useEffect } from 'react';
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
  const [active, setActive] = useState(core.getFormFieldCreationManager().isInFormFieldCreationMode());

  useEffect(() => {
    const formFieldCreationManager = core.getFormFieldCreationManager();
    if (formFieldCreationManager) {
      const updateState = () => setActive(formFieldCreationManager.isInFormFieldCreationMode());
      formFieldCreationManager.addEventListener('formFieldCreationModeStarted', updateState);
      formFieldCreationManager.addEventListener('formFieldCreationModeEnded', updateState);
      return () => {
        formFieldCreationManager.removeEventListener('formFieldCreationModeStarted', updateState);
        formFieldCreationManager.removeEventListener('formFieldCreationModeEnded', updateState);
      };
    }
  }, []);

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
          isActive={active}
          style={style}
          ariaPressed={active}
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