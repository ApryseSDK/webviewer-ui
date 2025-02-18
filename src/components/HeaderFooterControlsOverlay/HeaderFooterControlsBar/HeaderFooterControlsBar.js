import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Dropdown from 'components/Dropdown';
import classNames from 'classnames';
import core from 'core';

import './HeaderFooterControlsBar.scss';

const propTypes = {
  type: PropTypes.oneOf(['header', 'footer']),
  pageNumber: PropTypes.number,
  isActive: PropTypes.bool,
};

const HeaderFooterControlsBar = ({ type, pageNumber, isActive }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const blockerRef = useRef();
  const dropdownId = `${type}-options-dropdown-${pageNumber}`;
  const barId = `${type}-edit-ui-${pageNumber}`;
  const barClassName = classNames({
    'header-footer-edit-ui': true,
    [`${type}-edit-ui`]: true,
    'active': isActive
  });


  useEffect(() => {
    // This stops the cursor from moving when the user clicks on the bar
    const stopPropagation = (event) => {
      event.stopPropagation();
    };
    ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'].forEach((eventType) => {
      blockerRef.current?.addEventListener(eventType, stopPropagation);
    });
    return () => {
      ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave'].forEach((eventType) => {
        blockerRef.current?.removeEventListener(eventType, stopPropagation);
      });
    };
  }, []);

  const handlePageOptionsClick = () => {
    dispatch(actions.openElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  };

  const handleRemoveHeaderFooterOnClick = () => {
    if (type === 'header') {
      return core.getOfficeEditor().removeHeaders(pageNumber);
    }
    if (type === 'footer') {
      return core.getOfficeEditor().removeFooters(pageNumber);
    }
  };

  const renderDropdownItem = (item) => (
    <>
      <Icon glyph={item.icon} className='Dropdown__item-icon' />
      <div className='Dropdown__item-vertical'>
        <div className='Dropdown__item-label'>{t(item.label)}</div>
      </div>
      {item.key === 'page-options' && <div className='Divider'></div>}
    </>
  );


  const dropdownItems = [
    {
      label: t('officeEditor.pageOptions'),
      key: 'page-options',
      icon: 'ic-edit-page',
      onClick: handlePageOptionsClick,
    },
    {
      label: type === 'header' ? t('officeEditor.removeHeader') : t('officeEditor.removeFooter'),
      key: `remove-${type}`,
      icon: 'ic-delete-page',
      onClick: handleRemoveHeaderFooterOnClick,
    },
  ];

  const onClickItem = async (itemKey) => {
    const item = dropdownItems.find((item) => item.key === itemKey);
    await item?.onClick();
  };

  const renderDropdownButton = (isOpen) => (
    <ActionButton
      className='options-button'
      ariaLabelledby={barId}
      ariaControls={`${dropdownId}-dropdown`}
      ariaExpanded={isOpen}
      img={'ic_chevron_down_black_24px'}
      label={t('officeEditor.options')}
      isActive={isOpen}
    />
  );

  return (
    <div className={barClassName} id={barId}>
      <div className='box-shadow-div' ref={blockerRef}></div>
      <div className='label'>{t(`officeEditor.${type}`)}</div>

      <Dropdown
        width='auto'
        id={dropdownId}
        renderItem={renderDropdownItem}
        className='options-dropdown-container'
        getKey={(item) => item.key}
        items={dropdownItems}
        onClickItem={onClickItem}
        displayButton={renderDropdownButton}
        stopPropagationOnMouseDown={true}
      />
    </div>
  );
};

HeaderFooterControlsBar.propTypes = propTypes;

export default React.memo(HeaderFooterControlsBar);
