import core from 'core';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';

export default pageNumber => {
  warnDeprecatedAPI(
    'setCurrentPageNumber',
    'docViewer.setCurrentPage',
    '7.0',
  );
  core.setCurrentPage(pageNumber);
};
