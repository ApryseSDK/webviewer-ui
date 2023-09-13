import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextStylePicker from './TextStylePicker';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

jest.mock('core', () => ({
  getContentEditManager: () => ({
    isInContentEditMode: () => false,
  }),
}));

// mock initial state.
// UI Buttons are redux connected, and they need a state or the
const initialState = {
  viewer: {
    openElements: {
    },
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({
  reducer: () => initialState
});

const TextStylePickerWithRedux = (props) => (
  <Provider store={store}>
    <TextStylePicker {...props} />
  </Provider>
);


const noop = () => { };

describe.only('TextStylePicker Component', () => {
  it('should render without errors', () => {
    const props = {
      onPropertyChange: noop
    };
    render(<TextStylePickerWithRedux {...props} />);
  });

  it('should render a warning if you enter an invalid font size', () => {
    const props = {
      onPropertyChange: noop
    };
    render(<TextStylePickerWithRedux {...props} />);
    const fontSizeInput = screen.getByRole('textbox');
    userEvent.type(fontSizeInput, '12345');
    // Assert that a warning exists
    expect(screen.getByText('Font size must be less than 128')).toBeInTheDocument();
  });
});
