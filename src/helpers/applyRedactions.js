import core from 'core';
import i18next from 'i18next';

import actions from 'actions';
import { fireError } from 'helpers/fireEvent';
import downloadPdf from 'helpers/downloadPdf';

export default annotations => dispatch => {
    if (core.getType() === 'blackbox') {
        // when are using Webviewer Server, it'll download the redacted document
        return webViewerServerApply(annotations, dispatch);
    } else {
       return webViewerApply(annotations, dispatch);
    }
};

const webViewerServerApply = (annotations, dispatch) => {
    return core.applyRedactions(annotations).then(results => {
        if (results && results.url) { 
            return downloadPdf(dispatch, {
                filename: 'redacted.pdf',
                includeAnnotations: true, 
                externalURL: results.url
            });
        }
        console.warn('WebViewer Server did not return a valid result');
    });
};

const webViewerApply = (annotations, dispatch) => {
    const message = i18next.t('option.redaction.warningPopupMessage');
    const title = i18next.t('option.redaction.warningPopupTitle');
    const confirmBtnText = i18next.t('action.apply');

    const warning = {
        message,
        title,
        confirmBtnText,
        onConfirm: () => {
            core.applyRedactions(annotations).catch(err => fireError(err)); 
            return Promise.resolve();
        }
    };

    return dispatch(actions.showWarningMessage(warning));
};