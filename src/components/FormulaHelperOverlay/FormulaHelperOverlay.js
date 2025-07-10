import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './FormulaHelperOverlay.scss';

const FormulaHelperOverlay = (props) => {
  const { selectedFormula, labelId } = props;
  const { t } = useTranslation();

  const formulaLabel = selectedFormula?.name || '';
  const formulaParameters = selectedFormula?.parameters?.map((param) =>
    t(`formulas.${selectedFormula.name}.parameters.${param.name}.name`, param.name)
  ) || [];

  return (
    <div className="FormulaHelperOverlay" aria-labelledby={labelId}>
      <span className="formulaHelperOverlayValue">
        {formulaLabel}({formulaParameters.join(', ')})
      </span>
    </div>
  );
};

FormulaHelperOverlay.propTypes = {
  selectedFormula: PropTypes.object,
  labelId: PropTypes.string,
};

export default FormulaHelperOverlay;