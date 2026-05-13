import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import useOnContextMenuOpen from './useOnContextMenuOpen';

const mockGetAnnotationByMouseEvent = jest.fn();
const mockOnRightClick = jest.fn();
const mockIsOfficeEditorMode = jest.fn();

jest.mock('core', () => ({
  getAnnotationByMouseEvent: () => mockGetAnnotationByMouseEvent(),
  getOfficeEditor: () => ({ onRightClick: () => mockOnRightClick() }),
}));
jest.mock('helpers/officeEditor', () => ({ isOfficeEditorMode: () => mockIsOfficeEditorMode() }));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

const mockUseOnRightClick = jest.fn();
jest.mock('hooks/useOnRightClick', () => (...args) => mockUseOnRightClick(...args));

const wrapper = withProviders(({ children }) => <div>{children}</div>);

const getState = (overrides = {}) => ({
  viewer: {
    activeDocumentViewerKey: 1,
    enableRightClickAnnotationPopup: false,
    modularPopups: { contextMenuPopup: ['item1'] },
    ...overrides,
  },
});

describe('useOnContextMenuOpen', () => {
  const rightClick = async () => {
    const handler = mockUseOnRightClick.mock.calls[0][0];
    await act(async () => {
      await handler({ pageX: 100, pageY: 200 });
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAnnotationByMouseEvent.mockReturnValue(null);
    mockIsOfficeEditorMode.mockReturnValue(false);
    useSelector.mockImplementation((callback) => callback(getState()));
  });

  it('opens context menu when right-click annotation popup is disabled', async () => {
    renderHook(() => useOnContextMenuOpen(), { wrapper });
    await rightClick();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('does not open context menu when right-click annotation popup is enabled and annotation is present', async () => {
    const state = getState({ enableRightClickAnnotationPopup: true });
    useSelector.mockImplementation((callback) => callback(state));
    mockGetAnnotationByMouseEvent.mockReturnValue({ Id: 'annot1' });
    renderHook(() => useOnContextMenuOpen(), { wrapper });
    await rightClick();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('opens context menu in office editor mode', async () => {
    const state = getState({ enableRightClickAnnotationPopup: true });
    useSelector.mockImplementation((callback) => callback(state));
    mockGetAnnotationByMouseEvent.mockReturnValue({ Id: 'annot1' });
    mockIsOfficeEditorMode.mockReturnValue(true);
    renderHook(() => useOnContextMenuOpen(), { wrapper });
    await rightClick();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockOnRightClick).toHaveBeenCalledTimes(1);
  });
});
