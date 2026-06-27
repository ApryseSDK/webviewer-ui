import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useReplyAutosave, { replyDraftByAnnotationId } from './useReplyAutosave';
import useCore from 'hooks/useCore';
import selectors from 'selectors';
import NoteContext from 'components/Note/Context';
import {
  getReplyDraftsForExport,
  clearReplyDraftForExport,
} from 'helpers/replyDraftExportStore';

const mockAnnotationManager = {
  addAnnotations: jest.fn(),
  deleteAnnotations: jest.fn(),
  hasAnnotation: jest.fn(() => true),
  trigger: jest.fn(),
};

const mockCore = {
  getAnnotationManager: jest.fn(() => mockAnnotationManager),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getCurrentUser: jest.fn(() => 'TestUser'),
  addAnnotations: jest.fn(),
  createAnnotationReply: jest.fn((annotation, text) => ({ ...annotation, text })),
};

jest.mock('lodash/debounce', () => {
  return (fn) => {
    const debounced = (...args) => fn(...args);
    debounced.cancel = jest.fn();
    return debounced;
  };
});

jest.mock('helpers/MentionsManager', () => ({
  getFormattedTextFromDeltas: jest.fn(() => 'Draft reply'),
  extractMentionDataFromStr: jest.fn(() => ({ plainTextValue: 'Draft reply', ids: [] })),
  createMentionReply: jest.fn((annotation, text) => ({ ...annotation, text })),
}));

jest.mock('helpers/setAnnotationRichTextStyle', () => jest.fn());
jest.mock('helpers/ReplyAttachmentManager', () => ({
  setAnnotationAttachments: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => selector({})),
  shallowEqual: jest.fn(),
}));

jest.mock('hooks/useCore', () => jest.fn(() => ({ core: mockCore })));

jest.mock('selectors', () => ({
  getActiveDocumentViewerKey: jest.fn(() => 'viewer-1'),
  getAutosaveEnabled: jest.fn(() => true),
  getAutosaveInterval: jest.fn(() => 100),
  getIsMentionEnabled: jest.fn(() => false),
}));

