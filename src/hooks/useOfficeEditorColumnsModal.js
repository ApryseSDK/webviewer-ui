import { useState, useEffect } from 'react';
import core from 'core';
import {
  modifyColumns,
  modifyColumnsInReverse,
  checkEqualColumnWidths,
} from 'helpers/officeEditorColumnsHelper';
import {
  COLUMN_INPUT_TYPES,
  DEFAULT_COLUMN_SPACING_IN_POINTS,
  MINIMUM_COLUMN_WIDTH_IN_POINTS,
  LAYOUT_UNITS,
} from 'constants/officeEditor';

const clampValue = (value, minValue, maxValue) => {
  const candidate = value || minValue; // sanitize undefined, null, '', or 0
  const lowerBounded = Math.max(candidate, minValue);
  return Math.min(lowerBounded, maxValue);
};

const clampColumnWidthToPageLimits = (value, columnCount, availablePageWidth, equalColumns) => {
  const minValue = MINIMUM_COLUMN_WIDTH_IN_POINTS;
  const maxValue = equalColumns
    ? availablePageWidth / columnCount
    : availablePageWidth - ((columnCount - 1) * MINIMUM_COLUMN_WIDTH_IN_POINTS);
  return clampValue(value, minValue, maxValue);
};

const clampSpacingToPageLimits = (value, columnCount, availablePageWidth, equalColumns) => {
  const minValue = 0;
  const maxValue = equalColumns
    ? (availablePageWidth - (MINIMUM_COLUMN_WIDTH_IN_POINTS * columnCount)) / (columnCount - 1)
    : availablePageWidth - (MINIMUM_COLUMN_WIDTH_IN_POINTS * columnCount);
  return clampValue(value, minValue, maxValue);
};

const convertWidthsAndSpacingToColumns = (widthsAndSpacing) => {
  const columns = [];
  for (let i = 0; i < widthsAndSpacing.length; i += 2) {
    const width = widthsAndSpacing[i];
    const spacing = widthsAndSpacing[i + 1] ?? DEFAULT_COLUMN_SPACING_IN_POINTS;
    columns.push({ width, spacing });
  }
  return columns;
};

export const useOfficeEditorColumnsModal = () => {
  const [columnAmount, setColumnAmount] = useState(0);
  const [columns, setColumns] = useState([]); // [{ width: 0, spacing: 0 }]
  const [equalColumns, setEqualColumns] = useState(true);
  const [availablePageWidth, setAvailablePageWidth] = useState(0);
  const [maxAllowedColumns, setMaxAllowedColumns] = useState(0);

  useEffect(() => {
    (async () => {
      const pageNumber = await core.getOfficeEditor().getEditingPageNumber();
      const availablePageWidth = await core.getOfficeEditor().getAvailablePageWidth(pageNumber, LAYOUT_UNITS.PHYSICAL_POINT);
      const sectionColumns = await core.getOfficeEditor().getSectionColumns(LAYOUT_UNITS.PHYSICAL_POINT);
      const parsedColumns = convertWidthsAndSpacingToColumns(sectionColumns);
      const allColumnsEqual = checkEqualColumnWidths(sectionColumns);

      setAvailablePageWidth(availablePageWidth);
      setMaxAllowedColumns(Math.floor(availablePageWidth / MINIMUM_COLUMN_WIDTH_IN_POINTS));
      setColumnAmount(Math.ceil(sectionColumns.length / 2));
      setEqualColumns(allColumnsEqual);
      setColumns(parsedColumns);
    })();
  }, []);

  useEffect(() => {
    if (equalColumns) {
      rebalanceColumnWidthAndSpacingEvenly(columns);
    }
  }, [equalColumns]);

  const commitColumnAmount = (value) => {
    if (value === columns.length) {
      return;
    }
    setColumnAmount(columns.length);
  };

  const changeColumnAmount = (value) => {
    if (value === '') {
      setColumnAmount(value);
      return;
    }

    let newColumnAmount = Number.parseInt(value, 10);
    if (newColumnAmount === 0) {
      setColumnAmount(newColumnAmount);
      return;
    }

    if (!Number.isFinite(newColumnAmount) || newColumnAmount < 0) {
      newColumnAmount = 1;
    }
    newColumnAmount = Math.min(newColumnAmount, maxAllowedColumns);

    setColumnAmount(newColumnAmount);
    const newColumns = addOrRemoveColumns(newColumnAmount, columns);
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
    for (let i = prevColumns.length + 1; i <= newColumnAmount; i++) {
      newColumns.push({
        width: 0,
        spacing: DEFAULT_COLUMN_SPACING_IN_POINTS,
      });
    }
    return newColumns;
  };

  const rebalanceColumnWidthAndSpacingEvenly = (columns) => {
    const columnCount = columns.length;
    if (columnCount === 0) {
      return;
    }
    const referenceSpacing = columns[0].spacing;
    const widthAndSpacing =
      window.Core.Document.OfficeEditor.Layout.buildEqualColumnsConfig(columnCount, availablePageWidth, referenceSpacing);

    const newColumns = convertWidthsAndSpacingToColumns(widthAndSpacing);
    setColumns(newColumns);
  };

  const commitColumnValue = (value, index, type) => {
    const newBoundedValue = type === COLUMN_INPUT_TYPES.WIDTH
      ? clampColumnWidthToPageLimits(value, columns.length, availablePageWidth, equalColumns)
      : clampSpacingToPageLimits(value, columns.length, availablePageWidth, equalColumns);

    const newColumns = equalColumns ?
      rebalanceInputsEqually(newBoundedValue, type, columns) :
      rebalanceInputs(newBoundedValue, index, type, columns);
    setColumns(newColumns);
    return newColumns;
  };

  const rebalanceInputsEqually = (newValue, type, initialColumns) => {
    const widthAndSpacing = type === COLUMN_INPUT_TYPES.WIDTH ?
      window.Core.Document.OfficeEditor.Layout.buildEqualColumnsConfigFromWidth(newValue, initialColumns.length, availablePageWidth) :
      window.Core.Document.OfficeEditor.Layout.buildEqualColumnsConfig(initialColumns.length, availablePageWidth, newValue);
    return convertWidthsAndSpacingToColumns(widthAndSpacing);
  };

  const rebalanceInputs = (newValue, index, type, initialColumns) => {
    let newColumns = [...initialColumns];
    const columnCount = initialColumns.length;

    newColumns[index] = {
      width: (type === COLUMN_INPUT_TYPES.WIDTH ? newValue : newColumns[index].width),
      spacing: (type === COLUMN_INPUT_TYPES.SPACING ? newValue : newColumns[index].spacing),
    };
    // Calculate excess amount.
    const lastColumnSpacing = newColumns[columnCount - 1].spacing;
    const totalWidthAndSpacing = newColumns.reduce((acc, column) => acc + column.width + column.spacing, -lastColumnSpacing); // Ignore last column spacing
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

  const toggleEqualColumns = () => {
    setEqualColumns(!equalColumns);
  };

  const commitColumnSettings = () => {
    const columnsData = columns.reduce((acc, column) => {
      acc.push(Number.parseFloat(column.width), Number.parseFloat(column.spacing));
      return acc;
    }, []);
    columnsData.pop(); // Remove the last spacing value
    core.getOfficeEditor().setCustomSectionColumns(columnsData, LAYOUT_UNITS.PHYSICAL_POINT);
  };

  return {
    columnAmount,
    columns,
    equalColumns,
    maxAllowedColumns,
    changeColumnAmount,
    commitColumnAmount,
    commitColumnValue,
    toggleEqualColumns,
    commitColumnSettings,
  };
};
