import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default isAdmin => {
  warnDeprecatedAPI(
    'setAdminUser',
    'annotManager.setIsAdminUser',
    '7.0',
  );

  core.setIsAdminUser(isAdmin);
};