describe('useReplyAutosave', () => {
  const viewerKey = 'viewer-1';
  const annotationId = 'annotation-1';

  const makeAnnotation = () => ({
    Id: annotationId,
    X: 10,
    Y: 20,
    PageNumber: 1,
    addReply: jest.fn(),
    deleteReply: jest.fn(),
    getCustomData: jest.fn(() => '42'),
  });

  const makeTextareaRef = () => {
    const editor = {
      getText: jest.fn(() => 'Draft reply'),
      getContents: jest.fn(() => ({})),
      setText: jest.fn(),
      getLength: jest.fn(() => 'Pending draft'.length + 1),
      setSelection: jest.fn(),
    };

    return {
      editor,
      current: {
        getEditor: jest.fn(() => editor),
      },
    };
  };

  const renderUseReplyAutosave = ({ annotation, textareaRef, noteContextValue = {} }) => {
    const defaultContextValue = {
      isOfficeEditorCommentAnnotation: false,
      setPendingReply: jest.fn(),
      pendingReplyMap: {},
      pendingAttachmentMap: {},
      clearAttachments: jest.fn(),
    };

    const wrapper = ({ children }) => (
      <NoteContext.Provider value={{ ...defaultContextValue, ...noteContextValue }}>
        {children}
      </NoteContext.Provider>
    );

    return {
      ...renderHook(() => useReplyAutosave({ annotation, textareaRef }), { wrapper }),
      contextValue: { ...defaultContextValue, ...noteContextValue },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    selectors.getAutosaveEnabled.mockReturnValue(true);
    replyDraftByAnnotationId.clear();
    clearReplyDraftForExport(viewerKey, annotationId);
    window.Core = {
      Annotations: {
        StickyAnnotation: class {
          constructor() {
            this.customData = {};
          }

          setContents = jest.fn();

          setCustomData = jest.fn((key, value) => {
            this.customData[key] = value;
          });

          getCustomData = jest.fn((key) => this.customData[key]);
        },
      },
    };
  });

  it('restores draft content from module cache on mount when autosave is enabled', async () => {
    const annotation = makeAnnotation();
    const textareaRef = makeTextareaRef();
    replyDraftByAnnotationId.set(`${viewerKey}:${annotationId}`, 'Persisted Draft');

    const { result, waitFor } = renderUseReplyAutosave({ annotation, textareaRef });

    await waitFor(() => result.current.localReplyValue === 'Persisted Draft');
    expect(result.current.localReplyValue).toBe('Persisted Draft');
  });

  it('autosaves a non-office reply draft and stores it for export', async () => {
    const annotation = makeAnnotation();
    const textareaRef = makeTextareaRef();
    const { core } = useCore();
    const setPendingReply = jest.fn();

    const { result, waitFor } = renderUseReplyAutosave({
      annotation,
      textareaRef,
      noteContextValue: {
        setPendingReply,
      },
    });

    const annotationManager = core.getAnnotationManager(viewerKey);

    await act(async () => {
      result.current.setLocalReplyValue('Draft reply');
    });

    await waitFor(() => replyDraftByAnnotationId.get(`${viewerKey}:${annotationId}`) === 'Draft reply');
    await waitFor(() => annotationManager.addAnnotations.mock.calls.length > 0);

    expect(replyDraftByAnnotationId.get(`${viewerKey}:${annotationId}`)).toBe('Draft reply');
    expect(getReplyDraftsForExport(viewerKey)[0].replyText).toBe('Draft reply');
    expect(annotationManager.addAnnotations).toHaveBeenCalled();
    expect(setPendingReply).toHaveBeenCalledWith('', annotationId);
  });

  it('does not commit office editor autosaved draft on unmount', async () => {
    const annotation = makeAnnotation();
    const { core } = useCore();
    const addCommentReply = jest.fn(() => Promise.resolve());
    core.getOfficeEditor = jest.fn(() => ({
      getCommentManager: jest.fn(() => ({ addCommentReply })),
    }));
    replyDraftByAnnotationId.set(`${viewerKey}:${annotationId}`, 'Draft reply');

    const { unmount } = renderUseReplyAutosave({
      annotation,
      textareaRef: makeTextareaRef(),
      noteContextValue: {
        isOfficeEditorCommentAnnotation: true,
      },
    });

    await act(async () => {
      unmount();
    });

    expect(addCommentReply).not.toHaveBeenCalled();
    expect(replyDraftByAnnotationId.get(`${viewerKey}:${annotationId}`)).toBe('Draft reply');
  });

  it('does not restore a draft keyed to a different viewer', async () => {
    const annotation = makeAnnotation();
    const textareaRef = makeTextareaRef();
    // Store a draft under a different viewer key — must not bleed into viewer-1.
    replyDraftByAnnotationId.set(`viewer-2:${annotationId}`, 'Other viewer draft');

    const { result } = renderUseReplyAutosave({ annotation, textareaRef });

    expect(result.current.localReplyValue).toBe('');
  });

  it('restores from pending reply map when autosave cache is empty', async () => {
    const annotation = makeAnnotation();
    const textareaRef = makeTextareaRef();

    const { result, waitFor } = renderUseReplyAutosave({
      annotation,
      textareaRef,
      noteContextValue: {
        pendingReplyMap: {
          [annotationId]: 'Pending draft',
        },
      },
    });

    await waitFor(() => {
      expect(result.current.localReplyValue).toBe('Pending draft');
    });
    await waitFor(() => {
      expect(textareaRef.editor.setText).toHaveBeenCalledWith('Pending draft');
      expect(textareaRef.editor.setSelection).toHaveBeenCalledWith('Pending draft'.length, 0);
    });
  });

  it('restores from pending reply map when autosave is disabled', async () => {
    selectors.getAutosaveEnabled.mockReturnValue(false);
    const annotation = makeAnnotation();
    const textareaRef = makeTextareaRef();

    const { result, waitFor } = renderUseReplyAutosave({
      annotation,
      textareaRef,
      noteContextValue: {
        pendingReplyMap: {
          [annotationId]: 'Pending draft autosave off',
        },
      },
    });

    await waitFor(() => {
      expect(result.current.localReplyValue).toBe('Pending draft autosave off');
    });
  });
});
