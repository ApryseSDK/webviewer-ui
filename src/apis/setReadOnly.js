import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default isReadOnly => {
  warnDeprecatedAPI(
    'setReadOnly',
    'annotManager.setReadOnly',
    '7.0',
  );
  core.setReadOnly(isReadOnly);
};
