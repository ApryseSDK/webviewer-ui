import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ScaleSelector from './ScaleSelector';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useFocusHandler from 'hooks/useFocusHandler';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import DataElements from 'src/constants/dataElement';

const propTypes = {
  scales: PropTypes.arrayOf(PropTypes.object).isRequired,
  scalesInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedScales: PropTypes.arrayOf(PropTypes.string).isRequired,
  onScaleSelected: PropTypes.func.isRequired,
  onAddingNewScale: PropTypes.func.isRequired,
  onDeleteScale: PropTypes.func.isRequired,
  renderScale: PropTypes.func.isRequired,
};

const ScaleHeader = ({ scales, scalesInfo, selectedScales, onScaleSelected, onAddingNewScale, onDeleteScale, renderScale }) => {
  const [t] = useTranslation();

  const onClickFocusWrapped = useFocusHandler(onAddingNewScale);
  const isScaleModalEnabled = useSelector((state) => !selectors.isDisabledViewOnly(state, DataElements.SCALE_MODAL));

  return (
    <div className="scale-overlay-header">
      <Icon glyph="ic-calibrate" className="scale-overlay-icon" />
      <h4 id="scale-dropdown-label" className="scale-overlay-title">{t('option.measurementOption.scale')}</h4>
      {scales.length ? (
        <ScaleSelector
          scalesInfo={scalesInfo}
          selectedScales={selectedScales}
          onScaleSelected={onScaleSelected}
          onAddingNewScale={onAddingNewScale}
          onDeleteScale={onDeleteScale}
          renderScale={renderScale}
          ariaLabelledBy="scale-dropdown-label"
          isScaleModalEnabled={isScaleModalEnabled}
        />
      ) : (
        isScaleModalEnabled && (
          <Button className="add-new-scale" onClick={onClickFocusWrapped} dataElement="addNewScale" label={t('option.measurement.scaleOverlay.addNewScale')} />
        )
      )}
    </div>
  );
};

ScaleHeader.propTypes = propTypes;
export default ScaleHeader;
