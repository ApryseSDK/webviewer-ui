import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import core from 'core';
import actions from 'actions';
import useOnInlineCommentPopupOpen from './useOnInlineCommentPopupOpen';
import { isAnnotationInView } from 'helpers/getPopupPosition';
import DataElements from 'constants/dataElement';

jest.mock('core');
jest.mock('helpers/getPopupPosition', () => ({
  isAnnotationInView: jest.fn(),
}));
jest.mock('actions', () => ({
  openElement: jest.fn((element) => ({ type: 'OPEN_ELEMENT', payload: element })),
  closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent, {
  viewer: {
    inlineCommentFilter: () => true,
  },
});

const mockAnnotation = {
  getPageNumber: () => 1,
};

describe('useOnInlineCommentPopupOpen hook', () => {
  let onAnnotationSelectedHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    core.addEventListener = jest.fn((event, handler) => {
      if (event === 'annotationSelected') {
        onAnnotationSelectedHandler = handler;
      }
    });
  });

  it('dispatches openElement when annotation is in view', () => {
    isAnnotationInView.mockReturnValue(true);
    renderHook(() => useOnInlineCommentPopupOpen(), { wrapper });
    act(() => onAnnotationSelectedHandler([mockAnnotation], 'selected'));

    expect(isAnnotationInView).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.openElement(DataElements.INLINE_COMMENT_POPUP)
    );
  });

  it('does not dispatch openElement when annotation is not in view', () => {
    isAnnotationInView.mockReturnValue(false);
    renderHook(() => useOnInlineCommentPopupOpen(), { wrapper });
    act(() => onAnnotationSelectedHandler([mockAnnotation], 'selected'));

    expect(isAnnotationInView).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith(
      actions.openElement(DataElements.INLINE_COMMENT_POPUP)
    );
  });
});
