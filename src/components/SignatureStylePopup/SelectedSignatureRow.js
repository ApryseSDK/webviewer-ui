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
  const [activeToolName, isToolStyleOpen, displayedSignature, displayedSignatures, savedInitials] = useSelector(
    (state) => [
      selectors.getActiveToolName(state),
      selectors.isElementOpen(state, 'toolStylePopup'),
      selectors.getSelectedDisplayedSignature(state),
      selectors.getDisplayedSignatures(state),
      selectors.getSavedInitials(state),
    ],
  );
  const dispatch = useDispatch();

  const onDropDownClick = () => {
    if (displayedSignatures.length > 0 || savedInitials.length > 0) {
      dispatch(actions.toggleElement('toolStylePopup'));
    }
  };

  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  return (
    <div
      className="selected-signature-row"
    >
      {displayedSignature ?
        <SignatureRowContent
          imgSrc={displayedSignature.imgSrc}
          onClick={async () => {
            core.setToolMode('AnnotationCreateSignature');
            for (const signatureTool of signatureToolArray) {
              await signatureTool.setSignature(displayedSignature.annotation);
              if (signatureTool.hasLocation()) {
                await signatureTool.addSignature();
              } else {
                await signatureTool.showPreview();
              }
            }
          }}
          isActive={activeToolName === 'AnnotationCreateSignature'}
          altText={t('option.toolsOverlay.currentSignature')}
        /> :
        <SignatureAddBtn />}
      <ToolsDropdown
        onClick={onDropDownClick}
        isActive={isToolStyleOpen}
        isDisabled={displayedSignatures.length === 0 && savedInitials.length === 0}
      />
    </div>
  );
};

export default SelectedSignatureRow;
