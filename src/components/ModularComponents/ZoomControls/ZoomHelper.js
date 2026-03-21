import { fitToWidth, fitToPage, zoomTo, zoomIn, zoomOut } from 'helpers/zoom';
import actions from 'actions';
import { FLYOUT_ITEM_TYPES } from 'src/constants/customizationVariables';
import core from 'core';
import selectors from 'selectors';

const noop = () => {
};
export const getZoomFlyoutItems = ({
  zoomOptionsList,
  store,
  isSpreadsheetEditorMode = false,
  isOfficeEditorMode = false,
  size = 0,
  onZoomChanged = noop,
}) => {
  const { dispatch } = store;
  const state = store.getState();
  const documentViewerKey = selectors.getActiveDocumentViewerKey(state);
  const {
    onMarqueeZoom,
    onZoomInClicked,
    onZoomOutClicked,
    onClickZoomLevelOption
  } = getZoomHandlers(store, size, onZoomChanged);

  const fitToWidthButton = {
    icon: 'icon-header-zoom-fit-to-width',
    label: 'action.fitToWidth',
    title: 'action.fitToWidth',
    dataElement: 'fitToWidthButton',
    onClick: () => {
      fitToWidth(documentViewerKey);
      dispatch(actions.closeElement('zoom-containerFlyout'));
    },
  };
  const fitToPageButton = {
    icon: 'icon-header-zoom-fit-to-page',
    label: 'action.fitToPage',
    title: 'action.fitToPage',
    dataElement: 'fitToPageButton',
    onClick: () => {
      fitToPage(documentViewerKey);
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

export const getZoomHandlers = (store, size = 0, onZoomChanged = noop) => {
  const { dispatch } = store;
  const state = store.getState();
  const isMultViewerMode = selectors.isMultiViewerMode(state);
  const documentViewerKey = selectors.getActiveDocumentViewerKey(state);
  const onClickZoomLevelOption = (zoomLevel) => {
    zoomTo(zoomLevel, isMultViewerMode, documentViewerKey);
    (size === 0 || size === 1) && dispatch(actions.closeElement('zoom-containerFlyout'));
  };

  const onMarqueeZoom = () => {
    dispatch(actions.closeElement('zoom-containerFlyout'));
  };

  const getCurrentZoom = () => {
    return Math.ceil(core.getZoom(documentViewerKey) * 100).toString();
  };

  const onZoomInClicked = () => {
    zoomIn(isMultViewerMode, documentViewerKey);
    onZoomChanged(getCurrentZoom());
  };

  const onZoomOutClicked = () => {
    zoomOut(isMultViewerMode, documentViewerKey);
    onZoomChanged(getCurrentZoom());
  };

  return {
    onZoomInClicked,
    onZoomOutClicked,
    onMarqueeZoom,
    onClickZoomLevelOption,
  };
};