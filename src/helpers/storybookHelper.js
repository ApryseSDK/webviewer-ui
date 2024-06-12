import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import App from 'components/App';
import rootReducer from 'reducers/rootReducer';
import initialState from 'src/redux/initialState';
import { defaultPanels } from 'src/redux/modularComponents';

const noop = () => { };

export const createStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });
};

export const MockApp = ({ initialState }) => {
  return (
    <Provider store={createStore(initialState)}>
      <App removeEventHandlers={noop} />
    </Provider>
  );
};

MockApp.propTypes = {
  initialState: PropTypes.object.isRequired,
};

const BasicAppTemplate = (args) => {
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: args.headers,
      modularComponents: args.components,
      flyoutMap: args.flyoutMap,
      openElements: {},
      genericPanels: defaultPanels,
      activeGroupedItems: ['annotateGroupedItems'],
      lastPickedToolForGroupedItems: {
        annotateGroupedItems: 'AnnotationCreateTextUnderline',
      },
      activeCustomRibbon: 'annotations-ribbon-item',
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateTextUnderline',
        group: ['annotateGroupedItems'],
      },
      activeToolName: 'AnnotationCreateTextUnderline'
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithHeaders} />;
};

export const createTemplate = ({ headers = {}, components = {}, flyoutMap = {} }) => {
  const template = BasicAppTemplate.bind({});
  template.args = { headers, components, flyoutMap };
  template.parameters = { layout: 'fullscreen', customizableUI: true };
  return template;
};