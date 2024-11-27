import React from 'react';
import NoteState from './NoteState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { userEvent, within, expect } from '@storybook/test';
import { screen } from '@testing-library/react';
import rootReducer from 'src/redux/reducers/rootReducer';
import ToggleElementButton from '../ModularComponents/ToggleElementButton';
import Flyout from '../ModularComponents/Flyout';
import { noteStateFlyoutItems } from '../ModularComponents/NoteStateFlyout/NoteStateFlyout';

export default {
  title: 'Components/NotesPanel/NoteState',
  component: NoteState,
  parameters: {
    customizableUI: true,
  }
};

function getAnnotationWithStatus(status) {
  return {
    Id: '123',
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
    customElementOverrides: {},
    flyoutMap: {
      'noteStateFlyout-123': {
        dataElement: 'noteStateFlyout',
        items: noteStateFlyoutItems,
      }
    },
    activeFlyout: 'noteStateFlyout-123',
    openElements: {},
    genericPanels: [],
    modularHeaders: [],
    modularHeadersHeight: {},
    flyoutPosition: { x: 0, y: 0 },
    modularComponents: {},
    activeTabInPanel: {},
  },
  featureFlags: {
    customizableUI: true
  }
};

const store = configureStore({
  preloadedState: initialState,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export function Basic() {
  const availableNoteStates = ['Accepted', 'Rejected', 'Cancelled', 'Completed', 'None', 'Marked', 'Unmarked'];
  const allStates = availableNoteStates.map((state) => {
    return (
      <Provider store={store} key={state}>
        <React.Fragment key={state}>
          <span>{state}:</span>
          <NoteState annotation={getAnnotationWithStatus(state)} handleStateChange={handleStateChange} />
        </React.Fragment>
      </Provider>
    );
  });
  return (
    <div style={{
      width: 150,
      display: 'grid',
      gridTemplateColumns: '1fr 0fr',
      rowGap: '1em'
    }}
    >
      {allStates}
    </div>
  );
}

export function OpenFlyout() {
  return (
    <Provider store={store}>
      <ToggleElementButton
        dataElement={'noteState-123'}
        title={'Status'}
        img={'icon-annotation-status-accepted'}
        toggleElement={'noteStateFlyout-123'}
        disabled={false}
      />
      <Flyout />
    </Provider>
  );
}

OpenFlyout.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // The Note State Flyout should be closed by default
  const acceptedOption = screen.queryByText(/Accepted/i);
  expect(acceptedOption).not.toBeInTheDocument();
  const noteStateButton = await canvas.findByRole('button', { 'name': /Status/i });
  await userEvent.click(noteStateButton);
  // The Note State Flyout should be open
  expect(await canvas.findByRole('button', { name: /Accepted/i })).toBeInTheDocument();
};