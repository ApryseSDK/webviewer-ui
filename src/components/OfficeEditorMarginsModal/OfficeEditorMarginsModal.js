import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import { Input } from '@pdftron/webviewer-react-toolkit';
import core from 'core';
import {
  MARGIN_UNITS,
  PIXELS_PER_INCH,
  MARGIN_TOP_AND_BOTTOM_MAX_PERCENTAGE,
  MINIMUM_COLUMN_WIDTH_IN_INCHES,
  CM_PER_INCH
} from 'constants/officeEditor';
import { validateMarginInput } from 'helpers/officeEditor';

import './OfficeEditorMarginsModal.scss';

const OfficeEditorMarginsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [leftMargin, setLeftMargin] = useState('');
  const [rightMargin, setRightMargin] = useState('');
  const [topMargin, setTopMargin] = useState('');
  const [bottomMargin, setBottomMargin] = useState('');
  const [marginsOnOpen, setMarginsOnOpen] = useState({ left: '', right: '', top: '', bottom: '' });
  const [maxLeftMarginInInches, setMaxLeftMarginInInches] = useState(0);
  const [maxRightMarginInInches, setMaxRightMarginInInches] = useState(0);
  const [maxTopAndBottomMarginsInInches, setMaxTopAndBottomMarginsInInches] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [currentUnit, setCurrentUnit] = useState(MARGIN_UNITS.CM);

  useEffect(async () => {
    setCurrentUnit(MARGIN_UNITS.CM);
    const pageNumber = await core.getOfficeEditor().getEditingPageNumber();
    const pageHeight = core.getDocumentViewer().getPageHeight(pageNumber) / PIXELS_PER_INCH;

    setPageWidth(core.getDocumentViewer().getPageWidth(pageNumber) / PIXELS_PER_INCH);
    setMaxTopAndBottomMarginsInInches(pageHeight * MARGIN_TOP_AND_BOTTOM_MAX_PERCENTAGE);

    const margins = await core.getOfficeEditor().getSectionMargins(currentUnit);
    const convertedMargins = {
      left: (margins.left).toFixed(2),
      right: (margins.right).toFixed(2),
      top: (margins.top).toFixed(2),
      bottom: (margins.bottom).toFixed(2)
    };

    setLeftMargin(convertedMargins.left);
    setRightMargin(convertedMargins.right);
    setTopMargin(convertedMargins.top);
    setBottomMargin(convertedMargins.bottom);
    setMarginsOnOpen(convertedMargins);
  }, []);

  useEffect(() => {
    updateMaxHorizontalMargins();
  }, [pageWidth, leftMargin, rightMargin]);

  const calculateMaxHorizontalMargin = (pageWidth, oppositeMarginWidth) => {
    const maxWidth = pageWidth - oppositeMarginWidth - MINIMUM_COLUMN_WIDTH_IN_INCHES;
    return maxWidth;
  };

  const updateMaxHorizontalMargins = () => {
    const convertedMargins = {
      left: (currentUnit === MARGIN_UNITS.CM) ? leftMargin / CM_PER_INCH : leftMargin,
      right: (currentUnit === MARGIN_UNITS.CM) ? rightMargin / CM_PER_INCH : rightMargin,
    };
    const maxLeftMargin = calculateMaxHorizontalMargin(pageWidth, convertedMargins.right);
    const maxRightMargin = calculateMaxHorizontalMargin(pageWidth, convertedMargins.left);

    setMaxLeftMarginInInches(maxLeftMargin);
    setMaxRightMarginInInches(maxRightMargin);
  };

  const onInputBlur = (e, updateMarginCallback) => {
    if (e.target.value === '') {
      updateMarginCallback('0');
    }
  };

  const onMarginChange = (e, updateMarginCallback, maxMarginInInches) => {
    const val = validateMarginInput(e.target.value, maxMarginInInches, currentUnit);
    updateMarginCallback(val);
  };

  const onApply = () => {
    dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_MARGINS_MODAL));
    const marginsChanged = leftMargin !== marginsOnOpen.left || rightMargin !== marginsOnOpen.right || topMargin !== marginsOnOpen.top || bottomMargin !== marginsOnOpen.bottom;
    if (!marginsChanged) {
      return;
    }
    const margins = {
      left: leftMargin,
      right: rightMargin,
      top: topMargin,
      bottom: bottomMargin,
    };
    return core.getOfficeEditor().setSectionMargins(margins, currentUnit);
  };

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_MARGINS_MODAL));

    setTimeout(() => {
      core.getOfficeEditor().focusContent();
    }, 0);
  };

  const inputElements = [
    {
      id: 'leftMarginInput',
      label: t('officeEditor.marginsModal.leftMargin'),
      value: leftMargin,
      onChange: (e) => onMarginChange(e, setLeftMargin, maxLeftMarginInInches),
      onBlur: (e) => onInputBlur(e, setLeftMargin),
    },
    {
      id: 'rightMarginInput',
      label: t('officeEditor.marginsModal.rightMargin'),
      value: rightMargin,
      onChange: (e) => onMarginChange(e, setRightMargin, maxRightMarginInInches),
      onBlur: (e) => onInputBlur(e, setRightMargin),
    },
    {
      id: 'topMarginInput',
      label: t('officeEditor.marginsModal.topMargin'),
      value: topMargin,
      onChange: (e) => onMarginChange(e, setTopMargin, maxTopAndBottomMarginsInInches),
      onBlur: (e) => onInputBlur(e, setTopMargin),
    },
    {
      id: 'bottomMarginInput',
      label: t('officeEditor.marginsModal.bottomMargin'),
      value: bottomMargin,
      onChange: (e) => onMarginChange(e, setBottomMargin, maxTopAndBottomMarginsInInches),
      onBlur: (e) => onInputBlur(e, setBottomMargin),
    }
  ];

  return (
    <div className='OfficeEditorMarginsModal' data-element={DataElements.OFFICE_EDITOR_MARGINS_MODAL}>
      <ModalWrapper
        title={t('officeEditor.marginsModal.title')}
        closehandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose
        isOpen
      >
        <div className='modal-body'>
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
        </div>
        <div className='footer'>
          <Button onClick={onApply} label={t('action.apply')} />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default OfficeEditorMarginsModal;
