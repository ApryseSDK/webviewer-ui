import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormFieldEditButton from './FormFieldEdit';
import useCore from 'hooks/useCore';

jest.mock('hooks/useCore');

jest.mock('../../Helpers/menuItems', () => ({
  menuItems: {
    formFieldEditButton: {
      dataElement: 'formFieldEditButton',
      icon: 'icon-form-field-edit',
      title: 'formField.edit',
    },
  },
}));

describe('FormFieldEditButton', () => {
  const createFormFieldCreationManager = () => ({
    startFormFieldCreationMode: jest.fn(),
    endFormFieldCreationMode: jest.fn(),
  });

  const mockDocumentViewer = (formFieldCreationManager) => ({
    getAnnotationManager: jest.fn(() => ({
      getFormFieldCreationManager: jest.fn(() => formFieldCreationManager),
    })),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts formFieldCreationMode on all viewers when not in creation mode', () => {
    const formFieldCreationManager = {
      isInFormFieldCreationMode: jest.fn(() => false),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const formFieldCreationManager1 = createFormFieldCreationManager();
    const formFieldCreationManager2 = createFormFieldCreationManager();

    const core = {
      getFormFieldCreationManager: jest.fn(() => formFieldCreationManager),
      getDocumentViewers: jest.fn(() => [
        mockDocumentViewer(formFieldCreationManager1),
        mockDocumentViewer(formFieldCreationManager2),
      ]),
    };

    useCore.mockReturnValue({ core });

    const FormFieldEditButtonWithProviders = withProviders(FormFieldEditButton);
    render(<FormFieldEditButtonWithProviders />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(formFieldCreationManager1.startFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager2.startFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager1.endFormFieldCreationMode).not.toHaveBeenCalled();
    expect(formFieldCreationManager2.endFormFieldCreationMode).not.toHaveBeenCalled();
  });

  it('ends formFieldCreationMode on all viewers when in creation mode', () => {
    const formFieldCreationManager = {
      isInFormFieldCreationMode: jest.fn(() => true),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const formFieldCreationManager1 = createFormFieldCreationManager();
    const formFieldCreationManager2 = createFormFieldCreationManager();

    const core = {
      getFormFieldCreationManager: jest.fn(() => formFieldCreationManager),
      getDocumentViewers: jest.fn(() => [
        mockDocumentViewer(formFieldCreationManager1),
        mockDocumentViewer(formFieldCreationManager2),
      ]),
    };

    useCore.mockReturnValue({ core });

    const FormFieldEditButtonWithProviders = withProviders(FormFieldEditButton);
    render(<FormFieldEditButtonWithProviders />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(formFieldCreationManager1.endFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager2.endFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager1.startFormFieldCreationMode).not.toHaveBeenCalled();
    expect(formFieldCreationManager2.startFormFieldCreationMode).not.toHaveBeenCalled();
  });
});
