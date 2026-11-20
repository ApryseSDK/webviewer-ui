import mentionsManager from 'helpers/MentionsManager';
import {
  getEditorContent, getPendingEditorValue, stripQuillTrailingNewline,
  hasCommentText, getEditorPlainText, syncMentionDataToAnnotation, resetSkipAutoLink,
} from './NoteContentHelpers';

// Use the real markup parser so mention tests exercise its actual format and ID extraction.
jest.mock('helpers/MentionsManager', () => {
  const actualMentionsManager = jest.requireActual('helpers/MentionsManager').default;
  return {
    extractMentionDataFromStr: jest.fn((value) => actualMentionsManager.extractMentionDataFromStr(value)),
    extractMentionDataFromAnnot: jest.fn(() => ({ mentions: [] })),
    getFormattedTextFromDeltas: jest.fn(() => 'delta text\n'),
  };
});

const createAnnotation = (contents, mentionData = '') => ({
  Id: 'note-1',
  Author: 'author',
  getContents: () => contents,
  getCustomData: () => mentionData,
});

describe('NoteContent editor value helpers', () => {
  afterEach(() => jest.clearAllMocks());

  it('uses mention custom data to seed the editor with escaped plain text', () => {
    const annotation = createAnnotation('Saved text', JSON.stringify({ contents: 'Hi @[Alex](user-1) <team>', ids: ['user-1'] }));
    expect(getEditorContent(annotation, true)).toBe('Hi @Alex &lt;team&gt;');
  });

  it('preserves mention markup when mentions are disabled', () => {
    const annotation = createAnnotation('Saved text', JSON.stringify({ contents: '@[Alex](user-1)' }));
    expect(getEditorContent(annotation, false)).toBe('@[Alex](user-1)');
    expect(mentionsManager.extractMentionDataFromStr).not.toHaveBeenCalled();
  });

  it('uses annotation contents when custom data is malformed, missing, or has empty contents', () => {
    expect(getEditorContent(createAnnotation('Saved <text>', '{broken'), false)).toBe('Saved &lt;text&gt;');
    expect(getEditorContent(createAnnotation('Saved', ''), false)).toBe('Saved');
    expect(getEditorContent(createAnnotation('Saved', JSON.stringify({ contents: '' })), false)).toBe('Saved');
  });

  it('uses a safe empty editor value for missing or non-string content', () => {
    expect(getEditorContent(createAnnotation(undefined, ''), true)).toBe('');
    expect(getEditorContent(createAnnotation(42, ''), true)).toBe('');
    expect(getEditorContent(createAnnotation('Saved', JSON.stringify({ contents: { unexpected: true } })), false)).toBe('Saved');
    expect(mentionsManager.extractMentionDataFromStr).not.toHaveBeenCalled();
  });

  it('falls back to saved content when mention custom data has a non-string value', () => {
    expect(getEditorContent(createAnnotation('Saved', JSON.stringify({ contents: { unexpected: true } })), true)).toBe('Saved');
  });

  it.each(['null', '123'])('falls back to saved content when mention custom data is valid JSON without contents: %s', (mentionData) => {
    expect(getEditorContent(createAnnotation('Saved', mentionData), true)).toBe('Saved');
  });

  it('retains explicitly empty pending text instead of restoring saved text', () => {
    expect(getPendingEditorValue('Saved', { 'note-1': '' }, 'note-1')).toBe('');
    expect(getPendingEditorValue('Saved', {}, 'note-1')).toBe('Saved');
    expect(getPendingEditorValue('', {}, 'note-1')).toBeUndefined();
  });

  it('uses pending text when there is no saved content', () => {
    expect(getPendingEditorValue('', { 'note-1': 'Pending' }, 'note-1')).toBe('Pending');
  });

  it('uses saved content when the pending map is missing', () => {
    expect(getPendingEditorValue('Saved', undefined, 'note-1')).toBe('Saved');
    expect(getPendingEditorValue('Saved', null, 'note-1')).toBe('Saved');
  });

  it.each([undefined, null])('does not read a pending-map key when annotation ID is %s', (annotationId) => {
    expect(getPendingEditorValue('Saved', { [String(annotationId)]: 'Wrong note' }, annotationId)).toBe('Saved');
  });

  it('removes exactly one terminal Quill newline', () => {
    expect(stripQuillTrailingNewline('note\n')).toBe('note');
    expect(stripQuillTrailingNewline('note\n\n')).toBe('note\n');
    expect(stripQuillTrailingNewline('note\nmore')).toBe('note\nmore');
    expect(stripQuillTrailingNewline()).toBe('');
  });

  it('accepts visible comment text while rejecting empty markup, nonbreaking spaces, and non-strings', () => {
    expect(hasCommentText('<p>Hi <strong>team</strong></p>')).toBe(true);
    expect(hasCommentText('<p>  &nbsp; </p>')).toBe(false);
    expect(hasCommentText('<br><span></span>')).toBe(false);
    expect(hasCommentText(null)).toBe(false);
    expect(hasCommentText(42)).toBe(false);
  });

  it('reads Quill plain text without its terminal newline and prefers getText', () => {
    const editor = { getText: jest.fn(() => 'first\nsecond\n'), getContents: jest.fn() };
    expect(getEditorPlainText(editor)).toBe('first\nsecond');
    expect(editor.getContents).not.toHaveBeenCalled();
    expect(getEditorPlainText({ getText: () => 'first\n\n' })).toBe('first\n');
  });

  it('falls back to delta formatting when getText is unavailable', () => {
    const deltas = [{ insert: 'delta text\n' }];
    expect(getEditorPlainText({ getContents: () => deltas })).toBe('delta text');
    expect(mentionsManager.getFormattedTextFromDeltas).toHaveBeenCalledWith(deltas);
    expect(getEditorPlainText(null)).toBe('');
    expect(getEditorPlainText({})).toBe('');
  });

  it('synchronizes mention markup, plain contents, and existing mention IDs', () => {
    const annotation = {
      setCustomData: jest.fn(),
      setContents: jest.fn(),
    };
    mentionsManager.extractMentionDataFromAnnot.mockReturnValueOnce({
      mentions: [{ value: 'Alex', id: 'existing' }, { value: 'Absent', id: 'removed' }],
    });

    syncMentionDataToAnnotation(annotation, 'Hi @[Sam](new) and @Alex');

    expect(annotation.setCustomData).toHaveBeenCalledWith('trn-mention', JSON.stringify({
      contents: 'Hi @[Sam](new) and @Alex',
      ids: ['new', 'existing'],
    }));
    expect(annotation.setContents).toHaveBeenCalledWith('Hi @Sam and @Alex');
  });

  it('saves each mention ID once when an existing mention is also in the new markup', () => {
    const annotation = {
      setCustomData: jest.fn(),
      setContents: jest.fn(),
    };
    mentionsManager.extractMentionDataFromAnnot.mockReturnValueOnce({ mentions: [{ value: 'Alex', id: 'alex' }] });

    syncMentionDataToAnnotation(annotation, 'Hi @[Alex](alex)');

    expect(annotation.setCustomData).toHaveBeenCalledWith('trn-mention', JSON.stringify({
      contents: 'Hi @[Alex](alex)',
      ids: ['alex'],
    }));
  });

  it.each([
    ['throws', () => {
      throw new SyntaxError('invalid saved mentions');
    }],
    ['returns no data', () => undefined],
    ['returns invalid mentions', () => ({ mentions: { id: 'invalid' } })],
    ['returns malformed entries', () => ({ mentions: [null, { value: 42 }] })],
    ['returns entries without an id', () => ({ mentions: [{ value: 'Sam' }, { value: 'Sam', id: null }] })],
  ])('saves new mentions when extracting existing annotation mentions %s', (description, extract) => {
    const annotation = { setCustomData: jest.fn(), setContents: jest.fn() };
    mentionsManager.extractMentionDataFromAnnot.mockImplementationOnce(extract);

    expect(() => syncMentionDataToAnnotation(annotation, 'Hi @[Sam](new)')).not.toThrow();
    expect(annotation.setCustomData).toHaveBeenCalledWith('trn-mention', JSON.stringify({
      contents: 'Hi @[Sam](new)', ids: ['new'],
    }));
    expect(annotation.setContents).toHaveBeenCalledWith('Hi @Sam');
  });

  it('resets skip-autolink only when enabled and tolerates annotations without the getter', () => {
    const enabled = { getSkipAutoLink: jest.fn(() => true), disableSkipAutoLink: jest.fn() };
    const disabled = { getSkipAutoLink: jest.fn(() => false), disableSkipAutoLink: jest.fn() };
    resetSkipAutoLink(enabled);
    resetSkipAutoLink(disabled);
    resetSkipAutoLink({ disableSkipAutoLink: jest.fn() });
    expect(enabled.disableSkipAutoLink).toHaveBeenCalledTimes(1);
    expect(disabled.disableSkipAutoLink).not.toHaveBeenCalled();
  });
});
