import React, { useCallback, useEffect, useState, } from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { useTranslation } from 'react-i18next';

import actions from 'actions';
import core from 'core';
import selectors from 'selectors';
import setVerificationResult from 'helpers/setVerificationResult';

import Spinner from './Spinner';
import WidgetInfo from './WidgetInfo';

import './SignaturePanel.scss';
import Icon from 'components/Icon';
import { panelData, panelNames } from 'constants/panel';

const SignaturePanel = () => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [certificateErrorMessage, setCertificateErrorMessage] = useState('');
  const [document, setDocument] = useState(core.getDocument());
  const [
    isDisabled,
    certificate,
    trustLists,
    currentLanguage,
    revocationChecking,
    revocationProxyPrefix,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, 'signaturePanel'),
    selectors.getCertificates(state),
    selectors.getTrustLists(state),
    selectors.getCurrentLanguage(state),
    selectors.getIsRevocationCheckingEnabled(state),
    selectors.getRevocationProxyPrefix(state),
  ]);
  const [translate] = useTranslation();

  const onDocumentLoaded = async () => {
    setDocument(core.getDocument());
  };

  const onDocumentUnloaded = useCallback(() => {
    setShowSpinner(true);
    dispatch(actions.setVerificationResult({}));
  }, [setShowSpinner, dispatch]);

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
    const annot = annotation;
    const widgetFieldName = annot.getCustomData('trn-form-field-name');
    const isRectanglePlaceholder = annotation instanceof window.Core.Annotations.RectangleAnnotation && widgetFieldName;
    if (isRectanglePlaceholder) {
      const annotationManager = core.getAnnotationManager();
      const annotationList = annotationManager.getAnnotationsList();
      const widgetToDelete = annotationList.filter((annotation) => {
        return annotation.getCustomData('trn-editing-rectangle-id') === annot.Id;
      });
      annotationManager.deleteAnnotations(widgetToDelete);
    }
  };

  const resetFields = () => {
    setFields([]);
    addNonSignedFields();
  };

  useEffect(() => {
    // This ensures that when the document loads, the state of this component is
    // updated accordingly
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('documentUnloaded', onDocumentUnloaded);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('formFieldCreationModeStarted', resetFields);
    core.addEventListener('formFieldCreationModeEnded', resetFields);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('formFieldCreationModeStarted', resetFields);
      core.removeEventListener('formFieldCreationModeEnded', resetFields);
    };
  }, [onDocumentUnloaded]);

  useEffect(() => {
    // Need certificates for PDFNet to verify against, and for the document
    // to be loaded in order to iterate through the signature fields in the
    // document
    if (document) {
      // We need to wait for the annotationsLoaded event, otherwise the
      // Field will not exist in the document
      core.getAnnotationsLoadedPromise().then(() => {
        setShowSpinner(true);
        setVerificationResult(document, certificate, trustLists, currentLanguage, revocationChecking, revocationProxyPrefix, dispatch)
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
  }, [certificate, document, dispatch, currentLanguage]);

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
      result = <Spinner />;
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
        <Icon className="empty-icon" glyph={panelData[panelNames.SIGNATURE].icon}/>
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
