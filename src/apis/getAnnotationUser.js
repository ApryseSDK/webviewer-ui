import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default () => {
  warnDeprecatedAPI(
    'getAnnotationUser',
    'annotManager.getCurrentUser',
    '7.0',
  );

  return core.getCurrentUser();
};
