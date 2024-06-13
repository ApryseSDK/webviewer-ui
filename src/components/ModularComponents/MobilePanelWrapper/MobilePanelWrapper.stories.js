import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MobilePanelWrapper from './MobilePanelWrapper';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import { isMobileSize } from 'helpers/getDeviceSize';


export default {
  title: 'ModularComponents/MobilePanel',
  component: MobilePanelWrapper,
  parameters: {
    ...window.storybook.MobileParameters,
    customizableUI: true,
  },
};

const store = configureStore({
  reducer: rootReducer,
});

export const MobilePanel = () => {
  useEffect(() => {
    store.dispatch(actions.openElement('MobilePanelWrapper'));
  }, []);
  if (!isMobileSize()) {
    return <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'red',
        opacity: '15%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
      }}
    >
      VIEW THIS STORY IN MOBILE MODE
    </div>;
  }
  return (
    <Provider store={store}>
      <MobilePanelWrapper/>
    </Provider>
  );
};