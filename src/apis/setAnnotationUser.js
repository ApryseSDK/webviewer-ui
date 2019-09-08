import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default userName => {
  warnDeprecatedAPI(
    'setAnnotationUser',
    'annotManager.setCurrentUser',
    '7.0',
  );

  core.setCurrentUser(userName);
};
