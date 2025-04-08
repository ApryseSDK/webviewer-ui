import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import './FormulaBar.scss';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import classNames from 'classnames';

const FormulaBar = (props) => {
  const { isReadOnly, activeCellRange, cellFormula, stringCellValue, onRangeInputChange, onRangeInputKeyDown } = props;

  const { t } = useTranslation();

  const formulaBarValue = cellFormula || stringCellValue || '';

  return (
    <DataElementWrapper className='FormulaBar' dataElement={DataElements.FORMULA_BAR}>
      <input
        type="text"
        className='RangeInput'
        value={activeCellRange}
        onChange={(e) => onRangeInputChange(e.target.value)}
        onKeyDown={onRangeInputKeyDown}
        aria-label={t('formulaBar.range')}
      />
      <div className={classNames('Formula', { readOnly: isReadOnly })}>
        <Icon glyph="function" className={classNames('FormulaIcon', { readOnly: isReadOnly })}/>
        <input type="text"
          className={classNames('FormulaInput', { readOnly: isReadOnly })}
          onChange={()=>{}}
          value={formulaBarValue}
          readOnly={isReadOnly}
          aria-label={t('formulaBar.label')}
        />
      </div>
    </DataElementWrapper>
  );
};

FormulaBar.propTypes = {
  isReadOnly: PropTypes.bool,
  activeCellRange: PropTypes.string,
  cellFormula: PropTypes.oneOfType([PropTypes.string , PropTypes.number]),
  stringCellValue: PropTypes.string,
  onRangeInputChange: PropTypes.func,
  onRangeInputKeyDown: PropTypes.func,
};

export default FormulaBar;