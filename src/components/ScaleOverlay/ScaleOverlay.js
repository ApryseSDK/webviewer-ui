import ScaleHeader from './ScaleHeader';
import useCore from 'hooks/useCore';
import MeasurementDetail from './MeasurementDetail';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import React, { useEffect, useMemo, memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import CalibrationOverlay from './CalibrationOverlay';

import './ScaleOverlay.scss';

const Scale = window.Core.Scale;

const propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTool: PropTypes.object,
  scales: PropTypes.object.isRequired,
  scalesInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateIsCalibration: PropTypes.func.isRequired,
  disableToolElements: PropTypes.func.isRequired,
  onScaleSelected: PropTypes.func.isRequired,
  onCancelCalibrationMode: PropTypes.func.isRequired,
  onApplyCalibration: PropTypes.func.isRequired,
  onAddingNewScale: PropTypes.func.isRequired
};

const ScaleOverlay = ({
  annotations,
  selectedTool,
  scales,
  scalesInfo,
  updateIsCalibration,
  disableToolElements,
  onScaleSelected,
  onCancelCalibrationMode,
  onApplyCalibration,
  onAddingNewScale,
  forceUpdate,
}) => {
  const [
    { isCalibration, tempScale, previousToolName = 'AnnotationCreateDistanceMeasurement', isFractionalUnit },
    activeToolName
  ] = useSelector((state) => [
    selectors.getCalibrationInfo(state),
    selectors.getActiveToolName(state)
  ], shallowEqual);
  const { core } = useCore();
  const shouldShowMeasurementDetail = !!Object.keys(scales).length && !(!selectedTool && (!annotations.length || annotations.length > 1));

  useEffect(() => {
    forceUpdate();
  }, [scales]);

  useEffect(() => {
    if (activeToolName === 'AnnotationCreateCalibrationMeasurement') {
      !isCalibration && updateIsCalibration(true);
      disableToolElements(true);
    } else {
      updateIsCalibration(false);
      disableToolElements(false);
    }
  }, [activeToolName, updateIsCalibration, disableToolElements]);

  const selectedScales = useMemo(() => {
    const scales = new Set();
    [...annotations, selectedTool].forEach((measurementItem) => {
      const scale = measurementItem?.Measure?.scale;
      if (scale && !scales.has(scale)) {
        scales.add(scale);
      }
    });
    return [...scales];
  }, [annotations, selectedTool, scales, core]);

  const totalScales = Object.keys(scales).map((scale) => new Scale(scale));
  const canModifyMeasurement = annotations.length === 1 ? core.canModify(annotations[0]) : false;
  const renderScale = (scale) => {
    const precision = core.getScalePrecision(scale);
    const pageScaleStr = Scale.getFormattedValue(scale.pageScale.value, scale.pageScale.unit, precision, false);
    const worldScaleStr = Scale.getFormattedValue(scale.worldScale.value, scale.worldScale.unit, precision, false);
    const scaleDisplay = `${pageScaleStr} = ${worldScaleStr}`;
    return <div>{scaleDisplay}</div>;
  };
  const onDeleteScale = (scale) => {
    core.deleteScale(scale);
  };

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
        scalesInfo={scalesInfo}
        selectedScales={selectedScales}
        onScaleSelected={onScaleSelected}
        onAddingNewScale={onAddingNewScale}
        onDeleteScale={onDeleteScale}
        renderScale={renderScale}
      />
      {shouldShowMeasurementDetail && (
        <MeasurementDetail
          annotation={annotations.length > 1 ? null : annotations[0] || null}
          selectedTool={selectedTool}
          isOpen
          canModify={canModifyMeasurement}
        />
      )}
    </>
  );
};

ScaleOverlay.propTypes = propTypes;

export default memo(ScaleOverlay);
