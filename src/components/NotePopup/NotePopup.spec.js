import React from 'react';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import core from 'core';
import NotePopupWithOutI18n, { notePopupFlyoutItems } from './NotePopup';
import NotePopupContainerWithOutI18n from './NotePopupContainer';
import { Basic, DifferentStates } from './NotePopup.stories';
import { configureStore } from '@reduxjs/toolkit';

const NotePopup = withI18n(NotePopupWithOutI18n);
const NotePopupContainer = withProviders(NotePopupContainerWithOutI18n);
const BasicStory = withI18n(Basic);
const DifferentStatesStory = withI18n(DifferentStates);

const DEFAULT_NOTES_PANEL_WIDTH = 293;

const initialState = {
  viewer: {
    documentContainerHeight: null,
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    isNotesPanelMultiSelectEnabled: true,
    disabledElements: {},
    openElements: {
      notesPanel: true,
      'notePopupFlyout-1': true,
    },
    panelWidths: {
      notesPanel: DEFAULT_NOTES_PANEL_WIDTH
    },
    sortStrategy: 'position',
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
    flyoutMap: {
      'notePopupFlyout-1': {
        dataElement: 'notePopupFlyout-1',
        items: notePopupFlyoutItems,
      }
    },
    activeFlyout: 'notePopupFlyout-1',
    flyoutToggleElement: 'notePopup-1',
    modularHeaders: { },
    modularHeadersHeight: {
      topHeaders: 49
    },
    modularComponents: {},
    activeTabInPanel: {},
    flyoutPosition: { x: 0, y: 0 },
  },
  officeEditor: {},
  featureFlags: { customizableUI: true },
};

const store = configureStore({ reducer: () => initialState });

jest.mock('core');

describe('NotePopup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Basic story should not throw error when rendering', () => {
    expect(() => {
      render(<BasicStory />);
    }).not.toThrow();
  });

  it('Check aria-pressed tag', () => {
    render(<BasicStory />);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('DifferentStates story should not throw error when rendering', () => {
    expect(() => {
      render(<DifferentStatesStory />);
    }).not.toThrow();
  });

  it('Should not throw errors if no props given', () => {
    expect(() => {
      render(
        <Provider store={store}>
          <NotePopup />
        </Provider>
      );
    }).not.toThrow();
  });

  it('Should show popup when enabled', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isEditable isDeletable noteId="1"/>
      </Provider>
    );
    expect(container.querySelector('.NotePopup')).toBeInTheDocument();
  });

  it('Should show popup options when isOpen is true', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isEditable isDeletable isOpen />
      </Provider>
    );
    expect(container.querySelector('div.note-popup-options')).toBeInTheDocument();
  });

  it('Should not show delete option if not deletable', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable isDeletable={false} />
      </Provider>
    );
    expect(container.querySelector('.note-popup-options')).toBeInTheDocument();
    expect(container.querySelector('button[data-element="notePopupDelete"]')).not.toBeInTheDocument();
  });

  it('Should not show edit option if not editable', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isEditable={false} isDeletable />
      </Provider>
    );
    expect(container.querySelector('.note-popup-options')).toBeInTheDocument();
    expect(container.querySelector('[data-element="notePopupEdit"]')).not.toBeInTheDocument();
  });

  it('Should not render component when not editable and not deletable', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable={false} isDeletable={false} />
      </Provider>
    );
    expect(container.querySelector('.NotePopup')).not.toBeInTheDocument();
  });
});

describe('NotePopupContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((callback) => callback({
      viewer: {
        activeDocumentViewerKey: 1,
        disabledElements: {}
      }
    }));
  });

  it('Should attach updateAnnotationPermission event listener on mount', () => {
    const addEventListenerMock = jest.spyOn(core, 'addEventListener');
    render(
      <NotePopupContainer/>
    );
    expect(addEventListenerMock).toHaveBeenCalledWith('updateAnnotationPermission', expect.any(Function), undefined, expect.any(Number));
  });

  it('Should remove updateAnnotationPermission event listener on unmount', () => {
    const removeEventListenerMock = jest.spyOn(core, 'removeEventListener');
    const { unmount } = render(
      <NotePopupContainer />
    );
    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('updateAnnotationPermission', expect.any(Function), expect.any(Number));
  });
});
