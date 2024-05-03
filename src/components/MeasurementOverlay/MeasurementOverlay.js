import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import core from 'core';
import { mapAnnotationToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import CustomMeasurementOverlay from './CustomMeasurementOverlay';
import CountMeasurementOverlay from './CountMeasurementOverlay';
import DataElements from 'constants/dataElement';

import './MeasurementOverlay.scss';

const isMouseInsideRect = (e, overlayElement) => {
  if (overlayElement === null) {
    return false;
  }

  const overlayRect = overlayElement.getBoundingClientRect();
  let x; let y;
  if (e.touches && e instanceof TouchEvent) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  return (
    x >= overlayRect.left &&
    x <= overlayRect.right &&
    y >= overlayRect.top &&
    y <= overlayRect.bottom
  );
};

const isCountMeasurementAnnotation = (annot) => ['countMeasurement'].includes(mapAnnotationToKey(annot));

// create your forceUpdate hook
function useForceUpdate() {
  const [, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
}

const propTypes = {
  annotation: PropTypes.object,
};

const MeasurementOverlay = (props) => {
  const { annotation } = props;
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.MEASUREMENT_OVERLAY));

  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [isCreatingAnnotation, setIsCreatingAnnotation] = useState(false);
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.MEASUREMENT_OVERLAY));
  const activeToolName = useSelector((state) => selectors.getActiveToolName(state));
  const customMeasurementOverlay = useSelector((state) => selectors.getCustomMeasurementOverlay(state));
  const overlayRef = useRef();
  const key = mapAnnotationToKey(annotation);

  const shouldShowCustomOverlay = (annot) => (!isCountMeasurementAnnotation(annot) && customMeasurementOverlay.some((overlay) => overlay.validate(annot)));

  const renderOverlay = (annot, key) => {
    if (shouldShowCustomOverlay(annot)) {
      return (
        <CustomMeasurementOverlay
          annotation={annot}
          {...customMeasurementOverlay.filter((customOverlay) => customOverlay.validate(annot)
          )[0]}
        />
      );
    }
    if (key === 'countMeasurement') {
      return <CountMeasurementOverlay annotation={annot} />;
    }
  };

  const onMouseMove = (e) => {
    const tool = core.getTool(activeToolName);

    if (annotation) {
      const insideRect = isMouseInsideRect(e, overlayRef.current);
      let useTransparentBackground;

      if (isCreatingAnnotation) {
        const drawMode = core.getToolMode().getDrawMode?.();
        useTransparentBackground = insideRect && drawMode !== 'twoClicks';
      } else {
        const annotUnderMouse = core.getAnnotationByMouseEvent(e);
        useTransparentBackground = insideRect && annotUnderMouse === annotation;
      }
      setTransparentBackground(useTransparentBackground);
      forceUpdate();
    } else if (shouldShowCustomOverlay(tool.annotation)) {
      dispatch(actions.openElement(DataElements.MEASUREMENT_OVERLAY));
      // this.setState({ annotation: tool.annotation });
      // we know we are creating an annotation at this point because tool.annotation is truthy
      setIsCreatingAnnotation(true);
    }
  };

  const onAnnotationChanged = (annotations, action) => {
    // measurement overlay will open and show the annotation information when we are creating an annotation using measurement tools
    // since by default we don't auto select an annotation after it's created, we close the overlay here to avoid the confusion
    // where no annotation is selected but measurement overlay shows the information about the annotation we were creating
    if (
      action === 'add' &&
      annotations.length === 1 &&
      annotations[0] === annotation
    ) {
      dispatch(actions.closeElement(DataElements.MEASUREMENT_OVERLAY));
    }

    if (
      action === 'modify' &&
      annotations.length === 1 &&
      annotations[0] === annotation
    ) {
      forceUpdate();
    }
  };

  useEffect(() => {
    core.addEventListener('mouseMove', onMouseMove);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    return () => {
      core.removeEventListener('mouseMove', onMouseMove);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
    };
  }, []);

  if (isDisabled || !annotation) {
    return null;
  }

  return (
    <Draggable
      cancel="input"
      position={position}
      onDrag={(e, { x, y }) => setPosition({ x, y })}
      onStop={(e, { x, y }) => setPosition({ x, y })}
    >
      <div
        className={classNames({
          Overlay: true,
          MeasurementOverlay: true,
          open: isOpen,
          closed: !isOpen,
          transparent: transparentBackground,
        })}
        ref={overlayRef}
        data-element={DataElements.MEASUREMENT_OVERLAY}
      >
        {renderOverlay(annotation, key)}
      </div>
    </Draggable>
  );
};

MeasurementOverlay.propTypes = propTypes;

export default MeasurementOverlay;
