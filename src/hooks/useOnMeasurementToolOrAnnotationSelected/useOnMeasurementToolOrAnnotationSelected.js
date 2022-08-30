import { useEffect, useState } from 'react';
import { mapAnnotationToKey, annotationMapKeys } from 'constants/map';
import selectors from 'selectors';
import { useSelector, shallowEqual } from 'react-redux';
import { isMeasurementTool } from 'helpers/getMeasurementTools';
import core from 'core';

const { ToolNames } = window.Tools;

const isMeasurementExcludeCalibration = (measurement) => !!isMeasurementTool(measurement) &&
  ![measurement.name, measurement.ToolName].includes(ToolNames.CALIBRATION_MEASUREMENT);

export default function useOnMeasurementToolOrAnnotationSelected() {
  const [activeToolName] = useSelector((state) => [selectors.getActiveToolName(state)], shallowEqual);
  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    const onAnnotationSelected = (annots, action) => {
      const selectedAnnotations = core.getSelectedAnnotations();
      const measuredAnnotations = selectedAnnotations.filter(isMeasurementExcludeCalibration);
      if (measuredAnnotations.length && action === 'selected') {
        setAnnotations(measuredAnnotations);
      } else if (action === 'deselected') {
        setAnnotations([]);
      }
    };

    const onScaleUpdated = (tool) => {
      if (tool?.name === selectedTool?.name && tool?.Measure) {
        setSelectedTool(tool);
      }
    };

    const onAnnotationChanged = (changedAnnotations, action) => {
      if (action === 'add' && isMeasurementExcludeCalibration(changedAnnotations[0])) {
        setAnnotations([]);
      }
      if (action === 'delete') {
        setAnnotations([]);
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('toolUpdated', onScaleUpdated);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('toolUpdated', onScaleUpdated);
    };
  }, []);

  const onMouseMove = _.throttle(() => {
    const tool = core.getTool(activeToolName);
    if (isMeasurementToolWithInfo(tool) && !isSmallAnnotation(tool.annotation)) {
      setAnnotations([tool.annotation]);
    }
  }, 100);

  useEffect(() => {
    core.addEventListener('mouseMove', onMouseMove);

    return () => {
      core.removeEventListener('mouseMove', onMouseMove);
    };
  }, [activeToolName]);

  // This helps ensure we don't show an overlay for small annotations
  const isSmallAnnotation = (annotation) => {
    if (!annotation) {
      return true;
    }
    const w = annotation.getWidth();
    const h = annotation.getHeight();
    const minSize = (annotation.getRectPadding() + 1) * 2;

    return w <= minSize && h <= minSize;
  };

  const isMeasurementToolWithInfo = (tool) => {
    return isMeasurementExcludeCalibration(tool) && tool.annotation && shouldShowInfo(tool.annotation);
  };

  const shouldShowInfo = (annotation) => {
    const key = mapAnnotationToKey(annotation);

    let showInfo;
    if (
      [
        annotationMapKeys.PERIMETER_MEASUREMENT,
        annotationMapKeys.AREA_MEASUREMENT,
        annotationMapKeys.RECTANGULAR_AREA_MEASUREMENT,
        annotationMapKeys.CLOUDY_RECTANGULAR_AREA_MEASUREMENT,
        annotationMapKeys.ARC_MEASUREMENT,
      ].includes(key)
    ) {
      // for polyline and polygon, there's no useful information we can show if it has no vertices or only one vertex.
      showInfo = annotation.getPath().length > 1;
    } else if ([annotationMapKeys.DISTANCE_MEASUREMENT, annotationMapKeys.ELLIPSE_MEASUREMENT].includes(key)) {
      showInfo = true;
    }

    return showInfo;
  };

  useEffect(() => {
    if (activeToolName) {
      const tool = core.getTool(activeToolName);
      if (tool?.Measure) {
        setSelectedTool(tool);
        setAnnotations([]);
      } else {
        setSelectedTool(null);
      }
    }
  }, [activeToolName]);

  return { selectedTool, annotations };
}
