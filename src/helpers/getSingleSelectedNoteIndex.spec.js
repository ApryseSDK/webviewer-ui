import getSingleSelectedNoteIndex from 'helpers/getSingleSelectedNoteIndex';

const notes = [{ Id: 'a' }, { Id: 'b' }, { Id: 'c' }];

describe('getSingleSelectedNoteIndex', () => {
  it('returns -1 when nothing is selected', () => {
    expect(getSingleSelectedNoteIndex(notes, { selectedNoteIds: {}, curAnnotId: undefined })).toBe(-1);
  });

  it('returns the index of the single selected note', () => {
    expect(getSingleSelectedNoteIndex(notes, { selectedNoteIds: { b: true }, curAnnotId: undefined })).toBe(1);
  });

  it('returns -1 when the single selected note is not in the rendered list', () => {
    expect(getSingleSelectedNoteIndex(notes, { selectedNoteIds: { z: true }, curAnnotId: undefined })).toBe(-1);
  });

  it('returns the index of the current annotation when multiple grouped notes are selected', () => {
    // selectedNoteIds contains every ID in the group, but only the parent is rendered
    expect(getSingleSelectedNoteIndex(notes, { selectedNoteIds: { a: true, c: true, hidden: true }, curAnnotId: 'c' })).toBe(2);
  });

  it('returns -1 when multiple notes are selected but none are in the rendered list', () => {
    expect(getSingleSelectedNoteIndex(notes, { selectedNoteIds: { x: true, y: true }, curAnnotId: 'x' })).toBe(-1);
  });
});
