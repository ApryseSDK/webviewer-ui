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
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';

const initialState = {
  viewer: {
    isOfficeEditorMode: true,
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
      noteStateFlyout: { disabled: true },
    },
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
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
    isNotesPanelMultiSelectEnabled: true,
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40,
    },
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: [],
    },
    pageLabels: ['1'],
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
  officeEditorMode = OfficeEditorEditMode.EDITING,
  officeEditorStream = initialState.officeEditor.stream,
  annotationList = [],
} = {}) => {
  annotationManagerReadOnly = isAnnotationManagerReadOnly;
  const state = {
    ...initialState,
    officeEditor: {
      ...initialState.officeEditor,
      editMode: officeEditorMode,
      stream: officeEditorStream,
    },
  };
  officeEditorStore = configureStore({ reducer: rootReducer, preloadedState: state });

  setupNotesPanelCoreMocks(core, [], []);
  addCommentThreadAtCurrentRangeMock.mockReset();
  addCommentThreadAtCurrentRangeMock.mockImplementation(() => Promise.resolve());
  core.getOfficeEditor = () => ({
    getCommentManager: () => ({
      addCommentThreadAtCurrentRange: addCommentThreadAtCurrentRangeMock,
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
  const store = configureStore({ reducer: () => state });

  return renderStoryWithPanel({
    store,
    panelLocation: 'left',
    dataElement: 'officeEditorReviewPanel',
  });
}
OEEmptyReviewPanel.parameters = window.storybook.disableRtlMode;

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
  const createOECommentAnnotations = () => {
    const reply = new window.Core.Annotations.StickyAnnotation();
    reply.Listable = true;
    reply.isReply = () => true;
    reply.getContents = () => 'Reply comment test';
    reply.getRichTextStyle = () => {};

    const textHighlight = new window.Core.Annotations.TextHighlightAnnotation();
    textHighlight.Listable = true;
    textHighlight.Id = '1';
    textHighlight.PageNumber = 1;
    textHighlight.ToolName = 'AnnotationCreateTextHighlight';
    textHighlight._replies = [reply];
    textHighlight.getContents = () => 'Highlight comment test';
    textHighlight.getReplies = () => [reply];
    textHighlight.getCustomData = (key) => {
      const customData = {
        'trn-annot-preview': '',
        'officeEditorCommentUID': '0',
      };
      return customData[key];
    };
    return { textHighlight, reply };
  };

  const { textHighlight, reply } = createOECommentAnnotations();
  return renderOfficeEditorCommentPanelStory({
    annotationList: [textHighlight, reply],
  });
}
OECommentPanelWithComments.parameters = chromaticModesDisabled;

const CommentPanelAddButtonTemplate = (args) => renderOfficeEditorCommentPanelStory(args);

export const OECommentPanelAddButtonHiddenStates = CommentPanelAddButtonTemplate.bind({});
OECommentPanelAddButtonHiddenStates.args = {
  officeEditorMode: OfficeEditorEditMode.PREVIEW,
  isAnnotationManagerReadOnly: false,
};
OECommentPanelAddButtonHiddenStates.parameters = chromaticModesDisabled;

OECommentPanelAddButtonHiddenStates.play = async ({ canvasElement }) => {
  const updateEditMode = (editMode) => officeEditorStore.dispatch(actions.setOfficeEditorEditMode(editMode));

  await expectAddCommentButtonHidden(within(canvasElement));

  updateEditMode(OfficeEditorEditMode.VIEW_ONLY);
  await expectAddCommentButtonHidden(within(canvasElement));

  annotationManagerReadOnly = true;
  updateEditMode(OfficeEditorEditMode.EDITING);
  await expectAddCommentButtonHidden(within(canvasElement));
};
