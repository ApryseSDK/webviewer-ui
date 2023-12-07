import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import WatermarkPanel from './WatermarkPanel';
import initialState from 'src/redux/initialState';
import RightPanel from 'components/RightPanel';

export default {
  title: 'Components/WatermarkPanel',
  component: WatermarkPanel,
};

const noop = () => { };

const WatermarkPanelStoryWrapper = ({ children }) => {
  const state = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      openElements: {
        ...initialState.viewer.openElements,
        watermarkPanel: true,
      },
    },
  };
  const store = configureStore({
    preloadedState: state,
    reducer: rootReducer,
  });
  return (
    <Provider store={store}>
      <RightPanel
        dataElement="watermarkPanel"
        onResize={noop}
      >
        <div className="Panel WatermarkPanel" style={{ width: '330px', minWidth: '$330px' }}>
          {children}
        </div>
      </RightPanel>
    </Provider >
  );
};

export function Basic() {
  return (
    <WatermarkPanelStoryWrapper>
      <WatermarkPanel />
    </WatermarkPanelStoryWrapper>
  );
}
