import getNotesPanelModeStrategy from 'helpers/getNotesPanelModeStrategy';
import { getNotesPanelModeStrategies, NotesPanelMode } from 'constants/notesPanelModeStrategies';

jest.mock('constants/notesPanelModeStrategies', () => {
  const actual = jest.requireActual('constants/notesPanelModeStrategies');
  return {
    ...actual,
    getNotesPanelModeStrategies: jest.fn(actual.getNotesPanelModeStrategies),
  };
});

describe('getNotesPanelModeStrategy', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    getNotesPanelModeStrategies.mockImplementation(
      jest.requireActual('constants/notesPanelModeStrategies').getNotesPanelModeStrategies,
    );
  });

  it('returns the strategy for a known mode', () => {
    const strategies = getNotesPanelModeStrategies();
    expect(getNotesPanelModeStrategy(NotesPanelMode.OFFICE_EDITOR)).toBe(strategies[NotesPanelMode.OFFICE_EDITOR]);
    expect(getNotesPanelModeStrategy(NotesPanelMode.SPREADSHEET)).toBe(strategies[NotesPanelMode.SPREADSHEET]);
  });

  it('falls back to the default strategy and warns on an unknown mode', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const strategies = getNotesPanelModeStrategies();

    const strategy = getNotesPanelModeStrategy('unknown');

    expect(strategy).toBe(strategies[NotesPanelMode.DEFAULT]);
    expect(warnSpy).toHaveBeenCalledWith('Unknown NotesPanel mode: unknown');
  });
});
