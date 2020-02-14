import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

function EllipseMeasurementOverlay(props) {
  const { t, annotation } = props;
  const annotationKey = mapAnnotationToKey(annotation);
  const { icon } = getDataWithKey(annotationKey);
  const scale = annotation.Scale;
  const precision = annotation.Precision;

  const renderScaleRatio = () => `${scale[0][0]} ${scale[0][1]} = ${scale[1][0]} ${scale[1][1]}`;

  const computeRadius = () => {
    const decimalPlaces = 2;
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = (annotation.Width / 2).toFixed(decimalPlaces);
    return (radiusInPts * factor).toFixed(decimalPlaces);
  };


  return (
    <div className="Overlay MeasurementOverlay open" data-element="measurementOverlay">
      <div className="measurement__title">
        {icon && <Icon className="measurement__icon" glyph={icon}/>}
        {t('option.measurementOverlay.areaMeasurement')}
      </div>
      <div className="measurement__scale">
        {t('option.measurementOverlay.scale')}: {renderScaleRatio()}
      </div>
      <div className="measurement__precision">
        {t('option.shared.precision')}: {precision}
      </div>
      <div className="measurement__value">
        {t('option.measurementOverlay.area')}: {annotation.getContents()}
      </div>
      <div className="measurement__value">
        {t('option.measurementOverlay.radius')}: {computeRadius()}
      </div>
    </div>
  );
}

EllipseMeasurementOverlay.propTypes = {
  annotation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(EllipseMeasurementOverlay);