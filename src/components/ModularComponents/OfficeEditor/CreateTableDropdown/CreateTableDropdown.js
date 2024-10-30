import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
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
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      id={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      className={classNames({
        'dropdown-text-icon': true,
        'modular-ui': customizableUI,
      })}
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