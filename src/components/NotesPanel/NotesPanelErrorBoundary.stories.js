import React from 'react';
import NotesPanelErrorBoundary from './NotesPanelErrorBoundary';
import { expect } from 'storybook/test';

export default {
  title: 'Components/NotesPanel/NotesPanelErrorBoundary',
  component: NotesPanelErrorBoundary,
};

const ThrowOnRender = () => {
  throw new Error('Storybook crash test');
};

export function CrashFallback() {
  return (
    <NotesPanelErrorBoundary resetKey="notesPanel-1">
      <ThrowOnRender />
    </NotesPanelErrorBoundary>
  );
}

CrashFallback.play = async ({ canvasElement }) => {
  await expect(canvasElement.querySelector('.no-annotations')).toBeInTheDocument();
};
