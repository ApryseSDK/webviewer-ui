/* eslint-disable no-unsanitized/property */
import React, { useEffect, useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import NotesPanel from './NotesPanelContainer';
import RightPanel from '../RightPanel';
import Panel from 'components/Panel';
import { default as mockAppState } from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import core from 'core';
import { userEvent, within, expect, waitFor } from '@storybook/test';


export default {
  title: 'Components/NotesPanel/NotesPanel',
  component: NotesPanel,
};

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const DEFAULT_NOTES_PANEL_WIDTH = 293;

const initialState = {
  viewer: {
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
    },
    openElements: {
      notesPanel: true,
      header: true,
      panel: true,
    },
    panelWidths: { notesPanel: DEFAULT_NOTES_PANEL_WIDTH },
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
    isNotesPanelMultiSelectEnabled: true,
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
    unreadAnnotationIdSet: new Set(),
  },
  featureFlags: {
    customizableUI: true,
  },
  officeEditor: {
    editMode: 'editing'
  },
};

const createCustomStore = (customState, context) => {
  const baseState = {
    ...mockAppState,
    viewer: {
      ...mockAppState.viewer,
      openElements: {
        notesPanel: true,
      },
      activeTheme: context?.globals?.theme,
      selectedScale: undefined,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const mergedState = {
    ...baseState,
    ...(customState || {}),
  };

  return configureStore({
    reducer: () => mergedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
  });
};

export function Basic() {
  initialState.viewer.notesPanelCustomEmptyPanel = undefined;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
}

export function BasicInGenericPanel() {
  initialState.viewer.notesPanelCustomEmptyPanel = undefined;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <Panel location={'right'} dataElement={'panel'}>
        <NotesPanel isCustomPanelOpen={true} isCustomPanel={true} />
      </Panel>
    </Provider>
  );
}
export function BasicInGenericPanelOnLeft() {
  initialState.viewer.notesPanelCustomEmptyPanel = undefined;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <NotesPanel isCustomPanelOpen={true} isCustomPanel={true} />
      </Panel>
    </Provider>
  );
}

export function EmptyWithCustomIconAndMessage() {
  initialState.viewer.notesPanelCustomEmptyPanel = {
    // eslint-disable-next-line custom/no-hex-colors
    icon: '<svg width="75" height="62" viewBox="0 0 75 62" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.8558 32.4497C18.8558 30.6273 18.8558 28.8136 18.8558 26.9912C18.8558 24.0944 18.8558 21.189 18.8558 18.2922C18.8558 17.6217 18.8558 16.9598 18.8558 16.2893C17.9632 17.1489 17.0705 18.0085 16.1779 18.8681C18.0792 18.8681 19.9895 18.8681 21.8909 18.8681C24.908 18.8681 27.9341 18.8681 30.9513 18.8681C31.6476 18.8681 32.3438 18.8681 33.0401 18.8681C34.4416 18.8681 35.7806 17.6819 35.7181 16.2893C35.6556 14.8882 34.5398 13.7105 33.0401 13.7105C31.1388 13.7105 29.2285 13.7105 27.3271 13.7105C24.3099 13.7105 21.2839 13.7105 18.2667 13.7105C17.5704 13.7105 16.8741 13.7105 16.1779 13.7105C14.7318 13.7105 13.4999 14.8882 13.4999 16.2893C13.4999 18.1116 13.4999 19.9254 13.4999 21.7477C13.4999 24.6446 13.4999 27.55 13.4999 30.4468C13.4999 31.1173 13.4999 31.7792 13.4999 32.4497C13.4999 33.7992 14.7318 35.0886 16.1779 35.0284C17.6329 34.9683 18.8558 33.8938 18.8558 32.4497Z" fill="#CFD4DA"/><path d="M55.5805 28.9452C55.5805 30.7675 55.5805 32.5812 55.5805 34.4035C55.5805 37.3004 55.5805 40.2058 55.5805 43.1026C55.5805 43.7731 55.5805 44.4349 55.5805 45.1054C56.4742 44.2458 57.3679 43.3862 58.2616 42.5267C56.3581 42.5267 54.4456 42.5267 52.542 42.5267C49.5213 42.5267 46.4917 42.5267 43.471 42.5267C42.7739 42.5267 42.0769 42.5267 41.3798 42.5267C39.9767 42.5267 38.6361 43.7129 38.6987 45.1054C38.7613 46.5065 39.8784 47.6842 41.3798 47.6842C43.2833 47.6842 45.1958 47.6842 47.0994 47.6842C50.1201 47.6842 53.1497 47.6842 56.1704 47.6842C56.8675 47.6842 57.5645 47.6842 58.2616 47.6842C59.7094 47.6842 60.9427 46.5065 60.9427 45.1054C60.9427 43.2831 60.9427 41.4694 60.9427 39.647C60.9427 36.7502 60.9427 33.8448 60.9427 30.948C60.9427 30.2775 60.9427 29.6156 60.9427 28.9452C60.9427 27.5956 59.7094 26.3062 58.2616 26.3664C56.8049 26.4266 55.5805 27.5011 55.5805 28.9452Z" fill="#CFD4DA"/><path d="M67.5 0.711227H7.5C3.36375 0.711227 0 3.95039 0 7.93345V54.1557C0 58.1387 3.36375 61.3779 7.5 61.3779H67.5C71.6362 61.3779 75 58.1387 75 54.1557L75 7.93345C75 3.95039 71.6362 0.711227 67.5 0.711227ZM7.5 54.1557V7.93345H67.5L67.5075 54.1557H7.5Z" fill="#CFD4DA"/></svg>',
    message: 'Custom empty panel message.'
  };

  const store = configureStore({ reducer: () => initialState });

  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
}
export function EmptyWithMultiSelectEnabled() {
  initialState.viewer.isNotesPanelMultiSelectEnabled = true;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
}

