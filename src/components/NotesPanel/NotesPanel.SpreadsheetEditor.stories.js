/* eslint-disable no-unsanitized/property */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import NotesPanel from './NotesPanelContainer';
import core from 'core';
import { expect, within, fn, userEvent, waitFor } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { setupNotesPanelCoreMocks } from 'helpers/storybookHelper';
import DataElements from 'constants/dataElement';
import { panelMinWidth } from 'constants/panel';
import rootReducer from 'reducers/rootReducer';
import { SpreadsheetCommentState, SPREADSHEET_CELL_KEY, SPREADSHEET_COLUMN_KEY, SPREADSHEET_ROW_KEY, SPREADSHEET_SHEET_INDEX_KEY, SPREADSHEET_SHEET_NAME_KEY, SPREADSHEET_THREAD_ID_KEY, SPREADSHEET_COMMENT_STATE_KEY } from 'constants/spreadsheetEditor';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';

const initialState = {
  viewer: {
    isOfficeEditorMode: false,
    isSpreadsheetEditorModeEnabled: true,
    activeDocumentViewerKey: 1,
    currentLanguage: 'en',
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
      noteStateFlyout: { disabled: true },
      annotationNoteConnectorLine: { disabled: true },
      [DataElements.NOTE_MULTI_SELECT_MODE_BUTTON]: { disabled: true },
      [DataElements.NotesPanel.DefaultHeader.FILTER_ANNOTATION_BUTTON]: { disabled: true },
    },
    flyoutMap: {},
    flyoutPosition: { x: 0, y: 0 },
    modularComponents: {},
    activeTabInPanel: {},
    openElements: {
      notesPanel: true,
      header: true,
      panel: true,
      [DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL]: true,
    },
    panelWidths: {
      [DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL]: panelMinWidth,
    },
    sortStrategy: 'linePosition',
    isInDesktopOnlyMode: true,
    isNotesPanelMultiSelectEnabled: true,
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 49,
      bottomHeaders: 45,
    },
    genericPanels: [],
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: [],
    },
    pageLabels: { 1: ['1'] },
    unreadAnnotationIdSet: new Set(),
    colorMap: {},
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    editMode: 'editing',
    activeCellRange: '',
    cellProperties: {
      topLeftRow: null,
      topLeftColumn: null,
    },
  },
  officeEditor: {
    editMode: 'editing',
    stream: 0,
    cursorProperties: {
      paragraphProperties: {},
      locationProperties: {},
    },
  },
};

export default {
  title: 'Components/NotesPanel/SpreadsheetEditor',
  component: NotesPanel,
};

const chromaticModesDisabled = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};

const renderStoryWithPanel = ({ store, dataElement = DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL }) => (
  <Provider store={store}>
    <Panel location="right" dataElement={dataElement}>
      <NotesPanel />
    </Panel>
    <FlyoutContainer />
  </Provider>
);

