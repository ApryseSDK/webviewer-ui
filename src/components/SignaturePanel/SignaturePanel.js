import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useTranslation } from 'react-i18next';

import actions from 'actions';
import core from 'core';
import selectors from 'selectors';
import setVerificationResult from 'helpers/setVerificationResult';

import Spinner from './Spinner';
import WidgetInfo from './WidgetInfo';

import './SignaturePanel.scss';

const SignaturePanel = () => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [certificateErrorMessage, setCertificateErrorMessage] = useState('');
  const [document, setDocument] = useState(core.getDocument());
  const [isDisabled, certificate, trustLists] = useSelector(state => [
    selectors.isElementDisabled(state, 'signaturePanel'),
    selectors.getCertificates(state),
    selectors.getTrustLists(state),
  ]);
  const [translate] = useTranslation();

  const onDocumentLoaded = async() => {
    setDocument(core.getDocument());
  };

  const onDocumentUnloaded = useCallback(() => {
    setShowSpinner(true);
    dispatch(actions.setVerificationResult({}));
  }, [setShowSpinner, dispatch]);

  useEffect(() => {
    // This ensures that when the document loads, the state of this component is
    // updated accordingly
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('documentUnloaded', onDocumentUnloaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
    };
  }, [onDocumentUnloaded]);

  useEffect(() => {
    // Need certificates for PDFNet to verify against, and for the document
    // to be loaded in order to iterate through the signature fields in the
    // document
    if (document) {
      setShowSpinner(true);
      setVerificationResult(certificate, trustLists, dispatch)
        .then(async (verificationResult) => {
          // We need to wait for the annotationsLoaded event, otherwise the
          // Field will not exist in the document
          await core.getAnnotationsLoadedPromise();
          const fieldManager = core.getAnnotationManager().getFieldManager();
          setFields(Object.keys(verificationResult).map(fieldName => fieldManager.getField(fieldName)));
          setCertificateErrorMessage('');
          setShowSpinner(false);
        })
        .catch(e => {
          if (e && e.message) {
            setCertificateErrorMessage(e.message);
          } else {
            console.error(e);
          }
        });
    } else {
      setShowSpinner(true);
    }
  }, [certificate, document, dispatch]);

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
      result = <Spinner/>;
    } else if (
      certificateErrorMessage === 'Error reading the local certificate'
    ) {
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
      <div className="center">
        {result}
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
