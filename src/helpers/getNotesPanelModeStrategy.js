import { getNotesPanelModeStrategies, NotesPanelMode } from 'constants/notesPanelModeStrategies';

const getNotesPanelModeStrategy = (mode) => {
  const strategies = getNotesPanelModeStrategies();
  const hasStrategy = Object.hasOwn(strategies, mode);

  if (!hasStrategy) {
    console.warn(`Unknown NotesPanel mode: ${mode}`);
  }

  return hasStrategy ? strategies[mode] : strategies[NotesPanelMode.DEFAULT];
};

export default getNotesPanelModeStrategy;
