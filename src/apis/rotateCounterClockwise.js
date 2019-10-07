import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default () => {
  warnDeprecatedAPI(
    'rotateCounterClockwise',
    'docViewer.rotateCounterClockwise',
    '7.0',
  );
  core.rotateCounterClockwise();
};
