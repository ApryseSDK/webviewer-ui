import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

const SignatureToolButton = props => {
  const { 
    isDisabled, 
    toggleElement, 
    openElement,
    isSignatureModalOpen,
    isSignatureOverlayOpen
  } = props;
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const [ hasSavedSignature, setHasSavedSignature ] = useState(false);

  useEffect(() => {
    signatureTool.on('saveDefault.sigTool', () => {
      setHasSavedSignature(true);
    });

    signatureTool.on('noDefaultSignatures', () => {
      setHasSavedSignature(false);
    });

    return () => {
      signatureTool.off('saveDefault.sigTool');
      signatureTool.off('noDefaultSignatures');
    };
  }, []);

  const handleClick = e => {
    e.stopPropagation();

    if (hasSavedSignature) {
      toggleElement('signatureOverlay');
    } else {
      openElement('signatureModal');
    }
  };

  const buttonClass = classNames({
    'down-arrow':  hasSavedSignature
  });

  return (
    <Tooltip content="annotation.signature" isDisabled={isDisabled}>
      <Button
        className={buttonClass}
        isActive={isSignatureModalOpen || isSignatureOverlayOpen}
        img="ic_annotation_signature_black_24px"
        onClick={handleClick}
      />
    </Tooltip>
  );
};

SignatureToolButton.propTypes = {
  isDisabled: PropTypes.bool,
  isSignatureModalOpen: PropTypes.bool,
  isSignatureOverlayOpen: PropTypes.bool,
  toggleElement: PropTypes.func.isRequired,
  openElement: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureToolButton'),
  isSignatureModalOpen: selectors.isElementOpen(state, 'signatureModal'),
  isSignatureOverlayOpen: selectors.isElementOpen(state, 'signatureOverlay'),
});

const mapDispatchToProps = {
  toggleElement: actions.toggleElement,
  openElement: actions.openElement
};

export default connect(mapStateToProps, mapDispatchToProps)(SignatureToolButton);



