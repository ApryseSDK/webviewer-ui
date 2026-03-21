/* eslint-disable no-unsanitized/property */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import NotesPanel from './NotesPanelContainer';
import core from 'core';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { setupNotesPanelCoreMocks } from 'helpers/storybookHelper';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { OFFICE_EDITOR_SORT_STRATEGIES } from 'constants/sortStrategies';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import { disableRtlModeParameters } from 'helpers/storybookParams';

const initialState = {
  viewer: {
    isOfficeEditorMode: true,
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
      noteStateFlyout: { disabled: true },
    },
    flyoutMap: {},
    openElements: {
      notesPanel: true,
      header: true,
      panel: true,
      officeEditorCommentPanel: true,
      officeEditorReviewPanel: true,
    },
    panelWidths: {
      officeEditorCommentPanel: 330,
      officeEditorReviewPanel: 330,
    },
    sortStrategy: 'linePosition',
    isInDesktopOnlyMode: true,
    isNotesPanelMultiSelectEnabled: true,
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40,
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
    colorMap: {
      officeEditorComment: {
        iconColor: 'StrokeColor',
      },
    },
  },
  featureFlags: {
    customizableUI: true,
  },
  officeEditor: {
    editMode: 'editing',
    stream: 0,
  },
};

export default {
  title: 'Components/NotesPanel/OfficeEditor',
  component: NotesPanel,
};

const addCommentThreadAtCurrentRangeMock = fn(() => Promise.resolve());
const chromaticModesDisabled = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};

const expectAddCommentButtonHidden = async (canvas) => {
  await waitFor(() => {
    expect(canvas.queryByRole('button', { name: `${getTranslatedText('action.add')} ${getTranslatedText('action.comment')}` })).not.toBeInTheDocument();
  });
  expect(addCommentThreadAtCurrentRangeMock).not.toHaveBeenCalled();
};

const expectReplyAreaAndPopupButtonHidden = async (canvasElement) => {
  await waitFor(() => {
    expect(canvasElement.querySelector('.note-wrapper')).toBeInTheDocument();
    expect(canvasElement.querySelector('.reply-area-container')).not.toBeInTheDocument();
    expect(canvasElement.querySelector('.note-popup-toggle-trigger')).not.toBeInTheDocument();
  });
};

const createOECommentAnnotations = () => {
  const rect = new window.Core.Math.Rect(0, 0, 100, 20);
  const reply = new window.Core.Annotations.StickyAnnotation();
  reply.Listable = true;
  reply.isReply = () => true;
  reply.getContents = () => 'Reply comment test';
  reply.getRichTextStyle = () => {};
  reply.getRect = () => rect;
  reply.getPageNumber = () => 1;

  const createHighlight = ({ id, listable, contents, replies = [] }) => {
    const highlight = new window.Core.Annotations.TextHighlightAnnotation();
    highlight.Listable = listable;
    highlight.Id = id;
    highlight.PageNumber = 1;
    highlight.ToolName = 'AnnotationCreateTextHighlight';
    if (replies.length) {
      highlight._replies = replies;
      highlight.getReplies = () => replies;
    }
    highlight.getContents = () => contents;
    highlight.getRichTextStyle = () => {};
    highlight.getRect = () => rect;
    highlight.getPageNumber = () => 1;
    highlight.getCustomData = (key) => {
      const customData = {
        'trn-annot-preview': '',
        'officeEditorCommentUID': '0',
      };
      return customData[key];
    };
    return highlight;
  };

  const textHighlight = createHighlight({
    id: '1',
    listable: true,
    contents: 'Highlight comment test',
    replies: [reply],
  });

  const groupedHighlight = createHighlight({
    id: '2',
    listable: false,
    contents: 'Grouped highlight comment test',
  });

  return { textHighlight, reply, groupedHighlight };
};

const renderStoryWithPanel = ({
  store,
  panelLocation = 'right',
  dataElement = 'officeEditorCommentPanel',
}) => (
  <Provider store={store}>
    <Panel location={panelLocation} dataElement={dataElement}>
      <NotesPanel />
    </Panel>
  </Provider>
);

