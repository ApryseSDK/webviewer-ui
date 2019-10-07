import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default () => {
  warnDeprecatedAPI(
    'isAdminUser',
    'annotManager.getIsAdminUser',
    '7.0',
  );
  return !!core.getIsAdminUser();
};