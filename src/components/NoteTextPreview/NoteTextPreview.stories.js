import React from 'react';
import NoteTextPreview from './NoteTextPreview';

export default {
  title: 'Components/Note/NoteTextPreview',
  component: NoteTextPreview,
};


export function Basic() {
  return (
    <NoteTextPreview linesToBreak={1}>
      Space: the final frontier. These are the voyages of the starship Enterprise.
      Its continuing mission: to explore strange new worlds. To seek out new life and new civilizations.
      To boldly go where no one has gone before!
    </NoteTextPreview>
  );
}