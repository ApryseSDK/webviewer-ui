import { AUTOSAVE_DRAFT_REPLY_KEY } from '../constants/autosave';

export const markAutosaveDraftReply = (annotation) => {
  annotation.setCustomData(AUTOSAVE_DRAFT_REPLY_KEY, 'true');
};

export const clearAutosaveDraftReply = (annotation) => {
  annotation.setCustomData(AUTOSAVE_DRAFT_REPLY_KEY, '');
};

export const isAutosaveDraftReply = (annotation) => annotation?.getCustomData?.(AUTOSAVE_DRAFT_REPLY_KEY) === 'true';