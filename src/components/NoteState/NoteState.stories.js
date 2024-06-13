import React from 'react';
import NoteState from './NoteState';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

export default {
  title: 'Components/NotesPanel/NoteState',
  component: NoteState,
};

function getAnnotationWithStatus(status) {
  return {
    getStatus: () => {
      return status;
    },
    isReply: () => {
      return false;
    }
  };
}

function handleStateChange(newValue) {
  // eslint-disable-next-line no-console
  console.log('Updating with state value', newValue);
}

const initialState = {
  viewer: {
    disabledElements: {},
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

export function Basic() {
  const availableNoteStates = ['Accepted', 'Rejected', 'Cancelled', 'Completed', 'None', 'Marked', 'Unmarked'];
  const allStates = availableNoteStates.map((state) => {
    return (
      <Provider store={store} key={state}>
        <React.Fragment key={state}>
          <span>{state}:</span>

          <NoteState annotation={getAnnotationWithStatus(state)} isSelected handleStateChange={handleStateChange} />
        </React.Fragment>
      </Provider>
    );
  });
  return (
    <div style={{
      width: 150,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      rowGap: '1em'
    }}
    >
      {allStates}
    </div>
  );
}

export function PopupOpen() {
  return (
    <Provider store={store}>
      <div
        style={{
          backgroundColor: 'white',
          width: 100,
          display: 'flex',
          alignContent: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <NoteState
          annotation={getAnnotationWithStatus('Accepted')}
          isSelected={false}
          openOnInitialLoad
          handleStateChange={handleStateChange}
        />
      </div>
    </Provider>
  );
}
