import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataElements from 'constants/dataElement';
import actions from 'actions';
import ColorPickerButton from './ColorPickerButton';

const mockDispatch = jest.fn();
const mockUpdateSelectionAndCursorStyle = jest.fn();
const mockColorInput = { R: 255, G: 128, B: 64 };
const mockColorExpectedOutput = { r: mockColorInput.R, g: mockColorInput.G, b: mockColorInput.B };

const activeColorHex = '000000';
const activeColorMock = {
  toString: () => 'rgba(0,0,0,1)',
  toHexString: () => `#${activeColorHex}`,
};

const groupedItemsFlyout = 'officeEditorHomeToolsGroupedItemsFlyout';
const applyColorButtonLabel = 'apply-color';
const resetColorButtonLabel = 'reset-color';

jest.mock('hooks/useCore', () => () => ({
  core: {
    getOfficeEditor: () => ({ updateSelectionAndCursorStyle: mockUpdateSelectionAndCursorStyle }),
  },
}));

jest.mock('react-redux', () => ({
  useSelector: () => [activeColorMock],
  useDispatch: () => mockDispatch,
  shallowEqual: jest.fn(),
}));

jest.mock('actions', () => ({
  __esModule: true,
  default: {
    toggleElement: jest.fn((element) => ({ type: 'TOGGLE_ELEMENT', element })),
    closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', element })),
    closeElements: jest.fn((elements) => ({ type: 'CLOSE_ELEMENTS', elements })),
  },
}));

// Provide deterministic menu item metadata so rendering does not depend on the real config.
jest.mock('../../../Helpers/menuItems', () => ({
  menuItems: {
    officeEditorColorPicker: {
      dataElement: 'officeEditorColorPicker',
      icon: 'icon-office-editor-circle',
      title: 'officeEditor.textColor',
    },
  },
}));

// Render a stand-in that lets the test invoke the props the button wires up.
jest.mock('components/ColorPickerOverlay', () => {
  const MockColorPickerOverlay = (props) => (
    <>
      <button type="button" aria-label={applyColorButtonLabel} onClick={() => props.onStyleChange(null, mockColorInput)} />
      {props.onDefaultColorReset && (
        <button type="button" aria-label={resetColorButtonLabel} onClick={() => props.onDefaultColorReset()} />
      )}
    </>
  );
  return MockColorPickerOverlay;
});
jest.mock('components/ModularComponents/ToggleElementButton', () => {
  const MockToggleElementButton = () => <button type="button">toggle</button>;
  return MockToggleElementButton;
});

describe('ColorPickerButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should map the selected color and apply it to the office editor selection and cursor', () => {
    render(<ColorPickerButton />);

    fireEvent.click(screen.getByLabelText(applyColorButtonLabel));

    expect(mockUpdateSelectionAndCursorStyle).toHaveBeenCalledTimes(1);
    expect(mockUpdateSelectionAndCursorStyle).toHaveBeenCalledWith({ color: mockColorExpectedOutput });
  });

  it('should close the color picker overlay after a color is applied', () => {
    render(<ColorPickerButton />);

    fireEvent.click(screen.getByLabelText(applyColorButtonLabel));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLOSE_ELEMENTS',
      elements: [
        DataElements.OFFICE_EDITOR_COLOR_PICKER_OVERLAY,
        groupedItemsFlyout,
      ],
    });
  });

  it('should not offer a default color reset for the text color picker', () => {
    render(<ColorPickerButton />);

    expect(screen.queryByLabelText(resetColorButtonLabel)).not.toBeInTheDocument();
  });
});
