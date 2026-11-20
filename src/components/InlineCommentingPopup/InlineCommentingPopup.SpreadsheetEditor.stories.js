import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import core from 'core';
import rootReducer from 'reducers/rootReducer';
import DataElements from 'constants/dataElement';
import { setupNotesPanelCoreMocks } from 'src/helpers/storybookHelper';
import {
  SpreadsheetCommentState,
  SPREADSHEET_CELL_KEY,
  SPREADSHEET_COLUMN_KEY,
  SPREADSHEET_ROW_KEY,
  SPREADSHEET_SHEET_INDEX_KEY,
  SPREADSHEET_SHEET_NAME_KEY,
  SPREADSHEET_THREAD_ID_KEY,
  SPREADSHEET_COMMENT_STATE_KEY,
} from 'constants/spreadsheetEditor';
import { expect, waitFor } from 'storybook/test';
import InlineCommentingSpreadsheetEditorPopupContainer from './InlineCommentingSpreadsheetEditorPopupContainer';

const noop = () => { };
const chromaticModesDisabled = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};

export default {
  title: 'Components/InlineCommentPopup/SpreadsheetEditor',
  component: InlineCommentingSpreadsheetEditorPopupContainer,
};

const initialState = {
  viewer: {
    isOfficeEditorMode: false,
    isSpreadsheetEditorModeEnabled: true,
    activeDocumentViewerKey: 1,
    currentLanguage: 'en',
    customElementOverrides: {},
    disabledElements: {
      noteStateFlyout: { disabled: true },
      annotationNoteConnectorLine: { disabled: true },
    },
    flyoutMap: {},
    openElements: { [DataElements.INLINE_COMMENT_POPUP]: true },
    customPanels: [],
    unreadAnnotationIdSet: new Set(),
    colorMap: {},
    focusedElementsStack: [],
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    editMode: 'editing',
  },
  officeEditor: {},
};

const baseContext = {
  searchInput: '',
  resize: noop,
  isSelected: true,
  setCurAnnotId: noop,
  onTopNoteContentClicked: noop,
  isSpreadsheetEditorCommentAnnotation: true,
  pendingEditTextMap: {},
  pendingReplyMap: {},
  pendingAttachmentMap: {},
};

const createSSECommentAnnotation = ({ id = 'sse-popup-comment-1', contents = 'SSE popup comment', isReply = false } = {}) => {
  const annotation = new window.Core.Annotations.StickyAnnotation();
  annotation.Id = id;
  annotation.Author = 'Guest';
  annotation.DateCreated = new Date('2026-01-01T00:00:00Z');
  annotation.Listable = !isReply;
  annotation.isReply = () => isReply;
  annotation.isGrouped = () => false;
  annotation.getStatus = () => '';
  annotation.getContents = () => contents;
  annotation.getRichTextStyle = () => {};
  annotation.getReplies = () => [];
  annotation.getCustomData = (key) => {
    const customData = {
      [SPREADSHEET_THREAD_ID_KEY]: 'thread-sse-popup-comment-1',
      [SPREADSHEET_SHEET_INDEX_KEY]: '0',
      [SPREADSHEET_ROW_KEY]: '0',
      [SPREADSHEET_COLUMN_KEY]: '0',
      [SPREADSHEET_SHEET_NAME_KEY]: 'Sheet1',
      [SPREADSHEET_CELL_KEY]: 'A1',
      [SPREADSHEET_COMMENT_STATE_KEY]: SpreadsheetCommentState.OPEN,
      'trn-annot-preview': '',
    };
    return customData[key] ?? null;
  };
  return annotation;
};

const renderPopup = ({ isMobile = false, replyCount = 0 } = {}) => {
  const annotation = createSSECommentAnnotation();
  const replies = Array.from({ length: replyCount }, (_, index) => createSSECommentAnnotation({
    id: `sse-popup-reply-${index + 1}`,
    contents: `SSE popup reply ${index + 1}`,
    isReply: true,
  }));
  annotation.getReplies = () => replies;
  replies.forEach((reply) => {
    reply.InReplyTo = annotation.Id;
  });
  setupNotesPanelCoreMocks(core, [annotation, ...replies], [annotation]);
  core.getIsReadOnly = () => false;
  // Replies look up their root comment to decide whether they are editable.
  const baseAnnotationManager = core.getAnnotationManager;
  core.getAnnotationManager = (...args) => ({
    ...baseAnnotationManager(...args),
    getAnnotationById: (id) => (id === annotation.Id ? annotation : undefined),
  });

  const store = configureStore({
    reducer: rootReducer(),
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  return (
    <Provider store={store}>
      <InlineCommentingSpreadsheetEditorPopupContainer
        isMobile={isMobile}
        isUndraggable={false}
        isNotesPanelClosed={false}
        popupRef={{ current: null }}
        position={{ top: 0, left: 0 }}
        closeAndReset={noop}
        commentingAnnotation={annotation}
        contextValue={baseContext}
        annotationForAttachment={undefined}
        addAttachments={noop}
      />
    </Provider>
  );
};

export const Basic = () => renderPopup();

Basic.play = async ({ canvasElement }) => {
  await waitFor(() => {
    const popup = canvasElement.querySelector('.InlineCommentingSpreadsheetEditorPopup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent('SSE popup comment');
  });
};

export const WithManyReplies = () => renderPopup({ replyCount: 15 });

WithManyReplies.parameters = chromaticModesDisabled;
WithManyReplies.tags = ['vitest'];

WithManyReplies.play = async ({ canvasElement }) => {
  await waitFor(() => {
    const popup = canvasElement.querySelector('.InlineCommentingSpreadsheetEditorPopup');
    expect(popup).toBeInTheDocument();
    expect(popup.querySelectorAll('.reply')).toHaveLength(15);
  });

  // The popup caps its own height and scrolls, rather than growing with its replies.
  const popup = canvasElement.querySelector('.InlineCommentingSpreadsheetEditorPopup');
  expect(popup.scrollHeight).toBeGreaterThan(popup.clientHeight);
};
