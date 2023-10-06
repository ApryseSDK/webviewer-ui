import React, { useState, useEffect, useRef } from 'react';
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { zoomTo, zoomIn, zoomOut, fitToWidth, fitToPage } from 'helpers/zoom';
import ZoomControls from './ZoomControls';

const ZoomControlsContainer = ({ dataElement = 'zoom-container', initialSize = 0 }) => {
  // TODO: remove ignore below after resizing algorithm is implemented
  // eslint-disable-next-line no-unused-vars
  const [size, setSize] = useState(initialSize);
  const [zoomValue, setZoomValue] = useState('100');
  const dispatch = useDispatch();
  const elementRef = useRef();
  const [isActive, isZoomFlyoutMenuActive] = useSelector((state) => [
    selectors.isElementOpen(state, dataElement),
    selectors.isElementOpen(state, 'zoomFlyoutMenu'),
  ]);

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
      size === 0 && dispatch(actions.closeElements('zoomFlyoutMenu'));
    };

    core.addEventListener('zoomUpdated', onZoomUpdated);
    return () => core.removeEventListener('zoomUpdated', onZoomUpdated);
  }, [size]);

  const onClickHandler = () => {
    dispatch(actions.toggleElement('zoomFlyoutMenu'));
  };

  const onFlyoutToggle = () => {
    dispatch(actions.setFlyoutToggleElement(elementRef.current));
  };

  const [zoomOptionsList, currentFlyout] = useSelector((state) => [
    selectors.getZoomList(state),
    selectors.getFlyout(state, 'zoomFlyoutMenu')
  ]);

  const onClickZoomLevelOption = (zoomLevel) => {
    zoomTo(zoomLevel);
    size === 0 && dispatch(actions.closeElement('zoomFlyoutMenu'));
  };

  const onMarqueeZoom = () => {
    dispatch(actions.closeElement('zoomFlyoutMenu'));
  };

  const getCurrentZoom = () => {
    return Math.ceil(core.getZoom() * 100).toString();
  };

  const onZoomInClicked = () => {
    zoomIn();
    setZoomValue(getCurrentZoom());
  };

  const onZoomOutClicked = () => {
    zoomOut();
    setZoomValue(getCurrentZoom());
  };


  const getZoomItems = () => {
    const fitToWidthButton = {
      icon: 'icon-header-zoom-fit-to-width',
      label: 'action.fitToWidth',
      title: 'action.fitToWidth',
      onClick: fitToWidth,
      dataElement: 'fitToWidthButton'
    };
    const fitToPageButton = {
      icon: 'icon-header-zoom-fit-to-page',
      label: 'action.fitToPage',
      title: 'action.fitToPage',
      onClick: fitToPage,
      type: 'customButton',
      dataElement: 'fitToPageButton'
    };
    const marqueeButton = {
      icon: 'icon-header-zoom-marquee',
      toolName: 'MarqueeZoomTool',
      label: 'tool.Marquee',
      onClick: onMarqueeZoom,
      dataElement: 'marqueeButton'
    };
    const zoomInButton = {
      icon: 'icon-header-zoom-in-line',
      label: 'action.zoomIn',
      dataElement: 'zoomInButton',
      onClick: onZoomInClicked,
    };
    const zoomOutButton = {
      icon: 'icon-header-zoom-out-line',
      label: 'action.zoomOut',
      dataElement: 'zoomOutButton',
      onClick: onZoomOutClicked,
    };

    let zoomItems;
    if (size === 0) {
      const divider = 'divider';
      zoomItems = [fitToWidthButton, fitToPageButton, divider];
      zoomOptionsList.forEach((zoomValue) => {
        const item = {
          label: `${zoomValue * 100}%`,
          onClick: () => {
            onClickZoomLevelOption(zoomValue);
          },
          dataElement: `zoom-button-${zoomValue * 100}`
        };
        zoomItems.push(item);
      });
      zoomItems.push(divider);
      zoomItems.push(marqueeButton);
    } else if (size === 1) {
      const zoomOptionsItem = {
        dataElement: 'zoomOptionsButton',
        children: zoomOptionsList.map((zoomValue) => {
          return {
            label: `${zoomValue * 100}%`,
            onClick: () => {
              onClickZoomLevelOption(zoomValue);
            },
            dataElement: `zoom-button-${zoomValue * 100}`
          };
        }),
      };
      zoomItems = [zoomOptionsItem, zoomInButton, zoomOutButton, fitToWidthButton, fitToPageButton, marqueeButton];
    }
    return zoomItems;
  };

  useEffect(() => {
    const zoomFlyoutMenu = {
      dataElement: 'zoomFlyoutMenu',
      className: 'ZoomFlyoutMenu',
      items: getZoomItems()
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(zoomFlyoutMenu));
    } else {
      dispatch(actions.updateFlyout(zoomFlyoutMenu.dataElement, zoomFlyoutMenu));
    }
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
      onFlyoutToggle={onFlyoutToggle} />
  );
};

export default ZoomControlsContainer;
