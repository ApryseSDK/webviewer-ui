import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic } from './IndexPanelContent.stories';

const mockFormFieldCreationManager = {
  setFieldName: jest.fn(() => ({ isValid: true })),
};

jest.mock('core', () => ({
  getGroupAnnotations: () => [],
  getDisplayAuthor: () => '',
  canModify: () => true,
  canModifyContents: () => true,
  addEventListener: () => { },
  removeEventListener: () => { },
  getDocumentViewer: jest.fn(),
  getAnnotationById: jest.fn(() => ({ Id: '1' })),
  getFormFieldCreationManager: jest.fn(() => mockFormFieldCreationManager),
}));

describe('IndexPanelContent Component', () => {
  afterEach(() => {
    mockFormFieldCreationManager.setFieldName.mockReset();
    mockFormFieldCreationManager.setFieldName.mockReturnValue({ isValid: true });
  });

  const openRenameEditor = () => {
    fireEvent.doubleClick(screen.getByText('Signature Field 1'));
    return screen.getByDisplayValue('Signature Field 1');
  };

  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<Basic />);
    }).not.toThrow();
  });

  it('Should show correct field name', () => {
    render(
      <Basic />
    );
    expect(screen.getByText('Signature Field 1')).toBeInTheDocument();
  });

  it('enters edit mode on double click', () => {
    render(
      <Basic />
    );
    openRenameEditor();
    expect(screen.getByDisplayValue('Signature Field 1')).toBeInTheDocument();
  });

  it('saves a renamed field when Safari blurs the input during a Save tap', () => {
    render(<Basic />);

    const renameInput = openRenameEditor();
    fireEvent.change(renameInput, { target: { value: 'Renamed Field' } });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.touchStart(saveButton);
    fireEvent.blur(renameInput, { relatedTarget: null });
    expect(screen.getByDisplayValue('Renamed Field')).toBeInTheDocument();
    fireEvent.click(saveButton);

    expect(mockFormFieldCreationManager.setFieldName)
      .toHaveBeenCalledWith({ Id: '1' }, 'Renamed Field');
  });

  it('closes an invalid rename when the user later blurs the input outside the controls', () => {
    const duplicateNameValidationResponse = { isValid: false, errorType: 'duplicate' };
    mockFormFieldCreationManager.setFieldName.mockReturnValue(duplicateNameValidationResponse);
    render(<Basic />);

    const renameInput = openRenameEditor();
    fireEvent.change(renameInput, { target: { value: 'Renamed Field' } });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.touchStart(saveButton);
    fireEvent.blur(renameInput, { relatedTarget: null });
    fireEvent.click(saveButton);

    expect(mockFormFieldCreationManager.setFieldName)
      .toHaveBeenCalledWith({ Id: '1' }, 'Renamed Field');
    expect(screen.getByText('Field Name already exists')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Renamed Field')).toBeInTheDocument();

    fireEvent.blur(renameInput, { relatedTarget: null });
    expect(screen.queryByDisplayValue('Renamed Field')).not.toBeInTheDocument();
  });
});