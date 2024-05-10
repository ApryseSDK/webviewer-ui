import React, { useState, useEffect, useRef } from 'react';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { zoomTo } from 'helpers/zoom';
import ZoomControls from './ZoomControls';
import sizeManager, { useSizeStore } from 'helpers/responsivenessHelper';
import { getZoomHandlers, getZoomFlyoutItems } from 'components/ModularComponents/ZoomControls/ZoomHelper';

const ZoomControlsContainer = ({ dataElement = 'zoom-container', headerDirection }) => {
  const flyoutElement = `${dataElement}Flyout`;
  const [zoomValue, setZoomValue] = useState('100');
  const dispatch = useDispatch();
  const elementRef = useRef();
  const [isActive, isZoomFlyoutMenuActive] = useSelector((state) => [
    selectors.isElementOpen(state, dataElement),
    selectors.isElementOpen(state, flyoutElement),
  ]);

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
  useSizeStore(dataElement, size, elementRef, headerDirection);

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

  const onClickHandler = () => {
    dispatch(actions.toggleElement('zoom-containerFlyout'));
  };

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
  } = getZoomHandlers(zoomOptionsList, dispatch, size, setZoomValue);

  const getCurrentZoom = () => {
    return Math.ceil(core.getZoom() * 100).toString();
  };

  useEffect(() => {
    const zoomFlyoutMenu = {
      dataElement: flyoutElement,
      className: 'ZoomFlyoutMenu',
      items: getZoomFlyoutItems(zoomOptionsList, dispatch, size, setZoomValue)
    };
    dispatch(actions.updateFlyout(flyoutElement, zoomFlyoutMenu));
  }, [size]);

  return (
    <ZoomControls
      size={size}
      elementRef={elementRef}
      getZoom={core.getZoom}
      setZoomHandler={setZoomValue}
      zoomValue={zoomValue}
      zoomTo={zoomTo}
      getCurrentZoom={getCurrentZoom}
      onZoomInClicked={onZoomInClicked}
      onZoomOutClicked={onZoomOutClicked}
      isZoomFlyoutMenuActive={isZoomFlyoutMenuActive}
      dataElement={dataElement}
      isActive={isActive}
      onClick={onClickHandler}
      setFlyoutTriggerRef={setFlyoutTriggerRef} />
  );
};

export default ZoomControlsContainer;
