import { OFFICE_EDITOR_COMMENT_KEY, OFFICE_EDITOR_SPELL_CHECK_KEY } from 'constants/officeEditor';
import { getSpellingErrorFromAnnotations, isSpellCheckAnnotation } from './officeEditorSpellcheckHelper';

const MISSPELLED_WORD = 'wrold';

const createAnnotation = (customData = {}, contents = '') => ({
  getCustomData: (key) => customData[key],
  getContents: () => contents,
});

describe('isSpellCheckAnnotation', () => {
  it.each([
    ['a spell check annotation', createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '12' })],
    ['a spell check annotation with id 0', createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '0' })],
  ])('should return true for %s', (description, annotation) => {
    expect(isSpellCheckAnnotation(annotation)).toBe(true);
  });

  it.each([
    ['an annotation without spell check data', createAnnotation({ [OFFICE_EDITOR_COMMENT_KEY]: '4' })],
    ['an annotation with empty spell check data', createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '' })],
    ['null', null],
    ['undefined', undefined],
  ])('should return false for %s', (description, annotation) => {
    expect(isSpellCheckAnnotation(annotation)).toBe(false);
  });
});

describe('getSpellingErrorFromAnnotations', () => {
  it.each([
    ['null', null],
    ['an empty list', []],
    ['a list without spell check annotations', [createAnnotation({ [OFFICE_EDITOR_COMMENT_KEY]: '4' }, 'comment')]],
    ['a spell check annotation without a misspelled word', [createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '12' })]],
    ['a spell check annotation whose id is not a number', [createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: 'abc' }, MISSPELLED_WORD)]],
  ])('should return null for %s', (description, annotations) => {
    expect(getSpellingErrorFromAnnotations(annotations)).toBeNull();
  });

  it('should return the id and misspelled word of the first spell check annotation', () => {
    const annotations = [
      createAnnotation({ [OFFICE_EDITOR_COMMENT_KEY]: '4' }, 'comment'),
      createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '12' }, MISSPELLED_WORD),
      createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '13' }, 'teh'),
    ];

    expect(getSpellingErrorFromAnnotations(annotations)).toEqual({ id: 12, misspelledWord: MISSPELLED_WORD });
  });

  it('should return the spelling error when its id is 0', () => {
    const annotations = [createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '0' }, MISSPELLED_WORD)];

    expect(getSpellingErrorFromAnnotations(annotations)).toEqual({ id: 0, misspelledWord: MISSPELLED_WORD });
  });
});
