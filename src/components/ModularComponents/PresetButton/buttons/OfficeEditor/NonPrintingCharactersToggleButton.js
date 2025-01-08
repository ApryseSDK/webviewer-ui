import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
};

const NonPrintingCharactersToggleButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;

  const handleClick = async () => {
    const doc = core.getDocument();
    await doc.getOfficeEditor().toggleNonPrintingCharacters();
  };

  const [
    enableNonPrintingCharacters,
  ] = useSelector(
    (state) => [
      selectors.isNonPrintingCharactersEnabled(state),
    ],
    shallowEqual,
  );

  const { icon, title, dataElement } = menuItems.officeEditorToggleNonPrintingCharactersButton;

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass = {enableNonPrintingCharacters ? 'active' : ''}
      />
      : (
        <ActionButton
          onClick={handleClick}
          dataElement={dataElement}
          title={title}
          isActive={enableNonPrintingCharacters}
          img={icon}
        />
      )
  );
});

NonPrintingCharactersToggleButton.propTypes = propTypes;
NonPrintingCharactersToggleButton.displayName = 'NonPrintingCharactersToggleButton';

export default NonPrintingCharactersToggleButton;