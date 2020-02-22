import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Button from 'components/Button';
import Icon from 'components/Icon';
import defaultTool from 'constants/defaultTool';
import '../ToolGroupButton/ToolGroupButton.scss';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

const SignatureToolButton = () => {
  const [isActive, isSignatureModalOpen, isSignatureOverlayOpen] = useSelector(
    state => [
      selectors.getActiveToolName(state) === 'AnnotationCreateSignature',
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
    if (isActive) {
      core.setToolMode(defaultTool);
      dispatch(actions.closeElement('signatureOverlay'));
    } else {
      core.setToolMode('AnnotationCreateSignature');
      dispatch(actions.setActiveToolGroup(''));
      dispatch(actions.openElement('signatureOverlay'));
    }
  };

  return (
    <div
      className={classNames({
        'tool-group-button': true,
        active: isActive,
        signature: true,
      })}
      data-element="signatureToolButton"
      onClick={handleClick}
    >
      <div>
        <Button
          img="icon-tool-signature"
          title="annotation.signature"
        />
        <div className="arrow-up" />
      </div>
      <div className="down-arrow-container">
        <Icon className="down-arrow" glyph="icon-chevron-down" />
      </div>
    </div>
  );
};

export default SignatureToolButton;
