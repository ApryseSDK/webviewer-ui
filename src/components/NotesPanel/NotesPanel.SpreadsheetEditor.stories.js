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
import rootReducer from 'reducers/rootReducer';
import { SPREADSHEET_THREAD_ID_KEY } from 'constants/spreadsheetEditor';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';

const initialState = {
  viewer: {
    isOfficeEditorMode: false,
    isSpreadsheetEditorModeEnabled: true,
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
      noteStateFlyout: { disabled: true },
      annotationNoteConnectorLine: { disabled: true },
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
      [DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL]: 330,
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

const createSSECommentAnnotation = () => {
  const rect = new window.Core.Math.Rect(0, 0, 100, 20);
  const annotation = new window.Core.Annotations.StickyAnnotation();
  annotation.Id = 'sse-comment-id-1';
  annotation.Listable = true;
  annotation.isReply = () => false;
  annotation.isGrouped = () => false;
  annotation.isContentEditPlaceholder = () => false;
  annotation.getContents = () => 'SSE Comment test';
  annotation.getRichTextStyle = () => {};
  annotation.getRect = () => rect;
  annotation.getPageNumber = () => 1;
  annotation.getReplies = () => [];
  annotation.getCustomData = (key) => {
    const customData = {
      [SPREADSHEET_THREAD_ID_KEY]: 'thread-1',
      spreadsheetSheetIndex: '0',
      spreadsheetRow: '0',
      spreadsheetColumn: '0',
      spreadsheetSheetName: 'Sheet1',
      spreadsheetCell: 'A1',
      'trn-annot-preview': '',
    };
    return customData[key] ?? null;
  };
  return annotation;
};

export function SSECommentPanelWithComments() {
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
