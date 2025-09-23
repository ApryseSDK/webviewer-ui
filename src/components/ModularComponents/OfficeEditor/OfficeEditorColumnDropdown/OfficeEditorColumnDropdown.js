import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import Dropdown from 'components/Dropdown';
import VisuallyHiddenLabel from 'components/VisuallyHiddenLabel';
import DataElements from 'constants/dataElement';
import { OFFICE_EDITOR_TRANSLATION_PREFIX, LAYOUT_UNITS } from 'constants/officeEditor';
import { COLUMN_OPTIONS } from 'helpers/officeEditor';
import { checkEqualColumnWidths } from 'helpers/officeEditorColumnsHelper';
import renderDropdownItemWithDescription from 'helpers/renderDropdownItemWithDescription';
import './OfficeEditorColumnDropdown.scss';
import core from 'core';

const ToggleButton = (isOpen) => {
  return (
    <>
      <ActionButton
        dataElement={DataElements.OFFICE_EDITOR_COLUMN_DROPDOWN_TOGGLE}
        className={'dropdown-icon-only'}
        img="icon-office-editor-column"
        title={`${OFFICE_EDITOR_TRANSLATION_PREFIX}columns`}
        isActive={isOpen}
        ariaPressed={isOpen}
        ariaExpanded={isOpen}
      />
      <Icon
        className="arrow"
        ariaHidden={true}
        glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`}
      />
      <VisuallyHiddenLabel
        id={DataElements.OFFICE_EDITOR_COLUMN_DROPDOWN}
        label={`${OFFICE_EDITOR_TRANSLATION_PREFIX}columns`}
      />
    </>
  );
};

const OfficeEditorColumnDropdown = ({
  isFlyoutItem,
  onKeyDownHandler,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [activeColumnOption, setActiveColumnOption] = useState('');

  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);

  const onOpened = async () => {
    const sectionColumns = await core.getOfficeEditor().getSectionColumns(LAYOUT_UNITS.CM);
    const columnAmount = Math.ceil(sectionColumns.length / 2);
    const allColumnsEqual = checkEqualColumnWidths(sectionColumns);
    const usePresetColumns = allColumnsEqual && columnAmount <= 3;

    const activeKey = usePresetColumns
      ? COLUMN_OPTIONS.find((option) => option.numberOfColumns === columnAmount).key
      : '';
    setActiveColumnOption(activeKey);
  };

  const onClosed = () => {
    setActiveColumnOption('');
  };

  const onClickItem = async (itemKey) => {
    const item = COLUMN_OPTIONS.find((item) => item.key === itemKey);
    await item.onClick(dispatch, actions);
  };

  return (
    <Dropdown
      id='office-editor-column-dropdown'
      dataElement={DataElements.OFFICE_EDITOR_COLUMN_DROPDOWN}
      labelledById={DataElements.OFFICE_EDITOR_COLUMN_DROPDOWN}
      className={classNames({
        'office-editor-column-dropdown': true,
        'dropdown-text-icon': true,
        'modular-ui': customizableUI,
        'flyout-item': isFlyoutItem,
      })}
      width={'auto'}
      isFlyoutItem={isFlyoutItem}
      items={COLUMN_OPTIONS}
      getKey={(item) => item.key}
      applyCustomStyleToButton={false}
      currentSelectionKey={activeColumnOption}
      getDisplayValue={(item) => t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${item.key}`)}
      getCustomItemStyle={(item) => (item.key === 'customColumn' ? { height: '52px' } : { height: '40px' })}
      renderItem={(item) => renderDropdownItemWithDescription(item, t)}
      onClickItem={onClickItem}
      displayButton={ToggleButton}
      onKeyDownHandler={onKeyDownHandler}
      onOpened={onOpened}
      onClosed={onClosed}
    />
  );
};

OfficeEditorColumnDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default OfficeEditorColumnDropdown;