import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { expect, within } from 'storybook/test';

import actions from 'actions';
import LoadingScreenContexts from 'constants/loadingScreenContexts';
import LoadingScreenStyles from 'constants/loadingScreenStyles';
import rootReducer from 'reducers/rootReducer';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import LoadingScreen from './LoadingScreen';

export default {
  title: 'Components/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
    legacyUI: true,
  },
};

const getStore = (loadingScreenStyle, loadingScreenContext, openElement) => {
  const store = configureStore({
    reducer: rootReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
  });
  store.dispatch(actions.setLoadingScreenStyle(loadingScreenStyle));
  if (loadingScreenContext === LoadingScreenContexts.DOCUMENT) {
    store.dispatch(actions.openDocumentLoadingScreen());
  } else {
    store.dispatch(actions.openElement(openElement));
  }
  return store;
};

const Template = (args) => (
  <Provider store={getStore(args.loadingScreenStyle, args.loadingScreenContext, args.openElement)}>
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <LoadingScreen />
    </div>
  </Provider>
);

export const Skeleton = Template.bind({});
Skeleton.args = {
  loadingScreenStyle: LoadingScreenStyles.SKELETON,
  loadingScreenContext: LoadingScreenContexts.DOCUMENT,
};

export const LegacySpinner = Template.bind({});
LegacySpinner.args = {
  loadingScreenStyle: LoadingScreenStyles.LEGACY,
  loadingScreenContext: LoadingScreenContexts.DOCUMENT,
};
LegacySpinner.parameters = {
  chromatic: { disableSnapshot: true },
};

Skeleton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loadingDocumentText = getTranslatedText('message.loadingDocument');
  const loadingStatus = canvas.getByRole('status', { name: loadingDocumentText });

  expect(loadingStatus).toHaveAttribute('aria-busy', 'true');
};

LegacySpinner.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loadingDocumentText = getTranslatedText('message.loadingDocument');

  expect(canvas.getByRole('progressbar', { name: loadingDocumentText })).toBeInTheDocument();
};
