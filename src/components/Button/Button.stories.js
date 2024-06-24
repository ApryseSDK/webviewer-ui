import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ButtonComponent from './Button';
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
      <ButtonComponent {...props} />
    </Provider>
  );
};

export default {
  title: 'Components/Buttons',
  component: ButtonComponent,
};

export const Button = BasicComponent.bind({});
Button.args = {
  title: 'Test Button',
  isActive: true,
  img: 'icon-tool-pen-line',
  color: initialColors[0],
  fillColor: initialColors[0],
  strokeColor: initialColors[0],
  dataElement: 'test',
};
