import actions from 'actions';
import ScaleOverlay from './ScaleOverlay';
import classNames from 'classnames';
import core from 'core';
import Draggable from 'react-draggable';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';

import './ScaleOverlay.scss';

const Scale = window.Core.Scale;

const measurementDataElements = [
  'distanceToolGroupButton',
  'arcMeasurementToolGroupButton',
  'perimeterToolGroupButton',
  'areaToolGroupButton',
  'rectangleAreaToolGroupButton',
  'ellipseAreaToolGroupButton',
  'countToolGroupButton',
  'cloudyRectangleAreaToolGroupButton',
  'arcToolGroupButton'
];

const DEFAULT_CONTAINER_TOP_OFFSET = 85;
const DEFAULT_CONTAINER_RIGHT_OFFSET = 35;
const DEFAULT_WIDTH_RATIO = 0.666;
const DEFAULT_DISTANCE = 10;

const ScaleOverlayContainer = ({ annotations, selectedTool }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [
    isDisabled,
    isOpen,
    initialPosition,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.SCALE_OVERLAY_CONTAINER),
      selectors.isElementOpen(state, DataElements.SCALE_OVERLAY_CONTAINER),
      selectors.getScaleOverlayPosition(state),
    ],
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [, forceUpdate] = useReducer((x) => x + 1, 0, () => 0);

  const [
    documentContainerWidth,
    documentContainerHeight
  ] = useSelector((state) => [
    selectors.getDocumentContainerWidth(state),
    selectors.getDocumentContainerHeight(state)
  ]);

  const containerRef = useRef(null);

  const documentElement = core.getViewerElement();
  const documentContainerElement = core.getScrollViewElement();

  const calculateStyle = () => {
    const initialPositionParts = initialPosition.split('-');
    const offset = { left: 0, top: 0, };
    if (initialPositionParts[0] === 'top') {
      offset.top = documentElement?.offsetTop + DEFAULT_DISTANCE || DEFAULT_CONTAINER_TOP_OFFSET;
    } else {
      let containerHeight = 400;
      if (containerRef?.current) {
        containerHeight = containerRef.current.getBoundingClientRect().height;
      }
      offset.top = documentContainerHeight + documentContainerElement?.offsetTop - DEFAULT_DISTANCE - containerHeight || DEFAULT_CONTAINER_TOP_OFFSET;
    }

    if (initialPositionParts[1] === 'right') {
      offset.left = documentContainerWidth * DEFAULT_WIDTH_RATIO;
      if (documentElement && containerRef?.current) {
        offset.left = Math.min(
          documentElement?.offsetLeft + documentElement?.offsetWidth + DEFAULT_DISTANCE || offset.left,
          documentContainerWidth - containerRef.current.getBoundingClientRect().width - DEFAULT_DISTANCE,
        );
      }
    } else {
      if (documentElement && containerRef?.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        offset.left = documentElement?.offsetLeft - DEFAULT_DISTANCE - containerWidth || DEFAULT_DISTANCE;
        if (documentContainerElement && offset.left < documentContainerElement.offsetLeft) {
          offset.left = documentContainerElement.offsetLeft + DEFAULT_DISTANCE;
        }
      }
      if (!offset.left || isNaN(offset.left) || offset.left < 0) {
        offset.left = DEFAULT_DISTANCE;
      }
    }
    return offset;
  };
  const style = calculateStyle();

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [initialPosition]);

  const containerBounds = () => {
    const initialPositionParts = initialPosition.split('-');
    const bounds = { top: 0, bottom: 0, left: 0, right: 0 };
    if (initialPositionParts[0] === 'top') {
      bounds.top = 0;
      bounds.bottom = documentContainerHeight - (DEFAULT_DISTANCE * 2);
      if (containerRef.current) {
        bounds.bottom -= containerRef.current.getBoundingClientRect().height;
      } else {
        bounds.bottom -= DEFAULT_CONTAINER_TOP_OFFSET;
      }
    } else {
      bounds.top = -documentContainerHeight + (DEFAULT_DISTANCE * 2);
      if (containerRef.current) {
        bounds.top += containerRef.current.getBoundingClientRect().height;
      } else {
        bounds.top += DEFAULT_CONTAINER_TOP_OFFSET;
      }
      bounds.bottom = 0;
    }

    if (initialPositionParts[1] === 'right') {
      bounds.left = -documentContainerWidth;
      bounds.right = documentContainerWidth / 3;
      if (style) {
        bounds.right = documentContainerWidth - style['left'];
      }
    } else {
      bounds.left = documentContainerElement?.offsetLeft;
      if (style) {
        bounds.left = documentContainerElement?.offsetLeft - style['left'] + DEFAULT_DISTANCE;
      }
      bounds.right = documentContainerWidth - DEFAULT_DISTANCE - DEFAULT_CONTAINER_RIGHT_OFFSET;
      if (style) {
        bounds.right -= style['left'];
      }
    }
    return bounds;
  };

  const syncDraggablePosition = (e, { x, y }) => {
    setPosition({
      x,
      y,
    });
  };

  const updateIsCalibration = useCallback((isCalibration) => {
    dispatch(actions.updateCalibrationInfo({ isCalibration }));
  }, []);

  const enableOrDisableToolElements = useCallback((disabled) => {
    measurementDataElements.forEach((dataElement) => {
      dispatch(
        actions.setCustomElementOverrides(dataElement, {
          disabled,
        }),
      );
    });
  }, []);

  const setSelectedScale = (scale) => dispatch(actions.setSelectedScale(scale));

  const openScaleModal = useCallback((scale) => {
    scale && setSelectedScale(new Scale(scale));
    dispatch(actions.openElements([DataElements.SCALE_MODAL]));
    dispatch(actions.setIsAddingNewScale());
  }, []);

  const onScaleSelected = useCallback((selectedScales, scale) => {
    const newScale = new Scale(scale);
    if (selectedScales.length === 1 && selectedScales.includes(scale)) {
      openScaleModal(scale);
    } else {
      const applyTo = [...annotations, selectedTool];
      const scaleToDelete = core.getDocumentViewer().getMeasurementManager().getOldScalesToDeleteAfterApplying({ scale: newScale, applyTo })[0];
      const createAndApplyScale = () => {
        core.createAndApplyScale(
          newScale,
          [...annotations, selectedTool]
        );
      };
      if (scaleToDelete) {
        confirmScaleToDelete(scaleToDelete, createAndApplyScale);
      } else {
        createAndApplyScale();
      }
    }
  }, [annotations, selectedTool]);

  const confirmScaleToDelete = (scaleToDelete, createAndApplyScale) => {
    const message = (
      <div>
        <p>
          <span>
            {t('option.measurement.deleteScaleModal.ifChangeScale')}
            <b>{scaleToDelete}</b>
            {t('option.measurement.deleteScaleModal.notUsedWillDelete')}
          </span>
        </p>
        <p>
          <span>
            {t('option.measurement.deleteScaleModal.ifToContinue')}
          </span>
        </p>
      </div>
    );
    const title = `${t('option.measurement.deleteScaleModal.deleteScale')} ${scaleToDelete}`;
    const confirmBtnText = t('action.confirm');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => createAndApplyScale()
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const onCancelCalibrationMode = useCallback((previousToolName) => {
    core.setToolMode(previousToolName);
    updateIsCalibration(false);
    dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
  }, []);

  const onApplyCalibration = useCallback((previousToolName, tempScale, isFractionalUnit) => {
    dispatch(actions.updateCalibrationInfo({ isCalibration: false, tempScale, isFractionalUnit }));
    dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
    core.setToolMode(previousToolName);
    core.deleteAnnotations([annotations[0]]);
  }, [annotations]);

  const onAddingNewScale = useCallback(() => {
    openScaleModal();
    dispatch(actions.setIsAddingNewScale(true));
  }, []);

  return !isDisabled && (
    <Draggable
      position={position}
      bounds={containerBounds()}
      onDrag={syncDraggablePosition}
      onStop={syncDraggablePosition}
      cancel={'.scale-overlay-selector, .add-new-scale'}
    >
      <div
        className={classNames({
          Overlay: true,
          ScaleOverlay: true,
          open: isOpen,
          closed: !isOpen,
        })}
        data-element={DataElements.SCALE_OVERLAY_CONTAINER}
        style={style}
        ref={containerRef}
      >
        <ScaleOverlay
          annotations={annotations}
          selectedTool={selectedTool}
          updateIsCalibration={updateIsCalibration}
          enableOrDisableToolElements={enableOrDisableToolElements}
          onScaleSelected={onScaleSelected}
          onCancelCalibrationMode={onCancelCalibrationMode}
          onApplyCalibration={onApplyCalibration}
          onAddingNewScale={onAddingNewScale}
          forceUpdate={forceUpdate}
        />
      </div>
    </Draggable>
  );
};

export default ScaleOverlayContainer;
