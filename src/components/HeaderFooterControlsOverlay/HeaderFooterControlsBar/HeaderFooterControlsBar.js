import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { HEADER_FOOTER_BAR_DEFAULT_POSITION, OfficeEditorEditMode } from 'constants/officeEditor';

import './HeaderFooterControlsBar.scss';

const propTypes = {
  type: PropTypes.oneOf(['header', 'footer']),
  pageNumber: PropTypes.number,
  isActive: PropTypes.bool,
};

const MOUSE_EVENTS_TYPES = [
  'click',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'contextmenu',
];

const HeaderFooterControlsBar = ({ type, pageNumber, isActive }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const doc = core.getDocument();
  const officeEditor = doc.getOfficeEditor();
  const blockerRef = useRef();
  const dropdownId = `${type}-options-dropdown-${pageNumber}`;
  const barId = `${type}-edit-ui-${pageNumber}`;

  const [containerStyle, setContainerStyle] = useState({});
  const [sectionNumber, setSectionNumber] = useState(null);
  const [headerType, setHeaderType] = useState(0); // 0 is default for header type all
  const [footerType, setFooterType] = useState(0); // 0 is default for footer type all
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [showHeaderBar, setShowHeaderBar] = useState(false);
  const [showFooterBar, setShowFooterBar] = useState(false);

  const barClassName = useMemo(() => {
    const showBar = type === 'header' ? showHeaderBar : showFooterBar;
    return classNames(
      'header-footer-edit-ui',
      `${type}-edit-ui`,
      {
        'active': isActive && showBar,
      }
    );
  }, [type, isActive, showHeaderBar, showFooterBar]);

  const getHeaderFooterTop = () => {
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

  const updateHeaderFooterSectionNumber = async () => {
    const sectionNumber = await officeEditor.getSectionNumber(pageNumber);
    setSectionNumber(sectionNumber);
  };

  useEffect(async () => {
    // This stops the cursor from moving when the user clicks on the bar
    const onBarClick = (event) => {
      if (event.type === 'mousedown') {
        dispatch(actions.closeElements([DataElements.CONTEXT_MENU_POPUP]));
      }
      event.stopPropagation();
    };

    MOUSE_EVENTS_TYPES.forEach((eventType) => {
      blockerRef.current.addEventListener(eventType, onBarClick);
    });

    const onHeaderFooterUpdated = () => {
      updateHeaderFooterTop();
      updateHeaderFooterSectionNumber();
    };

    const updateHeaderFooterTop = () => {
      const top = getHeaderFooterTop();
      if (top > 0) {
        // Sometimes the headerTop is 0 when the data isn't loaded.
        // In this case just ignore it and wait for the next event to update the position
        setContainerStyle({ top });
      }
    };

    doc.addEventListener('headerFooterUpdated', onHeaderFooterUpdated);

    const onEditModeUpdated = (editMode) => {
      const isReadOnlyMode = editMode === OfficeEditorEditMode.VIEW_ONLY || editMode === OfficeEditorEditMode.PREVIEW;
      setOptionsDisabled(isReadOnlyMode);
    };
    doc.addEventListener('editModeUpdated', onEditModeUpdated);

    const getInitialHeaderFooterStyle = () => {
      const headerFooterStyle = type === 'header' ? { top: HEADER_FOOTER_BAR_DEFAULT_POSITION } : { bottom: HEADER_FOOTER_BAR_DEFAULT_POSITION };
      const top = getHeaderFooterTop();
      return top > 0 ? { top } : headerFooterStyle;
    };
    setContainerStyle(getInitialHeaderFooterStyle());

    return () => {
      MOUSE_EVENTS_TYPES.forEach((eventType) => {
        blockerRef.current?.removeEventListener(eventType, onBarClick);
      });

      doc.removeEventListener('headerFooterUpdated', onHeaderFooterUpdated);
      doc.removeEventListener('editModeUpdated', onEditModeUpdated);
    };
  }, [isActive]);

  useEffect(() => {
    const onLayoutChange = (e) => {
      if (e.source !== 'headerFooter') {
        return;
      }
      const headerType = officeEditor.getHeaderPageType(pageNumber);
      const footerType = officeEditor.getFooterPageType(pageNumber);
      if (headerType !== -1) {
        setShowHeaderBar(true);
        setHeaderType(headerType);
      }
      if (footerType !== -1) {
        setShowFooterBar(true);
        setFooterType(footerType);
      }
    };
    doc.addEventListener('officeDocumentEdited', onLayoutChange);
    return () => {
      doc.removeEventListener('officeDocumentEdited', onLayoutChange);
    };
  }, [pageNumber]);

  useEffect(() => {
    updateHeaderFooterSectionNumber();
    const headerType = officeEditor.getHeaderPageType(pageNumber);
    const footerType = officeEditor.getFooterPageType(pageNumber);
    if (headerType !== -1) {
      setShowHeaderBar(true);
      setHeaderType(headerType);
    }
    if (footerType !== -1) {
      setShowFooterBar(true);
      setFooterType(footerType);
    }
  }, [isActive, pageNumber]);

  const handlePageOptionsClick = async () => {
    HeaderFooterModalState.setPageNumber(pageNumber);
    dispatch(actions.openElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  };

  const handleRemoveHeaderFooterOnClick = () => {
    if (type === 'header') {
      return officeEditor.removeHeaders(pageNumber);
    }
    if (type === 'footer') {
      return officeEditor.removeFooters(pageNumber);
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
      disabled={optionsDisabled}
    />
  );
  const sectionLabel = sectionNumber ? ` - ${t('officeEditor.section')} ${sectionNumber}` : '';

  const layoutType = type === 'header' ? headerType : footerType;

  return (
    <div className={barClassName} id={barId} style={containerStyle}>
      <div className='box-shadow-div' ref={blockerRef}></div>
      <div className='label'>{t(`officeEditor.${type}.${layoutType}`)}{sectionLabel}</div>

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
        disabled={optionsDisabled}
      />
    </div>
  );
};

HeaderFooterControlsBar.propTypes = propTypes;

export default React.memo(HeaderFooterControlsBar);
