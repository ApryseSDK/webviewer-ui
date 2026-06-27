import { AUTOSAVE_DRAFT_REPLY_KEY } from '../constants/autosave';
import {
  markAutosaveDraftReply,
  clearAutosaveDraftReply,
  isAutosaveDraftReply,
} from './autosaveDraftReply';

describe('autosaveDraftReply', () => {
  const createAnnotation = () => {
    const customData = {};
    return {
      setCustomData: jest.fn((key, value) => {
        customData[key] = value;
      }),
      getCustomData: jest.fn((key) => customData[key]),
    };
  };

  it('marks and clears autosave draft reply custom data', () => {
    const annotation = createAnnotation();

    markAutosaveDraftReply(annotation);
    expect(annotation.setCustomData).toHaveBeenCalledWith(AUTOSAVE_DRAFT_REPLY_KEY, 'true');
    expect(isAutosaveDraftReply(annotation)).toBe(true);

    clearAutosaveDraftReply(annotation);
    expect(annotation.setCustomData).toHaveBeenCalledWith(AUTOSAVE_DRAFT_REPLY_KEY, '');
    expect(isAutosaveDraftReply(annotation)).toBe(false);
  });

  it('returns false for nullish annotation', () => {
    expect(isAutosaveDraftReply(null)).toBe(false);
    expect(isAutosaveDraftReply(undefined)).toBe(false);
  });
});
