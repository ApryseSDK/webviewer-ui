import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import SignatureAddBtn from 'components/SignatureStylePopup/SignatureAddBtn';
import Icon from 'components/Icon';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';

import './SelectedSignatureRow.scss';

const SelectedSignatureRow = () => {
  const [activeToolName, isToolStyleOpen, selectedSignature, savedSignatures] = useSelector(
    state => [
      selectors.getActiveToolName(state),
      selectors.isElementOpen(state, 'toolStylePopup'),
      selectors.getSelectedSignature(state),
      selectors.getSavedSignatures(state),
    ],
  );

  const signatureTool = core.getTool('AnnotationCreateSignature');
  const dispatch = useDispatch();
  return (
    <div
      className="selected-signature-row"
    >
      {selectedSignature ?
        <SignatureRowContent
          imgSrc={selectedSignature.imgSrc}
          onClick={() => {
            signatureTool.setSignature(selectedSignature.annotation);
            core.setToolMode('AnnotationCreateSignature');
            if (signatureTool.hasLocation()) {
              signatureTool.addSignature();
            } else {
              signatureTool.showPreview();
            }
          }}
          isActive={activeToolName === 'AnnotationCreateSignature'}
        /> :
        <SignatureAddBtn/>
      }
      <div
        className={classNames({
          "signatures-arrow-container": true,
          active: isToolStyleOpen,
          disabled: savedSignatures.length === 0,
        })}
        data-element="styling-button"
        onClick={() => savedSignatures.length > 0 && dispatch(actions.toggleElement('toolStylePopup'))}
      >
        {isToolStyleOpen ?
          <Icon className="styling-arrow-up" glyph="icon-chevron-up" /> :
          <Icon className="styling-arrow-down" glyph="icon-chevron-down" />}
      </div>
    </div>
  );
};

export default SelectedSignatureRow;