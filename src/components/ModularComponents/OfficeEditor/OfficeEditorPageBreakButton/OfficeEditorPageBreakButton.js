import React, { forwardRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import core from 'core';
import selectors from 'selectors';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { menuItems } from '../../Helpers/menuItems';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import ActionButton from 'components/ActionButton';

const OfficeEditorPageBreakButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const { dataElement, icon, title, label } = menuItems[PRESET_BUTTON_TYPES.PAGE_BREAK];

  const [
    isCursorInTable,
  ] = useSelector((state) => [
    selectors.isCursorInTable(state),
  ], shallowEqual);

  const handleClick = async () => {
    return core.getOfficeEditor().insertPageBreak();
  };

  return (
    <>
      {isFlyoutItem
        ? <FlyoutItemContainer
          {...props}
          label={label}
          ref={ref}
          disabled={isCursorInTable}
          onClick={handleClick}
        />
        : <ActionButton
          className='button-text-icon'
          dataElement={dataElement}
          title={title}
          img={icon}
          label={label}
          disabled={isCursorInTable}
          onClick={handleClick}
        />
      }
    </>
  );
});

OfficeEditorPageBreakButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
OfficeEditorPageBreakButton.displayName = 'PageBreakButton';

export default OfficeEditorPageBreakButton;