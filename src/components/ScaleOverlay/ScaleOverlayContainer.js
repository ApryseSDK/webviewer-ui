import actions from 'actions';
import ScaleOverlay from './ScaleOverlay';
import classNames from 'classnames';
import core from 'core';
import Draggable from 'react-draggable';
import selectors from 'selectors';
import useOnMeasurementToolOrAnnotationSelected from '../../hooks/useOnMeasurementToolOrAnnotationSelected';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef, useCallback } from 'react';
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

const ScaleOverlayContainer = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const { annotations, selectedTool } = useOnMeasurementToolOrAnnotationSelected();

  const [
    documentContainerWidth,
    documentContainerHeight
  ] = useSelector((state) => [
    selectors.getDocumentContainerWidth(state),
    selectors.getDocumentContainerHeight(state)
  ]);

  const containerRef = useRef(null);

  const documentElement = core.getViewerElement();

  useEffect(() => {
    if ((annotations.length || selectedTool) && documentElement?.offsetWidth) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [annotations, selectedTool, documentElement?.offsetWidth]);

  const calculateStyle = () => {
    const offset = {
      left: documentContainerWidth * DEFAULT_WIDTH_RATIO,
      top: documentElement?.offsetTop + DEFAULT_DISTANCE || DEFAULT_CONTAINER_TOP_OFFSET,
    };

    if (documentElement && containerRef?.current) {
      offset.left = Math.min(
        documentElement?.offsetLeft + documentElement?.offsetWidth + DEFAULT_DISTANCE || offset.left,
        documentContainerWidth - containerRef.current.getBoundingClientRect().width,
      );
    }
    return offset;
  };
  const style = calculateStyle();

  const containerBounds = () => {
    const bounds = {
      top: 0,
      bottom: documentContainerHeight - DEFAULT_CONTAINER_TOP_OFFSET,
      left: 0 - documentContainerWidth,
      right: documentContainerWidth / 3,
    };
    if (style) {
      bounds.right = documentContainerWidth - style['left'] - DEFAULT_CONTAINER_RIGHT_OFFSET;
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
    dispatch(actions.openElements([DataElements.SCALE_MODAL]));
  }, []);

  const onApplyCalibration = useCallback((previousToolName, tempScale, isFractionalUnit) => {
    setSelectedScale(new Scale(tempScale));
    dispatch(actions.updateCalibrationInfo({ isCalibration: false, tempScale, isFractionalUnit }));
    dispatch(actions.openElements([DataElements.SCALE_MODAL]));
    core.setToolMode(previousToolName);
    core.deleteAnnotations([annotations[0]]);
  }, [annotations]);

  const onAddingNewScale = useCallback(() => {
    openScaleModal();
    dispatch(actions.setIsAddingNewScale(true));
  }, []);

  return (
    <Draggable
      position={position}
      bounds={containerBounds()}
      onDrag={syncDraggablePosition}
      onStop={syncDraggablePosition}
      cancel={'.scale-overlay-selector'}
    >
      <div
        className={classNames({
          Overlay: true,
          ScaleOverlay: true,
          open: false,
          closed: !isOpen,
        })}
        data-element="scaleOverlayContainer"
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
        />
      </div>
    </Draggable>
  );
};

export default ScaleOverlayContainer;
