import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import OfficeEditorCreateTablePopup from 'components/OfficeEditorCreateTablePopup';
import DataElement from 'constants/dataElement';
import ActionButton from 'components/ActionButton';
import Icon from 'components/Icon';
import './CreateTableDropdown.scss';

const TableButton = (isOpen) => {
  return (
    <>
      <ActionButton
        title='officeEditor.table'
        img='ic-table'
        isActive={isOpen}
        label="officeEditor.table"
      />
      <Icon className="arrow" glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`} />
    </>
  );
};

const CreateTableDropdown = () => {
  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  return (
    <Dropdown
      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
      className={classNames({
        'insert-table-dropdown': true,
        'modular-ui': customizableUI,
      })}
      displayButton={TableButton}
      test={customizableUI.toString()}
    >
      <OfficeEditorCreateTablePopup />
    </Dropdown>
  );
};

export default CreateTableDropdown;