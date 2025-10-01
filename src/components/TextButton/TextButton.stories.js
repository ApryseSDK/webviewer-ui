import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TextButtonComponent from './TextButton';

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
      <TextButtonComponent {...props} />
    </Provider>
  );
};

export default {
  title: 'Components/TextButtons',
  component: TextButtonComponent,
};

export const Button = BasicComponent.bind({});
Button.args = {
  label: 'Test Button',
  dataElement: 'test',
  ariaLabel: 'Do Something',
  onClick: () => console.log('Button clicked'),
};

Button.parameters = window.storybook.disableChromatic;