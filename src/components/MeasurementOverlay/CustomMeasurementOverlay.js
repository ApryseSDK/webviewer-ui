import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

function CustomMeasurementOverlay(props) {
  const renderAppropriateOverlay = type => {
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
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

function CustomEllipseMeasurementOverlay(props) {
  console.log(props);
  const annotationKey = mapAnnotationToKey(props.annotation);
  const { icon } = getDataWithKey(annotationKey);
  const radius = props.value(props.annotation).toFixed(2);
  return (
    <div className="Overlay MeasurementOverlay open" data-element="measurementOverlay">
      <div className="measurement__title">
        {icon && <Icon className="measurement__icon" glyph={icon} />}
        Radius Measurement
      </div>
      <div className="measurement__value">
        {props.label}: {radius}
      </div>
    </div>
  );
}

CustomEllipseMeasurementOverlay.propTypes = CustomMeasurementOverlay.propTypes;

export default CustomMeasurementOverlay;