import core from 'core';
import mentionsManager from 'helpers/MentionsManager';

/**
 * An instance of MentionsManager that can be used to allow mentioning people in a textarea in the notes panel.
 * @name UI.mentions
 * @see UI.MentionsManager
 * @type {UI.MentionsManager}
 */

export default (store, documentViewerKey) => {
  mentionsManager.initialize(store, core.getAnnotationManager(documentViewerKey));

  return expose(mentionsManager, [
    'setUserData',
    'getUserData',
    'setAllowedTrailingCharacters',
    'getAllowedTrailingCharacters',
    'on',
    'one',
    'off',
    'trigger',
    'addEventListener',
    'setEventListener',
    'removeEventListener',
    'setMentionLookupCallback',
    'getMentionLookupCallback'
  ]);
};

const expose = (obj, methodsToExpose) => {
  const result = {};

  for (const methodName of methodsToExpose) {
    result[methodName] = (...args) => obj[methodName](...args);
  }

  return result;
};
