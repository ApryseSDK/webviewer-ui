import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import ToolButtonComponent from './ToolButton';
import initialState from 'src/redux/initialState';
import viewerReducer from 'src/redux/reducers/viewerReducer';

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer)
});

const store = createStore(reducer);

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
  color: '#E44234',
};
