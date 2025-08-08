import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import Dropdown from 'components/Dropdown';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import { focusContent } from 'helpers/officeEditor';
import { useOfficeEditorColumnsModal } from 'hooks/useOfficeEditorColumnsModal';
import {
  OFFICE_EDITOR_TRANSLATION_PREFIX,
  LAYOUT_UNITS,
  COLUMN_INPUT_TYPES,
} from 'constants/officeEditor';

import './OfficeEditorColumnsModal.scss';

const OfficeEditorColumnsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const columnTranslation = t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}column`);

  const {
    columnAmount,
    inputColumns,
    equalColumns,
    maxAllowedColumns,
    currentUnit,
    handleColumnAmountChange,
    handleColumnChange,
    handleColumnBlur,
    handleColumnAmountBlur,
    toggleEqualColumns,
    onApply,
  } = useOfficeEditorColumnsModal();

  const handleUnitChange = (unit) => dispatch(actions.setOfficeEditorUnitMeasurement(unit));
  const closeModal = () => dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_COLUMNS_MODAL));
  const closeModalAndFocus = () => {
    closeModal();
    focusContent();
  };
  const applyAndClose = async () => {
    onApply();
    closeModal();
  };

  const inputElements = Object.values(COLUMN_INPUT_TYPES).map((inputType) => ({
    id: `${inputType}ColumnInput`,
    label: t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.${inputType}`),
    onChange: (value, index) => handleColumnChange(value, index, inputType),
    onBlur: (value, index) => handleColumnBlur(value, index, inputType),
    type: inputType,
  }));

  return (
    <div className='OfficeEditorColumnsModal' data-element={DataElements.OFFICE_EDITOR_COLUMNS_MODAL}>
      <ModalWrapper
        title={t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.title`)}
        closehandler={closeModalAndFocus}
        onCloseClick={closeModalAndFocus}
        swipeToClose
        isOpen
      >
        <div className='modal-body'>
          <div className='input-container flex-half'>
            <label htmlFor='columnAmountInput' className='modal-label'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.columnAmount`)}</label>
            <Input
              type='number'
              id='columnAmountInput'
              onBlur={(e) => handleColumnAmountBlur(e.target.valueAsNumber)}
              onChange={(e) => handleColumnAmountChange(e.target.value)}
              value={columnAmount}
              min='1'
              max={maxAllowedColumns}
              step='1'
              className='column-amount-input'
            />
          </div>

          <div className='input-container flex-half'>
            <label id='office-editor-column-unit-label' className='modal-label'>
              {t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}unitMeasurement`)}
            </label>
            <Dropdown
              id='office-editor-column-unit'
              dataElement={DataElements.OFFICE_EDITOR_COLUMN_UNIT}
              labelledById='office-editor-column-unit-label'
              className={'unit-dropdown'}
              items={Object.values(LAYOUT_UNITS)}
              onClickItem={handleUnitChange}
              getKey={(item) => item}
              currentSelectionKey={currentUnit}
              width={'auto'}
            />
          </div>

          <div className='section'>
            <div className='section-label'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.widthAndSpacing`)}</div>
            <div className='columns-headers row'>
              <div className='flex-third'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.columnNumber`)}</div>
              <div className='flex-third'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.width`)}</div>
              <div className='flex-third'>{t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.spacing`)}</div>
            </div>
            <div className='columns-container'>
              {inputColumns.map((column, columnIndex) => {
                const columnNumber = columnIndex + 1;
                return <div key={columnNumber} className='row'>
                  <div className='row-label flex-third'>
                    {columnTranslation} {columnNumber}
                  </div>
                  {inputElements.map((input) => {
                    const isLastColumn = columnIndex === inputColumns.length - 1;
                    const isSpacingInput = input.type === COLUMN_INPUT_TYPES.SPACING;
                    const shouldRender = !(isLastColumn && isSpacingInput);
                    const shouldDisable = inputColumns.length === 1 || (equalColumns && columnNumber !== 1);
                    return shouldRender &&
                      <div key={`${columnNumber} ${input.id}`} className='input-container flex-third'>
                        <Input
                          type='number'
                          id={`${input.id}-${columnNumber}`}
                          onChange={(e) => input.onChange(e.target.value, columnIndex)}
                          onBlur={(e) => input.onBlur(e.target.valueAsNumber, columnIndex)}
                          value={column[input.type]}
                          aria-label={`${columnTranslation} ${columnNumber} ${input.label}`}
                          disabled={shouldDisable}
                          min='0'
                          step='0.1'
                        />
                      </div>;
                  })}
                </div>;
              })}
            </div>
          </div>
          <Choice
            id={'equal-columns-checkbox'}
            label={t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.equalColumns`)}
            aria-label={t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.equalColumns`)}
            checked={equalColumns}
            aria-checked={equalColumns}
            onChange={toggleEqualColumns}
          />
        </div>
        <div className='footer'>
          <Button onClick={applyAndClose} label={t('action.apply')} />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default OfficeEditorColumnsModal;
