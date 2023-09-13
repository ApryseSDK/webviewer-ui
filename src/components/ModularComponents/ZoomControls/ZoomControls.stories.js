import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ZoomControlsContainer from 'components/ModularComponents/ZoomControls/ZoomControlsContainer';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import rootReducer from 'reducers/rootReducer';

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
      <ZoomControlsContainer initialSize={0}/>
    </Provider>
  );
};

export const SmallSize = () => {
  return (
    <Provider store={store}>
      <FlyoutContainer/>
      <ZoomControlsContainer initialSize={1}/>
    </Provider>
  );
};
