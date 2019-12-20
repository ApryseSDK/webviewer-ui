import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default () => {
  warnDeprecatedAPI(
    'isReadOnly',
    'annotManager.getIsReadOnly',
    '7.0',
  );

  return !!core.getIsReadOnly();
};