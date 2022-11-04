import ScaleHeader from './ScaleHeader';
import core from 'core';
import MeasurementDetail from './MeasurementDetail';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import React, { useEffect, useState, useMemo, memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import CalibrationOverlay from './CalibrationOverlay';

import './ScaleOverlay.scss';

const Scale = window.Core.Scale;

const propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTool: PropTypes.object,
  updateIsCalibration: PropTypes.func.isRequired,
  enableOrDisableToolElements: PropTypes.func.isRequired,
  onScaleSelected: PropTypes.func.isRequired,
  onCancelCalibrationMode: PropTypes.func.isRequired,
  onApplyCalibration: PropTypes.func.isRequired,
  onAddingNewScale: PropTypes.func.isRequired
};

const ScaleOverlay = ({
  annotations,
  selectedTool,
  updateIsCalibration,
  enableOrDisableToolElements,
  onScaleSelected,
  onCancelCalibrationMode,
  onApplyCalibration,
  onAddingNewScale
}) => {
  const [
    { isCalibration, tempScale, previousToolName = 'AnnotationCreateDistanceMeasurement', isFractionalUnit },
    activeToolName
  ] = useSelector((state) => [
    selectors.getCalibrationInfo(state),
    selectors.getActiveToolName(state)
  ], shallowEqual);
  const [scales, setScales] = useState(core.getScales());
  const shouldShowMeasurementDetail = !!Object.keys(scales).length && !(!selectedTool && (!annotations.length || annotations.length > 1));

  useEffect(() => {
    const onScaleUpdated = (newScales) => {
      setScales(newScales);
    };
    const updateScales = () => {
      setScales(core.getScales());
    };

    const onCreateAnnotationWithNoScale = () => {
      onAddingNewScale();
    };
    core.addEventListener('scaleUpdated', onScaleUpdated);
    core.addEventListener('createAnnotationWithNoScale', onCreateAnnotationWithNoScale);
    core.addEventListener('annotationsLoaded', updateScales);
    core.addEventListener('annotationChanged', updateScales);

    return () => {
      core.removeEventListener('scaleUpdated', onScaleUpdated);
      core.removeEventListener('createAnnotationWithNoScale', onCreateAnnotationWithNoScale);
      core.removeEventListener('annotationsLoaded', updateScales);
      core.removeEventListener('annotationChanged', updateScales);
    };
  }, []);

  useEffect(() => {
    if (activeToolName === 'AnnotationCreateCalibrationMeasurement') {
      !isCalibration && updateIsCalibration(true);
      enableOrDisableToolElements(true);
    } else {
      updateIsCalibration(false);
      enableOrDisableToolElements(false);
    }
  }, [activeToolName, updateIsCalibration, enableOrDisableToolElements]);

  const selectedScales = useMemo(() => {
    const scales = new Set();
    [...annotations, selectedTool].forEach((measurementItem) => {
      const scale = measurementItem?.Measure?.scale;
      if (scale && !scales.has(scale)) {
        scales.add(scale);
      }
    });
    return [...scales];
  }, [annotations, selectedTool, scales]);

  const totalScales = Object.keys(scales).map((scale) => new Scale(scale));

  return isCalibration ? (
    <CalibrationOverlay
      tempScale={tempScale}
      onCancelCalibrationMode={() => onCancelCalibrationMode(previousToolName)}
      onApplyCalibration={() => onApplyCalibration(previousToolName, tempScale, isFractionalUnit)}
      previousToolName={previousToolName}
    />
  ) : (
    <>
      <ScaleHeader
        scales={totalScales}
        selectedScales={selectedScales}
        onScaleSelected={onScaleSelected}
        onAddingNewScale={onAddingNewScale}
      />
      {shouldShowMeasurementDetail && (
        <MeasurementDetail
          annotation={annotations.length > 1 ? null : annotations[0] || null}
          selectedTool={selectedTool}
          isOpen
        />
      )}
    </>
  );
};

ScaleOverlay.propTypes = propTypes;

export default memo(ScaleOverlay);
