import React from 'react';
import { render } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import ColorPickerModalRedux from './ColorPalettePickerRedux';
import '@testing-library/jest-dom/extend-expect';
import selectors from 'selectors';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('selectors', () => ({
  getCustomColor: jest.fn(),
  getCustomColors: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn()],
}));

describe('ColorPickerModalRedux', () => {
  const mockDispatch = jest.fn();
  const mockOnStyleChange = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue([]); // Assuming no custom colors by default
  });

  it('should not call handleColorChange when activeCustomColor is not updated', () => {
    const mockColor = { A: 1, toHexString: () => '#000000' }; // eslint-disable-line custom/no-hex-colors

    selectors.getCustomColor.mockReturnValue('#000000'); // eslint-disable-line custom/no-hex-colors
    selectors.getCustomColors.mockReturnValue(['#000000']); // eslint-disable-line custom/no-hex-colors

    render(
      <ColorPickerModalRedux
        property="fillColor"
        onStyleChange={mockOnStyleChange}
        color={mockColor}
        enableEdit={true}
      />
    );

    // Since the colors are the same, handleColorChange should not trigger onStyleChange
    expect(mockOnStyleChange).not.toHaveBeenCalled();
  });
});