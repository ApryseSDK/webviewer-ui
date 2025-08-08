import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const NonPrintingCharactersToggleButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    dataElement = menuItems.officeEditorToggleNonPrintingCharactersButton.dataElement,
    img: icon = menuItems.officeEditorToggleNonPrintingCharactersButton.icon,
    title = menuItems.officeEditorToggleNonPrintingCharactersButton.title,
  } = props;

  const handleClick = async () => {
    const doc = core.getDocument();
    await doc.getOfficeEditor().toggleNonPrintingCharacters();
  };

  const enableNonPrintingCharacters = useSelector((state) => selectors.isNonPrintingCharactersEnabled(state));

  return (
    isFlyoutItem
      ? <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={enableNonPrintingCharacters ? 'active' : ''}
      />
      : <ActionButton
        onClick={handleClick}
        dataElement={dataElement}
        title={title}
        isActive={enableNonPrintingCharacters}
        img={icon}
      />
  );
});

NonPrintingCharactersToggleButton.propTypes = propTypes;
NonPrintingCharactersToggleButton.displayName = 'NonPrintingCharactersToggleButton';

export default NonPrintingCharactersToggleButton;