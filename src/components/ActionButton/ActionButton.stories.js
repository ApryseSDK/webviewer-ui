import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ActionButtonComponent from './ActionButton';
import { initialColors } from 'helpers/initialColorStates';

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
  color: initialColors[0],
  fillColor: initialColors[0],
  strokeColor: initialColors[0],
  dataElement: 'test',
  onClick: () => {
    alert('Action Triggered');
  },
};
