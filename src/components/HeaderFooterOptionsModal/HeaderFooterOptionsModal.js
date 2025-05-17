import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import core from 'core';
import { MARGIN_UNITS } from 'constants/officeEditor';
import HeaderFooterModalState from 'helpers/headerFooterModalState';
import { validateMarginInput } from 'helpers/officeEditor';

import './HeaderFooterOptionsModal.scss';

const HeaderFooterOptionsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  const [headerToTopOnOpen, setHeaderToTopOnOpen] = useState('');
  const [footerToBottomOnOpen, setFooterToBottomOnOpen] = useState('');
  const [headerToTop, setHeaderToTop] = useState('');
  const [footerToBottom, setFooterToBottom] = useState('');
  const [differentFirstPageEnabled, setDifferentFirstPageEnabled] = useState(false);
  const [oddEvenEnabled, setOddEvenEnabled] = useState(false);
  const [maxMarginsInInches, setMaxMarginsInInches] = useState(0);
  const [currentUnit, setCurrentUnit] = useState(MARGIN_UNITS.CM);

  const onHeaderInputBlur = (e) => {
    if (e.target.value === '') {
      setHeaderToTop('0');
    }
  };

  const onFooterInputBlur = (e) => {
    if (e.target.value === '') {
      setFooterToBottom('0');
    }
  };

  const onHeaderToTopChange = (e) => {
    const val = validateMarginInput(e.target.value, maxMarginsInInches, currentUnit);
    setHeaderToTop(val);
  };

  const onFooterToBottomChange = (e) => {
    const val = validateMarginInput(e.target.value, maxMarginsInInches, currentUnit);
    setFooterToBottom(val);
  };

  const onSave = async () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
    const pageNumber = HeaderFooterModalState.getPageNumber();
    const headerFooterDistanceChanged = headerToTopOnOpen !== headerToTop || footerToBottomOnOpen !== footerToBottom;
    return Promise.all([
      core.getOfficeEditor().setDifferentFirstPage(pageNumber, differentFirstPageEnabled),
      core.getOfficeEditor().setOddEven(oddEvenEnabled),
      headerFooterDistanceChanged && core.getOfficeEditor().setHeaderFooterMargins(pageNumber, { headerDistanceToTop: headerToTop, footerDistanceToBottom: footerToBottom }, currentUnit),
    ]);
  };

  useEffect(async () => {
    if (isOpen) {
      setCurrentUnit(MARGIN_UNITS.CM);
      const pageNumber = HeaderFooterModalState.getPageNumber();
      const { headerDistanceToTop, footerDistanceToBottom } = await core.getOfficeEditor().getHeaderFooterMargins(pageNumber, currentUnit);
      const headerDistanceToTopConverted = headerDistanceToTop.toFixed(2);
      const footerDistanceToBottomConverted = footerDistanceToBottom.toFixed(2);
      setHeaderToTop(headerDistanceToTopConverted);
      setFooterToBottom(footerDistanceToBottomConverted);
      setHeaderToTopOnOpen(headerDistanceToTopConverted);
      setFooterToBottomOnOpen(footerDistanceToBottomConverted);

      setDifferentFirstPageEnabled(await core.getOfficeEditor().getDifferentFirstPage(pageNumber));
      setOddEvenEnabled(await core.getOfficeEditor().getOddEven());

      const maxMargins = await core.getOfficeEditor().getMaxHeaderFooterDistance(pageNumber);
      setMaxMarginsInInches(maxMargins);
    }
  }, [isOpen]);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));

    setTimeout(() => {
      core.getOfficeEditor().focusContent();
    }, 0);
  };

  const inputElements = [
    {
      id: 'headerToTopInput',
      value: headerToTop,
      label: t('officeEditor.headerFooterOptionsModal.headerFromTop'),
      onChange: onHeaderToTopChange,
      onBlur: onHeaderInputBlur,
    },
    {
      id: 'footerToBottomInput',
      value: footerToBottom,
      label: t('officeEditor.headerFooterOptionsModal.footerFromBottom'),
      onChange: onFooterToBottomChange,
      onBlur: onFooterInputBlur,
    },
  ];

  return isOpen && (
    <div className='HeaderFooterOptionsModal' data-element={DataElements.HEADER_FOOTER_OPTIONS_MODAL}>
      <ModalWrapper
        isOpen={isOpen}
        title={t('officeEditor.headerFooterOptionsModal.title')}
        closehandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose
      >
        <div className='modal-body'>
          <div className='title'>{t('officeEditor.margins')}</div>
          {inputElements.map((input) => (
            <div key={input.id} className='input-container'>
              <label htmlFor={input.id} className='label'>{input.label}</label>
              <Input
                type='number'
                id={input.id}
                onChange={input.onChange}
                onBlur={input.onBlur}
                value={input.value}
                min='0'
                step='any'
              />
            </div>
          ))}
          <div className='title'>{t('officeEditor.headerFooterOptionsModal.layouts.layout')}</div>
          <Choice
            id={'different-first-page'}
            label={t('officeEditor.headerFooterOptionsModal.layouts.differentFirstPage')}
            aria-label={t('officeEditor.headerFooterOptionsModal.layouts.differentFirstPage')}
            checked={differentFirstPageEnabled}
            aria-checked={differentFirstPageEnabled}
            onChange={(event) => setDifferentFirstPageEnabled(event.target.checked)}
          />
          <Choice
            id={'different-odd-even'}
            label={t('officeEditor.headerFooterOptionsModal.layouts.differentEvenOddPages')}
            aria-label={t('officeEditor.headerFooterOptionsModal.layouts.differentEvenOddPages')}
            checked={oddEvenEnabled}
            aria-checked={oddEvenEnabled}
            onChange={(event) => setOddEvenEnabled(event.target.checked)}
          />
        </div>
        <div className='footer'>
          <Button onClick={onSave} label={t('action.save')} />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default HeaderFooterOptionsModal;
