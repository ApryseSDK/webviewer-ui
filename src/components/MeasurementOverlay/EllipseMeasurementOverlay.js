import core from 'core';
import getNumberOfDecimalPlaces from 'helpers/getNumberOfDecimalPlaces';
import { isMobileDevice } from 'src/helpers/device';
import { precisionFractions } from 'constants/measurementScale';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useCallback } from 'react';
import getFormattedUnit from 'src/helpers/getFormattedUnit';

const propTypes = {
  annotation: (props, propName, componentName) => {
    if (!props.annotation && !props.selectedTool) {
      return new Error(`One of props 'annotation' or 'selectedTool' was not specified in '${componentName}'.`);
    }
    if (props.annotation) {
      PropTypes.checkPropTypes(
        {
          annotation: PropTypes.shape({
            Precision: PropTypes.number,
            DisplayUnits: PropTypes.arrayOf(PropTypes.string),
            getContents: PropTypes.func,
          }),
        },
        { annotation: props.annotation },
        'prop',
        'EllipseMeasurementOverlay',
      );
    }
    return null;
  },
  selectedTool: (props, propName, componentName) => {
    if (!props.annotation && !props.selectedTool) {
      return new Error(`One of props 'annotation' or 'selectedTool' was not specified in '${componentName}'.`);
    }
    if (props.selectedTool) {
      PropTypes.checkPropTypes(
        {
          selectedTool: PropTypes.shape({
            defaults: PropTypes.shape({
              Precision: PropTypes.number,
            }),
            Measure: PropTypes.shape({
              unit: PropTypes.string,
            }),
          }),
        },
        { selectedTool: props.selectedTool },
        'prop',
        'EllipseMeasurementOverlay',
      );
    }
    return null;
  },
  isOpen: PropTypes.bool.isRequired,
};

function EllipseMeasurementOverlay({ annotation, isOpen, selectedTool }) {
  const { t } = useTranslation();

  const isReadOnly = useSelector((state) => selectors.isDocumentReadOnly(state));
  const data = {
    precision: !annotation ? selectedTool?.defaults?.Precision : annotation.Precision,
    unit: getFormattedUnit((annotation?.Scale || selectedTool?.defaults?.Scale)[1][1]),
    area: annotation?.getContents() || 0,
  };

  const refreshRadius = () => {
    setRadius(computeRadius());
  };

  useEffect(() => {
    refreshRadius();
    core.addEventListener('mouseMove', refreshRadius);

    return () => {
      core.removeEventListener('mouseMove', refreshRadius);
    };
  }, [annotation]);

  useEffect(() => {
    const onAnnotationDeselected = (annotations, action) => {
      if (action === 'deselected') {
        const annotation = annotations[0];
        ensureDiameterIsWithinBounds(annotation.getWidth(), annotation);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationDeselected);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationDeselected);
    };
  }, []);

  const computeRadius = () => {
    if (!annotation) {
      return 0;
    }
    const decimalPlaces = annotation && getNumberOfDecimalPlaces(annotation.Precision) || 0;
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = (annotation.Width / 2).toFixed(decimalPlaces);
    return (radiusInPts * factor).toFixed(decimalPlaces);
  };

  const finishAnnotation = () => {
    const tool = core.getTool('AnnotationCreateEllipseMeasurement');
    tool.finish();
  };

  const selectAnnotation = () => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.selectAnnotation(annotation);
  };

  const deselectAnnot = () => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.deselectAnnotation(annotation);
  };

  const onChangeRadiusLength = (event) => {
    const radius = Math.abs(event.target.value);
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = radius / factor;
    const diameterInPts = radiusInPts * 2;
    const rect = annotation.getRect();
    let { X1, X2, Y1, Y2 } = 0;
    X1 = rect['x1'];
    Y1 = rect['y1'];
    X2 = rect['x1'] + diameterInPts;
    Y2 = rect['y1'] + diameterInPts;
    const newRect = { x1: X1, y1: Y1, x2: X2, y2: Y2 };

    annotation.setHeight(diameterInPts);
    annotation.setWidth(diameterInPts);
    annotation.resize(newRect);
    setRadius(radius);
    forceEllipseRedraw(annotation);
    finishAnnotation();
  };

  const forceEllipseRedraw = (annotation) => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.redrawAnnotation(annotation);
    annotationManager.trigger('annotationChanged', [[annotation], 'modify', []]);
  };

  const getMaxDiameterInPts = useCallback((annotation) => {
    const currentPageNumber = core.getCurrentPage();
    const documentWidth = core.getPageWidth(currentPageNumber);
    const documentHeight = core.getPageHeight(currentPageNumber);
    const startX = annotation['X'];
    const startY = annotation['Y'];

    const maxX = documentWidth - startX;
    const maxY = documentHeight - startY;

    return Math.min(maxX, maxY);
  });

  const validateDiameter = (event) => {
    const radius = Math.abs(event.target.value);
    const factor = annotation.Measure.axis[0].factor;
    const radiusInPts = radius / factor;
    const diameterInPts = radiusInPts * 2;
    ensureDiameterIsWithinBounds(diameterInPts, annotation);
    refreshRadius();
  };

  const ensureDiameterIsWithinBounds = useCallback((diameterInPts, annotation) => {
    const maxDiameterInPts = getMaxDiameterInPts(annotation);

    if (diameterInPts > maxDiameterInPts) {
      const boundingRect = annotation.getRect();
      const { x1, x2, y1, y2 } = boundingRect;
      let width = annotation.Width;
      let height = annotation.Height;
      const currentPageNumber = core.getCurrentPage();
      const documentWidth = core.getPageWidth(currentPageNumber);
      const documentHeight = core.getPageHeight(currentPageNumber);

      if (x2 > documentWidth) {
        boundingRect['x2'] = documentWidth;
        width = documentWidth - x1;
      }
      if (y2 > documentHeight) {
        boundingRect['y2'] = documentHeight;
        height = documentHeight - y1;
      }

      if (width < documentWidth) {
        annotation.setWidth(width);
      } else {
        annotation.setWidth(documentWidth);
      }
      if (height < documentHeight) {
        annotation.setHeight(height);
      } else {
        annotation.setHeight(documentHeight);
      }
      annotation.resize(boundingRect);
      forceEllipseRedraw(annotation);
    }
  }, [getMaxDiameterInPts]);

  useEffect(() => {
    if (!isOpen) {
      ensureDiameterIsWithinBounds(annotation.getWidth(), annotation);
    }
  }, [annotation, ensureDiameterIsWithinBounds, isOpen]);

  const [radius, setRadius] = useState(computeRadius());

  return (
    <div className="measurement__detail-container">
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.shared.precision')}:</div>
        {precisionFractions[data.precision] || data.precision}
      </div>
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.area')}:</div>
        <div className="distance-show">{data.area}</div>
      </div>
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.radius')}:</div>
        {annotation ? (
          <>
            <input
              autoFocus={!isMobileDevice}
              className="scale-input"
              type="number"
              min="0"
              disabled={isReadOnly}
              value={radius}
              onChange={(event) => {
                onChangeRadiusLength(event);
                selectAnnotation();
              }}
              onBlur={(event) => validateDiameter(event)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onChangeRadiusLength(event);
                  deselectAnnot();
                }
              }}
            />
            {data.unit}
          </>
        ) : (
          <div>0</div>
        )}
      </div>
    </div>
  );
}

EllipseMeasurementOverlay.propTypes = propTypes;

export default EllipseMeasurementOverlay;
