import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import SignatureAddBtn from 'components/SignatureStylePopup/SignatureAddBtn';
import ToolsDropdown from 'components/ToolsDropdown';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import SignatureModes from 'constants/signatureModes';
import { useTranslation } from 'react-i18next';

import './SelectedSignatureRow.scss';

const SelectedSignatureRow = () => {
  const [
    activeToolName,
    isToolStyleOpen,
    displayedSignature,
    displayedSignatures,
    savedInitials,
    displayedInitial,
    signatureMode,
  ] = useSelector(
    (state) => [
      selectors.getActiveToolName(state),
      selectors.isElementOpen(state, 'toolStylePopup'),
      selectors.getSelectedDisplayedSignature(state),
      selectors.getDisplayedSignatures(state),
      selectors.getSavedInitials(state),
      selectors.getDisplayedInitial(state),
      selectors.getSignatureMode(state),
    ],
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDropDownClick = () => {
    if (displayedSignatures.length > 0 || savedInitials.length > 0) {
      dispatch(actions.toggleElement('toolStylePopup'));
    }
  };

  const setSignature = async () => {
    const isFullSignature = signatureMode === SignatureModes.FULL_SIGNATURE;
    const { annotation } = isFullSignature ? displayedSignature : displayedInitial;
    core.setToolMode('AnnotationCreateSignature');
    for (const signatureTool of signatureToolArray) {
      await signatureTool[isFullSignature ? 'setSignature' : 'setInitials'](annotation);
      if (signatureTool.hasLocation()) {
        await signatureTool[isFullSignature ? 'addSignature' : 'addInitials']();
      } else {
        await signatureTool[isFullSignature ? 'showPreview' : 'showInitialsPreview']();
      }
    }
  };

  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  const selectedSignature = signatureMode === SignatureModes.INITIALS ? displayedInitial : displayedSignature;
  return (
    <div
      className="selected-signature-row"
    >
      {selectedSignature ?
        <SignatureRowContent
          imgSrc={selectedSignature.imgSrc}
          onClick={setSignature}
          isActive={activeToolName === 'AnnotationCreateSignature'}
          altText={t('option.toolsOverlay.currentSignature')}
        /> :
        <SignatureAddBtn/>}
      <ToolsDropdown
        onClick={onDropDownClick}
        isActive={isToolStyleOpen}
        isDisabled={displayedSignatures.length === 0 && savedInitials.length === 0}
      />
    </div>
  );
};

export default SelectedSignatureRow;
