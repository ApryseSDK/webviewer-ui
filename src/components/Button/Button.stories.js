import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ButtonComponent from './Button';

const noop = () => { };

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
  color: '#E44234',
  fillColor: '#E44234',
  strokeColor: '#E44234',
  dataElement: 'test',
};
