import { floorNumberToDecimals, getMinimumColumnWidth } from 'helpers/officeEditor';
import {
  MARGIN_UNITS,
  COLUMN_INPUT_TYPES,
} from 'constants/officeEditor';

const calculateNewExcessAmounts = ({ newValue, minimumValue, excessAmount, excessAmountPerColumn, numberOfRemainingColumns }) => {
  const remainingExcess = minimumValue - newValue;
  const excessUsed = excessAmountPerColumn - remainingExcess;
  const newExcessAmount = excessAmount -= excessUsed;
  const newExcessAmountPerColumn = (excessAmount < 0 ) ?
    (excessAmount + remainingExcess) / numberOfRemainingColumns :
    remainingExcess;
  return {
    excessAmount: newExcessAmount,
    excessAmountPerColumn: newExcessAmountPerColumn
  };
};

const getMinimumValue = (type) => {
  if (type === COLUMN_INPUT_TYPES.WIDTH) {
    return getMinimumColumnWidth(MARGIN_UNITS.CM);
  }
  return 0;
};

const setColumnValue = ({ columns, index, endIndex, excessAmount, excessAmountPerColumn, type }) => {
  const newColumns = [...columns];
  let newValue = newColumns[index][type] - excessAmountPerColumn;
  let nextExcess = {
    excessAmount,
    excessAmountPerColumn
  };
  const minimumValue = getMinimumValue(type);
  if (newValue < minimumValue) {
    const newExcess = calculateNewExcessAmounts({
      newValue,
      minimumValue: minimumValue,
      excessAmount,
      excessAmountPerColumn,
      numberOfRemainingColumns: endIndex - index
    });
    nextExcess.excessAmount = newExcess.excessAmount;
    nextExcess.excessAmountPerColumn = newExcess.excessAmountPerColumn;
    newValue = minimumValue;
  } else {
    nextExcess.excessAmount = excessAmount - excessAmountPerColumn;
  }
  newColumns[index][type] = floorNumberToDecimals(newValue);
  return {
    newColumns,
    nextExcess
  };
};

const calculateExcessAmountPerColumn = (excessAmount, numberOfColumns) => {
  return (excessAmount < 0) ?
    excessAmount / numberOfColumns :
    excessAmount;
};

export const modifyColumns = ({ columns, excessAmount, startIndex, endIndex, numberOfColumns, type }) => {
  let excessAmountPerColumn = calculateExcessAmountPerColumn(excessAmount, numberOfColumns);
  let excessAmountRemaining = excessAmount;
  let nextColumns = [...columns];
  for (let i = startIndex; (i <= endIndex && excessAmountRemaining !== 0); i++) {
    const { newColumns, nextExcess } = setColumnValue({
      columns: nextColumns,
      index: i,
      endIndex: endIndex,
      excessAmount: excessAmountRemaining,
      excessAmountPerColumn,
      type
    });
    excessAmountPerColumn = nextExcess.excessAmountPerColumn;
    excessAmountRemaining = nextExcess.excessAmount;
    nextColumns = [...newColumns];
  }
  return {
    nextColumns,
    excessAmountRemaining
  };
};

export const modifyColumnsInReverse = ({ columns, excessAmount, startIndex, endIndex, numberOfColumns, type, skipIndex = -1 }) => {
  let excessAmountPerColumn = calculateExcessAmountPerColumn(excessAmount, numberOfColumns);
  let excessAmountRemaining = excessAmount;
  let nextColumns = [...columns];
  for (let i = startIndex; (i >= endIndex && excessAmountRemaining !== 0); i--) {
    if (skipIndex > -1 && i === skipIndex) {
      continue; // Skip the current column
    }
    const { newColumns, nextExcess } = setColumnValue({
      columns: nextColumns,
      index: i,
      endIndex: startIndex,
      excessAmount: excessAmountRemaining,
      excessAmountPerColumn,
      type
    });
    excessAmountPerColumn = nextExcess.excessAmountPerColumn;
    excessAmountRemaining = nextExcess.excessAmount;
    nextColumns = [...newColumns];
  }
  return {
    nextColumns,
    excessAmountRemaining
  };
};

export const checkEqualColumnWidths = (columns) => {
  const width = columns[0];
  const spacing = columns[1];

  const widthEqual = columns
    .filter((_, i) => i % 2 === 0)
    .every((val) => val === width);

  const spacingEqual = columns
    .filter((_, i) => i % 2 === 1)
    .every((val) => val === spacing);

  return spacingEqual && widthEqual;
};