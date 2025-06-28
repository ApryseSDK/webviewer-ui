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
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import {
  focusContent,
  formatToDecimalString,
  getMinimumColumnWidth,
  getDefaultColumnSpacing,
  convertMeasurementUnit,
  floorNumberToDecimals,
} from 'helpers/officeEditor';
import {
  modifyColumns,
  modifyColumnsInReverse,
  checkEqualColumnWidths,
} from 'helpers/officeEditorColumnsHelper';
import {
  OFFICE_EDITOR_TRANSLATION_PREFIX,
  PIXELS_PER_INCH,
  MARGIN_UNITS,
  COLUMN_INPUT_TYPES,
} from 'constants/officeEditor';

import './OfficeEditorColumnsModal.scss';

const OfficeEditorColumnsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const columnTranslation = t(`${OFFICE_EDITOR_TRANSLATION_PREFIX}column`);

  const currentUnit = useSelector(selectors.getOfficeEditorUnitMeasurement);
  const [initialUnit, setInitialUnit] = useState(currentUnit);
  const [columnAmount, setColumnAmount] = useState(0);
  const [columns, setColumns] = useState([]); // [{ width: 0, spacing: 0 }]
  const [inputColumns, setInputColumns] = useState([]); // [{ width: 0, spacing: 0 }]
  const [equalColumns, setEqualColumns] = useState(true);
  const [availablePageWidth, setAvailablePageWidth] = useState(0);
  const [maxAllowedColumns, setMaxAllowedColumns] = useState(0);

  const handleUnitChange = (unit) => dispatch(actions.setOfficeEditorUnitMeasurement(unit));

  useEffect(() => {
    const setInitialData = async () => {
      const pageNumber = await core.getOfficeEditor().getEditingPageNumber();
      const pageWidthInInch = core.getDocumentViewer().getPageWidth(pageNumber) / PIXELS_PER_INCH;
      const pageWidthInCurrentUnit = convertMeasurementUnit(pageWidthInInch, MARGIN_UNITS.INCH, currentUnit);
      const margins = await core.getOfficeEditor().getSectionMargins(currentUnit);
      const sectionColumns = await core.getOfficeEditor().getSectionColumns(currentUnit);
      const parsedColumns = parseColumns(sectionColumns, currentUnit);
      const allColumnsEqual = checkEqualColumnWidths(sectionColumns);

      setInitialUnit(currentUnit);
      setAvailablePageWidth(pageWidthInCurrentUnit - margins.left - margins.right);
      setColumnAmount(Math.ceil(sectionColumns.length / 2));
      setEqualColumns(allColumnsEqual);
      setColumns(parsedColumns);
      setInputColumns(formatColumns(parsedColumns));
    };
    setInitialData();
  }, []);

  useEffect(() => {
    if (currentUnit === initialUnit) {
      return;
    }
    setInitialUnit(currentUnit);

    const pageWidthInCurrentUnit = convertMeasurementUnit(availablePageWidth, initialUnit, currentUnit);
    setAvailablePageWidth(pageWidthInCurrentUnit);

    const convertedColumns = columns.map((column) => ({
      width: convertMeasurementUnit(column.width, initialUnit, currentUnit),
      spacing: convertMeasurementUnit(column.spacing, initialUnit, currentUnit),
    }));
    setColumns(convertedColumns);
    setInputColumns(formatColumns(convertedColumns));
  }, [currentUnit, initialUnit]);

  const parseColumns = (sectionColumns, unit) => {
    let formattedColumns = [];
    for (let i = 0; i < sectionColumns.length; i += 2) {
      const width = sectionColumns[i];
      const spacing = sectionColumns[i + 1] ?? getDefaultColumnSpacing(unit);
      formattedColumns.push({ width, spacing });
    }
    return formattedColumns;
  };

  const formatColumns = (columns) => {
    return columns.map((column) => ({
      width: formatToDecimalString(column.width),
      spacing: formatToDecimalString(column.spacing),
    }));
  };

  // useEffect for recalculating max allowed columns
  useEffect(() => {
    setMaxAllowedColumns(Math.floor(availablePageWidth / getMinimumColumnWidth(currentUnit)));
  }, [availablePageWidth, currentUnit]);

  useEffect(() => {
    if (columns.length < 1) {
      return;
    }
    if (equalColumns) {
      rebalanceColumnWidthAndSpacingEvenly(columns);
    }
  }, [equalColumns, columns.length, availablePageWidth]);

  const handleColumnAmountChange = (value) => {
    let newColumnAmount = parseInt(value);
    if (isNaN(newColumnAmount) || newColumnAmount < 1) {
      newColumnAmount = 1;
    }

    if (newColumnAmount === columns.length) {
      return;
    }

    if (newColumnAmount > maxAllowedColumns) {
      newColumnAmount = maxAllowedColumns;
    }
    setColumnAmount(newColumnAmount);

    const newColumns = addOrRemoveColumns(newColumnAmount, columns);
    setColumns(newColumns);
    setInputColumns(formatColumns(newColumns));
    rebalanceColumnWidthAndSpacingEvenly(newColumns);
  };

  const addOrRemoveColumns = (newColumnAmount, prevColumns) => {
    if (newColumnAmount === prevColumns.length) {
      return prevColumns;
    }

    if (newColumnAmount < prevColumns.length) {
      return prevColumns.slice(0, newColumnAmount);
    }

    // Add columns if new amount is more than current amount
    const newColumns = [...prevColumns];
    for (let i = columns.length + 1; i <= newColumnAmount; i++) {
      newColumns.push({
        width: 0,
        spacing: getDefaultColumnSpacing(currentUnit),
      });
    }
    return newColumns;
  };

  const rebalanceColumnWidthAndSpacingEvenly = (columns) => {
    const columnCount = columns.length;
    let referenceSpacing = columns[0].spacing;
    if (columnCount === 1) {
      const singleColumn = [{
        width: availablePageWidth,
        spacing: referenceSpacing,
      }];
      setColumns(singleColumn);
      setInputColumns(formatColumns(singleColumn));
      return;
    }

    const spacingCount = columnCount - 1;
    let newTotalSpacing = spacingCount * referenceSpacing;
    let newTotalWidth = availablePageWidth - newTotalSpacing;
    const minRequiredSpace = getMinimumColumnWidth(currentUnit) * columnCount;
    if (newTotalWidth < minRequiredSpace) {
      const extraWidthNeeded = minRequiredSpace - newTotalWidth;
      newTotalWidth += extraWidthNeeded;
      newTotalSpacing -= extraWidthNeeded;
      referenceSpacing = floorNumberToDecimals(newTotalSpacing / spacingCount);
    }
    const newColumns = new Array(columnCount).fill().map(() => ({
      width: floorNumberToDecimals(newTotalWidth / columnCount),
      spacing: Math.max(referenceSpacing, 0),
    }));
    setColumns(newColumns);
    setInputColumns(formatColumns(newColumns));
  };

  const handleColumnChange = (value, index, type) => {
    const updatedColumns = [...inputColumns];
    updatedColumns[index] = {
      width: (type === COLUMN_INPUT_TYPES.WIDTH ? value : updatedColumns[index].width).toString(),
      spacing: (type === COLUMN_INPUT_TYPES.SPACING ? value : updatedColumns[index].spacing).toString(),
    };
    setInputColumns(updatedColumns);
  };

  const rebalanceInputs = (newValue, index, type, initialColumns) => {
    let newColumns = [...initialColumns];
    const columnCount = initialColumns.length;
    if (equalColumns) {
      if (type === COLUMN_INPUT_TYPES.WIDTH) {
        const availableSpacing = availablePageWidth - (newValue * columnCount);
        const newSpacing = floorNumberToDecimals(availableSpacing / (columnCount - 1));
        newColumns = newColumns.map(() => ({
          width: newValue,
          spacing: newSpacing,
        }));
      } else if (type === COLUMN_INPUT_TYPES.SPACING) {
        const availableWidth = availablePageWidth - (newValue * (columnCount - 1));
        const newWidth = floorNumberToDecimals(availableWidth / columnCount);
        newColumns = newColumns.map(() => ({
          width: newWidth,
          spacing: newValue,
        }));
      }
      return newColumns;
    }

    // Not Equal Columns
    newColumns[index] = {
      width: (type === COLUMN_INPUT_TYPES.WIDTH ? newValue : newColumns[index].width),
      spacing: (type === COLUMN_INPUT_TYPES.SPACING ? newValue : newColumns[index].spacing),
    };
    // Calculate excess amount.
    const lastColumnSpacing = parseFloat(newColumns[columnCount - 1].spacing);
    const totalWidthAndSpacing = newColumns.reduce((acc, column) => acc + parseFloat(column.width) + parseFloat(column.spacing), -lastColumnSpacing); // Ignore last column spacing
    let excessAmount = totalWidthAndSpacing - availablePageWidth;
    let modifiedResults = {};

    // take from or add to subsequent widths
    modifiedResults = modifyColumns({
      columns: newColumns,
      excessAmount,
      startIndex: index + 1,
      endIndex: columnCount - 1,
      numberOfColumns: columnCount - index - 1,
      type: COLUMN_INPUT_TYPES.WIDTH
    });
    newColumns = [...modifiedResults.nextColumns];
    excessAmount = modifiedResults.excessAmountRemaining;

    if (excessAmount === 0) {
      return newColumns;
    }

    if (type === COLUMN_INPUT_TYPES.WIDTH) {
      // take from or add to spacing
      modifiedResults = modifyColumnsInReverse({
        columns: newColumns,
        excessAmount,
        startIndex: columnCount - 2,
        endIndex: 0,
        numberOfColumns: columnCount - 1,
        type: COLUMN_INPUT_TYPES.SPACING
      });
      newColumns = [...modifiedResults.nextColumns];
      excessAmount = modifiedResults.excessAmountRemaining;

      if (excessAmount === 0) {
        return newColumns;
      }

      // take from or add to previous widths
      modifiedResults = modifyColumnsInReverse({
        columns: newColumns,
        excessAmount,
        startIndex: index - 1,
        endIndex: 0,
        numberOfColumns: index,
        type: COLUMN_INPUT_TYPES.WIDTH
      });
      newColumns = [...modifiedResults.nextColumns];
      excessAmount = modifiedResults.excessAmountRemaining;

      if (excessAmount === 0) {
        return newColumns;
      }
    } else if (type === COLUMN_INPUT_TYPES.SPACING) {
      // take from or add to previous widths equally
      modifiedResults = modifyColumns({
        columns: newColumns,
        excessAmount,
        startIndex: 0,
        endIndex: index,
        numberOfColumns: index + 1,
        type: COLUMN_INPUT_TYPES.WIDTH
      });
      newColumns = [...modifiedResults.nextColumns];
      excessAmount = modifiedResults.excessAmountRemaining;

      if (excessAmount === 0) {
        return newColumns;
      }

      // take from or add to spacing, other than index
      modifiedResults = modifyColumnsInReverse({
        columns: newColumns,
        excessAmount,
        startIndex: columnCount - 2,
        endIndex: 0,
        numberOfColumns: columnCount - 2,
        type: COLUMN_INPUT_TYPES.SPACING,
        skipIndex: index
      });
      newColumns = [...modifiedResults.nextColumns];
    }
    return newColumns;
  };

  const handleColumnBlur = (value, index, type) => {
    // Validate input limits
    const columnCount = columns.length;
    const minimumColumnWidth = getMinimumColumnWidth(currentUnit);
    const maxColumnWidth = (equalColumns) ?
      availablePageWidth / columnCount :
      availablePageWidth - ((columnCount - 1) * minimumColumnWidth);

    const maxColumnSpacing = (equalColumns) ?
      (availablePageWidth - (minimumColumnWidth * columnCount)) / (columnCount - 1) :
      availablePageWidth - (minimumColumnWidth * columnCount);

    const minimumValue = (type === COLUMN_INPUT_TYPES.WIDTH) ? minimumColumnWidth : 0;
    const maxValue = (type === COLUMN_INPUT_TYPES.WIDTH) ? maxColumnWidth : maxColumnSpacing;

    let newValue = parseFloat(value);
    if (isNaN(newValue) || newValue < minimumValue) {
      newValue = minimumValue;
    }
    newValue = Math.min(newValue, maxValue);

    const newColumns = rebalanceInputs(newValue, index, type, columns);
    setColumns(newColumns);
    setInputColumns(formatColumns(newColumns));
  };

  const onApply = async () => {
    const columnsData = columns.reduce((acc, column) => {
      acc.push(parseFloat(column.width), parseFloat(column.spacing));
      return acc;
    }, []);
    columnsData.pop(); // Remove the last spacing value
    await core.getOfficeEditor().setCustomSectionColumns(columnsData, currentUnit);
    closeModal();
  };

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.OFFICE_EDITOR_COLUMNS_MODAL));
  };

  const closeModalAndFocus = () => {
    closeModal();
    focusContent();
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
              items={Object.values(MARGIN_UNITS)}
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
            onChange={() => setEqualColumns(!equalColumns)}
          />
        </div>
        <div className='footer'>
          <Button onClick={onApply} label={t('action.apply')} />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default OfficeEditorColumnsModal;
