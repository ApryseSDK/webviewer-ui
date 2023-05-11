import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ActionButtonComponent from './ActionButton';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <ActionButtonComponent {...props} />
    </Provider>
  );
};

export default {
  title: 'Components/Buttons',
  component: ActionButtonComponent,
};

export const ActionButton = BasicComponent.bind({});
ActionButton.args = {
  title: 'Action Button',
  img: 'icon-tools-more',
  color: '#E44234',
  fillColor: '#E44234',
  strokeColor: '#E44234',
  dataElement: 'test',
  onClick: () => {
    alert('Action Triggered');
  },
};
