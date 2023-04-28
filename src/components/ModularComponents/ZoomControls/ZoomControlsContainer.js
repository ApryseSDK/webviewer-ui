import React, { useState, useEffect, useRef } from 'react';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { zoomTo, zoomIn, zoomOut } from 'helpers/zoom';
import ZoomControls from './ZoomControls';
import setFlyoutPositionOnElement from 'helpers/flyoutHelper';

const ZoomControlsContainer = ({ dataElement = 'zoom-container' }) => {
  const [zoomValue, setZoomValue] = useState('100');
  const dispatch = useDispatch();
  const elementRef = useRef();
  const [isActive, isZoomFlyoutMenuActive] = useSelector((state) => [
    selectors.isElementOpen(state, dataElement),
    selectors.isElementOpen(state, 'zoomFlyoutMenu'),
  ]);

  useEffect(() => {
    const onDocumentLoaded = () => setZoomValue(Math.ceil(core.getZoom() * 100).toString());
    const onZoomUpdated = () => {
      setZoomValue(Math.ceil(core.getZoom() * 100).toString());
      dispatch(actions.closeElements('zoomFlyoutMenu'));
    };
    const onDocumentUnloaded = () => setZoomValue('100');
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('zoomUpdated', onZoomUpdated);
    core.addEventListener('documentUnloaded', onDocumentUnloaded);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('zoomUpdated', onZoomUpdated);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
    };
  }, []);

  const onClickHandler = () => {
    dispatch(actions.toggleElement('zoomFlyoutMenu'));
  };

  const onFlyoutToggle = () => {
    setFlyoutPositionOnElement(elementRef.current, dispatch);
  };

  return (
    <ZoomControls
      elementRef={elementRef}
      getZoom={core.getZoom}
      setZoomHandler={setZoomValue}
      zoomValue={zoomValue}
      zoomTo={zoomTo}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      isZoomFlyoutMenuActive={isZoomFlyoutMenuActive}
      dataElement={dataElement}
      isActive={isActive}
      onClick={onClickHandler}
      onFlyoutToggle={onFlyoutToggle} />
  );
};

export default ZoomControlsContainer;
