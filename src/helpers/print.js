import i18n from 'i18next';

import actions from 'actions';
import core from 'core';

export default (dispatch, isEmbedPrintSupported) =>  {
  const bbURLPromise = core.getPrintablePDF();

  if (bbURLPromise) {
    const printPage = window.open('', '_blank');
    printPage.document.write(i18n.t('message.preparingToPrint'));
    bbURLPromise.then(result => {
      printPage.location.href = result.url;
    });
  } else if (isEmbedPrintSupported) {
    dispatch(actions.openElement('loadingModal'));
    printPdf().then(() => {
      dispatch(actions.closeElement('loadingModal'));
    });
  } else {
    dispatch(actions.openElement('printModal'));
  }
};

const printPdf = () => {
  return core.exportAnnotations().then(xfdfString => {
    const printDocument = true;
    return core.getDocument().getFileData({ xfdfString, printDocument }).then(data => {
      const arr = new Uint8Array(data);
      const blob = new Blob([ arr ], { type: 'application/pdf' });
      document.getElementById('print-handler').src = URL.createObjectURL(blob);
    });
  });
};