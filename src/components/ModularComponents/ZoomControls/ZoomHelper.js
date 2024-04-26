import { fitToWidth, fitToPage, zoomTo, zoomIn, zoomOut } from 'helpers/zoom';
import actions from 'actions';
import core from 'core';

const noop = () => {
};
export const getZoomFlyoutItems = (zoomOptionsList, dispatch, size = 0, onZoomChanged = noop) => {
  const {
    onMarqueeZoom,
    onZoomInClicked,
    onZoomOutClicked,
    onClickZoomLevelOption
  } = getZoomHandlers(zoomOptionsList, dispatch, size, onZoomChanged);

  const fitToWidthButton = {
    icon: 'icon-header-zoom-fit-to-width',
    label: 'action.fitToWidth',
    title: 'action.fitToWidth',
    onClick: () => {
      fitToWidth();
      dispatch(actions.closeElement('zoom-containerFlyout'));
    },
    className: 'fitToWidthButton',
  };
  const fitToPageButton = {
    icon: 'icon-header-zoom-fit-to-page',
    label: 'action.fitToPage',
    title: 'action.fitToPage',
    onClick: () => {
      fitToPage();
      dispatch(actions.closeElement('zoom-containerFlyout'));
    },
    type: 'customButton',
    className: 'fitToPageButton'
  };
  const marqueeButton = {
    dataElement: 'zoom-button-marquee-zoom',
    icon: 'icon-header-zoom-marquee',
    toolName: 'MarqueeZoomTool',
    label: 'tool.Marquee',
    onClick: onMarqueeZoom,
    className: 'marqueeButton',
  };
  const zoomInButton = {
    icon: 'icon-header-zoom-in-line',
    label: 'action.zoomIn',
    dataElement: 'zoomInButton',
    onClick: onZoomInClicked,
    className: 'zoomInButton'
  };
  const zoomOutButton = {
    icon: 'icon-header-zoom-out-line',
    label: 'action.zoomOut',
    dataElement: 'zoomOutButton',
    onClick: onZoomOutClicked,
    className: 'zoomOutButton'
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

export const getZoomHandlers = (zoomOptionsList, dispatch, size = 0, onZoomChanged = noop) => {
  const onClickZoomLevelOption = (zoomLevel) => {
    zoomTo(zoomLevel);
    (size === 0 || size === 1) && dispatch(actions.closeElement('zoom-containerFlyout'));
  };

  const onMarqueeZoom = () => {
    dispatch(actions.closeElement('zoom-containerFlyout'));
  };

  const getCurrentZoom = () => {
    return Math.ceil(core.getZoom() * 100).toString();
  };

  const onZoomInClicked = () => {
    zoomIn();
    onZoomChanged(getCurrentZoom());
  };

  const onZoomOutClicked = () => {
    zoomOut();
    onZoomChanged(getCurrentZoom());
  };

  return {
    onZoomInClicked,
    onZoomOutClicked,
    onMarqueeZoom,
    onClickZoomLevelOption,
  };
};