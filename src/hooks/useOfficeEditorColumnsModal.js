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
  LAYOUT_UNITS,
} from 'constants/officeEditor';

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
  const [maxAllowedColumns, setMaxAllowedColumns] = useState(0);

  useEffect(() => {
    (async () => {
      const sectionColumns = await core.getOfficeEditor().getSectionColumns(LAYOUT_UNITS.PHYSICAL_POINT);
      const parsedColumns = convertWidthsAndSpacingToColumns(sectionColumns);
      const allColumnsEqual = checkEqualColumnWidths(sectionColumns);

      setMaxAllowedColumns(await core.getOfficeEditor().getMaxColumns());
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

  const resetColumnAmountInput = (value) => {
    if (value === columns.length) {
      return;
    }
    setColumnAmount(columns.length);
  };

  const changeColumnAmount = async (value) => {
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
    const maxColumns = await core.getOfficeEditor().getMaxColumns();
    newColumnAmount = Math.min(newColumnAmount, maxColumns);

    setColumnAmount(newColumnAmount);
    const newColumns = addOrRemoveColumns(newColumnAmount, columns);
    await rebalanceColumnWidthAndSpacingEvenly(newColumns);
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

  const rebalanceColumnWidthAndSpacingEvenly = async (columns) => {
    const columnCount = columns.length;
    if (columnCount === 0) {
      return;
    }
    const referenceSpacing = columns[0].spacing;
    const widthAndSpacing =
      await core.getOfficeEditor().buildEqualColumnsConfig(columnCount, referenceSpacing, LAYOUT_UNITS.PHYSICAL_POINT);
    const newColumns = convertWidthsAndSpacingToColumns(widthAndSpacing);
    setColumns(newColumns);
  };

  const commitColumnValue = async (value, index, type) => {
    const newBoundedValue = type === COLUMN_INPUT_TYPES.WIDTH
      ? await core.getOfficeEditor().clampColumnWidthToSectionLimits(value, columns.length, equalColumns, LAYOUT_UNITS.PHYSICAL_POINT)
      : await core.getOfficeEditor().clampColumnSpacingToSectionLimits(value, columns.length, equalColumns, LAYOUT_UNITS.PHYSICAL_POINT);

    const newColumns = equalColumns ?
      await rebalanceInputsEqually(newBoundedValue, type, columns) :
      await rebalanceInputs(newBoundedValue, index, type, columns);
    setColumns(newColumns);
    return newColumns;
  };

  const rebalanceInputsEqually = async (newValue, type, initialColumns) => {
    const widthAndSpacing = type === COLUMN_INPUT_TYPES.WIDTH ?
      await core.getOfficeEditor().buildEqualColumnsConfigFromWidth(newValue, initialColumns.length, LAYOUT_UNITS.PHYSICAL_POINT) :
      await core.getOfficeEditor().buildEqualColumnsConfig(initialColumns.length, newValue, LAYOUT_UNITS.PHYSICAL_POINT);
    return convertWidthsAndSpacingToColumns(widthAndSpacing);
  };

  const rebalanceInputs = async (newValue, index, type, initialColumns) => {
    let newColumns = [...initialColumns];
    const columnCount = initialColumns.length;

    newColumns[index] = {
      width: (type === COLUMN_INPUT_TYPES.WIDTH ? newValue : newColumns[index].width),
      spacing: (type === COLUMN_INPUT_TYPES.SPACING ? newValue : newColumns[index].spacing),
    };
    // Calculate excess amount.
    const lastColumnSpacing = Number.parseFloat(newColumns[columnCount - 1].spacing);
    const totalWidthAndSpacing = newColumns.reduce((acc, column) => acc + Number.parseFloat(column.width) + Number.parseFloat(column.spacing), -lastColumnSpacing); // Ignore last column spacing
    let excessAmount = totalWidthAndSpacing - await core.getOfficeEditor().getAvailableCurrentSectionWidth(LAYOUT_UNITS.PHYSICAL_POINT);
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
    resetColumnAmountInput,
    commitColumnValue,
    toggleEqualColumns,
    commitColumnSettings,
  };
};
