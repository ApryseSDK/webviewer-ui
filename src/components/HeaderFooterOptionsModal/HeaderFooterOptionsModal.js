import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import core from 'core';
import { CM_PER_INCH } from 'constants/officeEditor';
import HeaderFooterModalState from 'helpers/headerFooterModalState';

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
  const [currentUnit, setCurrentUnit] = useState('cm');

  const validateInput = (input) => {
    if (input && input <= 0) {
      return '0';
    }
    // Removes leading zero unless it is followed by a decimal
    const validatedInput = input.replace(/^0+(?!\.)/, '');

    let maxMarginsConverted = maxMarginsInInches;

    if (currentUnit === 'cm') {
      maxMarginsConverted = maxMarginsInInches * CM_PER_INCH;
    }

    if (parseFloat(validatedInput) > maxMarginsConverted) {
      return maxMarginsConverted.toFixed(2);
    }

    return validatedInput;
  };

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
    const val = validateInput(e.target.value);
    setHeaderToTop(val);
  };

  const onFooterToBottomChange = (e) => {
    const val = validateInput(e.target.value);
    setFooterToBottom(val);
  };

  const inchesToCurrentUnit = (inches) => {
    let val = inches;
    if (currentUnit === 'cm') {
      val = (parseFloat(inches) * CM_PER_INCH).toFixed(2);
    }
    return val;
  };

  const currentUnitToInches = (input) => {
    let val = parseFloat(input);
    if (currentUnit === 'cm') {
      val = val / CM_PER_INCH;
    }
    return val;
  };

  const onSave = async () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
    const headerToTopInches = currentUnitToInches(headerToTop);
    const footerToBottomInches = currentUnitToInches(footerToBottom);
    const pageNumber = HeaderFooterModalState.getPageNumber();
    const headerFooterDistanceChanged = headerToTopOnOpen !== headerToTop || footerToBottomOnOpen !== footerToBottom;
    return Promise.all([
      core.getOfficeEditor().setDifferentFirstPage(pageNumber, differentFirstPageEnabled),
      core.getOfficeEditor().setOddEven(oddEvenEnabled),
      headerFooterDistanceChanged && core.getOfficeEditor().setHeaderFooterMarginsInInches(pageNumber, headerToTopInches, footerToBottomInches),
    ]);
  };

  useEffect(async () => {
    if (isOpen) {
      setCurrentUnit('cm');
      const pageNumber = HeaderFooterModalState.getPageNumber();
      const { headerDistanceToTop, footerDistanceToBottom } = await core.getOfficeEditor().getHeaderFooterMarginsInInches(pageNumber);
      const headerDistanceToTopConverted = inchesToCurrentUnit(headerDistanceToTop);
      const footerDistanceToBottomConverted = inchesToCurrentUnit(footerDistanceToBottom);
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

  const modalClass = classNames({
    'HeaderFooterOptionsModal': true
  });

  return isOpen && (
    <div className={modalClass} data-element={DataElements.HEADER_FOOTER_OPTIONS_MODAL}>
      <ModalWrapper
        isOpen={isOpen}
        title={t('officeEditor.headerFooterOptionsModal.title')}
        closehandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose
      >
        <div className='modal-body'>
          <div className='title'>{t('officeEditor.headerFooterOptionsModal.margins')}</div>
          <div className='input-container'>
            <label htmlFor='headerToTopInput' className='label'>{t('officeEditor.headerFooterOptionsModal.headerFromTop')}</label>
            <Input
              type='number'
              id='headerToTopInput'
              data-testid="headerToTopInput"
              onChange={onHeaderToTopChange}
              onBlur={onHeaderInputBlur}
              value={headerToTop}
              min='0'
              step='any'
            />
          </div>
          <div className='input-container'>
            <label htmlFor='footerToBottomInput' className='label'>{t('officeEditor.headerFooterOptionsModal.footerFromBottom')}</label>
            <Input
              type='number'
              id='footerToBottomInput'
              data-testid="footerToBottomInput"
              onChange={onFooterToBottomChange}
              onBlur={onFooterInputBlur}
              value={footerToBottom}
              min='0'
              step='any'
            />
          </div>
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
