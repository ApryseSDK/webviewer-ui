import { fitToWidth, fitToPage, zoomTo, zoomIn, zoomOut } from 'helpers/zoom';
import actions from 'actions';
import core from 'core';
import { FLYOUT_ITEM_TYPES } from 'src/constants/customizationVariables';

const noop = () => {
};
export const getZoomFlyoutItems = ({
  zoomOptionsList,
  isSpreadsheetEditorMode = false,
  isOfficeEditorMode = false,
  dispatch,
  size = 0,
  onZoomChanged = noop
}) => {
  const {
    onMarqueeZoom,
    onZoomInClicked,
    onZoomOutClicked,
    onClickZoomLevelOption
  } = getZoomHandlers(dispatch, size, onZoomChanged);

  const fitToWidthButton = {
    icon: 'icon-header-zoom-fit-to-width',
    label: 'action.fitToWidth',
    title: 'action.fitToWidth',
    dataElement: 'fitToWidthButton',
    onClick: () => {
      fitToWidth();
      dispatch(actions.closeElement('zoom-containerFlyout'));
    },
  };
  const fitToPageButton = {
    icon: 'icon-header-zoom-fit-to-page',
    label: 'action.fitToPage',
    title: 'action.fitToPage',
    dataElement: 'fitToPageButton',
    onClick: () => {
      fitToPage();
      dispatch(actions.closeElement('zoom-containerFlyout'));
    },
    type: 'customButton',
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

  const transformedZoomOptionsList = [];
  zoomOptionsList.forEach((zoomValue) => {
    const item =  {
      label: `${zoomValue * 100}%`,
      onClick: () => {
        onClickZoomLevelOption(zoomValue);
      },
      dataElement: `zoom-button-${zoomValue * 100}`,
    };
    if (isSpreadsheetEditorMode && zoomValue <= 2) {
      transformedZoomOptionsList.push(item);
    }
    if (!isSpreadsheetEditorMode) {
      transformedZoomOptionsList.push(item);
    }
  });

  let zoomItems;
  if (size === 0) {
    const divider = 'divider';
    zoomItems = isSpreadsheetEditorMode
      ? []
      : [fitToWidthButton, fitToPageButton, divider];

    zoomItems = zoomItems.concat(transformedZoomOptionsList);

    if (!isSpreadsheetEditorMode && !isOfficeEditorMode) {
      zoomItems.push(divider);
      zoomItems.push(marqueeButton);
    }
  } else if (size === 1) {
    const zoomOptionsItem = {
      dataElement: FLYOUT_ITEM_TYPES.ZOOM_OPTIONS_BUTTON,
      children: transformedZoomOptionsList,
      type: FLYOUT_ITEM_TYPES.ZOOM_OPTIONS_BUTTON,
    };

    zoomItems = [zoomOptionsItem, zoomInButton, zoomOutButton, fitToWidthButton, fitToPageButton, marqueeButton];
    if (isSpreadsheetEditorMode) {
      zoomItems = [zoomOptionsItem, zoomInButton, zoomOutButton];
    }
    if (isOfficeEditorMode) {
      zoomItems = [zoomOptionsItem, zoomInButton, zoomOutButton, fitToWidthButton, fitToPageButton];
    }
  }
  return zoomItems;
};

export const getZoomHandlers = (dispatch, size = 0, onZoomChanged = noop) => {
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