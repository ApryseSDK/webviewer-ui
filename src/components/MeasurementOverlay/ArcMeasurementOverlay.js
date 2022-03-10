import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

ArcMeasurementOverlay.propTypes = {
  annotation: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

function ArcMeasurementOverlay(props) {
  const annotationKey = mapAnnotationToKey(props.annotation);
  const { translate, annotation } = props;
  const { icon } = getDataWithKey(annotationKey);
  const scale = annotation.Scale;
  const precision = annotation.Precision;

  const renderScaleRatio = () => `${scale[0][0]} ${scale[0][1]} = ${scale[1][0]} ${scale[1][1]}`;

  return (
    <>
      <div className="measurement__title">
        {icon && <Icon className="measurement__icon" glyph={icon} />}
        {translate('option.measurementOverlay.arcMeasurement')}
      </div>
      <div className="measurement__scale">
        {translate('option.measurementOverlay.scale')}: {renderScaleRatio()}
      </div>
      <div className="measurement__precision">
        {translate('option.shared.precision')}: {precision}
      </div>
      <div className="measurement__circumference">
        {translate('option.measurementOverlay.length')}: {annotation.Length}
      </div>
      <div className="measurement__radius">
        {translate('option.measurementOverlay.radius')}: {annotation.Radius}
      </div>
      <div className="measurement__radius">
        {translate('option.measurementOverlay.angle')}: {`${annotation.Angle.toFixed(2)}\xB0`}
      </div>
    </>
  );
}

export default withTranslation()(ArcMeasurementOverlay);
