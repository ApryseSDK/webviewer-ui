import React, { useState, useEffect, useRef } from 'react';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { zoomTo } from 'helpers/zoom';
import ZoomControls from './ZoomControls';
import sizeManager, { useSizeStore } from 'helpers/responsivenessHelper';
import { getZoomHandlers, getZoomFlyoutItems } from 'components/ModularComponents/ZoomControls/ZoomHelper';
import PropTypes from 'prop-types';

const ZoomControlsContainer = ({ dataElement = 'zoom-container', headerDirection, className }) => {
  const flyoutElement = `${dataElement}Flyout`;
  const [zoomValue, setZoomValue] = useState('100');
  const dispatch = useDispatch();
  const elementRef = useRef();

  const isActive = useSelector((state) => selectors.isElementOpen(state, dataElement));
  const isZoomFlyoutMenuActive = useSelector((state) => selectors.isElementOpen(state, flyoutElement));
  const isSpreadsheetEditorMode = useSelector((state) => selectors.isSpreadsheetEditorModeEnabled(state));
  const size = useSelector((state) => selectors.getCustomElementSize(state, dataElement));

  useEffect(() => {
    sizeManager[dataElement] = {
      ...(sizeManager[dataElement] ? sizeManager[dataElement] : {}),
      canGrow: size === 1,
      canShrink: size === 0,
      grow: () => {
        dispatch(actions.setCustomElementSize(dataElement, 0));
      },
      shrink: () => {
        dispatch(actions.setCustomElementSize(dataElement, 1));
      },
      size: size,
    };
  }, [size]);
  useSizeStore({ dataElement, elementRef, headerDirection });

  useEffect(() => {
    const onDocumentLoaded = () => setZoomValue(Math.ceil(core.getZoom() * 100).toString());
    const onDocumentUnloaded = () => setZoomValue('100');
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('documentUnloaded', onDocumentUnloaded);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
    };
  }, []);

  useEffect(() => {
    const onZoomUpdated = () => {
      setZoomValue(Math.ceil(core.getZoom() * 100).toString());
    };

    core.addEventListener('zoomUpdated', onZoomUpdated);
    return () => core.removeEventListener('zoomUpdated', onZoomUpdated);
  }, [size]);

  // This is necessary because the button triggering the flyout menu is not the element we want to set as the trigger for positioning it
  const setFlyoutTriggerRef = () => {
    const dataElement = elementRef.current.getAttribute('data-element');
    dispatch(actions.setFlyoutToggleElement(dataElement));
  };

  const [zoomOptionsList] = useSelector((state) => [
    selectors.getZoomList(state),
  ]);

  const {
    onZoomInClicked,
    onZoomOutClicked,
  } = getZoomHandlers(dispatch, size, setZoomValue);

  const getCurrentZoom = () => {
    return Math.ceil(core.getZoom() * 100).toString();
  };

  useEffect(() => {
    const zoomFlyoutMenu = {
      dataElement: flyoutElement,
      className: 'ZoomFlyoutMenu',
      items: getZoomFlyoutItems({ zoomOptionsList, isSpreadsheetEditorMode, dispatch, size, onZoomChanged: setZoomValue })
    };
    dispatch(actions.updateFlyout(flyoutElement, zoomFlyoutMenu));
  }, [size]);

  const zoomProps = {
    isActive: isActive,
    isZoomFlyoutMenuActive: isZoomFlyoutMenuActive,
    getZoom: core.getZoom,
    setZoomHandler: setZoomValue,
    zoomValue: zoomValue,
    zoomTo: zoomTo,
    getCurrentZoom: getCurrentZoom,
    onZoomInClicked: onZoomInClicked,
    onZoomOutClicked: onZoomOutClicked,
    setFlyoutTriggerRef: setFlyoutTriggerRef,
    size: size,
    className: className
  };
  return (
    <ZoomControls
      dataElement={dataElement}
      elementRef={elementRef}
      componentProps={zoomProps}
    />
  );
};

ZoomControlsContainer.propTypes = {
  dataElement: PropTypes.string,
  headerDirection: PropTypes.string,
  className: PropTypes.string,
};

export default ZoomControlsContainer;
