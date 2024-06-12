import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';

/**
 * A button that toggles form field edit mode.
 * @name formFieldEditButton
 * @memberof UI.Components.PresetButton
 */
const FormFieldEditButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label, presetDataElement, icon, title } = menuItems.formFieldEditButton;
  const { t } = useTranslation();

  const handleClick = () => {
    const formFieldCreationManager = core.getFormFieldCreationManager();
    const isInFormFieldCreationMode = formFieldCreationManager.isInFormFieldCreationMode();
    if (isInFormFieldCreationMode) {
      formFieldCreationManager.endFormFieldCreationMode();
    } else {
      formFieldCreationManager.startFormFieldCreationMode();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    isFlyoutItem ?
      (
        <div className="menu-container"
          tabIndex="0" onClick={handleClick} onKeyDown={onKeyDown}>
          <div className="icon-label-wrapper">
            {iconDOMElement}
            {label && <div className="flyout-item-label">{t(label)}</div>}
          </div>
        </div>
      )
      : (
        <ActionButton
          className={'PresetButton formFieldEditButton'}
          dataElement={presetDataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          isActive={core.getFormFieldCreationManager().isInFormFieldCreationMode()}
        />
      )
  );
};

FormFieldEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default FormFieldEditButton;