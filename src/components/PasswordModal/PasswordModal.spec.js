import React from 'react';
import i18next from 'i18next';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import LoadingScreen from 'components/LoadingScreen';
import rootReducer from 'reducers/rootReducer';
import PasswordModalComponent from './PasswordModal';
import { PasswordModal, PasswordManyAttemptsErrorModal } from './PasswordModal.stories';
import { fireError } from 'helpers/fireEvent';
import { createStructuredLoadError } from 'helpers/loadError';

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
      expect(fireError).toHaveBeenCalledWith(createStructuredLoadError({
        message: i18next.t('message.encryptedUserCancelled'),
        type: 'PasswordUserCancelled',
        filename: 'PasswordModal',
        functionName: 'renderContent',
      }));
    });
  });

  it('fires a load error when the user exceeds retries', async () => {
    const PasswordModalWithProviders = withProviders(PasswordManyAttemptsErrorModal);
    render(<PasswordModalWithProviders />);

    await waitFor(() => {
      expect(fireError).toHaveBeenCalledTimes(1);
      expect(fireError).toHaveBeenCalledWith(createStructuredLoadError({
        message: i18next.t('message.encryptedAttemptsExceeded'),
        type: 'PasswordAttemptsExceeded',
        filename: 'PasswordModal',
        functionName: 'renderContent',
      }));
    });
  });

  it('replaces document loading with the password prompt', async () => {
    const store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    });
    store.dispatch(actions.openDocumentLoadingScreen());
    store.dispatch(actions.openElement(DataElements.PASSWORD_MODAL));
    const TestContent = withI18n(() => (
      <>
        <LoadingScreen />
        <PasswordModalComponent />
      </>
    ));

    render(
      <Provider store={store}>
        <TestContent />
      </Provider>
    );

    expect(screen.getByRole('dialog', { name: 'Password required' })).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByRole('status', { name: 'Loading document' })).not.toBeInTheDocument();
      expect(screen.queryByRole('progressbar', { name: 'Loading document' })).not.toBeInTheDocument();
    });
  });
});
