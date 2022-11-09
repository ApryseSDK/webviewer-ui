import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import WatermarkPanel from './WatermarkPanel';
import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState';
import RightPanel from 'components/RightPanel';

export default {
  title: 'Components/WatermarkPanel',
  component: WatermarkPanel,
};

// Mock some state to show the style popups
initialState.viewer.openElements.watermarkPanel = true;

const noop = () => { };

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer),
});
const store = createStore(reducer);

const WatermarkPanelStoryWrapper = ({ children }) => {
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
