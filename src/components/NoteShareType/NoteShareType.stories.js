import React from 'react';
import NoteShareType from './NoteShareType';

import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import getCustomData from 'src/apis/getCustomData';
import ShareTypes from 'src/constants/shareTypes';

export default {
  title: 'WISEflow/NoteShareType',
  component: NoteShareType,
};

const mockAnnotation = {
  getCustomData: () => {},
  setCustomData: () => {},
};

export function Basic() {
  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <NoteShareType annotation={mockAnnotation} />
    </ReduxProvider>
  );
}

export function WithPreselectedSharetypeParticipants() {
  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <NoteShareType annotation={{ ...mockAnnotation, getCustomData: () => ShareTypes.PARTICIPANTS }} />
    </ReduxProvider>
  );
}
