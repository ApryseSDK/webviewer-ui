import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import SignatureAddBtn from 'components/SignatureStylePopup/SignatureAddBtn';
import ToolsDropdown from 'components/ToolsDropdown';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';

import './SelectedSignatureRow.scss';

const SelectedSignatureRow = ({ t }) => {
  const [activeToolName, isToolStyleOpen, displayedSignature, displayedSignatures] = useSelector(
    state => [
      selectors.getActiveToolName(state),
      selectors.isElementOpen(state, 'toolStylePopup'),
      selectors.getSelectedDisplayedSignature(state),
      selectors.getDisplayedSignatures(state),
    ],
  );
  const dispatch = useDispatch();

  const signatureTool = core.getTool('AnnotationCreateSignature');
  return (
    <div
      className="selected-signature-row"
    >
      {displayedSignature ?
        <SignatureRowContent
          imgSrc={displayedSignature.imgSrc}
          onClick={async () => {
            await signatureTool.setSignature(displayedSignature.annotation);
            core.setToolMode('AnnotationCreateSignature');
            if (signatureTool.hasLocation()) {
              await signatureTool.addSignature();
            } else {
              await signatureTool.showPreview();
            }
          }}
          isActive={activeToolName === 'AnnotationCreateSignature'}
          altText={t('option.toolsOverlay.currentSignature')}
        /> :
        <SignatureAddBtn />}
      <ToolsDropdown
        onClick={() => displayedSignatures.length > 0 && dispatch(actions.toggleElement('toolStylePopup'))}
        isActive={isToolStyleOpen}
        isDisabled={displayedSignatures.length === 0}
      />
    </div>
  );
};

export default SelectedSignatureRow;