import React from 'react';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import core from 'core';


const EDIT_MODE = window.Core.SpreadsheetEditor.SpreadsheetEditorEditMode;

const items = [
  {
    key: EDIT_MODE.EDITING,
    description: 'editingDescription',
  },
  {
    key: EDIT_MODE.VIEW_ONLY,
    description: 'viewOnlyDescription',
  }
];
const translationPrefix = 'spreadsheetEditor.';


const SpreadsheetEditorEditModeDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler, disabled = false } = props;
  const activeFlyout = useSelector(selectors.getActiveFlyout);
  const editMode = useSelector(selectors.getSpreadsheetEditorEditMode);

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const renderDropdownItem = (item) => (
    <div className='Dropdown__item-vertical'>
      <div className='Dropdown__item-label'>{t(`${translationPrefix}${item.key}`)}</div>
      <div className='Dropdown__item-description'>{t(`${translationPrefix}${item.description}`)}</div>
    </div>
  );

  const onClickItem = (mode) => {
    const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
    spreadsheetEditorManager.setEditMode(mode);

    if (isFlyoutItem && activeFlyout) {
      dispatch(actions.closeElement(activeFlyout));
    }
  };

  return (
    <div className={classNames({
      'track-change-overlay': true,
      'flyout-item': isFlyoutItem,
    })}>
      <Dropdown
        id={'spreadsheetEditor'}
        items={items}
        width={144}
        disabled={disabled}
        getCustomItemStyle={() => ({ width: '144px', height: '48px' })}
        applyCustomStyleToButton={false}
        currentSelectionKey={editMode}
        onClickItem={onClickItem}
        getDisplayValue={(item) => t(`${translationPrefix}${item.key}`)}
        getKey={(item) => item.key}
        renderItem={renderDropdownItem}
        className="text-left"
        isFlyoutItem={isFlyoutItem}
        onKeyDownHandler={onKeyDownHandler}
        ariaLabel={t('spreadsheetEditor.editModeDropdown')}
      />
    </div>
  );
};

SpreadsheetEditorEditModeDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SpreadsheetEditorEditModeDropdown;