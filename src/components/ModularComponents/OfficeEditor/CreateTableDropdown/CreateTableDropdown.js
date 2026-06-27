import React, { useState } from 'react';
import Dropdown from 'components/Dropdown';
import OfficeEditorCreateTablePopup from 'components/OfficeEditorCreateTablePopup';
import DataElement from 'constants/dataElement';
import ActionButton from 'components/ActionButton';
import Icon from 'components/Icon';

const TableButton = (isOpen) => {
  return (
    <>
      <ActionButton
        dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE_BUTTON}
        title='officeEditor.table'
        img='ic-table'
        isActive={isOpen}
        label="officeEditor.table"
        ariaPressed={isOpen}
        ariaExpanded={isOpen}
      />
      <Icon className="arrow" glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`} />
    </>
  );
};

const CreateTableDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      id={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      className='dropdown-text-icon'
      displayButton={TableButton}
      width={136}
      onOpened={() => setIsOpen(true)}
      onClosed={() => setIsOpen(false)}
    >
      <OfficeEditorCreateTablePopup isOpen={isOpen} />
    </Dropdown>
  );
};

export default CreateTableDropdown;