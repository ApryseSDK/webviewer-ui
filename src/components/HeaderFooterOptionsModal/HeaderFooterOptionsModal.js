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
import { MARGIN_UNITS, OFFICE_EDITOR_TRANSLATION_PREFIX } from 'constants/officeEditor';
import HeaderFooterModalState from 'helpers/headerFooterModalState';
import { validateMarginInput, focusContent, convertMeasurementUnit, formatToDecimalString } from 'helpers/officeEditor';
import Dropdown from 'components/Dropdown';

import './HeaderFooterOptionsModal.scss';

const HeaderFooterOptionsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  const [headerToTopOnOpen, setHeaderToTopOnOpen] = useState(0);
  const [footerToBottomOnOpen, setFooterToBottomOnOpen] = useState(0);
  const [headerToTop, setHeaderToTop] = useState(0);
  const [footerToBottom, setFooterToBottom] = useState(0);
  const [headerToTopInput, setHeaderToTopInput] = useState('');
  const [footerToBottomInput, setFooterToBottomInput] = useState('');
  const [differentFirstPageEnabled, setDifferentFirstPageEnabled] = useState(false);
  const [oddEvenEnabled, setOddEvenEnabled] = useState(false);
  const [maxMarginsInInches, setMaxMarginsInInches] = useState(0);
  const currentUnit = useSelector(selectors.getOfficeEditorUnitMeasurement);
  const [initialUnit, setInitialUnit] = useState(currentUnit);

  const onClickUnitDropdownItem = (unit) => dispatch(actions.setOfficeEditorUnitMeasurement(unit));

  const onHeaderInputBlur = (inputVal) => {
    const maxMarginsInCurrentUnit = convertMeasurementUnit(maxMarginsInInches, MARGIN_UNITS.INCH, currentUnit);
    const val = validateMarginInput(inputVal, maxMarginsInCurrentUnit);
    setHeaderToTop(val);
    setHeaderToTopInput(formatToDecimalString(val));
  };

  const onFooterInputBlur = (inputVal) => {
    const maxMarginsInCurrentUnit = convertMeasurementUnit(maxMarginsInInches, MARGIN_UNITS.INCH, currentUnit);
    const val = validateMarginInput(inputVal, maxMarginsInCurrentUnit);
    setFooterToBottom(val);
    setFooterToBottomInput(formatToDecimalString(val));
  };

  const onHeaderToTopChange = (inputVal) => {
    setHeaderToTopInput(inputVal);
  };

  const onFooterToBottomChange = (inputVal) => {
    setFooterToBottomInput(inputVal);
  };

  const onSave = async () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
    const pageNumber = HeaderFooterModalState.getPageNumber();
    const headerFooterDistanceChanged = headerToTopOnOpen !== headerToTop || footerToBottomOnOpen !== footerToBottom;
    return Promise.all([
      core.getOfficeEditor().setDifferentFirstPage(pageNumber, differentFirstPageEnabled),
      core.getOfficeEditor().setOddEven(oddEvenEnabled),
      headerFooterDistanceChanged && core.getOfficeEditor().setHeaderFooterMargins(pageNumber, { headerDistanceToTop: headerToTop, footerDistanceToBottom:footerToBottom }, currentUnit),
    ]);
  };

  useEffect(async () => {
    if (isOpen) {
      const pageNumber = HeaderFooterModalState.getPageNumber();
      const { headerDistanceToTop, footerDistanceToBottom } = await core.getOfficeEditor().getHeaderFooterMargins(pageNumber, currentUnit);
      setHeaderToTop(headerDistanceToTop);
      setHeaderToTopInput(formatToDecimalString(headerDistanceToTop));
      setFooterToBottom(footerDistanceToBottom);
      setFooterToBottomInput(formatToDecimalString(footerDistanceToBottom));
      setHeaderToTopOnOpen(headerDistanceToTop);
      setFooterToBottomOnOpen(footerDistanceToBottom);

      setDifferentFirstPageEnabled(await core.getOfficeEditor().getDifferentFirstPage(pageNumber));
      setOddEvenEnabled(await core.getOfficeEditor().getOddEven());

      const maxMargins = await core.getOfficeEditor().getMaxHeaderFooterDistance(pageNumber);
      setMaxMarginsInInches(maxMargins);
    }
  }, [isOpen]);

  useEffect(async () => {
    if (currentUnit === initialUnit) {
      return;
    }
    setInitialUnit(currentUnit);

    // get and set header and footer distances in the new unit
    const headerDistanceToTopInCurrentUnit = convertMeasurementUnit(headerToTop, initialUnit, currentUnit);
    const footerDistanceToBottomInCurrentUnit = convertMeasurementUnit(footerToBottom, initialUnit, currentUnit);
    const maxMarginsInCurrentUnit = convertMeasurementUnit(maxMarginsInInches, MARGIN_UNITS.INCH, currentUnit);
    const validatedHeaderDistance = validateMarginInput(headerDistanceToTopInCurrentUnit, maxMarginsInCurrentUnit);
    const validatedFooterDistance = validateMarginInput(footerDistanceToBottomInCurrentUnit, maxMarginsInCurrentUnit);
    setHeaderToTop(validatedHeaderDistance);
    setHeaderToTopInput(formatToDecimalString(validatedHeaderDistance));
    setFooterToBottom(validatedFooterDistance);
    setFooterToBottomInput(formatToDecimalString(validatedFooterDistance));
  }, [currentUnit, initialUnit]);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
    focusContent();
  };

  const inputElements = [
    {
      id: 'headerToTopInput',
      value: headerToTopInput,
      label: t('officeEditor.headerFooterOptionsModal.headerFromTop'),
      onChange: (e) => onHeaderToTopChange(e.target.value),
      onBlur: (e) => onHeaderInputBlur(e.target.valueAsNumber),
    },
    {
      id: 'footerToBottomInput',
      value: footerToBottomInput,
      label: t('officeEditor.headerFooterOptionsModal.footerFromBottom'),
      onChange: (e) => onFooterToBottomChange(e.target.value),
      onBlur: (e) => onFooterInputBlur(e.target.valueAsNumber),
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
          <div className='input-container'>
            <label
              id='office-editor-margin-unit-label'
              className='modal-label'
            >
              {t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}unitMeasurement`)}

            </label>
            <Dropdown
              id='office-editor-margin-unit'
              dataElement={DataElements.OFFICE_EDITOR_MARGIN_UNIT}
              labelledById='office-editor-margin-unit-label'
              className='margin-unit-dropdown'
              items={Object.values(MARGIN_UNITS)}
              onClickItem={onClickUnitDropdownItem}
              getKey={(item) => item}
              currentSelectionKey={currentUnit}
              width={'auto'}
            />
          </div>
          {inputElements.map((input) => (
            <div key={input.id} className='input-container'>
              <label htmlFor={input.id} className='modal-label'>{input.label}</label>
              <Input
                type='number'
                id={input.id}
                onChange={input.onChange}
                onBlur={input.onBlur}
                value={input.value}
                min='0'
                step='0.1'
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
