import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import Dropdown from 'components/Dropdown';
import DataElements from 'constants/dataElement';
import { MARGIN_SIDES, MARGIN_UNIT_LABELS, OFFICE_EDITOR_TRANSLATION_PREFIX } from 'constants/officeEditor';
import { MARGIN_OPTIONS } from 'helpers/officeEditor';
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
        glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`}
      />
    </>
  );
};

const OfficeEditorMarginDropdown = ({
  isFlyoutItem,
  onKeyDownHandler,
}) => {
  const [t] = useTranslation();

  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);

  const getTranslatedSide = (side) => t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${side}`);

  const getTranslatedDescription = (item, unit) => {
    return Object.values(MARGIN_SIDES)
      .map((side) => `${getTranslatedSide(side)}: ${item[side]}${unit}`)
      .join(', ');
  };

  const getLocalizedMarginOptions = () => {
    return MARGIN_OPTIONS.map((item) => ({
      ...item,
      description: item.description || getTranslatedDescription(item, MARGIN_UNIT_LABELS.CM),
    }));
  };

  const renderDropdownItem = (item) => (
    <div className='Dropdown__item-vertical'>
      <div className='Dropdown__item-label'>{t(item.label)}</div>
      <div className='Dropdown__item-description'>{t(item.description)}</div>
    </div>
  );

  const isItemSelected = () => {
    return 'normal';
  };

  const onClickItem = async (itemKey) => {
    const item = MARGIN_OPTIONS.find((item) => item.key === itemKey);
    await item.onClick();
  };


  return (
    <Dropdown
      id='office-editor-margin-dropdown'
      dataElement={DataElements.OFFICE_EDITOR_MARGIN_DROPDOWN}
      className={classNames({
        'office-editor-margin-dropdown': true,
        'dropdown-text-icon': true,
        'modular-ui': customizableUI,
        'flyout-item': isFlyoutItem,
      })}
      width={'auto'}
      isFlyoutItem={isFlyoutItem}
      items={getLocalizedMarginOptions()}
      getKey={(item) => item.key}
      applyCustomStyleToButton={false}
      currentSelectionKey={isItemSelected()}
      getDisplayValue={(item) => t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}${item.key}`)}
      getCustomItemStyle={() => ({ height: '52px' })}
      renderItem={renderDropdownItem}
      onClickItem={onClickItem}
      displayButton={ToggleButton}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

OfficeEditorMarginDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default OfficeEditorMarginDropdown;