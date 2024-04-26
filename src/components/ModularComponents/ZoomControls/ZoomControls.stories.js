import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ZoomControlsContainer from 'components/ModularComponents/ZoomControls/ZoomControlsContainer';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import App from 'components/App';
import initialState from 'src/redux/initialState';
import PropTypes from 'prop-types';

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
      <ZoomControlsContainer/>
    </Provider>
  );
};

export const SmallSize = () => {
  useEffect(() => {
    store.dispatch(actions.setCustomElementSize('zoom-container', 1));
    return () => store.dispatch(actions.setCustomElementSize('zoom-container', 0));
  }, []);
  return (
    <Provider store={store}>
      <FlyoutContainer/>
      <ZoomControlsContainer/>
    </Provider>
  );
};

const MockApp = ({ mockState }) => {
  return (
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: mockState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}
    >
      <App removeEventHandlers={() => { }} />
    </Provider>
  );
};

MockApp.propTypes = {
  mockState: PropTypes.object,
};

const stateWithFlyoutOpen = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    activeFlyout: 'zoom-containerFlyout',
    flyoutToggleElement: 'zoom-container',
    openElements: {
      ...initialState.viewer.openElements,
      'zoom-containerFlyout': true,
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};

export const OpenWithMockApp = () => {
  return <MockApp mockState={stateWithFlyoutOpen} />;
};

OpenWithMockApp.parameters = {
  layout: 'fullscreen',
};