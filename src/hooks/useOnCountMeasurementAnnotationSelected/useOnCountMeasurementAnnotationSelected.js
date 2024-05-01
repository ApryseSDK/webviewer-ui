import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';
import { mapAnnotationToKey, mapToolNameToKey } from 'constants/map';
import usePrevious from 'hooks/usePrevious';
import { isMeasurementTool } from 'src/helpers/getMeasurementTools';

export default function useOnCountMeasurementAnnotationSelected() {
  const dispatch = useDispatch();
  const [
    activeToolName,
    customMeasurementOverlay,
  ] = useSelector(
    (state) => [
      selectors.getActiveToolName(state),
      selectors.getCustomMeasurementOverlay(state),
    ],
    shallowEqual,
  );

  const prevActiveToolName = usePrevious(activeToolName);
  const [annotation, setAnnotation] = useState(null);

  const isCountMeasurementAnnotation = (annotation) => {
    return ['countMeasurement'].includes(mapAnnotationToKey(annotation));
  };

  const isCountMeasurementTool = (toolName) => [
    'countMeasurement'
  ].includes(mapToolNameToKey(toolName));

  const shouldShowCustomOverlay = (annotation) => {
    return (
      !isCountMeasurementAnnotation(annotation) &&
      customMeasurementOverlay.some((overlay) => overlay.validate(annotation))
    );
  };

  useEffect(() => {
    if (prevActiveToolName !== activeToolName) {
      const tool = core.getTool(activeToolName);
      if (!isCountMeasurementTool(activeToolName) && isMeasurementTool(tool)) {
        dispatch(actions.openElement(DataElements.MEASUREMENT_OVERLAY));
      } else {
        dispatch(actions.closeElement(DataElements.MEASUREMENT_OVERLAY));
      }
    }
  }, [prevActiveToolName, activeToolName]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (
        action === 'selected' &&
        annotations.length === 1 &&
        (isCountMeasurementAnnotation(annotations[0]) || shouldShowCustomOverlay(annotations[0]))
      ) {
        setAnnotation(annotations[0]);
        dispatch(actions.openElement(DataElements.MEASUREMENT_OVERLAY));
      } else if (action === 'deselected' && !core.isAnnotationSelected(annotation)) {
        dispatch(actions.closeElement(DataElements.MEASUREMENT_OVERLAY));
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => core.removeEventListener('annotationSelected', onAnnotationSelected);
  }, [dispatch]);

  return { annotation };
}