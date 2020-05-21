import core from 'core';
import mentionsManager from 'helpers/MentionsManager';

/**
 * An instance of MentionsManager that can be used to allow mentioning people in a textarea in the notes panel.
 * @name WebViewerInstance#mentions
 * @see WebViewerInstance.MentionsManager
 * @type {WebViewerInstance.MentionsManager}
 */

export default store => {
  mentionsManager.initialize(store, core.getAnnotationManager());

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
  ]);
};

const expose = (obj, methodsToExpose) => {
  const result = {};

  for (const methodName of methodsToExpose) {
    result[methodName] = (...args) => {
      obj[methodName](...args);
    };
  }

  return result;
};
