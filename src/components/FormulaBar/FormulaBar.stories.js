import React from 'react';
import FormulaBar from './FormulaBar';

export default {
  title: 'SpreadsheetEditor/FormulaBar',
  component: FormulaBar,
};

const activeCellRange = 'A1';
const cellFormula = '=SUM(A1:A10)';

export const FormulaBarDefault = () => {
  return (
    <FormulaBar isReadOnly={false} activeCellRange={activeCellRange} cellFormula={cellFormula} />
  );
};

export const FormulaBarReadOnly = () => {
  return (
    <FormulaBar isReadOnly={true} activeCellRange={activeCellRange} cellFormula={cellFormula}  />
  );
};