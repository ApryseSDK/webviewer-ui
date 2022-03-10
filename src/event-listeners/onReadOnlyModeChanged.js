import disableElements from 'src/apis/disableElements';
import enableElements from 'src/apis/enableElements';

export default store => isReadOnly => {
  if (isReadOnly) {
    disableElements(store)(['documentControl', 'thumbnailControl']);
  } else {
    enableElements(store)(['documentControl', 'thumbnailControl']);
  }
};