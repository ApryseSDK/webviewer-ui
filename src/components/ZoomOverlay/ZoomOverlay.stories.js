import React from 'react';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import ZoomOverlay from './ZoomOverlay.js';

export default {
  title: 'Components/ZoomOverlay',
  component: ZoomOverlay
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: ['zoomOverlay'],
    colorMap: [{colorMapKey: '#F1A099'}],
    toolButtonObjects: {MarqueeZoomTool: { dataElement: 'marqueeToolButton', showColor: 'never' }},
    customElementOverrides: [{marqueeToolButton: {disabled: true}}]
  }
};
function rootReducer(state = initialState, action) {
  return state;
}
const store = createStore(rootReducer);

function onClickZoomLevelOption() {
  console.log('onClickZoomLevelOption');
}

function fitToWidth() {
  console.log('fitToWidth');
}

function fitToPage() {
  console.log('fitToPage');
}

function onClickMarqueeZoom() {
  console.log('onClickMarqueeZoom');
}

export function Basic() {
  const zoomList = [0.1, 0.25, 0.5, 1, 1.25, 1.5, 2, 4, 8, 16, 64];
  const currentZoomLevel = 1.09;
  const isReaderMode = false;

  const props = {
    isMarqueeToolButtonDisabled: false,
    isMarqueeZoomActive: false,
    zoomList,
    currentZoomLevel,
    isReaderMode,
    onClickMarqueeZoom,
    onClickZoomLevelOption,
    fitToWidth,
    fitToPage
  };
  return (
      <Provider store={store}>
        <div style={{ width: 150 }}>
          <ZoomOverlay {...props} />
        </div>
      </Provider>
  )
}
