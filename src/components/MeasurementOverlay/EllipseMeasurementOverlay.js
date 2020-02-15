import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import core from 'core';
import getClassName from 'helpers/getClassName';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

function EllipseMeasurementOverlay(props) {
  const { t, annotation, isOpen } = props;
  const annotationKey = mapAnnotationToKey(annotation);
  const { icon } = getDataWithKey(annotationKey);
  const scale = annotation.Scale;
  const precision = annotation.Precision;
  const unit = annotation.Scale[1][1];
  const className = getClassName('Overlay MeasurementOverlay', { isOpen });

  const renderScaleRatio = () => `${scale[0][0]} ${scale[0][1]} = ${scale[1][0]} ${scale[1][1]}`;

  const computeRadius = () => {
    const decimalPlaces = 2;
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = (annotation.Width / 2).toFixed(decimalPlaces);
    return (radiusInPts * factor).toFixed(decimalPlaces);
  };

  const onChangeRadiusLength = event => {
    const radius = Math.abs(event.target.value);
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = radius / factor;
    const diameterInPts = radiusInPts * 2;
    annotation.setHeight(diameterInPts);
    annotation.setWidth(diameterInPts);
    forceEllipseRedraw();
  };

  const forceEllipseRedraw = () => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.redrawAnnotation(annotation);
    annotationManager.trigger('annotationChanged', [[annotation], 'modify', []]);
  };

  const getMaxDiameterInPts = () => {
    const currentPageIndex = core.getCurrentPage() - 1;
    const documentWidth = window.docViewer.getPageWidth(currentPageIndex);
    const documentHeight = window.docViewer.getPageHeight(currentPageIndex);
    const startX = annotation['X'];
    const startY = annotation['Y'];

    const maxX = documentWidth - startX;
    const maxY = documentHeight - startY;

    return Math.min(maxX, maxY);
  };

  const onBlurValidateRadius = event => {
    const radius = Math.abs(event.target.value);
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = radius / factor;
    const diameterInPts = radiusInPts * 2;
    ensureDiameterIsWithinBounds(diameterInPts);
  };

  const ensureDiameterIsWithinBounds = diameterInPts => {
    const maxDiameterInPts = getMaxDiameterInPts();

    if (diameterInPts > maxDiameterInPts) {
      annotation.setHeight(maxDiameterInPts);
      annotation.setWidth(maxDiameterInPts);
      forceEllipseRedraw();
    }
  };

  if (!isOpen) {
    ensureDiameterIsWithinBounds(annotation.getWidth());
  }


  return (
    <div className={className} data-element="measurementOverlay">
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
        {t('option.measurementOverlay.radius')}: <input className="lineMeasurementInput" type="number" min="0" value={computeRadius()} onChange={event => onChangeRadiusLength(event)} onBlur={event => onBlurValidateRadius(event)}/> {unit}
      </div>
    </div>
  );
}

EllipseMeasurementOverlay.propTypes = {
  annotation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withTranslation()(EllipseMeasurementOverlay);