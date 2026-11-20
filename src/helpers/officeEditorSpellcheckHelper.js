import { OFFICE_EDITOR_SPELL_CHECK_KEY } from 'constants/officeEditor';
import { parseRecordId } from 'helpers/officeEditorAnnotationsHelper';

// Custom data is stored as a string, so an id of '0' is truthy and still counts as a spell check annotation.
export const isSpellCheckAnnotation = (annotation) => Boolean(annotation?.getCustomData(OFFICE_EDITOR_SPELL_CHECK_KEY));

// Returns { id, misspelledWord } for the first spell check annotation in the list, or null if there is none.
// Ids can be 0, so callers should check for null rather than truthiness.
export const getSpellingErrorFromAnnotations = (annotations) => {
  const spellcheckErrorAnnotation = annotations?.find((annotation) => isSpellCheckAnnotation(annotation)
    && Boolean(annotation.getContents()));
  const id = parseRecordId(spellcheckErrorAnnotation?.getCustomData(OFFICE_EDITOR_SPELL_CHECK_KEY));

  return id === null ? null : { id, misspelledWord: spellcheckErrorAnnotation.getContents() };
};
