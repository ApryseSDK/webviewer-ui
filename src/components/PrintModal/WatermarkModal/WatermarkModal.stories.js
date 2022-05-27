import React from 'react';
import WatermarkModalComponent from './WatermarkModal'
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider, } from "react-redux";
import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState';

export default {
  title: 'Components/WatermarkModal',
  component: WatermarkModal,
};

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer),
});

const store = configureStore({
  reducer,
});

export const WatermarkModal = () => (
  <Provider store={store}>
    <WatermarkModalComponent isVisible={true} />
  </Provider>
);