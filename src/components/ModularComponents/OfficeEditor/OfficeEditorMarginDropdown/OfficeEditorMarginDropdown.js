import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import core from 'core';
import actions from 'actions';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import Dropdown from 'components/Dropdown';
import VisuallyHiddenLabel from 'components/VisuallyHiddenLabel';
import DataElements from 'constants/dataElement';
import { MARGIN_SIDES, OFFICE_EDITOR_TRANSLATION_PREFIX } from 'constants/officeEditor';
import { getConvertedMarginOptions, getUnitLabel, MARGIN_OPTIONS, roundNumberToDecimals } from 'helpers/officeEditor';
import renderDropdownItemWithDescription from 'helpers/renderDropdownItemWithDescription';
import './OfficeEditorMarginDropdown.scss';

const ToggleButton = (isOpen) => {
  return (
    <>
      <ActionButton
        dataElement={DataElements.OFFICE_EDITOR_MARGIN_DROPDOWN_TOGGLE}
        className={'dropdown-icon-only'}
        img="icon-office-editor-margin"
        title={`${OFFICE_EDITOR_TRANSLATION_PREFIX}margins`}
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
        id={DataElements.OFFICE_EDITOR_MARGIN_DROPDOWN}
        label={`${OFFICE_EDITOR_TRANSLATION_PREFIX}margins`}
      />
    </>
  );
};

const OfficeEditorMarginDropdown = ({
  isFlyoutItem,
  onKeyDownHandler,
}) => {
  const [selectedKey, setSelectedKey] = useState('');
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  const currentUnit = useSelector(selectors.getOfficeEditorUnitMeasurement);

  const convertedOptions = useMemo(() => {
    return getConvertedMarginOptions(currentUnit);
  }, [currentUnit]);

  const getTranslatedSide = (side) => t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${side}`);

  const getTranslatedDescription = useCallback((item, unit) => {
    return Object.values(MARGIN_SIDES)
      .map((side) => `${getTranslatedSide(side)}: ${item[side]}${unit}`)
      .join(', ');
  }, [getTranslatedSide]);

  const localizedMarginOptions = useMemo(() => {
    const unitLabel = getUnitLabel(currentUnit);
    return convertedOptions.map((item) => ({
      ...item,
      label: t(item.label),
      description: t(item.description) || getTranslatedDescription(item, unitLabel),
    }));
  }, [convertedOptions, currentUnit, getTranslatedDescription]);

  const onClickItem = async (itemKey) => {
    const item = MARGIN_OPTIONS.find((item) => item.key === itemKey);
    await item.onClick(dispatch, actions);
  };

  const onOpened = async () => {
    if (selectedKey !== '') {
      return;
    }
    let sectionMargins = await core.getOfficeEditor().getSectionMargins(currentUnit);
    for (const [key, value] of Object.entries(sectionMargins)) {
      sectionMargins[key] = roundNumberToDecimals(value);
    }
    const selectedOption = convertedOptions.find((option) => {
      return Object.values(MARGIN_SIDES).every((side) => option[side] === sectionMargins[side]);
    });
    if (selectedOption) {
      setSelectedKey(selectedOption.key);
    }
  };

  const onClosed = () => {
    setSelectedKey('');
  };

  return (
    <Dropdown
      id='office-editor-margin-dropdown'
      dataElement={DataElements.OFFICE_EDITOR_MARGIN_DROPDOWN}
      labelledById={DataElements.OFFICE_EDITOR_MARGIN_DROPDOWN}
      className={classNames({
        'office-editor-margin-dropdown': true,
        'dropdown-text-icon': true,
        'modular-ui': customizableUI,
        'flyout-item': isFlyoutItem,
      })}
      width={'auto'}
      isFlyoutItem={isFlyoutItem}
      items={localizedMarginOptions}
      getKey={(item) => item.key}
      applyCustomStyleToButton={false}
      currentSelectionKey={selectedKey}
      getDisplayValue={(item) => t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${item.key}`)}
      getCustomItemStyle={() => ({ height: '52px' })}
      renderItem={(item) => renderDropdownItemWithDescription(item)}
      onClickItem={onClickItem}
      displayButton={ToggleButton}
      onKeyDownHandler={onKeyDownHandler}
      onOpened={onOpened}
      onClosed={onClosed}
    />
  );
};

OfficeEditorMarginDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default OfficeEditorMarginDropdown;