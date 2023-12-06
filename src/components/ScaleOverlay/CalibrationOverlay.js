import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';

const Scale = window.Core.Scale;

const CalibrationOverlayPropTypes = {
  tempScale: PropTypes.string,
  onCancelCalibrationMode: PropTypes.func,
  onApplyCalibration: PropTypes.func
};

const CalibrationOverlay = ({ tempScale, onCancelCalibrationMode, onApplyCalibration }) => {
  const [t] = useTranslation();

  const isCalibrationPopupOpen = useSelector((state) => selectors.isElementOpen(state, 'annotationPopup'));

  const canApplyCalibration = isCalibrationPopupOpen && tempScale;

  return (
    <div className="scale-overlay-calibrate">
      <div className="scale-overlay-header">
        <Icon glyph="ic-calibrate" className="scale-overlay-icon" />
        <div className="scale-overlay-title">{t('option.measurement.scaleModal.calibrate')}</div>
      </div>
      <div className="scale-overlay-content">
        {!canApplyCalibration
          ? t('option.measurement.scaleOverlay.selectTwoPoints')
          : t('option.measurement.scaleOverlay.inputKnowDimension')}
      </div>
      <div className="divider" />
      <div className="scale-overlay-footer">
        <button
          className="calibration-cancel"
          onMouseDown={onCancelCalibrationMode}
        >
          {t('action.cancel')}
        </button>
        <button
          className="calibration-apply"
          disabled={!(isCalibrationPopupOpen && tempScale && (new Scale(tempScale).worldScale?.value > 0))}
          data-element="calibrationApply"
          onMouseDown={onApplyCalibration}
        >
          {t('action.apply')}
        </button>
      </div>
    </div>
  );
};

CalibrationOverlay.propTypes = CalibrationOverlayPropTypes;

export default CalibrationOverlay;