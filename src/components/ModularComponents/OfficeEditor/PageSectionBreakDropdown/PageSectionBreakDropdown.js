import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import actions from 'actions';
import { PAGE_SECTION_BREAK_OPTIONS } from 'helpers/officeEditor';
import { OFFICE_EDITOR_TRANSLATION_PREFIX, EditingStreamType } from 'constants/officeEditor';
import DataElements from 'constants/dataElement';
import Dropdown from 'components/Dropdown';
import ActionButton from 'components/ActionButton';
import Icon from 'components/Icon';

import './PageSectionBreakDropdown.scss';

const ToggleButton = ({ isOpen, disabled }) => {
  return (
    <>
      <ActionButton
        dataElement={DataElements.OFFICE_EDITOR_BREAK_DROPDOWN_TOGGLE}
        img="icon-office-editor-page-break"
        title={`${OFFICE_EDITOR_TRANSLATION_PREFIX}breaks`}
        label={`${OFFICE_EDITOR_TRANSLATION_PREFIX}breaks`}
        disabled={disabled}
        isActive={isOpen}
        ariaPressed={isOpen}
        ariaExpanded={isOpen}
      />
      <Icon
        className="arrow"
        glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`}
        disabled={disabled}
      />
    </>
  );
};

ToggleButton.propTypes = {
  isOpen: PropTypes.bool,
  disabled: PropTypes.bool,
};

const renderToggleButton = (isOpen, disabled) => <ToggleButton isOpen={isOpen} disabled={disabled} />;

const PageSectionBreakDropdown = (props) => {
  const { isFlyoutItem, activeFlyout, onKeyDownHandler } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  const isCursorInTable = useSelector(selectors.isCursorInTable);
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);

  const isDropdownDisabled = isCursorInTable || activeStream !== EditingStreamType.BODY;

  const renderDropdownItem = (item) => (
    <>
      <Icon glyph={item.icon} className='Dropdown__item-icon' />
      <div className='Dropdown__item-vertical'>
        <div className='Dropdown__item-label'>{t(item.label)}</div>
        <div className='Dropdown__item-description'>{t(item.description)}</div>
      </div>
      {item.key === 'pageBreak' && <div className='Divider'></div>}
    </>
  );

  const getCustomItemStyle = (item) => {
    let styles = {
      height: '52px',
      marginTop: '4px',
      marginBottom: '4px',
    };

    if (item.key === 'pageBreak') {
      styles = {
        ...styles,
        marginBottom: '9px',
        position: 'relative',
      };
    }
    return styles;
  };

  const onClickItem = async (itemKey) => {
    if (isDropdownDisabled) {
      return;
    }
    const item = PAGE_SECTION_BREAK_OPTIONS.find((item) => item.key === itemKey);
    await item?.onClick();

    if (isFlyoutItem && activeFlyout) {
      dispatch(actions.closeElement(activeFlyout));
    }
  };

  return (
    <Dropdown
      id='office-editor-break-dropdown'
      dataElement={DataElements.OFFICE_EDITOR_BREAK_DROPDOWN}
      className={classNames({
        'office-editor-break-dropdown': true,
        'dropdown-text-icon': true,
        'flyout-item': isFlyoutItem,
        'modular-ui': customizableUI,
      })}
      width={'auto'}
      isFlyoutItem={isFlyoutItem}
      items={PAGE_SECTION_BREAK_OPTIONS}
      getKey={(item) => item.key}
      renderItem={renderDropdownItem}
      onClickItem={onClickItem}
      onKeyDownHandler={onKeyDownHandler}
      getCustomItemStyle={getCustomItemStyle}
      applyCustomStyleToButton={false}
      disabled={isDropdownDisabled}
      displayButton={(isOpen) => renderToggleButton(isOpen, isDropdownDisabled)}
    />
  );
};

PageSectionBreakDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  activeFlyout: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

export default PageSectionBreakDropdown;