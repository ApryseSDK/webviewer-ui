import core from 'core';
import i18next from 'i18next';

import actions from 'actions';
import selectors from 'selectors';
import { fireError } from 'helpers/fireEvent';
import downloadPdf from 'helpers/downloadPdf';

function noop() { }

export default (annotations, onRedactionCompleted = noop, activeDocumentViewerKey) => (dispatch, getState) => {
  const resolvedDocumentViewerKey = activeDocumentViewerKey ?? selectors.getActiveDocumentViewerKey(getState());
  if (core.isWebViewerServerDocument()) {
    // when are using Webviewer Server, it'll download the redacted document
    return webViewerServerApply(annotations, dispatch, resolvedDocumentViewerKey);
  }
  return webViewerApply(annotations, onRedactionCompleted, dispatch, resolvedDocumentViewerKey);
};

const webViewerServerApply = (annotations, dispatch, activeDocumentViewerKey) => core.applyRedactions(annotations, activeDocumentViewerKey).then((results) => {
  if (results && results.url) {
    return downloadPdf(dispatch, {
      filename: 'redacted.pdf',
      includeAnnotations: true,
      externalURL: results.url,
    });
  }
  console.warn('WebViewer Server did not return a valid result');
});

const webViewerApply = (annotations, onRedactionCompleted, dispatch, activeDocumentViewerKey) => {
  const message = i18next.t('warning.redaction.applyMessage');
  const title = i18next.t('warning.redaction.applyTile');
  const confirmBtnText = i18next.t('action.apply');

  const warning = {
    message,
    title,
    confirmBtnText,
    onConfirm: () => {
      core.applyRedactions(annotations, activeDocumentViewerKey)
        .then(() => {
          onRedactionCompleted();
        })
        .catch((err) => fireError(err));
      return Promise.resolve();
    },
  };

  return dispatch(actions.showWarningMessage(warning));
};
