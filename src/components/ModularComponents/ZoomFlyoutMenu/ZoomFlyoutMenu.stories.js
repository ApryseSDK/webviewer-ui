import React from 'react';
import ZoomFlyoutMenu from './ZoomFlyoutMenu';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from '../Flyout/Flyout';

export default {
  title: 'ModularComponents/ZoomContainer/ZoomFlyoutMenu',
  component: ZoomFlyoutMenu,
};
const fitToWidthButton = {
  icon: 'icon-header-zoom-fit-to-width',
  label: 'action.fitToWidth',
  title: 'action.fitToWidth',
  onClick: () => console.log('Fot to width'),
  dataElement: 'fitToWidthButton'
};

const fitToPageButton = {
  icon: 'icon-header-zoom-fit-to-page',
  label: 'action.fitToPage',
  title: 'action.fitToPage',
  onClick: () => console.log('Fot to page'),
  type: 'customButton',
  dataElement: 'fitToPageButton'
};

const zoomList = [0.1, 0.25, 0.5, 1, 1.25, 1.5, 2, 4, 8, 16, 64];
const zoomItems = [
  fitToWidthButton,
  fitToPageButton
].concat(zoomList.map((zoom) => {
  return {
    label: `${zoom * 100}%`,
    onClick: () => {},
    dataElement: `zoom-button-${zoom * 100}`
  };
}));

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    customFlxPanels: [],
    zoomList: zoomList,
    flyoutMap: {
      'zoomFlyoutMenu': {
        dataElement: 'zoomFlyoutMenu',
        items: zoomItems
      }
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'zoomFlyoutMenu',
  },
};

const store = configureStore({
  reducer: () => initialState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <Flyout {...props} />
    </Provider>
  );
};

export const ZoomFlyout = BasicComponent.bind({});
ZoomFlyout.args = {
  dataElement: 'zoom-flyout-menu'
};