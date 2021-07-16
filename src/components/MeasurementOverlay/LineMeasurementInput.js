import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import core from 'core';
import { isMobileDevice } from 'helpers/device';
import selectors from 'selectors';

function LineMeasurementInput(props) {
  const { t, annotation, isOpen } = props;
  const isReadOnly = useSelector(state => selectors.isDocumentReadOnly(state));
  const factor = annotation.Measure.axis[0].factor;
  const unit = annotation.Scale[1][1];
  const [length, setLength] = useState((annotation.getLineLength() * factor).toFixed(2));

  useEffect(() => {
    const onAnnotationChanged = () => {
      setLength((annotation.getLineLength() * factor).toFixed(2));
      setAngle(computeAngle());
    };
    core.addEventListener('mouseMove', onAnnotationChanged);
    return () => {
      core.removeEventListener('mouseMove', onAnnotationChanged);
    };
  }, [annotation, computeAngle, factor]);

  const onInputChanged = event => {
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

  const validateLineLength = event => {
    const length = Math.abs(event.target.value);
    const factor = annotation.Measure.axis[0].factor;
    const lengthInPts = length / factor;
    ensureLineIsWithinBounds(lengthInPts);
  };

  const isApproximatelyEqual = (value1, value2) => {
    return Math.abs(value1 - value2) < 0.1;
  };

  const ensureLineIsWithinBounds = useCallback(lengthInPts => {
    if (!isApproximatelyEqual(annotation.getLineLength(), lengthInPts)) {
      const maxLengthInPts = getMaxLineLengthInPts();
      annotation.setLineLength(Math.min(maxLengthInPts, lengthInPts));
      forceLineRedraw();
    }
  }, [annotation, forceLineRedraw, getMaxLineLengthInPts]);

  const forceLineRedraw = useCallback(() => {
    const annotationManager = core.getAnnotationManager();
    annotationManager.drawAnnotations(annotation.PageNumber);
    annotationManager.trigger('annotationChanged', [[annotation], 'modify', {}]);
  }, [annotation]);

  const getMaxLineLengthInPts = useCallback(() => {
    const currentPageNumber = core.getCurrentPage();
    const documentWidth = window.documentViewer.getPageWidth(currentPageNumber);
    const documentHeight = window.documentViewer.getPageHeight(currentPageNumber);
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

  const setLineAngle = event => {
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

  const onAngleChange = event => {
    setAngle(event.target.value);
    setLineAngle(event);
    finishAnnotation();
  };

  const computeAngle = useCallback(() => {
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
    <div>
      <div className="measurement__value">
        {t('option.measurementOverlay.distance')}: {' '}
        <input
          className="lineMeasurementInput"
          type="number"
          min="0"
          disabled={isReadOnly}
          value={length}
          autoFocus={!isMobileDevice}
          onChange={event => {
            onInputChanged(event);
            selectAnnotation();
          }}
          onBlur={event => validateLineLength(event)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              onInputChanged(event);
              deselectAnnotation();
            }
          }}
        /> {unit}
      </div>
      <div className="angle_input">
        {t('option.measurementOverlay.angle')}: {' '}
        <input
          className="lineMeasurementInput"
          type="number"
          min="0"
          max="360"
          disabled={isReadOnly}
          value={angle}
          onChange={event => {
            onAngleChange(event);
            selectAnnotation();
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              onAngleChange(event);
              deselectAnnotation();
            }
          }}
        /> &deg;
      </div>
    </div>
  );
}

LineMeasurementInput.propTypes = {
  annotation: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default LineMeasurementInput;