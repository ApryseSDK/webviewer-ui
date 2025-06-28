import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Basic } from './CreateStampModal.stories';

const noop = () => { };

const mockCustomStampTool = {
  drawCustomStamp: () => 0
};

jest.mock('core', () => ({
  getCurrentUser: () => 'Guest',
  addEventListener: noop,
  removeEventListener: noop,
  getDocumentViewers: () => [{
    getAnnotationManager: () => ({
      getAnnotationsList: () => []
    })
  }],
  getToolsFromAllDocumentViewers: () => [
    mockCustomStampTool
  ],
  deselectAllAnnotations: noop,
}));

const TestCreateStampModalPopup = withProviders(Basic);

describe('CreateStampModal Component', () => {
  it('should have the focus trapped inside the modal', async () => {
    render(<TestCreateStampModalPopup />);

    const closeButton = screen.getByRole('button', { name: /Close/i });
    const stampTextInput = screen.getByRole('textbox', { name: /Stamp Text/i });
    const fontDropdown = screen.getByRole('combobox', { name: /Font Style/i });
    const boldButton = screen.getByRole('button', { name: /Bold/i });
    const italicButton = screen.getByRole('button', { name: /Italic/i });
    const underlineButton = screen.getByRole('button', { name: /Underline/i });
    const strikeoutButton = screen.getByRole('button', { name: /Strikeout/i });
    const whiteColorButton = screen.getByRole('button', { name: /Color #FFFFFF/i });
    const blackColorButton = screen.getByRole('button', { name: /Color #000000/i });
    const addCustomColorButton = screen.getAllByRole('button', { name: /Add new color/i });
    const deleteCustomColorButton = screen.getAllByRole('button', { name: /Delete custom color/i });
    const greenColorButton = screen.getByRole('button', { name: /Color #4F9964/i });
    const blueColorButton = screen.getByRole('button', { name: /Color #2A85D0/i });
    const redColorButton = screen.getByRole('button', { name: /Color #D65656/i });
    const usernameCheckbox = screen.getByRole('checkbox', { name: /Username/i });
    const dateCheckbox = screen.getByRole('checkbox', { name: /Date/i });
    const timeCheckbox = screen.getByRole('checkbox', { name: /time/i });
    const dateInfoButton = screen.getByRole('button', { name: /More info about date format/i });
    const dateFormatDropdown = screen.getByRole('combobox', { name: /Date Format/i });
    const createButton = screen.getByRole('button', { name: /Create/i });

    const tabOrder = [
      closeButton,
      stampTextInput,
      fontDropdown,
      boldButton,
      italicButton,
      underlineButton,
      strikeoutButton,
      whiteColorButton,
      blackColorButton,
      addCustomColorButton[0],
      deleteCustomColorButton[0],
      greenColorButton,
      blueColorButton,
      redColorButton,
      addCustomColorButton[1],
      deleteCustomColorButton[1],
      usernameCheckbox,
      dateCheckbox,
      timeCheckbox,
      dateInfoButton,
      dateFormatDropdown,
      createButton,
    ];

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    for (let i = 1; i < tabOrder.length; i++) {
      userEvent.tab();
      expect(tabOrder[i]).toHaveFocus();
    }

    userEvent.tab();
    expect(closeButton).toHaveFocus();
  });
});

