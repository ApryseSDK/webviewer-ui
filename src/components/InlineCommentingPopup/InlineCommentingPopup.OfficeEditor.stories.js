import React from 'react';
import InlineCommentingOfficeEditorPopupContainer from './InlineCommentingOfficeEditorPopupContainer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BASIC_PALETTE } from 'constants/commonColors';
import core from 'core';
import { setupNotesPanelCoreMocks } from 'src/helpers/storybookHelper';
import { expect, waitFor, within } from 'storybook/test';
import actions from 'actions';
import { OfficeEditorEditMode, OFFICE_EDITOR_COMMENT_KEY, OFFICE_EDITOR_TRACKED_CHANGE_KEY } from 'constants/officeEditor';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

import './InlineCommentingOfficeEditorPopup.scss';

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
  title: 'Components/InlineCommentPopup/OfficeEditor',
  component: InlineCommentingOfficeEditorPopupContainer,
};

const initialState = {
  viewer: {
    disabledElements: { noteStateFlyout: { disabled: true } },
    customElementOverrides: {},
    openElements: { inlineCommentPopup: true },
    customPanels: [],
    unreadAnnotationIdSet: new Set(),
    colorMap: [{ colorMapKey: () => BASIC_PALETTE[0] }],
    flyoutMap: {},
    focusedElementsStack: [],
    isOfficeEditorMode: true,
    currentLanguage: 'en',
    noteDateFormat: 'LLL',
  },
  officeEditor: {
    editMode: 'editing',
  },
  featureFlags: {
    customizableUI: true,
  }
};

const baseContext = {
  searchInput: '',
  resize: noop,
  isSelected: true,
  setCurAnnotId: noop,
  onTopNoteContentClicked: noop,
  pendingEditTextMap: {},
  pendingReplyMap: {},
  pendingAttachmentMap: {},
};

const createOfficeEditorCommentAnnotations = ({ includeReply = false } = {}) => {
  const reply = new window.Core.Annotations.StickyAnnotation();
  reply.isReply = () => true;
  reply.getContents = () => 'Inline reply test';
  reply.getRichTextStyle = () => {};

  const textHighlight = new window.Core.Annotations.TextHighlightAnnotation();
  textHighlight.getContents = () => 'Inline comment test';
  textHighlight.getReplies = () => (includeReply ? [reply] : []);
  textHighlight.getCustomData = (key) => {
    const customData = {
      'trn-annot-preview': '',
      [OFFICE_EDITOR_COMMENT_KEY]: '0',
    };
    return customData[key];
  };

  const trackedChange = new window.Core.Annotations.TextHighlightAnnotation();
  trackedChange.getContents = () => 'Inline tracked change test';
  trackedChange.getReplies = () => [];
  trackedChange.getCustomData = (key) => {
    const customData = {
      'trn-annot-preview': '',
      [OFFICE_EDITOR_TRACKED_CHANGE_KEY]: '1',
    };
    return customData[key];
  };

  const groupedHighlight = new window.Core.Annotations.TextHighlightAnnotation();
  groupedHighlight.getContents = () => 'Grouped inline comment test';
  groupedHighlight.getReplies = () => [];
  groupedHighlight.getCustomData = (key) => {
    const customData = {
      'trn-annot-preview': '',
      [OFFICE_EDITOR_COMMENT_KEY]: '0',
    };
    return customData[key];
  };

  return { textHighlight, groupedHighlight, reply, trackedChange };
};

const createStore = (stateOverrides = {}) => configureStore({
  reducer: () => ({
    ...initialState,
    ...stateOverrides,
  }),
});

const renderInlinePopup = ({ store, annotation, annotationsUnderMouse, contextOverrides = {} }) => (
  <Provider store={store}>
    <InlineCommentingOfficeEditorPopupContainer
      isMobile={false}
      isUndraggable={false}
      isNotesPanelClosed={false}
      popupRef={{ current: null }}
      position={{ top: 0, left: 0 }}
      closeAndReset={noop}
      commentingAnnotation={annotation}
      annotationsUnderMouse={annotationsUnderMouse || (annotation ? [annotation] : [])}
      contextValue={{
        ...baseContext,
        ...contextOverrides,
      }}
      annotationForAttachment={undefined}
      addAttachments={noop}
    />
  </Provider>
);


