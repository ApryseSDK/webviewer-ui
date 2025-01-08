import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ScaleSelector from './ScaleSelector';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useFocusHandler from 'hooks/useFocusHandler';

const propTypes = {
  scales: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedScales: PropTypes.arrayOf(PropTypes.string).isRequired,
  onScaleSelected: PropTypes.func.isRequired,
  onAddingNewScale: PropTypes.func.isRequired,
};

const ScaleHeader = ({ scales, selectedScales, onScaleSelected, onAddingNewScale }) => {
  const [t] = useTranslation();

  const onClickFocusWrapped = useFocusHandler(onAddingNewScale);

  return (
    <div className="scale-overlay-header">
      <Icon glyph="ic-calibrate" className="scale-overlay-icon" />
      <h4 id="scale-dropdown-label" className="scale-overlay-title">{t('option.measurementOption.scale')}</h4>
      {scales.length ? (
        <ScaleSelector
          scales={scales}
          selectedScales={selectedScales}
          onScaleSelected={onScaleSelected}
          onAddingNewScale={onAddingNewScale}
          ariaLabelledBy="scale-dropdown-label"
        />
      ) : (
        <Button className="add-new-scale" onClick={onClickFocusWrapped} dataElement="addNewScale" label={t('option.measurement.scaleOverlay.addNewScale')} />
      )}
    </div>
  );
};

ScaleHeader.propTypes = propTypes;
export default ScaleHeader;
