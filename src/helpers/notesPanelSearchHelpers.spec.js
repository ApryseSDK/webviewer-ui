import core from 'core';
import {
  noteMatchesSearchText,
  noteMatchesAnnotationNumber,
  prioritizeNotesByAnnotationNumber,
  createNoteFilter,
  shouldExpandNoteForReplyMatch,
} from 'helpers/notesPanelSearchHelpers';

jest.mock('core', () => ({
  getDisplayAuthor: jest.fn(),
}));

const documentViewerKey = 1;

let noteIdCounter = 0;

const createNote = ({
  contents = '',
  author = 'author',
  customData = {},
  replies = [],
} = {}) => ({
  Author: author,
  Id: `note-${noteIdCounter++}`,
  getContents: () => contents,
  getReplies: () => replies,
  getCustomData: (key) => (key in customData ? customData[key] : undefined),
});

describe('notesPanelSearchHelpers', () => {
  beforeEach(() => {
    core.getDisplayAuthor.mockImplementation((author) => author);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('noteMatchesSearchText', () => {
    it('matches on note contents case-insensitively', () => {
      const note = createNote({ contents: 'Hello World' });
      expect(noteMatchesSearchText(note, { searchInput: 'hello', documentViewerKey })).toBe(true);
    });

    it('matches on display author', () => {
      const note = createNote({ contents: '', author: 'Jane Doe' });
      expect(noteMatchesSearchText(note, { searchInput: 'jane', documentViewerKey })).toBe(true);
    });

    it('matches on annotation preview custom data', () => {
      const note = createNote({ customData: { 'trn-annot-preview': 'quoted text' } });
      expect(noteMatchesSearchText(note, { searchInput: 'quoted', documentViewerKey })).toBe(true);
    });

    it('matches on the associated number text', () => {
      const note = createNote({ customData: { 'trn-associated-number': 42 } });
      expect(noteMatchesSearchText(note, { searchInput: '42', documentViewerKey })).toBe(true);
    });

    it('returns false when nothing matches', () => {
      const note = createNote({ contents: 'abc', author: 'xyz' });
      expect(noteMatchesSearchText(note, { searchInput: 'nomatch', documentViewerKey })).toBe(false);
    });

    it('returns false when the search input is missing or empty', () => {
      const note = createNote({ contents: 'abc', author: 'xyz' });
      expect(noteMatchesSearchText(note, { searchInput: undefined, documentViewerKey })).toBe(false);
      expect(noteMatchesSearchText(note, { searchInput: '', documentViewerKey })).toBe(false);
    });

    it('keeps whitespace-only search input as a valid query', () => {
      const note = createNote({ contents: 'a b' });
      expect(noteMatchesSearchText(note, { searchInput: '   ', documentViewerKey })).toBe(false);
      expect(noteMatchesSearchText(note, { searchInput: ' ', documentViewerKey })).toBe(true);
    });

    it('does not throw and returns false when contents and author are null', () => {
      const note = createNote({ contents: null, author: null });
      expect(noteMatchesSearchText(note, { searchInput: 'anything', documentViewerKey })).toBe(false);
    });

    it('does not invoke the display-author mapper for a nullish author', () => {
      core.getDisplayAuthor.mockImplementation((author) => author.toUpperCase());
      const note = { Author: undefined, getContents: () => 'hello', getReplies: () => [], getCustomData: () => undefined };
      expect(() => noteMatchesSearchText(note, { searchInput: 'hello', documentViewerKey })).not.toThrow();
      expect(noteMatchesSearchText(note, { searchInput: 'hello', documentViewerKey })).toBe(true);
      expect(core.getDisplayAuthor).not.toHaveBeenCalled();
    });

    it('passes the document viewer key when reading the associated number', () => {
      const getCustomData = jest.fn(() => '');
      const note = { Author: '', getContents: () => '', getReplies: () => [], getCustomData };
      noteMatchesSearchText(note, { searchInput: 'a', documentViewerKey: 2 });
      expect(getCustomData).toHaveBeenCalledWith('trn-associated-number', 2);
    });

    it('does not throw and returns false when the note is missing accessor methods', () => {
      const note = { Author: null };
      expect(noteMatchesSearchText(note, { searchInput: 'anything', documentViewerKey })).toBe(false);
    });

    it('coerces a non-string custom data value without throwing', () => {
      const note = createNote({ customData: { 'trn-annot-preview': 5 } });
      expect(noteMatchesSearchText(note, { searchInput: '5', documentViewerKey })).toBe(true);
    });
  });

  describe('noteMatchesAnnotationNumber', () => {
    it('returns true when the associated number equals the searched number', () => {
      const note = createNote({ customData: { 'trn-associated-number': '7' } });
      expect(noteMatchesAnnotationNumber(note, { searchedNumber: 7, documentViewerKey })).toBe(true);
    });

    it('returns false when the associated number differs', () => {
      const note = createNote({ customData: { 'trn-associated-number': '8' } });
      expect(noteMatchesAnnotationNumber(note, { searchedNumber: 7, documentViewerKey })).toBe(false);
    });

    it('returns false for null, undefined, or blank associated numbers', () => {
      expect(noteMatchesAnnotationNumber(createNote({ customData: { 'trn-associated-number': null } }), { searchedNumber: 7, documentViewerKey })).toBe(false);
      expect(noteMatchesAnnotationNumber(createNote(), { searchedNumber: 7, documentViewerKey })).toBe(false);
      expect(noteMatchesAnnotationNumber(createNote({ customData: { 'trn-associated-number': '   ' } }), { searchedNumber: 7, documentViewerKey })).toBe(false);
    });

    it('returns false when the associated number is not numeric', () => {
      const note = createNote({ customData: { 'trn-associated-number': 'abc' } });
      expect(noteMatchesAnnotationNumber(note, { searchedNumber: 7, documentViewerKey })).toBe(false);
    });

    it('does not throw and returns false when the note is missing getCustomData', () => {
      expect(noteMatchesAnnotationNumber({}, { searchedNumber: 7, documentViewerKey })).toBe(false);
    });
  });

  describe('prioritizeNotesByAnnotationNumber', () => {
    const options = { showAnnotationNumbering: true, searchInput: '2', documentViewerKey };

    it('returns notes unchanged when numbering is disabled', () => {
      const notes = [createNote(), createNote()];
      expect(prioritizeNotesByAnnotationNumber(notes, { ...options, showAnnotationNumbering: false })).toBe(notes);
    });

    it('returns notes unchanged when the search input is empty', () => {
      const notes = [createNote(), createNote()];
      expect(prioritizeNotesByAnnotationNumber(notes, { ...options, searchInput: '   ' })).toBe(notes);
    });

    it('returns notes unchanged when the search input is not a number', () => {
      const notes = [createNote(), createNote()];
      expect(prioritizeNotesByAnnotationNumber(notes, { ...options, searchInput: 'abc' })).toBe(notes);
    });

    it('moves matching notes to the front while preserving relative order', () => {
      const unmatchedA = createNote({ customData: { 'trn-associated-number': '1' } });
      const matched = createNote({ customData: { 'trn-associated-number': '2' } });
      const unmatchedB = createNote({ customData: { 'trn-associated-number': '3' } });
      const result = prioritizeNotesByAnnotationNumber([unmatchedA, matched, unmatchedB], options);
      expect(result).toEqual([matched, unmatchedA, unmatchedB]);
    });
  });

  describe('createNoteFilter', () => {
    it('applies the custom note filter', () => {
      const filter = createNoteFilter({ customNoteFilter: (note) => note.getContents() === 'keep', searchInput: '', documentViewerKey });
      expect(filter(createNote({ contents: 'keep' }))).toBe(true);
      expect(filter(createNote({ contents: 'drop' }))).toBe(false);
    });

    it('applies the internal note filter', () => {
      const filter = createNoteFilter({ internalNoteFilter: (note) => note.getContents() === 'keep', searchInput: '', documentViewerKey });
      expect(filter(createNote({ contents: 'keep' }))).toBe(true);
      expect(filter(createNote({ contents: 'drop' }))).toBe(false);
    });

    it('renders all notes when no filters or search are provided', () => {
      const filter = createNoteFilter({ searchInput: '', documentViewerKey });
      expect(filter(createNote({ contents: 'anything' }))).toBe(true);
    });

    it('keeps a note when it matches the search input', () => {
      const filter = createNoteFilter({ searchInput: 'match', documentViewerKey });
      expect(filter(createNote({ contents: 'match here' }))).toBe(true);
    });

    it('keeps a note when only one of its replies matches the search input', () => {
      const reply = createNote({ contents: 'match here' });
      const note = createNote({ contents: 'no', replies: [reply] });
      const filter = createNoteFilter({ searchInput: 'match', documentViewerKey });
      expect(filter(note)).toBe(true);
    });

    it('drops a note when neither it nor its replies match the search input', () => {
      const reply = createNote({ contents: 'nope' });
      const note = createNote({ contents: 'no', replies: [reply] });
      const filter = createNoteFilter({ searchInput: 'match', documentViewerKey });
      expect(filter(note)).toBe(false);
    });

    it('does not throw when replies are missing while searching', () => {
      const note = { Id: 'note-missing-replies', Author: '', getContents: () => 'match here', getCustomData: () => undefined };
      const filter = createNoteFilter({ searchInput: 'match', documentViewerKey });
      expect(filter(note)).toBe(true);
    });

    it('treats null or undefined replies as no replies without warning', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const noteWithNullReplies = createNote({ contents: 'match here', replies: null });
      const noteWithUndefinedReplies = createNote({ contents: 'match here', replies: undefined });
      const filterWithNullReplies = createNoteFilter({ searchInput: 'match', documentViewerKey });
      const filterWithUndefinedReplies = createNoteFilter({ searchInput: 'match', documentViewerKey });

      expect(filterWithNullReplies(noteWithNullReplies)).toBe(true);
      expect(filterWithUndefinedReplies(noteWithUndefinedReplies)).toBe(true);
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('warns and falls back to no replies when getReplies returns a non-array', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const note = createNote({ contents: 'no', replies: 'not-an-array' });
      const filter = createNoteFilter({ searchInput: 'match', documentViewerKey });
      expect(filter(note)).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith('NotesPanel: expected note replies to be an array but received', 'not-an-array');
      warnSpy.mockRestore();
    });
  });

  describe('shouldExpandNoteForReplyMatch', () => {
    it('returns false when any note is selected', () => {
      const note = createNote();
      const options = { notesToRender: [note], selectedNoteIds: { some: true }, searchInput: 'match', documentViewerKey };
      expect(shouldExpandNoteForReplyMatch(note, options)).toBe(false);
    });

    it('returns false when there is no search input', () => {
      const note = createNote();
      const options = { notesToRender: [note], selectedNoteIds: {}, searchInput: '', documentViewerKey };
      expect(shouldExpandNoteForReplyMatch(note, options)).toBe(false);
    });

    it('returns true when one of the note replies matches the search input', () => {
      const reply = createNote({ contents: 'match here' });
      const note = createNote({ contents: 'no', replies: [reply] });
      const options = { notesToRender: [note], selectedNoteIds: {}, searchInput: 'match', documentViewerKey };
      expect(shouldExpandNoteForReplyMatch(note, options)).toBe(true);
    });

    it('returns false when the note has no matching replies', () => {
      const reply = createNote({ contents: 'nope' });
      const note = createNote({ contents: 'no', replies: [reply] });
      const options = { notesToRender: [note], selectedNoteIds: {}, searchInput: 'match', documentViewerKey };
      expect(shouldExpandNoteForReplyMatch(note, options)).toBe(false);
    });

    it('returns false for a different note than the one whose reply matches', () => {
      const reply = createNote({ contents: 'match here' });
      const noteWithMatch = createNote({ contents: 'no', replies: [reply] });
      const otherNote = createNote({ contents: 'no' });
      const options = { notesToRender: [noteWithMatch, otherNote], selectedNoteIds: {}, searchInput: 'match', documentViewerKey };
      expect(shouldExpandNoteForReplyMatch(otherNote, options)).toBe(false);
    });

    it('does not throw when a rendered note is missing replies', () => {
      const note = { Id: 'note-missing-replies', getContents: () => 'no', getCustomData: () => undefined };
      const options = { notesToRender: [note], selectedNoteIds: {}, searchInput: 'match', documentViewerKey };
      expect(shouldExpandNoteForReplyMatch(note, options)).toBe(false);
    });
  });
});
