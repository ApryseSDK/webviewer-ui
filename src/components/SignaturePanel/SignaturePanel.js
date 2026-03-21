import React, { useCallback, useEffect, useMemo, useState, } from 'react';
import { shallowEqual, useDispatch, useSelector, } from 'react-redux';
import { useTranslation } from 'react-i18next';
import throttle from 'lodash/throttle';

import actions from 'actions';
import useCore from 'hooks/useCore';
import selectors from 'selectors';
import setVerificationResult from 'helpers/setVerificationResult';

import Spinner from 'components/Spinner';
import WidgetInfo from './WidgetInfo';

import './SignaturePanel.scss';
import Icon from 'components/Icon';
import { panelData, panelNames } from 'constants/panel';

const SignaturePanel = () => {
  const { core } = useCore();
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [certificateErrorMessage, setCertificateErrorMessage] = useState('');
  const [document, setDocument] = useState(core.getDocument());
  const [signatureVersion, setSignatureVersion] = useState(0);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, 'signaturePanel'));
  const certificate = useSelector((state) => selectors.getCertificates(state, activeDocumentViewerKey), shallowEqual);
  const currentLanguage = useSelector(selectors.getCurrentLanguage);
  const revocationChecking = useSelector(selectors.getIsRevocationCheckingEnabled);
  const revocationProxyPrefix = useSelector(selectors.getRevocationProxyPrefix);
  const trustListKey = useSelector(selectors.getTrustListKey);

  const [translate] = useTranslation();

  const onDocumentLoaded = () => {
    setDocument(core.getDocument());
  };

  const onDocumentUnloaded = useCallback(() => {
    setShowSpinner(true);
    dispatch(actions.setVerificationResult({}, activeDocumentViewerKey));
  }, [setShowSpinner, dispatch, activeDocumentViewerKey]);

  const resetFields = () => {
    setFields([]);
    addNonSignedFields();
  };

  const checkDocument = useCallback(() => {
    const doc = core.getDocument();
    if (doc) {
      onDocumentLoaded();
      resetFields();
    } else {
      onDocumentUnloaded();
    }
  }, [core, onDocumentUnloaded]);

  const onAnnotationChanged = ((annotations, action) => {
    const isInFormCreationMode = core.getAnnotationManager().getFormFieldCreationManager().isInFormFieldCreationMode();

    if (action === 'add') {
      addSignatureWidgetAnnotations(core.getAnnotationManager().getAnnotationsList());
    } else if (action === 'delete' && isInFormCreationMode) {
      removeAnnotations(annotations);
    }
  });

  const addNonSignedFields = () => {
    const currentAnnotations = core.getAnnotationManager().getAnnotationsList();
    addSignatureWidgetAnnotations(currentAnnotations);
  };

  const addSignatureWidgetAnnotations = (annotations) => {
    const currentFields = [];
    annotations.forEach((annotation) => {
      if (annotation instanceof window.Core.Annotations.SignatureWidgetAnnotation) {
        currentFields.push(annotation.getField());
      }
    });
    const newSet = new Set(currentFields);
    setFields([...newSet]);
  };

  const removeAnnotations = (annotations) => {
    annotations.forEach((annotation) => {
      removeMatchingWidget(annotation);
    });

    addNonSignedFields();
  };

  const removeMatchingWidget = (annotation) => {
    const isWidget = annotation instanceof window.Core.Annotations.WidgetAnnotation;
    if (isWidget) {
      const annotationManager = core.getAnnotationManager();
      const annotationList = annotationManager.getAnnotationsList();
      const widgetToDelete = annotationList.filter((annotationToFilter) => {
        return annotationToFilter.getCustomData('trn-editing-rectangle-id') === annotation.Id;
      });
      annotationManager.deleteAnnotations(widgetToDelete);
    }
  };
  const digitalSignatureHandlerThrottleDelay = 800;

  // Throttle the digitalSignatureApplied handler to avoid rapid panel refreshes
  const onDigitalSignatureApplied = useMemo(
    () => throttle(
      () => setSignatureVersion((v) => v + 1),
      digitalSignatureHandlerThrottleDelay,
      { leading: true, trailing: true },
    ),
    [],
  );

  useEffect(() => {
    // This ensures that when the document loads, the state of this component is
    // updated accordingly
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('documentUnloaded', onDocumentUnloaded);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('digitalSignatureApplied', onDigitalSignatureApplied);
    core.addEventListener('formFieldCreationModeStarted', resetFields);
    core.addEventListener('formFieldCreationModeEnded', resetFields);
    checkDocument();
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('digitalSignatureApplied', onDigitalSignatureApplied);
      onDigitalSignatureApplied.cancel();
      core.removeEventListener('formFieldCreationModeStarted', resetFields);
      core.removeEventListener('formFieldCreationModeEnded', resetFields);
    };
  }, [onDocumentUnloaded, checkDocument, onDigitalSignatureApplied]);

  const onDBRequestSucceeded = (request, resolve, reject) => {
    const db = request.result;

    const isTrustListStoreAvailable = db.objectStoreNames.contains('trustList');
    if (!isTrustListStoreAvailable) {
      db.close();
      resolve(null);
      return;
    }

    const transaction = db.transaction('trustList', 'readonly');
    const store = transaction.objectStore('trustList');

    let getReq = store.get(trustListKey);
    getReq.onsuccess = async () => {
      const value = getReq.result;

      if (!value) {
        resolve(null);
      } else if (value instanceof ArrayBuffer) {
        resolve(value.slice(0));
      } else {
        resolve(value);
      }
    };

    getReq.onerror = () => reject(getReq.error);

    transaction.onerror = () => {
      reject(transaction.error);
    };
    transaction.oncomplete = () => db.close();
  };

  const getTrustList = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('WebViewerTrustList', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        onDBRequestSucceeded(request, resolve, reject);
      };
    });
  };


  useEffect(() => {
    // Need certificates for PDFNet to verify against, and for the document
    // to be loaded in order to iterate through the signature fields in the
    // document
    if (document) {
      // We need to wait for the annotationsLoaded event, otherwise the
      // Field will not exist in the document
      core.getAnnotationsLoadedPromise().then(async () => {
        setShowSpinner(true);
        const trustList = trustListKey ? (await getTrustList() || []) : [];
        setVerificationResult(document, certificate, trustList, currentLanguage, revocationChecking, revocationProxyPrefix, dispatch, activeDocumentViewerKey)
          .then(async (verificationResult) => {
            const fieldManager = core.getAnnotationManager().getFieldManager();
            setFields(Object.keys(verificationResult).map((fieldName) => fieldManager.getField(fieldName)));
            setCertificateErrorMessage('');
          })
          .catch((e) => {
            if (e && e.message) {
              setCertificateErrorMessage(e.message);
            } else {
              console.error(e);
            }
          })
          .then(() => {
            addNonSignedFields();
          })
          .finally(() => {
            setShowSpinner(false);
          });
      });
    } else {
      setShowSpinner(true);
    }
  }, [certificate, document, dispatch, currentLanguage, trustListKey, core, signatureVersion]);

  if (isDisabled) {
    return null;
  }

  /**
   * Returns a JSX element if document loading is not complete, or an error
   * occurs, otherwise nothing is returned, indicating that information about
   * one or more signature will be returned from this component
   */
  const renderLoadingOrErrors = () => {
    let result;
    if (showSpinner) {
      result = <Spinner inPanel width={'40px'} height={'40px'} />;
    } else if (certificateErrorMessage === 'Error reading the local certificate') {
      result = translate('digitalSignatureVerification.panelMessages.localCertificateError');
    } else if (certificateErrorMessage === 'Download Failed') {
      result = translate('digitalSignatureVerification.panelMessages.certificateDownloadError');
    } else if (!fields.length) {
      result = translate('digitalSignatureVerification.panelMessages.noSignatureFields');
    } else {
      /**
       * If document has completed loading, there are no errors, and there are
       * signature fields, this function does not need to return anything
       */
      return null;
    }

    return (
      <div className="empty-panel-container">
        <Icon className="empty-icon" glyph={panelData[panelNames.SIGNATURE].icon} />
        <div className="empty-message">{result}</div>
      </div>
    );
  };

  return (
    <div
      className="Panel SignaturePanel"
      data-element="signaturePanel"
    >
      {renderLoadingOrErrors()}
      {
        !showSpinner && fields.length > 0 && (
          fields.map((field, index) => {
            if (!field) {
              return null;
            }
            return (
              <WidgetInfo
                key={index}
                name={field.name}
                collapsible
                field={field}
              />
            );
          })
        )
      }
    </div>
  );
};

export default SignaturePanel;
