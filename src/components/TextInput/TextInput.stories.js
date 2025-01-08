import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TextInputComponent from './TextInput';

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
    <div style={{ minWidth: '330px', maxWidth: '400px' }}>
      <Provider store={store}>
        <TextInputComponent {...props} />
      </Provider>
    </div>

  );
};

export default {
  title: 'Components/TextInput',
  component: TextInputComponent,
  includeStories: ['Basic', 'ErrorComponent'],
};

export const Basic = () => {
  const props = {
    label: 'Test Input',
    onChange: () => {},
    validationMessage: 'Test Validation Message',
    hasError: false,
    ariaDescribedBy: 'Test Aria Described By',
    ariaLabelledBy: 'Test Aria Labelled By',
  };
  return <BasicComponent {...props} />;
};

export const ErrorComponent = () => {
  const props = {
    label: 'Test Input',
    onChange: () => {},
    validationMessage: 'Test Validation Message',
    hasError: true,
    ariaDescribedBy: 'Test Aria Described By',
    ariaLabelledBy: 'Test Aria Labelled By',
  };
  return <BasicComponent {...props} />;
};


