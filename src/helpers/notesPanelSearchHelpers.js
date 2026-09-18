/* eslint-disable custom/use-core-hook-in-components */
import core from 'core';

/**
 * Safely coerces a possibly missing or non-string note value into a lowercased
 * string so search matching never throws on malformed data.
 * @ignore
 */
const toSearchableText = (value) => (value === null || value === undefined ? '' : String(value).toLowerCase());

/**
 * Safely reads a note's replies, returning an empty array when replies are missing
 * or malformed so callers can spread or iterate over them without throwing. Warns at
 * most once per malformed reply type so a hot search/render path cannot spam the console.
 * @ignore
 */
const warnedReplyTypes = new Set();

const getNoteReplies = (note) => {
  const replies = note?.getReplies?.();

  if (Array.isArray(replies)) {
    return replies;
  }

  if (replies !== null && replies !== undefined) {
    const replyType = typeof replies;
    if (!warnedReplyTypes.has(replyType)) {
      warnedReplyTypes.add(replyType);
      console.warn('NotesPanel: expected note replies to be an array but received', replies);
    }
  }

  return [];
};

/**
 * Returns whether a single note matches the current search input by checking its
 * contents, display author, annotation preview, and associated number text.
 * @ignore
 */
export const noteMatchesSearchText = (note, { searchInput, documentViewerKey }) => {
  if (searchInput === null || searchInput === undefined || String(searchInput) === '') {
    return false;
  }

  const content = note?.getContents?.();
  const author = note?.['Author'];
  // Skip the display-author mapper for nullish authors so we never forward
  // undefined/null into a customer-supplied mapper that expects a string.
  const authorName = author === null || author === undefined ? '' : core.getDisplayAuthor(author);
  const annotationPreview = note?.getCustomData?.('trn-annot-preview');
  const annotationNumber = note?.getCustomData?.('trn-associated-number', documentViewerKey);
  const normalizedSearchInput = toSearchableText(searchInput);

  // didn't use regex here because the search input may form an invalid regex, e.g. *
  return (
    toSearchableText(content).includes(normalizedSearchInput) ||
    toSearchableText(authorName).includes(normalizedSearchInput) ||
    toSearchableText(annotationPreview).includes(normalizedSearchInput) ||
    toSearchableText(annotationNumber).includes(normalizedSearchInput)
  );
};

/**
 * Returns whether a note's associated number equals the searched number.
 * @ignore
 */
export const noteMatchesAnnotationNumber = (note, { searchedNumber, documentViewerKey }) => {
  const annotationNumber = note?.getCustomData?.('trn-associated-number', documentViewerKey);

  if (
    annotationNumber === null ||
    annotationNumber === undefined ||
    (typeof annotationNumber === 'string' && annotationNumber.trim() === '')
  ) {
    return false;
  }

  const parsedAnnotationNumber = Number(annotationNumber);

  return !Number.isNaN(parsedAnnotationNumber) && parsedAnnotationNumber === searchedNumber;
};

/**
 * Reorders notes so that those whose associated number matches a numeric search
 * input come first, preserving relative order otherwise. Returns the input notes
 * unchanged when numbering is disabled or the search input is not a number.
 * @ignore
 */
export const prioritizeNotesByAnnotationNumber = (notes, { showAnnotationNumbering, searchInput, documentViewerKey }) => {
  if (!showAnnotationNumbering) {
    return notes;
  }

  const normalizedSearchInput = String(searchInput ?? '').trim();
  if (normalizedSearchInput === '') {
    return notes;
  }

  const searchedNumber = Number(normalizedSearchInput);
  if (Number.isNaN(searchedNumber)) {
    return notes;
  }

  const matched = [];
  const unmatched = [];

  for (const note of notes) {
    (noteMatchesAnnotationNumber(note, { searchedNumber, documentViewerKey }) ? matched : unmatched).push(note);
  }

  return [...matched, ...unmatched];
};

/**
 * Builds a predicate that decides whether a note should be rendered, applying the
 * optional custom/internal note filters and, when a search input is present,
 * matching the note or any of its replies against that input.
 * @ignore
 */
export const createNoteFilter = ({ customNoteFilter, internalNoteFilter, searchInput, documentViewerKey }) => (note) => {
  let shouldRender = true;

  if (customNoteFilter) {
    shouldRender = shouldRender && customNoteFilter(note);
  }

  if (internalNoteFilter) {
    shouldRender = shouldRender && internalNoteFilter(note);
  }

  if (searchInput) {
    const replies = getNoteReplies(note);
    // reply is also a kind of annotation
    // https://docs.apryse.com/api/web/Core.AnnotationManager.html#createAnnotationReply__anchor
    const noteAndReplies = [note, ...replies];

    shouldRender = shouldRender && noteAndReplies.some((noteOrReply) => noteMatchesSearchText(noteOrReply, { searchInput, documentViewerKey }));
  }
  return shouldRender;
};

/**
 * Returns whether a note should be expanded because one of its replies matches the current
 * search input. Used to auto-expand a collapsed note so the matching reply is visible.
 * Returns false when any note is selected or there is no search input.
 * @ignore
 */
export const shouldExpandNoteForReplyMatch = (note, { notesToRender, selectedNoteIds, searchInput, documentViewerKey }) => {
  if (Object.keys(selectedNoteIds).length) {
    return false;
  }
  return (
    !!searchInput &&
    notesToRender
      .filter((noteToRender) => getNoteReplies(noteToRender).some((reply) => noteMatchesSearchText(reply, { searchInput, documentViewerKey })))
      .some((matchingNote) => matchingNote.Id === note.Id)
  );
};