export const InlineCommentingPopupGrouped = () => {
  const { textHighlight, groupedHighlight } = createOfficeEditorCommentAnnotations();
  setupNotesPanelCoreMocks(core, [textHighlight, groupedHighlight], []);
  core.canModify = () => true;
  core.canModifyContents = () => true;
  core.getGroupAnnotations = (annotation) => (
    annotation === textHighlight ? [textHighlight, groupedHighlight] : [annotation]
  );

  return renderInlinePopup({
    store: createStore(),
    annotation: textHighlight,
  });
};

InlineCommentingPopupGrouped.parameters = chromaticModesDisabled;
InlineCommentingPopupGrouped.play = async ({ canvasElement }) => {
  const viewAllLabel = getTranslatedText('component.noteGroupSection.open');
  const canvas = within(canvasElement);

  await waitFor(() => {
    expect(canvas.queryByRole('button', { name: viewAllLabel })).not.toBeInTheDocument();
  });

  expect(canvas.queryByRole('tablist')).not.toBeInTheDocument();
};

export const InlineCommentingPopupWithReply = () => {
  const { textHighlight, reply } = createOfficeEditorCommentAnnotations({ includeReply: true });
  setupNotesPanelCoreMocks(core, [textHighlight, reply], [textHighlight]);
  core.canModify = () => true;
  core.canModifyContents = () => true;

  return renderInlinePopup({
    store: createStore(),
    annotation: textHighlight,
  });
};

InlineCommentingPopupWithReply.parameters = chromaticModesDisabled;
InlineCommentingPopupWithReply.play = async ({ canvasElement }) => {
  await waitFor(() => {
    expect(canvasElement.querySelector('.reply')).toBeInTheDocument();
  });
};


export const InlineCommentingPopupAnnotationManagerReadOnly = () => {
  const { textHighlight, reply } = createOfficeEditorCommentAnnotations({ includeReply: true });
  setupNotesPanelCoreMocks(core, [textHighlight, reply], [textHighlight]);
  core.canModify = () => false;
  core.canModifyContents = () => false;
  core.getIsReadOnly = () => true;

  return renderInlinePopup({
    store: createStore({
      viewer: {
        ...initialState.viewer,
        isReadOnly: true,
      },
    }),
    annotation: textHighlight,
  });
};

InlineCommentingPopupAnnotationManagerReadOnly.parameters = chromaticModesDisabled;
InlineCommentingPopupAnnotationManagerReadOnly.play = async ({ canvasElement }) => {
  await waitFor(() => {
    expect(canvasElement.querySelector('.reply')).toBeInTheDocument();
  });
  expect(core.getIsReadOnly()).toBe(true);
  expect(core.canModifyContents()).toBe(false);
  expect(canvasElement.querySelector('.reply-area-container')).not.toBeInTheDocument();
};

export const InlineCommentingPopupTabsWithChanges = () => {
  const { textHighlight, trackedChange } = createOfficeEditorCommentAnnotations();
  setupNotesPanelCoreMocks(core, [textHighlight, trackedChange], [trackedChange]);

  return renderInlinePopup({
    store: createStore(),
    annotation: trackedChange,
    annotationsUnderMouse: [trackedChange, textHighlight],
  });
};


InlineCommentingPopupTabsWithChanges.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const changesTab = canvas.getByRole('tab', { name: getTranslatedText('officeEditor.changes') });
  const commentTab = canvas.getByRole('tab', { name: getTranslatedText('officeEditor.comments') });

  expect(changesTab).toHaveAttribute('aria-selected', 'true');
  expect(commentTab).toHaveAttribute('aria-selected', 'false');
  expect(canvas.getByRole('tablist')).toBeInTheDocument();
};
