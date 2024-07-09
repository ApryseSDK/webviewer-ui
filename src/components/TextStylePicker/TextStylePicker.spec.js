import React from 'react';
import { render, screen } from '@testing-library/react';
import TextStylePicker from './TextStylePicker';
import { DEBOUNCE_TIME } from '../FontSizeDropdown/FontSizeDropdown';
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

describe('TextStylePicker Component', () => {
  it('should render without errors', () => {
    const props = {
      onPropertyChange: noop
    };
    render(<TextStylePickerWithRedux {...props} />);
  });

  it('should render a warning if you enter an invalid font size', async () => {
    const props = {
      onPropertyChange: noop
    };
    render(<TextStylePickerWithRedux {...props} />);
    const fontSizeInput = screen.getByRole('textbox');
    userEvent.type(fontSizeInput, '12345');
    // Assert that a warning exists
    await new Promise((r) => setTimeout(r, DEBOUNCE_TIME + 5));
    expect(screen.getByText('Font size must be in the following range: 1 - 512')).toBeInTheDocument();
  });
  it('should disable vertical alignment when isFreeTextAutoSize is true', () => {
    const props = {
      onPropertyChange: noop,
      isFreeTextAutoSize: true
    };
    render(<TextStylePickerWithRedux {...props} />);
    expect(screen.getByLabelText('Align bottom')).toBeDisabled();
    expect(screen.getByLabelText('Align top')).toBeDisabled();
    expect(screen.getByLabelText('Align middle')).toBeDisabled();
  });
});
