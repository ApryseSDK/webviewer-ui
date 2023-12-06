import React from 'react';
import Icon from 'components/Icon';
import ScaleSelector from './ScaleSelector';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const propTypes = {
  scales: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedScales: PropTypes.arrayOf(PropTypes.string).isRequired,
  onScaleSelected: PropTypes.func.isRequired,
  onAddingNewScale: PropTypes.func.isRequired,
};

const ScaleHeader = ({ scales, selectedScales, onScaleSelected, onAddingNewScale }) => {
  const [t] = useTranslation();

  return (
    <div className="scale-overlay-header">
      <Icon glyph="ic-calibrate" className="scale-overlay-icon" />
      <div className="scale-overlay-title">{t('option.measurementOption.scale')}</div>
      {scales.length ? (
        <ScaleSelector
          scales={scales}
          selectedScales={selectedScales}
          onScaleSelected={onScaleSelected}
          onAddingNewScale={onAddingNewScale}
        />
      ) : (
        <button className="add-new-scale" onClick={onAddingNewScale} data-element="addNewScale">{t('option.measurement.scaleOverlay.addNewScale')}</button>
      )}
    </div>
  );
};

ScaleHeader.propTypes = propTypes;
export default ScaleHeader;
