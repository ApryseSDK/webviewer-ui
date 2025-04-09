import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import DataElement from 'constants/dataElement';
import { EditingStreamType } from 'constants/officeEditor';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import OfficeEditorCreateTablePopup from 'components/OfficeEditorCreateTablePopup';

const TableButton = ({ isOpen, disabled }) => {
  return (
    <>
      <ActionButton
        dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE_BUTTON}
        title='officeEditor.table'
        img='ic-table'
        label="officeEditor.table"
        isActive={isOpen}
        ariaPressed={isOpen}
        ariaExpanded={isOpen}
        disabled={disabled}
      />
      <Icon
        className='arrow'
        glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`}
        disabled={disabled}
      />
    </>
  );
};

const renderToggleButton = (isOpen, disabled) => <TableButton isOpen={isOpen} disabled={disabled} />;

const CreateTableDropdown = () => {
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = activeStream !== EditingStreamType.BODY;

  return (
    <Dropdown
      id={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      className={classNames({
        'dropdown-text-icon': true,
        'modular-ui': customizableUI,
      })}
      width={136}
      disabled={isDisabled}
      displayButton={(isOpen) => renderToggleButton(isOpen, isDisabled)}
      onOpened={() => setIsOpen(true)}
      onClosed={() => setIsOpen(false)}
    >
      <OfficeEditorCreateTablePopup isOpen={isOpen} />
    </Dropdown>
  );
};

export default CreateTableDropdown;