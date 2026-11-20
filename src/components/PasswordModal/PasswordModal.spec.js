import React from 'react';
import i18next from 'i18next';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import LoadingScreen from 'components/LoadingScreen';
import rootReducer from 'reducers/rootReducer';
import PasswordModalComponent, { setCheckPasswordFunction, setCancelPasswordCheckCallback } from './PasswordModal';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { registerInstance, resetInstances, runWithInstance, setCurrentInstanceId } from 'core/documentViewers';
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

  describe('with two instances', () => {
    beforeEach(() => {
      registerInstance(1);
      registerInstance(2);
    });

    afterEach(() => {
      resetInstances();
    });

    it('should check the password with the callback of its own instance when another instance is current', () => {
      const check1 = jest.fn();
      const check2 = jest.fn();
      runWithInstance(1, () => setCheckPasswordFunction(check1));
      runWithInstance(2, () => setCheckPasswordFunction(check2));
      setCurrentInstanceId(2);
      const PasswordModalWithProviders = withProviders(PasswordModal);
      render(<InstanceIdContext.Provider value={1}><PasswordModalWithProviders /></InstanceIdContext.Provider>);

      fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secret' } });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      expect(check1).toHaveBeenCalledWith('secret');
      expect(check2).not.toHaveBeenCalled();
    });

    it('should call the cancel callback of its own instance when another instance is current', () => {
      const cancel1 = jest.fn();
      const cancel2 = jest.fn();
      runWithInstance(1, () => setCancelPasswordCheckCallback(cancel1));
      runWithInstance(2, () => setCancelPasswordCheckCallback(cancel2));
      setCurrentInstanceId(2);
      const PasswordModalWithProviders = withProviders(PasswordManyAttemptsErrorModal);
      render(<InstanceIdContext.Provider value={1}><PasswordModalWithProviders /></InstanceIdContext.Provider>);

      fireEvent.click(screen.getByRole('button', { name: /^ok$/i }));

      expect(cancel1).toHaveBeenCalledTimes(1);
      expect(cancel2).not.toHaveBeenCalled();
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
