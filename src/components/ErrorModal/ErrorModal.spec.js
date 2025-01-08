import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import ErrorModal from './ErrorModal';
import selectors from 'selectors';

jest.mock('selectors', () => ({
  getErrorMessage: jest.fn(),
  getErrorTitle: jest.fn(),
  isElementDisabled: jest.fn(),
  isElementOpen: jest.fn(),
  getIsMultiTab: jest.fn(),
  getFeatureFlags: jest.fn(),
  getCustomElementOverrides: jest.fn(),
  getActiveDocumentViewerKey: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [(k) => k],
}));

const mockStore = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};

describe('ErrorModal', () => {
  beforeEach(() => {
    selectors.getErrorMessage.mockReturnValue('Error message');
    selectors.getErrorTitle.mockReturnValue('Error Title');
    selectors.isElementDisabled.mockReturnValue(false);
    selectors.isElementOpen.mockReturnValue(true);
    selectors.getIsMultiTab.mockReturnValue(false);
  });

  it('should not have aria-hidden={true} tag', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ErrorModal />
      </Provider>
    );

    const modalContent = container.querySelector('.modal-content.error-modal-content');
    expect(modalContent).not.toHaveAttribute('aria-hidden', 'true');
  });
});