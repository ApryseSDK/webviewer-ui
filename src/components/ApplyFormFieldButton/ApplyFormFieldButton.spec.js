import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ApplyFormFieldButton from './ApplyFormFieldButton';
import useCore from 'hooks/useCore';

jest.mock('hooks/useCore');

jest.mock('actions', () => ({
  setToolbarGroup: jest.fn(() => ({ type: 'SET_TOOLBAR_GROUP' })),
}));

describe('ApplyFormFieldButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ends formFieldCreationMode for every documentViewer when clicked', () => {
    const formFieldCreationManager1 = { endFormFieldCreationMode: jest.fn() };
    const formFieldCreationManager2 = { endFormFieldCreationMode: jest.fn() };

    const viewer1 = {
      getAnnotationManager: jest.fn(() => ({
        getFormFieldCreationManager: jest.fn(() => formFieldCreationManager1),
      })),
    };

    const viewer2 = {
      getAnnotationManager: jest.fn(() => ({
        getFormFieldCreationManager: jest.fn(() => formFieldCreationManager2),
      })),
    };

    const core = {
      getDocumentViewers: jest.fn(() => [viewer1, viewer2]),
    };

    useCore.mockReturnValue({ core });

    const ApplyFormFieldButtonWithProviders = withProviders(ApplyFormFieldButton);
    render(<ApplyFormFieldButtonWithProviders />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(formFieldCreationManager1.endFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager2.endFormFieldCreationMode).toHaveBeenCalledTimes(1);
  });
});
