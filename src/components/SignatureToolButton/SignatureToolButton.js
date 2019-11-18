import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

const SignatureToolButton = () => {
  const [isSignatureModalOpen, isSignatureOverlayOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'signatureModal'),
      selectors.isElementOpen(state, 'signatureOverlay'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [hasSavedSignature, setHasSavedSignature] = useState(false);

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const onSignatureSaved = () => setHasSavedSignature(true);
    const onSignatureDeleted = () =>
      setHasSavedSignature(!!signatureTool.getSavedSignatures().length);

    signatureTool.on('signatureSaved', onSignatureSaved);
    signatureTool.on('signatureDeleted', onSignatureDeleted);
    return () => {
      signatureTool.off('signatureSaved', onSignatureSaved);
      signatureTool.off('signatureDeleted', onSignatureDeleted);
    };
  }, []);

  const handleClick = () => {
    if (hasSavedSignature) {
      dispatch(actions.toggleElement('signatureOverlay'));
    } else {
      dispatch(actions.openElement('signatureModal'));
    }
  };

  const buttonClass = classNames({
    'down-arrow': hasSavedSignature,
  });

  return (
    <Button
      className={buttonClass}
      isActive={isSignatureModalOpen || isSignatureOverlayOpen}
      img="icon-tool-signature"
      onClick={handleClick}
      title="annotation.signature"
    />
  );
};

export default SignatureToolButton;
