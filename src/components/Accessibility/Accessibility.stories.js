import React from 'react';
import Accessibility from './Accessibility';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import './Accessibility.stories.css';

export default {
  title: 'Components/Accessibility',
  component: Accessibility,
};

const state = {
  viewer: {
    ...initialState.viewer,
    shouldAddA11yContentToDOM: true,
  },
};

export const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => state })}>
      <Accessibility/>
    </Provider>
  );
};