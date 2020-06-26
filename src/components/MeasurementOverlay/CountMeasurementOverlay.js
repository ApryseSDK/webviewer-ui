import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import core from 'core';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

CountMeasurementOverlay.propTypes = {
  annotation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

function CountMeasurementOverlay(props) {
  const annotationKey = mapAnnotationToKey(props.annotation);
  const { icon } = getDataWithKey(annotationKey);
  const { t } = props;
  const annotationList = core.getAnnotationsList();

  const measurementAnnotationsList = annotationList.filter(annotation => {
    return annotation.getCustomData('trn-is-count');
  });
  const annotationCount = measurementAnnotationsList.length;

  return (
    <>
      <div className="measurement__title">
        {icon && <Icon className="measurement__icon" glyph={icon} />}
        {t('option.measurementOverlay.countMeasurement')}
      </div>
      <div className="measurement__count">
        {t('option.measurementOverlay.count')}: {annotationCount}
      </div>
    </>
  );
}

export default withTranslation()(CountMeasurementOverlay);