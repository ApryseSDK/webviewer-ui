import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import App from 'components/App';
import RubberStampPanel from './RubberStampPanel';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import PropTypes from 'prop-types';

export default {
  title: 'ModularComponents/RubberStampPanel',
  component: RubberStampPanel,
};

const createStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
};

const MockApp = ({ store }) => (
  <Provider store={store}>
    <App removeEventHandlers={() => { }} />
  </Provider>
);

MockApp.propTypes = {
  store: PropTypes.object.isRequired,
};

const RubberStampPanelInApp = (location,) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'rubberStampPanel',
        render: 'rubberStampPanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        rubberStampPanel: true,
      },
      lastPickedToolForGroupedItems: {
        'insertGroupedItems': 'AnnotationCreateRubberStamp'
      },
      activeGroupedItems: ['insertGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Insert',
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateRubberStamp',
        group: ['insertGroupedItems'],
      },
      activeToolName: 'AnnotationCreateRubberStamp'
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp store={store} />;
};

export const RubberStampPanelInleft = () => RubberStampPanelInApp('left');
export const RubberStampPanelInRight = () => RubberStampPanelInApp('right');
export const RubberStampPanelInMobile = () => RubberStampPanelInApp();

RubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInRight.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInMobile.parameters = window.storybook.MobileParameters;