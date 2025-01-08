import i18next from 'i18next';
import React from 'react';
import NotePopup, { notePopupFlyoutItems } from './NotePopup';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Flyout from '../ModularComponents/Flyout';

export default {
  title: 'Components/NotesPanel/NotePopup',
  component: NotePopup,
};

function noop() { }

function handleEdit() {
  console.log('Would handle Edit');
}

function handleDelete() {
  console.log('Would handle Delete');
}

function open() {
  console.log('Would open the popup');
}

function close() {
  console.log('Would close the popup');
}

const state = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    flyoutMap: {
      'notePopupFlyout-foo': {
        dataElement: 'notePopupFlyout-foo',
        items: notePopupFlyoutItems,
      }
    },
    activeFlyout: 'notePopupFlyout-foo',
    openElements: {
      'notePopupFlyout-foo': true,
    },
    flyoutToggleElement: 'notePopup-foo',
    flyoutPosition: { x: 50, y: 150 },
  }
};

const store = configureStore({
  reducer: () => state,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export function Basic() {
  const annotation = {};
  const style = {
    width: 200,
  };
  return (
    <Provider store={store}>
      <div style={style}>
        <NotePopup
          annotation={annotation}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isEditable
          isDeletable
          noteId={'foo'}
        />
      </div>
    </Provider>
  );
}

export function DifferentLanguages() {
  const annotation = {};
  const style = {
    width: 200,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: 10,
    rowGap: 15,
  };

  i18next.changeLanguage('zh_cn');
  return (
    <Provider store={store}>
      <div style={style}>
        <div>Popup closed</div>
        <div>Popup open</div>
        <div style={{ justifySelf: 'start' }}>
          <NotePopup
            annotation={annotation}
            handleEdit={noop}
            isEditable
            isDeletable
          />
        </div>
        <div style={{ justifySelf: 'end' }}>
          <NotePopup
            annotation={annotation}
            handleEdit={noop}
            isEditable
            isDeletable
          />
          <Flyout />
        </div>
      </div>
    </Provider>
  );
}

export function DifferentStates() {
  const annotation = {};
  const style = {
    width: 200,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: 10,
    rowGap: 15,
  };

  i18next.changeLanguage('en');

  return (
    <Provider store={store}>
      <div style={style}>
        <div>Popup closed</div>
        <div>Popup open</div>
        <div style={{ justifySelf: 'start' }}>
          <NotePopup
            annotation={annotation}
            handleEdit={noop}
            isEditable
            isDeletable
          />
        </div>
        <div style={{ justifySelf: 'end' }}>
          <NotePopup
            annotation={annotation}
            handleEdit={noop}
            isEditable
            isDeletable
          />
          <Flyout />
        </div>
      </div>
    </Provider>
  );
}
