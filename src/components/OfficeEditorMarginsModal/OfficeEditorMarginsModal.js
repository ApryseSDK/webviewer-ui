import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import mapObjectKeys from 'helpers/mapObjectKeys';
import {
  OFFICE_EDITOR_TRANSLATION_PREFIX,
  LAYOUT_UNITS,
  MARGIN_SIDES,
  VERTICAL_MARGIN_LIMIT,
  PAGE_LAYOUT_WARNING_TYPE,
} from 'constants/officeEditor';
import { validateMarginInput, focusContent, convertBetweenUnits, getMinimumColumnWidth, formatToDecimalString, showPageLayoutWarning } from 'helpers/officeEditor';

import './OfficeEditorMarginsModal.scss';

// SIDES must be listed in this order for HTML inputs
const SIDES = [MARGIN_SIDES.LEFT, MARGIN_SIDES.RIGHT, MARGIN_SIDES.TOP, MARGIN_SIDES.BOTTOM];

const OfficeEditorMarginsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const currentUnit = useSelector(selectors.getOfficeEditorUnitMeasurement);
  const [initialUnit, setInitialUnit] = useState(currentUnit);
  const [initialMargins, setInitialMargins] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [numericMargins, setNumericMargins] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [inputMargins, setInputMargins] = useState({ left: '0', right: '0', top: '0', bottom: '0' });
  const [maxMargins, setMaxMargins] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const handleUnitChange = (unit) => dispatch(actions.setOfficeEditorUnitMeasurement(unit));

  const areMarginsEqual = (a, b) => SIDES.every((side) => a[side] === b[side]);

  const calculateMaxHorizontalMargins = (pageWidth, oppositeMarginWidth, unit) => {
    const maxWidth = pageWidth - oppositeMarginWidth - getMinimumColumnWidth(unit);
    return maxWidth;
  };

  const calculateAllMaxMargins = (pageWidth, pageHeight, margins, unit) => {
    const maxTopAndBottom = pageHeight * VERTICAL_MARGIN_LIMIT;
    return {
      top: maxTopAndBottom,
      bottom: maxTopAndBottom,
      left: calculateMaxHorizontalMargins(pageWidth, margins.right, unit),
      right: calculateMaxHorizontalMargins(pageWidth, margins.left, unit),
    };
  };

  const handleBlur = (value, side, maxMargin) => {
    const validated = validateMarginInput(value, maxMargin);
    if (numericMargins[side] === validated && inputMargins[side] === validated.toString()) {
      return;
    }
    setNumericMargins((previous) => ({ ...previous, [side]: validated }));
    setInputMargins((previous) => ({ ...previous, [side]: validated.toString() }));
  };

  const handleChange = (value, side) => {
    setInputMargins((previous) => ({ ...previous, [side]: value }));
  };

  const onApply = async () => {
    if (areMarginsEqual(numericMargins, initialMargins)) {
      closeModalAndFocus();
      return;
    }
    try {
      await core.getOfficeEditor().setSectionMargins(numericMargins, currentUnit);
      closeModal();
    } catch (e) {
      console.error('Error applying margins:', e);
      showPageLayoutWarning(dispatch, actions, PAGE_LAYOUT_WARNING_TYPE.MARGIN);
    }

  };

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_MARGINS_MODAL));
  };

  const closeModalAndFocus = () => {
    closeModal();
    focusContent();
  };

  const inputElements = SIDES.map((side) => ({
    id: `${side}MarginInput`,
    label: t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}marginsModal.${side}Margin`),
    value: inputMargins[side],
    onChange: (e) => handleChange(e.target.value, side),
    onBlur: (e) => handleBlur(e.target.valueAsNumber, side, maxMargins[side]),
  }));

  useEffect(() => {
    const setInitialData = async () => {
      const pageNumber = await core.getOfficeEditor().getEditingPageNumber();
      const margins = await core.getOfficeEditor().getSectionMargins(currentUnit);
      const { width: pageWidthInCurrentUnit, height: pageHeightInCurrentUnit } = core.getOfficeEditor().getPageDimensions(pageNumber, currentUnit);

      setPageWidth(pageWidthInCurrentUnit);
      setPageHeight(pageHeightInCurrentUnit);
      setInitialUnit(currentUnit);
      setInitialMargins(margins);
      setNumericMargins(margins);
      setInputMargins(mapObjectKeys(SIDES, (side) => formatToDecimalString(margins[side])));
      setMaxMargins(calculateAllMaxMargins(pageWidthInCurrentUnit, pageHeightInCurrentUnit, margins, currentUnit));
    };
    setInitialData();
  }, []);

  useEffect(() => {
    setMaxMargins((previous) => ({
      ...previous,
      left: calculateMaxHorizontalMargins(pageWidth, numericMargins.right, currentUnit),
      right: calculateMaxHorizontalMargins(pageWidth, numericMargins.left, currentUnit),
    }));
  }, [pageWidth, numericMargins.left, numericMargins.right]);

  useEffect(() => {
    if (currentUnit === initialUnit) {
      return;
    }
    setInitialUnit(currentUnit);

    const pageWidthInCurrentUnit = convertBetweenUnits(pageWidth, initialUnit, currentUnit);
    const pageHeightInCurrentUnit = convertBetweenUnits(pageHeight, initialUnit, currentUnit);
    setPageWidth(pageWidthInCurrentUnit);
    setPageHeight(pageHeightInCurrentUnit);

    const initialMarginsInCurrentUnit = mapObjectKeys(SIDES, (side) => convertBetweenUnits(initialMargins[side], initialUnit, currentUnit));
    const marginsInCurrentUnit = mapObjectKeys(SIDES, (side) => convertBetweenUnits(numericMargins[side], initialUnit, currentUnit));
    const maxMarginsInCurrentUnit = calculateAllMaxMargins(pageWidthInCurrentUnit, pageHeightInCurrentUnit, marginsInCurrentUnit, currentUnit);

    // validate margins here because of rounding from conversion
    const validatedMargins = mapObjectKeys(SIDES, (side) => validateMarginInput(marginsInCurrentUnit[side], maxMarginsInCurrentUnit[side]));
    setInitialMargins(initialMarginsInCurrentUnit);
    setMaxMargins(maxMarginsInCurrentUnit);
    setNumericMargins(validatedMargins);
    setInputMargins(mapObjectKeys(SIDES, (side) => formatToDecimalString(validatedMargins[side])));
  }, [currentUnit, initialUnit]);

  return (
    <div className='OfficeEditorMarginsModal' data-element={DataElements.OFFICE_EDITOR_MARGINS_MODAL}>
      <ModalWrapper
        title={t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}marginsModal.title`)}
        closehandler={closeModalAndFocus}
        onCloseClick={closeModalAndFocus}
        swipeToClose
        isOpen
      >
        <div className='modal-body'>
          <div className='input-container flex-full'>
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
              className={'unit-dropdown'}
              items={Object.values(LAYOUT_UNITS)}
              onClickItem={handleUnitChange}
              getKey={(item) => item}
              currentSelectionKey={currentUnit}
              width={'auto'}
            />
          </div>

          {inputElements.map((input) => (
            <div key={input.id} className='input-container flex-half'>
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
        </div>
        <div className='footer'>
          <Button onClick={onApply} label={t('action.apply')} />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default OfficeEditorMarginsModal;