let officeEditorStore;
let annotationManagerReadOnly = false;

const renderOfficeEditorCommentPanelStory = ({
  isAnnotationManagerReadOnly = false,
  isDocumentReadOnly = false,
  officeEditorMode = OfficeEditorEditMode.EDITING,
  officeEditorStream = initialState.officeEditor.stream,
  annotationList = [],
  selectedAnnotations = [],
  getGroupAnnotations = null,
} = {}) => {
  annotationManagerReadOnly = isAnnotationManagerReadOnly;
  const state = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isReadOnly: isDocumentReadOnly,
    },
    officeEditor: {
      ...initialState.officeEditor,
      editMode: officeEditorMode,
      stream: officeEditorStream,
    },
  };
  officeEditorStore = configureStore({
    reducer: rootReducer,
    preloadedState: state,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  setupNotesPanelCoreMocks(core, annotationList, selectedAnnotations);
  if (getGroupAnnotations) {
    core.getGroupAnnotations = getGroupAnnotations;
  }
  const canModifyWhenNotReadOnly = !annotationManagerReadOnly && !isDocumentReadOnly;
  core.canModify = () => canModifyWhenNotReadOnly;
  core.canModifyContents = () => canModifyWhenNotReadOnly;
  addCommentThreadAtCurrentRangeMock.mockReset();
  addCommentThreadAtCurrentRangeMock.mockImplementation(() => Promise.resolve());
  const addDeletePermission = { allowed: !annotationManagerReadOnly && !isDocumentReadOnly };
  core.getOfficeEditor = () => ({
    getCommentManager: () => ({
      addCommentThreadAtCurrentRange: addCommentThreadAtCurrentRangeMock,
      getAddDeletePermission: () => addDeletePermission,
    }),
  });
  core.getAnnotationManager = () => ({
    getFormFieldCreationManager: () => ({
      isInFormFieldCreationMode: () => false,
    }),
  });
  core.getIsReadOnly = () => annotationManagerReadOnly;
  core.getAnnotationsList = () => annotationList;

  return renderStoryWithPanel({ store: officeEditorStore });
};
export function OEEmptyReviewPanel() {
  const state = { ...initialState };
  const store = configureStore({
    reducer: () => state,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  return renderStoryWithPanel({
    store,
    panelLocation: 'left',
    dataElement: 'officeEditorReviewPanel',
  });
}
OEEmptyReviewPanel.parameters = disableRtlModeParameters;

export function OEEmptyCommentPanel() {
  return renderOfficeEditorCommentPanelStory();
}
OEEmptyCommentPanel.parameters = chromaticModesDisabled;

OEEmptyCommentPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const addCommentLabel = `${getTranslatedText('action.add')} ${getTranslatedText('action.comment')}`;
  const addButton = await canvas.findByRole('button', { name: addCommentLabel });
  await expect(addButton).toBeEnabled();
  await userEvent.click(addButton);
  await waitFor(() => expect(addCommentThreadAtCurrentRangeMock).toHaveBeenCalledTimes(1));
};

export function OECommentPanelInHeaderStream() {
  return renderOfficeEditorCommentPanelStory({
    officeEditorStream: 1,
  });
}
OECommentPanelInHeaderStream.parameters = chromaticModesDisabled;

export function OECommentPanelWithComments() {
  const { textHighlight: textHighlight1, reply: reply1 } = createOECommentAnnotations();
  return renderOfficeEditorCommentPanelStory({
    annotationList: [textHighlight1, reply1],
    selectedAnnotations: [textHighlight1],
  });
}
OECommentPanelWithComments.parameters = chromaticModesDisabled;
OECommentPanelWithComments.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);

  await waitFor(() => {
    expect(canvasElement.querySelector('.reply-area-container')).toBeInTheDocument();
  });

  const attachmentButton = canvasElement.querySelector('[data-element="addReplyAttachmentButton"]');
  expect(attachmentButton).not.toBeInTheDocument();

  const notes = canvasElement.querySelectorAll('.note-wrapper');
  expect(notes.length).toBe(1);

  const sortDropdown = await canvas.findByRole('combobox');
  await userEvent.click(sortDropdown);
  await body.findByRole('listbox');

  for (const key of OFFICE_EDITOR_SORT_STRATEGIES) {
    expect(body.getByRole('option', { name: getTranslatedText(`option.notesOrder.${key}`) })).toBeInTheDocument();
  }

  const hiddenSortOptionKeys = ['modifiedDate', 'status', 'type', 'color'];
  for (const key of hiddenSortOptionKeys) {
    expect(body.queryByRole('option', { name: getTranslatedText(`option.notesOrder.${key}`) })).not.toBeInTheDocument();
  }

  await userEvent.keyboard('{Escape}');
  await waitFor(() => {
    expect(body.queryByRole('listbox')).not.toBeInTheDocument();
  });
};

