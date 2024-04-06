import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from 'components/App';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';

export default {
  title: 'ModularComponents/App',
  component: App,
};

const noop = () => { };

const MockApp = ({ initialState }) => {
  return (
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <App removeEventHandlers={noop} />
    </Provider>
  );
};

const Template = (args) => {
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: args.headers,
      modularComponents: args.components,
      openElements: {},
      genericPanels: [{
        dataElement: 'stylePanel',
        render: 'stylePanel',
        location: 'left',
      }],
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

function createTemplate({ headers, components }) {
  const template = Template.bind({});
  template.args = { headers, components };
  template.parameters = { layout: 'fullscreen' };
  return template;
}

export const DefaultUI = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

