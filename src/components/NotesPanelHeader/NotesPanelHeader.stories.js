/* eslint-disable no-unsanitized/property */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import NotesPanelHeader from './NotesPanelHeader';

export default {
  title: 'Components/NotesPanel/NotesPanelHeader',
  component: NotesPanelHeader,
  argTypes: {
    'Multi Select': {
      options: ['Hide', 'Show'],
      control: { type: 'radio' },
    },
  },
};

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const initialState = {
  viewer: {
    sortStrategy: 'position',
    disabledElements: {},
    customElementOverrides: {},
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
  },
  featureFlags: {
    customizableUI: true,
  }
};

export function Basic(args) {
  initialState.viewer.notesPanelCustomHeaderOptions = null;
  const store = configureStore({ reducer: () => initialState });
  const flag = args['Multi Select'];
  const isMultiSelectEnabled = flag === 'Show';
  return (
    <Provider store={store}>
      <NotesPanelHeader
        isMultiSelectEnabled={isMultiSelectEnabled}
        notes={[]}
        disableFilterAnnotation={false}
        setSearchInputHandler={noop}
      />
    </Provider>
  );
}

export function CustomHeaderOverwriteDefault() {
  initialState.viewer.notesPanelCustomHeaderOptions = {
    overwriteDefaultHeader: true,
    render: customHeaderRenderFunction
  };

  const store = configureStore({ reducer: () => initialState });

  return (
    <Provider store={store}>
      <NotesPanelHeader
        isMultiSelectEnabled={true}
        notes={[]}
        disableFilterAnnotation={false}
        setSearchInputHandler={noop}
      />
    </Provider>
  );
}

export function CustomHeaderPrependToDefault() {
  initialState.viewer.notesPanelCustomHeaderOptions = {
    overwriteDefaultHeader: false,
    render: customHeaderRenderFunction
  };

  const store = configureStore({ reducer: () => initialState });

  return (
    <Provider store={store}>
      <NotesPanelHeader
        isMultiSelectEnabled={true}
        notes={[]}
        disableFilterAnnotation={false}
        setSearchInputHandler={noop}
      />
    </Provider>
  );
}

function customHeaderRenderFunction(notes) {
  const div = document.createElement('div');
  div.style.margin = '20px 0';

  const header = document.createElement('h2');
  header.innerHTML = 'Custom header!';
  div.appendChild(header);

  const subheader = document.createElement('h3');
  subheader.innerHTML = `Number of comments: ${notes.length}`;
  div.appendChild(subheader);

  const button = document.createElement('button');
  button.innerHTML = 'Custom button';
  button.addEventListener('click', () => {
    alert('Clicked custom button!');
  });
  div.appendChild(button);

  return div;
}