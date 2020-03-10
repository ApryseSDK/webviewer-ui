import core from 'core';
import MentionsManager from 'helpers/MentionsManager';

export default store => {
  const mentionsManager = new MentionsManager(store, core.getAnnotationManager());

  return expose(mentionsManager, [
    'setUserData',
    'getUserData',
    'setAllowedTrailingCharacters',
    'getAllowedTrailingCharacters',
    'on',
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
