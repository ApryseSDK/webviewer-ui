import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FormulaBar from './FormulaBar';
const formulaOptions = [
  { value: '=SUMIF', label: 'SUMIF', description: 'formulaBar.sumif' },
  { value: '=SUMSQ', label: 'SUMSQ', description: 'formulaBar.sumsq' },
  { value: '=SUM', label: 'SUM', description: 'formulaBar.sum' },
  { value: '=ASINH', label: 'ASINH', description: 'formulaBar.asinh' },
  { value: '=ACOS', label: 'ACOS', description: 'formulaBar.acos' },
  { value: '=COSH', label: 'COSH', description: 'formulaBar.cosh' },
  { value: '=ISEVEN', label: 'ISEVEN', description: 'formulaBar.iseven' },
  { value: '=ISODD', label: 'ISODD', description: 'formulaBar.isodd' },
];
export const FormulaBarContainer = () => {
  // This component can pull all Redux state and call any core methods
  const activeCellRange = useSelector(selectors.getActiveCellRange);
  const cellFormula = useSelector(selectors.getCellFormula);
  const stringCellValue = useSelector(selectors.getStringCellValue);

  return (
    <FormulaBar
      isReadOnly
      formulaOptions={formulaOptions}
      activeCellRange={activeCellRange}
      cellFormula={cellFormula}
      stringCellValue={stringCellValue} />
  );
};

export default FormulaBarContainer;