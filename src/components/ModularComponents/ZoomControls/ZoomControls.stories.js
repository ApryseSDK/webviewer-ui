import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ZoomControlsContainer from 'components/ModularComponents/ZoomControls/ZoomControlsContainer';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import rootReducer from 'reducers/rootReducer';
import { MockApp } from 'helpers/storybookHelper';
import actions from 'actions';
import initialState from 'src/redux/initialState';
import { expect } from '@storybook/test';
import core from 'core';
import { workerTypes } from 'src/constants/types';

export default {
  title: 'ModularComponents/ZoomControls',
  component: ZoomControlsContainer,
};

const store = configureStore({
  reducer: rootReducer,
});

export const FullSize = () => {
  return (
    <Provider store={store}>
      <FlyoutContainer/>
      <ZoomControlsContainer className='zoom-full-size' />
    </Provider>
  );
};

FullSize.play = async ({ canvasElement }) => {
  const zoomContainer = canvasElement.querySelector('.ZoomContainerWrapper');
  expect(zoomContainer.classList.contains('zoom-full-size')).toBe(true);
};

export const SmallSize = () => {
  useEffect(() => {
    store.dispatch(actions.setCustomElementSize('zoom-container', 1));
    return () => store.dispatch(actions.setCustomElementSize('zoom-container', 0));
  }, []);
  return (
    <Provider store={store}>
      <FlyoutContainer/>
      <ZoomControlsContainer />
    </Provider>
  );
};

export const ZoomInSheetEditorMode = () => {
  let preloadedState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isSpreadsheetEditorModeEnabled: true,
    },
  };

  const store = configureStore({
    preloadedState: preloadedState,
    reducer: rootReducer,
  });

  return (
    <Provider store={store}>
      <FlyoutContainer/>
      <ZoomControlsContainer />
    </Provider>
  );
};

export const ZoomInOfficeEditorMode = (args, context) => {
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => {},
    removeEventListener: () => {},
    getOfficeEditor: () => {},
  });

  return <MockApp initialState={getStateWithFlyoutOpen(context)} />;
};

ZoomInOfficeEditorMode.parameters = {
  layout: 'fullscreen',
};

const getStateWithFlyoutOpen = (context) => {
  return {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeFlyout: 'zoom-containerFlyout',
      flyoutToggleElement: 'zoom-container',
      openElements: {
        ...initialState.viewer.openElements,
        'zoom-containerFlyout': true,
      },
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
};

export const OpenWithMockApp = (args, context) => {
  return <MockApp initialState={getStateWithFlyoutOpen(context)} />;
};

OpenWithMockApp.parameters = {
  layout: 'fullscreen',
};