export function EmptyWithMultiSelectDisabled() {
  initialState.viewer.isNotesPanelMultiSelectEnabled = false;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
}

export function EmptyWithCustomRenderCallback() {
  initialState.viewer.notesPanelCustomEmptyPanel = {
    render: () => {
      const div = document.createElement('div');
      const header = document.createElement('h2');
      header.innerHTML = 'Custom empty content goes here!';
      div.appendChild(header);
      return div;
    }
  };

  const store = configureStore({ reducer: () => initialState });

  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
}

const NotesPanelInApp = (context, location, panelSize) => {
  const mockState = {
    ...mockAppState,
    viewer: {
      ...mockAppState.viewer,
      activeCustomRibbon: 'toolbarGroup-Insert',
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'notesPanel',
        render: 'notesPanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        notesPanel: true,
      },
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  if (panelSize) {
    mockState.viewer.mobilePanelSize = panelSize;
  }

  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export const NotesPanelInMobile = (args, context) => NotesPanelInApp(context, 'right');

NotesPanelInMobile.parameters = window.storybook?.MobileParameters;

const createTestAnnotations = () => {
  const rectangle = new window.Core.Annotations.RectangleAnnotation();
  rectangle.Listable = true;
  rectangle.Id = '123';
  rectangle.PageNumber = 1;
  rectangle.ToolName = 'AnnotationCreateRectangle';

  const widget1 = new window.Core.Annotations.TextWidgetAnnotation();
  widget1.Listable = true;
  widget1.Id = '456';
  widget1.PageNumber = 1;
  widget1.ToolName = 'AnnotationCreateTextWidget';

  const widget2 = new window.Core.Annotations.ChoiceWidgetAnnotation();
  widget2.Listable = false;
  widget2.Id = '789';
  widget2.PageNumber = 1;
  widget2.ToolName = 'AnnotationCreateChoiceWidget';

  return { rectangle, widget1, widget2 };
};

const setupCoreMocks = (annotations, selectedAnnotations) => {
  core.getAnnotationsList = () => annotations;
  core.getSelectedAnnotations = () => selectedAnnotations;
  core.getDisplayModeObject = () => ({
    pageToWindow: () => ({ x: 0, y: 0 }),
  });
};

export function NotesPanelWithNotes(args, context) {
  const { rectangle, widget1, widget2 } = createTestAnnotations();
  const store = createCustomStore(null, context);

  setupCoreMocks([rectangle, widget1, widget2], [rectangle]);

  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
}

NotesPanelWithNotes.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const listItems = await canvas.findAllByRole('listitem');
  expect(listItems.length).toBe(1);
};

const customNoteFunction = () => { };
export const NotesPanelNotesWithComments = (args, context) => {
  const mockState = {
    ...mockAppState,
    viewer: {
      ...mockAppState.viewer,
      openElements: {
        notesPanel: true,
      },
      activeTheme: context.globals.theme,
      colorMap: {
        rectangle: {
          currentStyleTab: 'StrokeColor',
          iconColor: 'StrokeColor'
        },
      },
      selectedScale: undefined,
      customNoteFunction: customNoteFunction
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = configureStore({
    reducer: () => mockState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  });

  const replyAnnot = new window.Core.Annotations.StickyAnnotation();
  replyAnnot.Listable = true;
  replyAnnot.isReply = () => true;
  replyAnnot.getContents = () => 'Reply comment test';
  replyAnnot.getRichTextStyle = () => ({ '0':{},'13':{ 'font-weight':'bold' },'18':{} });

  const annotationsList = window.Core.documentViewer.getAnnotationManager().getAnnotationsList();
  const rectangle = annotationsList.find((item) => item instanceof window.Core.Annotations.RectangleAnnotation);
  rectangle.Listable = true;
  rectangle.getContents = () => 'Test comment https://google.ca test';
  rectangle.getRichTextStyle = () => ({ '0':{},'13':{ 'font-weight':'bold' },'30':{} });
  rectangle._replies = [replyAnnot];
  rectangle.getReplies = () => [replyAnnot];
  rectangle.getCustomData = (key) => {
    const customData = {
      'trn-annot-preview': 'Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no one has gone before.',
    };

    return customData[key];
  };

  core.getAnnotationsList = () => [rectangle, replyAnnot];
  core.getSelectedAnnotations = () => [rectangle];

  return (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  );
};

NotesPanelNotesWithComments.parameters = {
  chromatic: { delay: 500 },
};

NotesPanelNotesWithComments.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByRole('button', { name: /Multi Select/i })).toBeVisible();

  await waitFor(async () => {
    await expect(canvas.getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });

  const textElement = await canvas.getByText(/Test comment/i);
  await expect(textElement).toBeInTheDocument();

  await userEvent.click(textElement);
  await expect(customNoteFunction).toHaveBeenCalled;

  const link = await canvas.getByRole('link', { name: /google.ca/i });
  await expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', 'https://google.ca');
  expect(link).toHaveAttribute('target', '_blank');
  link.removeAttribute('target');
  link.setAttribute('onclick', 'return false;');

  await userEvent.click(link);

  const preview = await canvas.getByText(/Space, the final frontier. These are the voyages of the Starship Enterprise/i);
  expect(preview).toBeInTheDocument();

  // Check computed style (text should be selectable and interactable)
  const computedStyle = window.getComputedStyle(preview);
  expect(computedStyle.pointerEvents).not.toBe('none');
  expect(computedStyle.userSelect).not.toBe('none');

  const replyTextElement = await canvas.getByText(/Reply comment/i);
  await expect(replyTextElement).toBeInTheDocument();
};

export function NotesPanelWithNotesInFormFieldMode(args, context) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const originalAnnotationManager = core.getAnnotationManager;
    const mockFormFieldManager = {
      isInFormFieldCreationMode: () => true,
      addEventListener: noop,
      removeEventListener: noop,
    };

    const mockAnnotationManager = () => {
      const originalManager = originalAnnotationManager();
      return {
        ...originalManager,
        getFormFieldCreationManager: () => mockFormFieldManager,
      };
    };

    core.getAnnotationManager = mockAnnotationManager;

    setShouldRender(true);

    return () => {
      core.getAnnotationManager = originalAnnotationManager;
    };
  }, []);

  const store = createCustomStore(null, context);
  const { rectangle, widget1, widget2 } = createTestAnnotations();

  setupCoreMocks([rectangle, widget1, widget2], [widget1]);

  return shouldRender ? (
    <Provider store={store}>
      <RightPanel dataElement="notesPanel" onResize={noop}>
        <NotesPanel />
      </RightPanel>
    </Provider>
  ) : <>Loading...</>;
}

NotesPanelWithNotesInFormFieldMode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const listItems = await canvas.findAllByRole('listitem');
  expect(listItems.length).toBe(3);
};