export function OECommentPanelWithHiddenGroupedComments() {
  const { textHighlight, reply, groupedHighlight } = createOECommentAnnotations();
  return renderOfficeEditorCommentPanelStory({
    annotationList: [textHighlight, reply],
    selectedAnnotations: [textHighlight],
    getGroupAnnotations: (annotation) => (
      annotation === textHighlight ? [textHighlight, groupedHighlight] : [annotation]
    ),
  });
}
OECommentPanelWithHiddenGroupedComments.parameters = chromaticModesDisabled;
OECommentPanelWithHiddenGroupedComments.play = async ({ canvasElement }) => {
  await waitFor(() => {
    expect(canvasElement.querySelector('.note-wrapper')).toBeInTheDocument();
  });

  const viewAllLabel = getTranslatedText('component.noteGroupSection.open');
  const canvas = within(canvasElement);
  expect(canvas.queryByRole('button', { name: viewAllLabel })).not.toBeInTheDocument();
};

const CommentPanelAddButtonTemplate = (args) => renderOfficeEditorCommentPanelStory(args);

export const OECommentPanelViewOnlyAndPreview = CommentPanelAddButtonTemplate.bind({});
const { textHighlight: viewOnlyTextHighlight, reply: viewOnlyReply } = createOECommentAnnotations();
OECommentPanelViewOnlyAndPreview.args = {
  officeEditorMode: OfficeEditorEditMode.PREVIEW,
  isAnnotationManagerReadOnly: false,
  annotationList: [viewOnlyTextHighlight, viewOnlyReply],
  selectedAnnotations: [viewOnlyTextHighlight],
};
OECommentPanelViewOnlyAndPreview.parameters = chromaticModesDisabled;

OECommentPanelViewOnlyAndPreview.play = async ({ canvasElement }) => {
  const updateEditMode = (editMode) => officeEditorStore.dispatch(actions.setOfficeEditorEditMode(editMode));

  await expectAddCommentButtonHidden(within(canvasElement));
  await expectReplyAreaAndPopupButtonHidden(canvasElement);

  updateEditMode(OfficeEditorEditMode.VIEW_ONLY);
  await expectAddCommentButtonHidden(within(canvasElement));
  await expectReplyAreaAndPopupButtonHidden(canvasElement);
};

export const OECommentPanelReadOnlyMode = CommentPanelAddButtonTemplate.bind({});
OECommentPanelReadOnlyMode.args = {
  officeEditorMode: OfficeEditorEditMode.EDITING,
  isAnnotationManagerReadOnly: true,
  isDocumentReadOnly: true,
  annotationList: [viewOnlyTextHighlight, viewOnlyReply],
  selectedAnnotations: [viewOnlyTextHighlight],
};
OECommentPanelReadOnlyMode.parameters = chromaticModesDisabled;

OECommentPanelReadOnlyMode.play = async ({ canvasElement }) => {
  await expectAddCommentButtonHidden(within(canvasElement));
  await expectReplyAreaAndPopupButtonHidden(canvasElement);
};
