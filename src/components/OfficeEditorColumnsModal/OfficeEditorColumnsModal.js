import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import Dropdown from 'components/Dropdown';
import Choice from 'components/Choice';
import Input from 'components/Input';
import {
  focusContent,
  formatToDecimalString,
  convertBetweenUnits,
} from 'helpers/officeEditor';
import { useOfficeEditorColumnsModal } from 'hooks/useOfficeEditorColumnsModal';
import {
  OFFICE_EDITOR_TRANSLATION_PREFIX,
  LAYOUT_UNITS,
  COLUMN_INPUT_TYPES,
} from 'constants/officeEditor';

import './OfficeEditorColumnsModal.scss';

const OfficeEditorColumnsModal = () => {
  const currentUnit = useSelector(selectors.getOfficeEditorUnitMeasurement);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const columnTranslation = t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}column`);

  const {
    columnAmount,
    columns,
    equalColumns,
    maxAllowedColumns,
    commitColumnAmount,
    changeColumnAmount,
    commitColumnValue,
    toggleEqualColumns,
    commitColumnSettings,
  } = useOfficeEditorColumnsModal();

  const [displayColumns, setDisplayColumns] = useState([]);

  const convertInputToPoints = (numericValue) => {
    return convertBetweenUnits(numericValue, currentUnit, LAYOUT_UNITS.PHYSICAL_POINT);
  };

  const formatColumnsForDisplay = (pointColumns) => pointColumns.map((column) => ({
    width: formatToDecimalString(convertBetweenUnits(column.width, LAYOUT_UNITS.PHYSICAL_POINT, currentUnit)),
    spacing: formatToDecimalString(convertBetweenUnits(column.spacing, LAYOUT_UNITS.PHYSICAL_POINT, currentUnit)),
  }));

  useEffect(() => {
    setDisplayColumns(formatColumnsForDisplay(columns));
  }, [columns, currentUnit]);

  const handleColumnBlur = (event, index, type) => {
    const numericValue = Number.parseFloat(event.target.value);
    if (!Number.isFinite(numericValue)) {
      setDisplayColumns(formatColumnsForDisplay(columns));
      return;
    }
    const valueInPoints = convertInputToPoints(numericValue);
    const newColumns = commitColumnValue(valueInPoints, index, type);
    setDisplayColumns(formatColumnsForDisplay(newColumns));
  };

  const handleColumnChange = (event, index, type) => {
    const { value } = event.target;
    // Use functional state update so we always work with the latest displayColumns
    // (blur/unit changes enqueue updates too, so a closed-over array could be stale).
    setDisplayColumns((prevColumns) => {
      const nextColumns = [...prevColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        [type]: value,
      };
      return nextColumns;
    });
  };

  const handleUnitChange = (unit) => dispatch(actions.setOfficeEditorUnitMeasurement(unit));
  const closeModal = () => dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_COLUMNS_MODAL));
  const closeModalAndFocus = () => {
    closeModal();
    focusContent();
  };
  const applyAndClose = async () => {
    commitColumnSettings();
    closeModal();
  };

  const inputElements = Object.values(COLUMN_INPUT_TYPES).map((inputType) => ({
    id: `${inputType}ColumnInput`,
    label: t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}columnsModal.${inputType}`),
    onBlur: (event, index) => handleColumnBlur(event, index, inputType),
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
              onBlur={(e) => commitColumnAmount(e.target.valueAsNumber)}
              onChange={(e) => changeColumnAmount(e.target.value)}
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
              {displayColumns.map((column, columnIndex) => {
                const columnNumber = columnIndex + 1;
                return <div key={columnNumber} className='row'>
                  <div className='row-label flex-third'>
                    {columnTranslation} {columnNumber}
                  </div>
                  {inputElements.map((input) => {
                    const isLastColumn = columnIndex === displayColumns.length - 1;
                    const isSpacingInput = input.type === COLUMN_INPUT_TYPES.SPACING;
                    const shouldRender = !(isLastColumn && isSpacingInput);
                    const shouldDisable = displayColumns.length === 1 || (equalColumns && columnNumber !== 1);
                    return shouldRender &&
                      <div key={`${columnNumber}-${input.id}`} className='input-container flex-third'>
                        <Input
                          type='number'
                          id={`${input.id}-${columnNumber}`}
                          value={column?.[input.type] ?? ''}
                          onBlur={(e) => input.onBlur(e, columnIndex)}
                          onChange={(e) => handleColumnChange(e, columnIndex, input.type)}
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
