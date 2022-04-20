import React from 'react';
import NoteState from './NoteState.js';

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
    },
  };
}

function handleStateChange(newValue) {
  // eslint-disable-next-line no-console
  console.log('Updating with state value', newValue);
}

export function Basic() {
  const availableNoteStates = [
    'Accepted',
    'Rejected',
    'Cancelled',
    'Completed',
    'None',
    'Marked',
    'Unmarked',
    'Participants',
    'Assessors',
    'All',
  ];
  const allStates = availableNoteStates.map(state => {
    return (
      <React.Fragment key={state}>
        <span>{state}:</span>
        <NoteState annotation={getAnnotationWithStatus(state)} isSelected handleStateChange={handleStateChange} />
      </React.Fragment>
    );
  });
  return (
    <div
      style={{
        width: 150,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        rowGap: '1em',
      }}
    >
      {allStates}
    </div>
  );
}

export function PopupOpen() {
  return (
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
        annotation={getAnnotationWithStatus('Private')}
        isSelected={false}
        openOnInitialLoad
        handleStateChange={handleStateChange}
      />
    </div>
  );
}
