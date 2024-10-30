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
  getDocumentViewer: () => ({}),
  getScrollViewElement: () => ({
    getBoundingClientRect: () => ({}),
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
    const mockOnPropertyChange = jest.fn();
    const props = {
      onPropertyChange: mockOnPropertyChange
    };
    render(<TextStylePickerWithRedux {...props} />);
    const comboBox = screen.getByRole('combobox', { name: 'Font Size' });
    expect(comboBox).toHaveTextContent('12');
    userEvent.click(comboBox);
    // Now we input an invalid value in the input combobox
    const fontSizeInput = screen.getAllByRole('combobox')[2];
    // It should have the same value as the combobox
    expect(fontSizeInput).toHaveValue('12');
    // Select all the text and input a big number
    userEvent.clear(fontSizeInput);
    userEvent.type(fontSizeInput, '9999999');
    userEvent.type(fontSizeInput, '{enter}');

    // Assert that a warning exists
    await new Promise((r) => setTimeout(r, DEBOUNCE_TIME + 5));
    // Since we input an invalid value we got back to the default
    expect(comboBox).toHaveTextContent('12');
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
  it('should only render the dropdown when isWidget is true', () => {
    const props = {
      onPropertyChange: noop,
      isWidget: true
    };
    render(<TextStylePickerWithRedux {...props} />);
    const dropdown = screen.getAllByRole('listbox');
    const inputs = screen.getAllByRole('combobox');
    expect(dropdown).toHaveLength(1);
    expect(dropdown[0]).toBeInTheDocument();
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toBeInTheDocument();
  });
});
