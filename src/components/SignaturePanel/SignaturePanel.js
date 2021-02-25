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
  const [sigWidgets, setSigWidgets] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [certificateErrorMessage, setCertificateErrorMessage] = useState('');
  const [isDisabled, certificate] = useSelector(state => [
    selectors.isElementDisabled(state, 'signaturePanel'),
    selectors.getCertificates(state),
  ]);
  const [translate] = useTranslation();

  const onDocumentLoaded = async() => {
    setShowSpinner(true);

    await core.getAnnotationsLoadedPromise();

    const _sigWidgets = core
      .getAnnotationsList()
      .filter(annotation => annotation instanceof Annotations.SignatureWidgetAnnotation);
    if (!_sigWidgets.length) {
      setShowSpinner(false);
    }
    setSigWidgets(_sigWidgets);
  };

  const onDocumentUnloaded = useCallback(() => {
    setShowSpinner(true);
    dispatch(actions.setVerificationResult({}));
  }, [setShowSpinner, dispatch]);

  useEffect(() => {
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('documentUnloaded', onDocumentUnloaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
    };
  }, [dispatch, sigWidgets, onDocumentUnloaded]);

  useEffect(() => {
    if (sigWidgets.length && certificate.length) {
      setVerificationResult(certificate, sigWidgets, dispatch)
        .then(() => {
          setCertificateErrorMessage('');
        })
        /**
         * @todo Consolidate into a single .then?
         */
        .then(() => {
          setShowSpinner(false);
        })
        .catch(e => {
          setCertificateErrorMessage(e.message);
        });
    } else if (!sigWidgets.length && core.getDocument()) {
      // The document is loaded, and the signature widgets need to be retrieved
      onDocumentLoaded();
    } else {
      setShowSpinner(false);
    }
  }, [certificate, dispatch, sigWidgets]);

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
    } else if (!sigWidgets.length) {
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
        !showSpinner && sigWidgets.length > 0 && (
          sigWidgets.map((widget, index) => {
            const name = widget.getField().name;
            return (
              <WidgetInfo
                key={index}
                name={name}
                collapsible
                widget={widget}
              />
            );
          })
        )
      }
    </div>
  );
};

export default SignaturePanel;
