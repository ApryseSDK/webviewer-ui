import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import './FormulaBar.scss';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import classNames from 'classnames';

const FormulaBar = (props) => {
  const { isReadOnly, activeCellRange, cellFormula, stringCellValue } = props;

  const { t } = useTranslation();

  const formulaBarValue = cellFormula || stringCellValue || '';

  return (
    <DataElementWrapper className='FormulaBar' dataElement={DataElements.FORMULA_BAR}>
      <input type="text" className='RangeInput' value={activeCellRange} readOnly={isReadOnly} aria-label={t('formulaBar.range')}/>
      <div className={classNames('Formula', { readOnly: isReadOnly })}>
        <Icon glyph="function" className={classNames('FormulaIcon', { readOnly: isReadOnly })}/>
        <input className={classNames('FormulaInput', { readOnly: isReadOnly })} type="text" value={formulaBarValue} readOnly={isReadOnly} aria-label={t('formulaBar.label')}/>
      </div>
    </DataElementWrapper>
  );
};

FormulaBar.propTypes = {
  isReadOnly: PropTypes.bool,
  activeCellRange: PropTypes.string,
  cellFormula: PropTypes.string,
  stringCellValue: PropTypes.string,
};

export default FormulaBar;