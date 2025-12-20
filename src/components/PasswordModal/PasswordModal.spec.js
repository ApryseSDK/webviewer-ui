import React from 'react';
import i18next from 'i18next';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { PasswordModal, PasswordManyAttemptsErrorModal } from './PasswordModal.stories';
import { fireError } from 'helpers/fireEvent';

jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  fireError: jest.fn(),
}));

describe('PasswordModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fires a load error when the user cancels from the password modal', async () => {
    const PasswordModalWithProviders = withProviders(PasswordModal);
    render(<PasswordModalWithProviders />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(fireError).not.toHaveBeenCalled();
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(fireError).toHaveBeenCalledTimes(1);
      expect(fireError).toHaveBeenCalledWith(i18next.t('message.encryptedUserCancelled'));
    });
  });

  it('fires a load error when the user exceeds retries', async () => {
    const PasswordModalWithProviders = withProviders(PasswordManyAttemptsErrorModal);
    render(<PasswordModalWithProviders />);

    await waitFor(() => {
      expect(fireError).toHaveBeenCalledTimes(1);
      expect(fireError).toHaveBeenCalledWith(i18next.t('message.encryptedAttemptsExceeded'));
    });
  });
});