const renderSSECommentPanelStory = () => {
  const store = configureStore({
    reducer: rootReducer(),
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  setupNotesPanelCoreMocks(core, [], []);
  core.getIsReadOnly = () => false;
  core.getAnnotationsList = () => [];
  // The shared documentViewer mock from setupNotesPanelCoreMocks doesn't include
  // getSpreadsheetEditorManager, so stub it here to avoid a crash in NotesPanel's
  // active-sheet-tracking effect.
  core.getDocumentViewer().getSpreadsheetEditorManager = () => undefined;

  return renderStoryWithPanel({ store });
};

export function SSEEmptyCommentPanel() {
  return renderSSECommentPanelStory();
}
SSEEmptyCommentPanel.parameters = chromaticModesDisabled;

SSEEmptyCommentPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const addCommentLabel = `${getTranslatedText('action.add')} ${getTranslatedText('action.comment')}`;
  const addButton = await canvas.findByRole('button', { name: addCommentLabel });
  await expect(addButton).toBeEnabled();
};

const deleteCommentMock = fn(() => undefined);

const createSSECommentAnnotation = ({
  id = 'sse-comment-id-1',
  author = 'Guest',
  contents = 'SSE Comment test',
  status = '',
  createdDate = new Date('2026-01-01T00:00:00Z'),
  modifiedDate,
  sheetIndex = 0,
  row = 0,
  column = 0,
  sheetName = 'Sheet1',
  cell = 'A1',
} = {}) => {
  const rect = new window.Core.Math.Rect(0, 0, 100, 20);
  const annotation = new window.Core.Annotations.StickyAnnotation();
  annotation.Id = id;
  annotation.Author = author;
  annotation.DateCreated = createdDate;
  annotation.DateModified = modifiedDate;
  annotation.Listable = true;
  annotation.isReply = () => false;
  annotation.isGrouped = () => false;
  annotation.isContentEditPlaceholder = () => false;
  annotation.getStatus = () => status;
  annotation.getContents = () => contents;
  annotation.getRichTextStyle = () => {};
  annotation.getRect = () => rect;
  annotation.getPageNumber = () => 1;
  annotation.getReplies = () => [];
  annotation.getCustomData = (key) => {
    const customData = {
      [SPREADSHEET_THREAD_ID_KEY]: `thread-${id}`,
      [SPREADSHEET_SHEET_INDEX_KEY]: String(sheetIndex),
      [SPREADSHEET_ROW_KEY]: String(row),
      [SPREADSHEET_COLUMN_KEY]: String(column),
      [SPREADSHEET_SHEET_NAME_KEY]: sheetName,
      [SPREADSHEET_CELL_KEY]: cell,
      [SPREADSHEET_COMMENT_STATE_KEY]: SpreadsheetCommentState.OPEN,
      'trn-annot-preview': '',
    };
    return customData[key] ?? null;
  };
  return annotation;
};

const renderSSECommentPanelWithComments = () => {
  const annotation = createSSECommentAnnotation();
  const store = configureStore({
    reducer: rootReducer(),
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  setupNotesPanelCoreMocks(core, [annotation], [annotation]);
  core.getIsReadOnly = () => false;
  core.getAnnotationsList = () => [annotation];
  deleteCommentMock.mockReset();
  const baseDocumentViewer = core.getDocumentViewer();
  core.getDocumentViewer = () => ({
    ...baseDocumentViewer,
    getSpreadsheetEditorManager: () => ({
      getWorkbook: () => null,
      getCommentManager: () => ({
        deleteComment: deleteCommentMock,
      }),
    }),
  });

  return renderStoryWithPanel({ store });
};

export function SSECommentPanelWithComments() {
  return renderSSECommentPanelWithComments();
}
SSECommentPanelWithComments.parameters = chromaticModesDisabled;

SSECommentPanelWithComments.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);

  await waitFor(() => {
    expect(canvasElement.querySelector('.note-wrapper')).toBeInTheDocument();
  });

  await userEvent.click(canvasElement.querySelector('.note-wrapper'));

  const optionsButton = await canvas.findByRole('button', { name: getTranslatedText('formField.formFieldPopup.options') });
  await userEvent.click(optionsButton);

  const deleteLabel = getTranslatedText('action.delete');
  await waitFor(() => {
    expect(body.getByText(deleteLabel)).toBeInTheDocument();
  });

  await userEvent.click(body.getByText(deleteLabel));
  await waitFor(() => {
    expect(deleteCommentMock).toHaveBeenCalledWith('sse-comment-id-1');
  });
};

export function SSECommentPanelWithPendingReply() {
  return renderSSECommentPanelWithComments();
}
SSECommentPanelWithPendingReply.parameters = chromaticModesDisabled;

SSECommentPanelWithPendingReply.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await waitFor(() => {
    expect(canvasElement.querySelector('.note-wrapper')).toBeInTheDocument();
  });
  await userEvent.click(canvasElement.querySelector('.note-wrapper'));

  const replyField = await canvas.findByRole('generic', { name: getTranslatedText('action.reply') });
  await userEvent.type(replyField, 'Draft reply');

  await expect(replyField).toHaveTextContent('Draft reply');
};

