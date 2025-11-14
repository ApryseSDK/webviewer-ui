
import { configureStore } from '@reduxjs/toolkit';

jest.mock('helpers/fileToBase64');

jest.mock('actions', () => ({
  openElement: jest.fn((el) => ({ type: 'OPEN', payload: el })),
  closeElement: jest.fn((el) => ({ type: 'CLOSE', payload: el })),
  showWarningMessage: jest.fn((payload) => ({ type: 'WARN', payload })),
}));

jest.mock('selectors', () => ({
  getActiveFlyout: jest.fn(),
  isElementDisabled: jest.fn(() => false),
  getFeatureFlags: jest.fn(() => ({})),
  getCustomElementOverrides: jest.fn(() => ({})),
  getActiveDocumentViewerKey: jest.fn(() => 1),
}));

export const mockState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    featureFlags: {},
    activeDocumentViewerKey: 1,
    shortcutKeyMap: {},
    activeFlyout: 'some-flyout',
  },
};

export const mockReducer = (state = mockState) => state;

export const createMockStore = () =>
  configureStore({
    reducer: {
      viewer: mockReducer,
    },
  });

export const createMockFile = (name = 'test.png', content = 'hello', type = 'image/png') => {
  return new File([content], name, { type });
};

export const TEST_FILES = {
  validImage: () => createMockFile('test.png', 'hello', 'image/png'),
  invalidImage: () => createMockFile('fail.png', 'oops', 'image/png'),
};
