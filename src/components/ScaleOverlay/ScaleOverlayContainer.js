import actions from 'actions';
import ScaleOverlay from './ScaleOverlay';
import classNames from 'classnames';
import core from 'core';
import Draggable from 'react-draggable';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import useDraggablePosition from '../../hooks/useDraggablePosition';

import './ScaleOverlay.scss';

import MobilePopupWrapper from '../MobilePopupWrapper';
import { isMobileSize } from 'helpers/getDeviceSize';

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
  const { position, handleDrag, handleStop, containerRef, style, bounds, resetPosition } = useDraggablePosition(initialPosition);
  const [, forceUpdate] = useReducer((x) => x + 1, 0, () => 0);

  useEffect(() => {
    resetPosition();
  }, [initialPosition, resetPosition]);

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
      <div className='customMessage'>
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

  const isMobile = isMobileSize();

  if (isMobile) {
    return !isDisabled && (
      <MobilePopupWrapper>
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
          tabIndex={0}
        />
      </MobilePopupWrapper>
    );
  } else {
    return !isDisabled && (
      <Draggable
        position={position}
        bounds={bounds}
        onDrag={handleDrag}
        onStop={handleStop}
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
            tabIndex={0}
          />
        </div>
      </Draggable>
    );
  }
};

export default ScaleOverlayContainer;