export function SSECommentPanelSorting() {
  const commentAtB1 = createSSECommentAnnotation({
    id: 'sse-comment-b1',
    author: 'Alice',
    contents: 'Comment at B1',
    status: 'Rejected',
    createdDate: new Date('2026-01-01T00:00:00Z'),
    modifiedDate: new Date('2026-01-01T00:00:00Z'),
    column: 1,
    cell: 'B1',
  });
  const commentAtA1 = createSSECommentAnnotation({
    id: 'sse-comment-a1',
    author: 'Zoe',
    contents: 'Comment at A1',
    status: 'Accepted',
    createdDate: new Date('2026-01-03T00:00:00Z'),
    modifiedDate: new Date('2026-01-02T00:00:00Z'),
  });
  const commentAtC1 = createSSECommentAnnotation({
    id: 'sse-comment-c1',
    author: 'Mike',
    contents: 'Comment at C1',
    status: 'Completed',
    createdDate: new Date('2026-01-02T00:00:00Z'),
    modifiedDate: new Date('2026-01-03T00:00:00Z'),
    column: 2,
    cell: 'C1',
  });
  const comments = [commentAtB1, commentAtC1, commentAtA1];
  const store = configureStore({
    reducer: rootReducer(),
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  setupNotesPanelCoreMocks(core, comments, comments);
  core.getIsReadOnly = () => false;
  core.getAnnotationsList = () => comments;
  core.getDocumentViewer().getSpreadsheetEditorManager = () => undefined;

  return renderStoryWithPanel({ store });
}
SSECommentPanelSorting.parameters = chromaticModesDisabled;

SSECommentPanelSorting.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  const getRenderedComments = () => Array.from(canvasElement.querySelectorAll('.note-wrapper'));
  const getRenderedSeparators = () => Array.from(canvasElement.querySelectorAll('h4.ListSeparator'));
  const expectCommentOrderAndSeparators = async (expectedContents, expectedSeparators) => {
    await waitFor(() => {
      const renderedComments = getRenderedComments();
      expect(renderedComments).toHaveLength(expectedContents.length);
      expectedContents.forEach((contents, index) => {
        expect(renderedComments[index]).toHaveTextContent(contents);
      });

      const renderedSeparators = getRenderedSeparators();
      expect(renderedSeparators).toHaveLength(expectedSeparators.length);
      expectedSeparators.forEach((separator, index) => {
        expect(renderedSeparators[index]).toHaveTextContent(separator);
      });
    });
  };
  const selectSortOption = async (sortDropdown, optionKey, expectedContents, expectedSeparators) => {
    await userEvent.click(sortDropdown);
    await userEvent.click(body.getByRole('option', { name: getTranslatedText(`option.notesOrder.${optionKey}`) }));
    await expectCommentOrderAndSeparators(expectedContents, expectedSeparators);
  };

  expect(canvas.queryByRole('button', { name: getTranslatedText('component.filter') })).not.toBeInTheDocument();
  expect(canvas.queryByRole('button', { name: getTranslatedText('component.multiSelectButton') })).not.toBeInTheDocument();
  await expectCommentOrderAndSeparators(['Comment at A1', 'Comment at B1', 'Comment at C1'], ['Sheet1']);

  const sortDropdown = await canvas.findByRole('combobox');
  expect(sortDropdown).toHaveTextContent(getTranslatedText('option.notesOrder.spreadsheetPosition'));
  await selectSortOption(sortDropdown, 'author', ['Comment at B1', 'Comment at C1', 'Comment at A1'], ['Alice', 'Mike', 'Zoe']);
  await selectSortOption(sortDropdown, 'status', ['Comment at A1', 'Comment at C1', 'Comment at B1'], ['Accepted', 'Completed', 'Rejected']);
  await selectSortOption(sortDropdown, 'createdDate', ['Comment at B1', 'Comment at C1', 'Comment at A1'], ['Jan 1, 2026', 'Jan 2, 2026', 'Jan 3, 2026']);
  await selectSortOption(sortDropdown, 'modifiedDate', ['Comment at C1', 'Comment at A1', 'Comment at B1'], ['Jan 3, 2026', 'Jan 2, 2026', 'Jan 1, 2026']);
};
