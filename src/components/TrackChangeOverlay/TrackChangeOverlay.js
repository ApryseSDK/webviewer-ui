import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { OFFICE_EDITOR_EDIT_MODE } from 'constants/officeEditor';

import './TrackChangeOverlay.scss';

const items = [
  {
    key: OFFICE_EDITOR_EDIT_MODE.EDITING,
    description: 'editingDescription',
  },
  {
    key: OFFICE_EDITOR_EDIT_MODE.REVIEWING,
    description: 'reviewingDescription',
  },
  {
    key: OFFICE_EDITOR_EDIT_MODE.VIEW_ONLY,
    description: 'viewOnlyDescription',
  }
];
const translationPrefix = 'officeEditor.';

const TrackChangeOverlay = () => {
  const [t] = useTranslation();
  const [
    editMode,
  ] = useSelector(
    (state) => [
      selectors.getOfficeEditorEditMode(state),
    ],
    shallowEqual
  );

  const renderDropdownItem = (item) => (
    <div className='Dropdown__item-TrackChange'>
      <div className='Dropdown__item-mode'>{t(`${translationPrefix}${item.key}`)}</div>
      <div className='Dropdown__item-description'>{t(`${translationPrefix}${item.description}`)}</div>
    </div>
  );

  const onClickItem = (mode) => {
    core.getOfficeEditor().setEditMode(mode);
  };

  return (
    <div className="track-change-overlay">
      <Dropdown
        items={items}
        getCustomItemStyle={() => ({ width: '144px', height: '48px' })}
        applyCustomStyleToButton={false}
        currentSelectionKey={(editMode === OFFICE_EDITOR_EDIT_MODE.PREVIEW) ? OFFICE_EDITOR_EDIT_MODE.REVIEWING : editMode}
        onClickItem={onClickItem}
        getDisplayValue={(item) => t(`${translationPrefix}${item.key}`)}
        getKey={(item) => item.key}
        renderItem={renderDropdownItem}
      />
    </div>
  );
};

export default TrackChangeOverlay;
