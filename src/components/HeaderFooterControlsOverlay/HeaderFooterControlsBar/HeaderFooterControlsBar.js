import React, { useEffect, useRef, useState } from 'react';
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
import HeaderFooterModalState from 'helpers/headerFooterModalState';

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

  const [containerTop, setContainerTop] = useState(0);
  const [headerType, setHeaderType] = useState(0); // 0 is default for header type all
  const [footerType, setFooterType] = useState(0); // 0 is default for footer type all

  const barClassName = classNames(
    'header-footer-edit-ui',
    `${type}-edit-ui`,
    { 'active': (isActive && containerTop > 0) }
  );

  const getHeaderFooterTop = () => {
    const officeEditor = core.getDocument().getOfficeEditor();
    const heightOfBar = blockerRef.current?.clientHeight || 0;
    switch (type) {
      case 'header':
        return officeEditor.getHeaderPosition(pageNumber);
      case 'footer':
        return officeEditor.getFooterPosition(pageNumber) - heightOfBar;
      default:
        return 0;
    }
  };

  useEffect(async () => {
    // This stops the cursor from moving when the user clicks on the bar
    const onBarClick = (event) => {
      if (event.type === 'mousedown') {
        dispatch(actions.closeElements([DataElements.CONTEXT_MENU_POPUP]));
      }
      event.stopPropagation();
    };

    ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'contextmenu'].forEach((eventType) => {
      blockerRef.current.addEventListener(eventType, onBarClick);
    });

    const updateHeaderFooterTop = async () => {
      const headerFooterTop = getHeaderFooterTop();
      if (headerFooterTop > 0) {
        // Sometimes the headerTop is 0 when the data isn't loaded.
        // In this case just ignore it and wait for the next event to update the position
        setContainerTop(headerFooterTop);
      }
    };

    core.getDocument().addEventListener('officeDocumentEdited', updateHeaderFooterTop);
    return () => {
      ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'contextmenu'].forEach((eventType) => {
        blockerRef.current.removeEventListener(eventType, onBarClick);
      });

      core.getDocument().removeEventListener('officeDocumentEdited', updateHeaderFooterTop);
    };
  }, []);

  useEffect(() => {
    const onLayoutChange = () => {
      setTimeout(() => {
        const headerType = core.getOfficeEditor().getHeaderPageType(pageNumber);
        const footerType = core.getOfficeEditor().getFooterPageType(pageNumber);
        headerType != -1 && setHeaderType(headerType);
        footerType != -1 && setFooterType(footerType);
      // Core resolves the promise too early.
      // So we have to wait a bit to get the correct value
      }, 800);
    };
    const doc = core.getDocument();
    doc.addEventListener('headerFooterLayoutUpdated', onLayoutChange);
    return () => {
      doc.removeEventListener('headerFooterLayoutUpdated', onLayoutChange);
    };
  }, [pageNumber]);

  useEffect(() => {
    setContainerTop(getHeaderFooterTop());
  }, [isActive]);

  useEffect(() => {
    const headerType = core.getOfficeEditor().getHeaderPageType(pageNumber);
    const footerType = core.getOfficeEditor().getFooterPageType(pageNumber);
    headerType != -1 && setHeaderType(headerType);
    footerType != -1 && setFooterType(footerType);
  }, [isActive, pageNumber]);

  const handlePageOptionsClick = async () => {
    HeaderFooterModalState.setPageNumber(pageNumber);
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

  const layoutType = type === 'header' ? headerType: footerType;

  return (
    <div className={barClassName} id={barId} style={{ top: containerTop }}>
      <div className='box-shadow-div' ref={blockerRef}></div>
      <div className='label'>{t(`officeEditor.${type}.${layoutType}`)}</div>

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
