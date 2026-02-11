import actions from 'actions';
import ScaleOverlay from './ScaleOverlay';
import classNames from 'classnames';
import useCore from 'hooks/useCore';
import Draggable from 'react-draggable';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useReducer, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import useDraggablePosition from '../../hooks/useDraggablePosition';
import PropTypes from 'prop-types';

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

const propTypes = {
  annotations: PropTypes.array,
  selectedTool: PropTypes.object,
};

const ScaleOverlayContainer = ({ annotations, selectedTool }) => {
  const { core } = useCore();
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.SCALE_OVERLAY_CONTAINER));
  const isDisabledViewOnly = useSelector((state) => selectors.isDisabledViewOnly(state, DataElements.SCALE_OVERLAY));
  const areToolsDisabledViewOnly = useSelector((state) => {
    const annotationToolNames = [...new Set(annotations.map((annotation) => annotation.ToolName))];
    const toolNames = annotationToolNames.length > 0 ? annotationToolNames : [selectedTool?.name];
    return toolNames.some((name) => selectors.isToolDisabledViewOnly(state, name));
  });
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.SCALE_OVERLAY_CONTAINER));
  const initialPosition = useSelector((state) => selectors.getScaleOverlayPosition(state));
  const { position, handleDrag, handleStop, containerRef, setOverlayRef, initialOffset, dragBounds, resetPosition } = useDraggablePosition(initialPosition);
  const [, forceUpdate] = useReducer((x) => x + 1, 0, () => 0);
  const [scales, setScales] = useState({});
  const scalesInfo = useMemo(() => {
    const scaleInfoList = [];
    if (!scales || Object.keys(scales).length === 0) {
      return scaleInfoList;
    }

    Object.keys(scales).forEach((scaleKey) => {
      const scaleData = scales[scaleKey];

      if (!scaleData || scaleData.length === 0) {
        console.warn(`No measurements found for scale ${scaleKey}`);
        return;
      }

      const measurements = [];
      const relatedPages = new Set();
      let canDelete = true;

      scaleData.forEach((measurementItem) => {
        const isAnnotation = measurementItem instanceof window.Core.Annotations.Annotation;
        if (!isAnnotation) {
          return;
        }

        relatedPages.add(measurementItem['PageNumber']);
        measurements.push(measurementItem);

        if (!core.canModify(measurementItem)) {
          canDelete = false;
        }
      });

      scaleInfoList.push({
        scale: new Scale(scaleKey),
        title: scaleKey,
        measurementsNum: measurements.length,
        pages: [...relatedPages],
        canDelete
      });
    });

    return scaleInfoList;
  }, [core, scales]);

  useEffect(() => {
    resetPosition();
  }, [initialPosition, resetPosition]);

  const updateIsCalibration = useCallback((isCalibration) => {
    dispatch(actions.updateCalibrationInfo({ isCalibration }));
  }, []);

  const disableToolElements = useCallback((disabled) => {
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
    dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
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
    updateIsCalibration(false);
    dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
    core.setToolMode(previousToolName);
  }, []);

  const onApplyCalibration = useCallback((previousToolName, tempScale, isFractionalUnit) => {
    dispatch(actions.updateCalibrationInfo({ isCalibration: false, tempScale, isFractionalUnit }));
    dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
    core.setToolMode(previousToolName);
    core.deleteAnnotations([annotations[0]]);
  }, [annotations]);

  const onAddingNewScale = useCallback(() => {
    dispatch(actions.setIsAddingNewScale(true));
    openScaleModal();
  }, []);

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
    updateScales();

    return () => {
      core.removeEventListener('scaleUpdated', onScaleUpdated);
      core.removeEventListener('createAnnotationWithNoScale', onCreateAnnotationWithNoScale);
      core.removeEventListener('annotationsLoaded', updateScales);
      core.removeEventListener('annotationChanged', updateScales);
    };
  }, [core, onAddingNewScale]);

  const isMobile = isMobileSize();

  if (isDisabled || isDisabledViewOnly || areToolsDisabledViewOnly) {
    return null;
  }

  if (isMobile) {
    return (
      <MobilePopupWrapper>
        <ScaleOverlay
          annotations={annotations}
          selectedTool={selectedTool}
          scales={scales}
          scalesInfo={scalesInfo}
          updateIsCalibration={updateIsCalibration}
          disableToolElements={disableToolElements}
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
    return (
      <Draggable
        position={position}
        bounds={dragBounds}
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
          style={initialOffset}
          ref={(node) => {
            containerRef.current = node;
            setOverlayRef(node);
          }}
        >
          <ScaleOverlay
            annotations={annotations}
            selectedTool={selectedTool}
            scales={scales}
            scalesInfo={scalesInfo}
            updateIsCalibration={updateIsCalibration}
            disableToolElements={disableToolElements}
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

ScaleOverlayContainer.propTypes = propTypes;

export default ScaleOverlayContainer;
