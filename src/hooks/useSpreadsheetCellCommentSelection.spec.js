import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useCore from 'hooks/useCore';
import useSpreadsheetCellCommentSelection from './useSpreadsheetCellCommentSelection';

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// eslint-disable-next-line react/prop-types
const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

describe('useSpreadsheetCellCommentSelection', () => {
  let core;
  const comment = { Id: 'comment-1' };

  beforeEach(() => {
    core = {
      selectAnnotation: jest.fn(),
      deselectAllAnnotations: jest.fn(),
      getSelectedAnnotations: jest.fn(() => []),
    };
    useCore.mockReturnValue({ core });
  });

  it('selects the comment at the selected cell so the notes panel expands it', () => {
    renderHook(() => useSpreadsheetCellCommentSelection({ isEnabled: true, comment, documentViewerKey: 1 }), { wrapper });

    expect(useCore).toHaveBeenCalledWith(1);
    expect(core.selectAnnotation).toHaveBeenCalledWith(comment);
  });

  it('deselects the previous comment first so the notes panel does not enter multi-select mode', () => {
    const otherComment = { Id: 'comment-2' };
    core.getSelectedAnnotations.mockReturnValue([otherComment]);

    renderHook(() => useSpreadsheetCellCommentSelection({ isEnabled: true, comment, documentViewerKey: 1 }), { wrapper });

    expect(core.deselectAllAnnotations).toHaveBeenCalled();
    expect(core.selectAnnotation).toHaveBeenCalledWith(comment);
  });

  it('does not reselect a comment that is already the only selected annotation', () => {
    core.getSelectedAnnotations.mockReturnValue([comment]);

    renderHook(() => useSpreadsheetCellCommentSelection({ isEnabled: true, comment, documentViewerKey: 1 }), { wrapper });

    expect(core.deselectAllAnnotations).not.toHaveBeenCalled();
    expect(core.selectAnnotation).not.toHaveBeenCalled();
  });

  it('does nothing when disabled, for example when the notes panel is closed', () => {
    renderHook(() => useSpreadsheetCellCommentSelection({ isEnabled: false, comment, documentViewerKey: 1 }), { wrapper });

    expect(core.selectAnnotation).not.toHaveBeenCalled();
    expect(core.deselectAllAnnotations).not.toHaveBeenCalled();
  });

  it('deselects the expanded comment when the selected cell has no comment', () => {
    core.getSelectedAnnotations.mockReturnValue([comment]);

    const { rerender } = renderHook(
      ({ comment: currentComment }) => useSpreadsheetCellCommentSelection({ isEnabled: true, comment: currentComment, documentViewerKey: 1 }),
      { wrapper, initialProps: { comment } },
    );
    rerender({ comment: undefined });

    expect(core.deselectAllAnnotations).toHaveBeenCalled();
  });

  it('does not deselect when nothing is selected', () => {
    renderHook(() => useSpreadsheetCellCommentSelection({ isEnabled: true, comment: undefined, documentViewerKey: 1 }), { wrapper });

    expect(core.selectAnnotation).not.toHaveBeenCalled();
    expect(core.deselectAllAnnotations).not.toHaveBeenCalled();
  });

});
