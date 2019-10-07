import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import core from 'core';

export default () => {
  warnDeprecatedAPI(
    'goToFirstPage',
    'docViewer.setCurrentPage(1)',
    '7.0',
  );

  core.setCurrentPage(1);
};
