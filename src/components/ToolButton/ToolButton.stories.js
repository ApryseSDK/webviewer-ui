import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ToolButtonComponent from './index';
import initialState from 'src/redux/initialState';
import viewerReducer from 'src/redux/reducers/viewerReducer';
import { initialColors } from 'helpers/initialColorStates';
import { disableRtlModeParameters } from 'helpers/storybookParams';

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer)
});

const store = configureStore({ reducer: reducer });

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <ToolButtonComponent {...props} />
    </Provider>
  );
};

export default {
  title: 'Components/Buttons',
  component: ToolButtonComponent,
};

export const ToolButton = BasicComponent.bind({});
ToolButton.args = {
  toolName: 'AnnotationCreateFreeText',
  group: 'freeTextTools',
  color: initialColors[0],
};

ToolButton.parameters = disableRtlModeParameters;
