import React from 'react';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import core from 'core';
import NotePopupWithOutI18n from './NotePopup';
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
      notesPanel: true
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
  },
  officeEditor: {},
  featureFlags: { customizableUI: true },
};

function createDisabledStateForDataElement(dataElement) {
  const state = { viewer: { disabledElements: {}, customElementOverrides: {} } };
  state.viewer.disabledElements[dataElement] = { disabled: true };
  return state;
}

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

  it('Check aria-extanded tag', () => {
    const { container } = render(<BasicStory />);
    const btn = container.querySelector('[data-element="notePopupButtonClass"]');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    btn.click();

    const btn2 = container.querySelector('[data-element="notePopupButtonClass"]');
    expect(btn2.getAttribute('aria-expanded')).toBe('true');
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
        <NotePopup isEditable isDeletable />
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

  it('Should show popup options when isOpen is true', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isEditable isDeletable isOpen={false} />
      </Provider>
    );
    expect(container.querySelector('div.note-popup-options')).not.toBeInTheDocument();
  });

  it('Should not show component if disabled', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue(true);
    const { container } = render(
      <Provider store={store}>
        <NotePopup isEditable isDeletable />
      </Provider>
    );
    expect(container.querySelector('.NotePopup')).not.toBeInTheDocument();
  });

  it('Should not show delete option if disable', () => {
    const dataElement = 'notePopupDelete';
    const state = createDisabledStateForDataElement(dataElement);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation(function(selector) {
      return selector(state);
    });
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable isDeletable />
      </Provider>
    );
    expect(container.querySelector('.note-popup-options')).toBeInTheDocument();
    expect(container.querySelector('button[data-element="notePopupDelete"]')).not.toBeInTheDocument();
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

  it('Should call correct function when delete option clicked', () => {
    const closePopup = jest.fn();
    const handleDelete = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable isDeletable closePopup={closePopup} handleDelete={handleDelete} />
      </Provider>
    );
    const deleteButton = container.querySelector('button[data-element="notePopupDelete"]');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(closePopup).toHaveBeenCalled();
    expect(handleDelete).toHaveBeenCalled();
  });

  it('Should not show edit option if disable', () => {
    const dataElement = 'notePopupEdit';
    const state = createDisabledStateForDataElement(dataElement);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation(function(selector) {
      return selector(state);
    });
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable isDeletable />
      </Provider>
    );
    expect(container.querySelector('.note-popup-options')).toBeInTheDocument();
    expect(container.querySelector('button[data-element="notePopupEdit"]')).not.toBeInTheDocument();
  });

  it('Should not show edit option if not editable', () => {
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable={false} isDeletable />
      </Provider>
    );
    expect(container.querySelector('.note-popup-options')).toBeInTheDocument();
    expect(container.querySelector('button[data-element="notePopupEdit"]')).not.toBeInTheDocument();
  });

  it('Should call correct function when edit option clicked', () => {
    const closePopup = jest.fn();
    const handleEdit = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <NotePopup isOpen isEditable isDeletable closePopup={closePopup} handleEdit={handleEdit} />
      </Provider>
    );
    const editButton = container.querySelector('button[data-element="notePopupEdit"]');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(closePopup).toHaveBeenCalled();
    expect(handleEdit).toHaveBeenCalled();
  });

  it('Should call openPopup when icon is clicked', () => {
    const annotation = { Id: 'unit-test-annotation-id' };
    const openPopup = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <NotePopup annotation={annotation} isEditable isDeletable openPopup={openPopup} isOpen={false} />
      </Provider>
    );
    expect(container.querySelector('.note-popup-options')).not.toBeInTheDocument();
    const button = container.querySelector('.note-popup-toggle-trigger');
    fireEvent.click(button);
    expect(openPopup).toHaveBeenCalledWith();
  });

  it('Should close when clicked outside of popup', () => {
    const annotation = { Id: 'unit-test-annotation-id' };
    const closePopup = jest.fn();
    const { container } = render(
      <div>
        <div id="unit-test-outside">Outside of notepopup</div>
        <Provider store={store}>
          <NotePopup annotation={annotation} isEditable isDeletable closePopup={closePopup} isOpen />
        </Provider>
      </div>
    );
    expect(container.querySelector('.note-popup-options')).toBeInTheDocument();
    const outsideElement = container.querySelector('#unit-test-outside');
    fireEvent.mouseDown(outsideElement);
    expect(closePopup).toHaveBeenCalled();
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
