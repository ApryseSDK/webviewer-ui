import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import StylePicker from './StylePicker';
import { StylePicker as StoryBookStylePicker } from './StylePicker.stories';
import userEvent from '@testing-library/user-event';

const initialState = {
  viewer: {
    toolColorOverrides: {
      AnnotationEdit: [],
    },
    customElementOverrides: {},
    openElements: {
      strokeStyleContainer: true,
    },
    disabledElements: {},
    documentContainerHeight: 0,
    colors: [],
    activeToolName: '',
    snapMode: {},
    customColors: [],
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);
const StylePickerWithRedux = (props) => (
  <Provider store={store}>
    <StylePicker {...props} />
  </Provider>
);

jest.mock('core', () => ({
  getTool: () => '',
  addEventListener: () => { },
  getType: () => '',
  getDocument: () => ({ getType: () => 'pdf' })
}));

const style = {
  Opacity: 1,
  StrokeThickness: 1,
  Scale: [
    [1, 'in'],
    [1, 'in']
  ],
  Precision: 0.1,
};

const freeTextProps = {
  style: style,
  sliderProperties: ['Opacity', 'StrokeThickness'],
  showLineStyleOptions: false,
  isFreeText: true,
  strokeStyle: 'solid',
  activeTool: 'AnnotationCreateFreeText',
  onStyleChange: () => { },
};

const props = {
  style: style,
  sliderProperties: ['Opacity', 'StrokeThickness'],
  showLineStyleOptions: true,
  startLineStyle: 'None',
  endLineStyle: 'None',
  strokeStyle: 'solid',
  onStyleChange: () => { },
};

// Helper function that allows us to inject different context scenarios to test with
const customRenderWithContext = () => {
  return render(
    <StylePickerWithRedux {...props} />,
  );
};

describe('StylePicker', () => {
  it('renders the storybook component correctly', () => {
    expect(() => {
      render(<StoryBookStylePicker {...props} />);
    }).not.toThrow();
  });

  it('line style dropdowns has aria label', () => {
    customRenderWithContext();

    const startLineStyleDropdown = screen.getByRole('combobox', { name: 'Line Start' });
    expect(startLineStyleDropdown).toHaveClass('Dropdown StylePicker-StartLineStyleDropdown', { exact: true });

    const middleLineStyleDropdown = screen.getByRole('combobox', { name: 'Line Middle' });
    expect(middleLineStyleDropdown).toHaveClass('Dropdown StylePicker-StrokeLineStyleDropdown', { exact: true });

    const endLineStyleDropdown = screen.getByRole('combobox', { name: 'Line End' });
    expect(endLineStyleDropdown).toHaveClass('Dropdown StylePicker-EndLineStyleDropdown', { exact: true });
  });

  it('Style color picker buttons have aria-label', () => {
    customRenderWithContext();

    const strokeStylePickerShowMoreButton = screen.getByRole('button', { name: 'Stroke Show More Colors' });
    expect(strokeStylePickerShowMoreButton).toBeInTheDocument();

    const strokeStylePickerAddButton = screen.getByRole('button', { name: 'Stroke Add New Color from Custom Color Picker' });
    expect(strokeStylePickerAddButton).toBeInTheDocument();

    const strokeStylePickerDeleteButton = screen.getByRole('button', { name: 'Stroke Delete Selected Color transparent' });
    expect(strokeStylePickerDeleteButton).toBeInTheDocument();

    const strokeStylePickerCopyButton = screen.getByRole('button', { name: 'Stroke Copy Selected Color transparent' });
    expect(strokeStylePickerCopyButton).toBeInTheDocument();
  });

  const checkStrokeInputChange = async (inputValue, expectedFinalValue, props) => {
    render(<StylePickerWithRedux {...props} />);
    const strokeThicknessInput = screen.getByRole('textbox', { name: /Stroke/i } );
    expect(strokeThicknessInput).toHaveValue('1pt');
    userEvent.clear(strokeThicknessInput);
    userEvent.type(strokeThicknessInput, inputValue);
    userEvent.type(strokeThicknessInput, '{enter}');
    expect(screen.getByRole('textbox', { name: /Stroke/i } )).toHaveValue(expectedFinalValue);
  };

  it('should accept zero StrokeThickness for FreeText annotations', async () => {
    checkStrokeInputChange('0', '0pt', freeTextProps);
  });

  it('should NOT accept zero StrokeThickness for annotations other than FreeText', async () => {
    checkStrokeInputChange('0', '0.10pt', props);
  });

  it('should restores the last stroke value when invalid input is provided', async () => {
    checkStrokeInputChange('-abc', '1pt', props);
  });

  it('should restores the last stroke value when empty value is provided', async () => {
    checkStrokeInputChange('', '1pt', props);
  });
});