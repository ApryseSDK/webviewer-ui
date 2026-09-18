/**
 * Derives the index of the single selected note within the rendered note list so it
 * can be scrolled into view. Returns -1 when there is no single selection to focus.
 *
 * When exactly one note is selected, its index is used directly. When multiple notes
 * are selected (e.g. a grouped annotation), only the parent annotation appears in the
 * rendered list, so the index of the current annotation (`curAnnotId`) is used instead.
 * @ignore
 */
const getSingleSelectedNoteIndex = (notesToRender, { selectedNoteIds, curAnnotId }) => {
  const ids = Object.keys(selectedNoteIds);

  if (ids.length === 1) {
    return notesToRender.findIndex((note) => note.Id === ids[0]);
  }

  if (ids.length) {
    // when selecting annotations that are grouped together, only the parent annotation is in
    // "notesToRender" while selectedNoteIds has every ID in the group, so scroll to the current
    // annotation id (curAnnotId)
    const existingSelectedNotes = notesToRender.filter((note) => selectedNoteIds[note.Id]);

    if (existingSelectedNotes.length) {
      return notesToRender.findIndex((note) => note.Id === curAnnotId);
    }
  }

  return -1;
};

export default getSingleSelectedNoteIndex;
