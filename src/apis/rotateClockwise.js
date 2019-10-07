import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default () => {
  warnDeprecatedAPI(
    'rotateClockwise',
    'docViewer.rotateClockwise',
    '7.0',
  );

  core.rotateClockwise();
};
