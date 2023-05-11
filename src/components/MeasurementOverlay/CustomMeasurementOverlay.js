import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import core from 'core';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

function CustomMeasurementOverlay(props) {
  const renderAppropriateOverlay = (type) => {
    const annotationType = mapAnnotationToKey(props.annotation);
    switch (annotationType) {
      case 'ellipse':
        return <CustomEllipseMeasurementOverlay {...props}/>;
      default:
        console.error(`Custom overlay for annotation type: ${type} not supported`);
    }
  };
  return (renderAppropriateOverlay(props.type));
}

CustomMeasurementOverlay.propTypes = {
  annotation: PropTypes.object.isRequired,
  value: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

function CustomEllipseMeasurementOverlay(props) {
  const annotationKey = mapAnnotationToKey(props.annotation);
  const { icon } = getDataWithKey(annotationKey);
  const { t } = props;

  // Get the Scale, Precision and Units from
  // the AnnotationCreateDistanceMeasurement tool as these do not exist
  // in the Ellipse annotation
  const distanceMeasurementTool = core.getTool('AnnotationCreateDistanceMeasurement');
  const precision = distanceMeasurementTool.defaults.Precision;
  const scale = distanceMeasurementTool.defaults.Scale;
  const measure = distanceMeasurementTool.Measure;
  const unit = scale[1][1];


  const renderScaleRatio = () => `${scale[0][0]} ${scale[0][1]} = ${scale[1][0]} ${scale[1][1]}`;

  const computeRadius = () => {
    const decimalPlaces = 2;
    const factor = measure.axis[0].factor;
    const radiusInPts = props.value(props.annotation).toFixed(decimalPlaces);
    return (radiusInPts * factor).toFixed(decimalPlaces);
  };

  return (
    <>
      <div className="measurement__title">
        {icon && <Icon className="measurement__icon" glyph={icon} />}
        {props.title}
      </div>
      <div className="measurement__scale">
        {t('option.measurementOverlay.scale')}: {renderScaleRatio()}
      </div>
      <div className="measurement__precision">
        {t('option.shared.precision')}: {precision}
      </div>
      <div className="measurement__value">
        {props.label}: <input className="lineMeasurementInput" type="number" min="0" value={computeRadius()} onChange={(event) => props.onChange(event, props.annotation)}/> {unit}
      </div>
    </>
  );
}

CustomEllipseMeasurementOverlay.propTypes = CustomMeasurementOverlay.propTypes;

export default withTranslation()(CustomMeasurementOverlay);