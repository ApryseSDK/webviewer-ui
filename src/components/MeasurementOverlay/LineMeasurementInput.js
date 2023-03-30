import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import core from 'core';
import { isMobileDevice } from 'helpers/device';
import selectors from 'selectors';
import getAngleInRadians from 'helpers/getAngleInRadians';

const unitMap = {
  'in\"': 'in',
  'ft\'': 'ft'
};

LineMeasurementInput.propTypes = {
  annotation: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  selectedTool: PropTypes.object,
};

const Scale = window.Core.Scale;

function LineMeasurementInput({ annotation, isOpen, selectedTool }) {
  const [t] = useTranslation();
  const isReadOnly = useSelector((state) => selectors.isDocumentReadOnly(state));
  const factor = annotation?.Measure.axis[0].factor;
  const unit = annotation?.DisplayUnits[0] || selectedTool?.Measure?.unit;
  const [length, setLength] = useState((annotation?.getLineLength() * factor || 0).toFixed(2));
  const [toggleDistanceInput, setDistanceInputToggle] = useState(false);
  const [toggleAngleInput, setAngleToggle] = useState(false);

  useEffect(() => {
    if (!annotation) {
      setAngle(computeAngle());
      return;
    }
    const onAnnotationChanged = () => {
      setLength((annotation.getLineLength() * factor).toFixed(2));
      setAngle(computeAngle());
    };
    core.addEventListener('mouseMove', onAnnotationChanged);

    return () => {
      core.removeEventListener('mouseMove', onAnnotationChanged);
    };
  }, [annotation, computeAngle, factor, selectedTool]);

  const onInputChanged = (event) => {
    setLength(event.target.value);
    validateLineLength(event);
    finishAnnotation();
  };

  const finishAnnotation = () => {
    const tool = core.getTool('AnnotationCreateDistanceMeasurement');
    tool.finish();
  };

  const selectAnnotation = () => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.selectAnnotation(annotation);
  };

  const deselectAnnotation = () => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.deselectAnnotation(annotation);
  };

  const validateLineLength = (event) => {
    if (!annotation) {
      return;
    }
    let length = Math.abs(event.target.value);
    if (length < annotation.Precision) {
      length = annotation.Precision;
      setLength(length);
    }
    const factor = annotation.Measure.axis[0].factor;
    const lengthInPts = length / factor;
    ensureLineIsWithinBounds(lengthInPts);
  };

  const isApproximatelyEqual = (value1, value2) => {
    return Math.abs(value1 - value2) < 0.1;
  };

  const ensureLineIsWithinBounds = useCallback(
    (lengthInPts) => {
      if (!isApproximatelyEqual(annotation.getLineLength(), lengthInPts)) {
        const maxLengthInPts = getMaxLineLengthInPts();
        annotation.setLineLength(Math.min(maxLengthInPts, lengthInPts));
        forceLineRedraw();
      }
    },
    [annotation, forceLineRedraw, getMaxLineLengthInPts],
  );

  const getAnnotationUnit = (annotation) => {
    let annotUnit;
    if (annotation?.DisplayUnits?.length) {
      if (annotation.DisplayUnits.length === 2 && annotation.DisplayUnits[0] === "ft'" && annotation.DisplayUnits[1] === 'in"') {
        annotUnit = 'in';
      } else {
        annotUnit = annotation.DisplayUnits[0];
      }
    }
    return unitMap[annotUnit] || annotUnit || unitMap[unit] || unit;
  };

  const renderDeltas = () => {
    const angle = (annotation && getAngleInRadians(annotation.Start, annotation.End)) || 0;
    const unit = getAnnotationUnit(annotation);
    const deltaX = Scale.getFormattedValue(annotation && Math.abs(length * Math.cos(angle)), unit, annotation?.Precision);
    const deltaY = Scale.getFormattedValue(annotation && Math.abs(length * Math.sin(angle)), unit, annotation?.Precision);

    return (
      <>
        <div className="measurement__detail-item">
          <div className="measurement_list">X:</div>
          <div>
            {deltaX}
          </div>
        </div>
        <div className="measurement__detail-item">
          <div className="measurement_list">Y:</div>
          <div>
            {deltaY}
          </div>
        </div>
      </>
    );
  };

  const forceLineRedraw = useCallback(() => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.drawAnnotations(annotation.PageNumber);
    annotationManager.trigger('annotationChanged', [[annotation], 'modify', {}]);
  }, [annotation]);

  const getMaxLineLengthInPts = useCallback(() => {
    const currentPageNumber = core.getCurrentPage();
    const documentWidth = core.getPageWidth(currentPageNumber);
    const documentHeight = core.getPageHeight(currentPageNumber);
    const angleInDegrees = annotation.getAngle() * (180 / Math.PI).toFixed(2);
    const startPoint = annotation.getStartPoint();
    const startX = startPoint.x;
    const startY = startPoint.y;

    let maxX;
    let maxY;
    if (Math.abs(angleInDegrees) < 90) {
      maxX = documentWidth;
    } else {
      maxX = 0;
    }

    if (angleInDegrees > 0) {
      maxY = documentHeight;
    } else {
      maxY = 0;
    }

    const maxLenX = Math.abs((maxX - startX) / Math.cos(annotation.getAngle()));
    const maxLenY = Math.abs((maxY - startY) / Math.sin(annotation.getAngle()));

    return Math.min(maxLenX, maxLenY);
  }, [annotation]);

  const setLineAngle = (event) => {
    const angle = event.target.value;
    const angleInRadians = angle * (Math.PI / 180) * -1;
    const lengthInPts = annotation.getLineLength();
    const start = annotation.Start;
    const endX = Math.cos(angleInRadians) * lengthInPts + start.x;
    const endY = Math.sin(angleInRadians) * lengthInPts + start.y;
    annotation.setEndPoint(endX, endY);
    annotation.adjustRect();
    forceLineRedraw();
  };

  const onAngleChange = (event) => {
    setAngle(event.target.value);
    setLineAngle(event);
    finishAnnotation();
  };

  const computeAngle = useCallback(() => {
    if (!annotation) {
      return 0;
    }
    let angleInRadians = annotation.getAngle();
    // Multiply by -1 to achieve 0-360 degrees counterclockwise
    angleInRadians *= -1;
    angleInRadians = angleInRadians < 0 ? angleInRadians + 2 * Math.PI : angleInRadians;
    return ((angleInRadians / Math.PI) * 180).toFixed(2);
  }, [annotation]);

  const [angle, setAngle] = useState(computeAngle());

  useEffect(() => {
    if (!isOpen) {
      ensureLineIsWithinBounds(annotation.getLineLength());
    }
  }, [annotation, ensureLineIsWithinBounds, isOpen]);

  return (
    <>
      <div className="measurement__detail-item">
        <div className="measurement_list">
          {t('option.measurementOverlay.distance')}:
        </div>
        {(!annotation || !toggleDistanceInput) ? (
          <div onClick={() => setDistanceInputToggle(true)} className="distance-show">
            {annotation?.getContents() || 0}
          </div>
        ) : (
          <>
            <input
              className="scale-input"
              type="number"
              min="0"
              disabled={isReadOnly}
              value={length}
              autoFocus={!isMobileDevice}
              onChange={(event) => {
                onInputChanged(event);
                selectAnnotation();
              }}
              onBlur={(event) => {
                validateLineLength(event);
                setDistanceInputToggle(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onInputChanged(event);
                  deselectAnnotation();
                }
              }}
            />
            {unit}
          </>
        )}
      </div>
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.angle')}:</div>
        {(!annotation || !toggleAngleInput) ? (
          <div onClick={() => setAngleToggle(true)} className="distance-show">
            {angle}&deg;
          </div>
        ) : (
          <>
            <input
              className="scale-input"
              type="number"
              min="0"
              max="360"
              disabled={isReadOnly}
              value={angle}
              autoFocus={!isMobileDevice}
              onChange={(event) => {
                onAngleChange(event);
                selectAnnotation();
              }}
              onBlur={() => setAngleToggle(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onAngleChange(event);
                  deselectAnnotation();
                }
              }}
            />
            &deg;
          </>
        )}
      </div>
      {renderDeltas()}
    </>
  );
}

export default LineMeasurementInput;
