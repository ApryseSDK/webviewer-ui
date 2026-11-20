import escape from 'lodash/escape';
import isString from 'lodash/isString';
import mentionsManager from 'helpers/MentionsManager';

export const hasCommentText = (value = '') => {
  if (!isString(value)) {
    return false;
  }

  const parsedDocument = new DOMParser().parseFromString(value, 'text/html');
  return Boolean(parsedDocument.body.textContent.replaceAll('\u00a0', ' ').trim());
};

export const getEditorPlainText = (editor) => {
  if (!editor) {
    return '';
  }

  if (typeof editor.getText === 'function') {
    return stripQuillTrailingNewline(editor.getText());
  }

  if (typeof editor.getContents === 'function') {
    return stripQuillTrailingNewline(mentionsManager.getFormattedTextFromDeltas(editor.getContents()));
  }

  return '';
};

export const syncMentionDataToAnnotation = (annotation, contentValue) => {
  const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(contentValue);

  // Preserve IDs for mentions already on the annotation whose display text remains.
  let existingMentions = [];
  try {
    const annotMentionData = mentionsManager.extractMentionDataFromAnnot(annotation);
    if (Array.isArray(annotMentionData?.mentions)) {
      existingMentions = annotMentionData.mentions;
    }
  } catch (e) {
    // Malformed saved mention data should not prevent the current edit from being saved.
  }
  existingMentions.forEach((mention) => {
    const isStillMentioned = typeof mention?.value === 'string' && mention.id != null && plainTextValue.includes(mention.value);
    if (isStillMentioned && !ids.includes(mention.id)) {
      ids.push(mention.id);
    }
  });

  annotation.setCustomData('trn-mention', JSON.stringify({
    contents: contentValue,
    ids,
  }));
  annotation.setContents(plainTextValue);
};

export const resetSkipAutoLink = (annotation) => {
  if (annotation.getSkipAutoLink?.()) {
    annotation.disableSkipAutoLink();
  }
};

// Quill keeps one terminal newline in its plain-text representation.
export const stripQuillTrailingNewline = (value = '') => value.endsWith('\n') ? value.slice(0, -1) : value;

export const getEditorContent = (annotation, isMentionEnabled) => {
  const mentionData = annotation.getCustomData('trn-mention');
  let customData;
  try {
    customData = JSON.parse(mentionData);
  } catch (e) {
    customData = mentionData;
  }

  const customContent = customData?.contents;
  const content = typeof customContent === 'string' && customContent
    ? customContent
    : annotation.getContents();
  if (typeof content !== 'string') {
    return '';
  }

  // Seed the editor with plain text so mention markup is not briefly displayed.
  const plainText = isMentionEnabled ? mentionsManager.extractMentionDataFromStr(content).plainTextValue : content;
  return plainText ? escape(plainText) : plainText;
};

export const getPendingEditorValue = (contents, pendingEditTextMap, annotationId) => {
  const pendingText = annotationId === null || annotationId === undefined
    ? undefined
    : pendingEditTextMap?.[annotationId];
  return contents && pendingText === undefined ? contents : pendingText;
};
