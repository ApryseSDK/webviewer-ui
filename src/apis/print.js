import print from 'helpers/print';
import selectors from 'selectors';

export default store => () => {
  print(store.dispatch, selectors.isEmbedPrintSupported(store.getState()));  
};
