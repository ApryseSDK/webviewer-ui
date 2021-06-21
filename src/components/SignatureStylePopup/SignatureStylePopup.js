import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import selectors from 'selectors';
import Icon from 'components/Icon';
import SignatureRowContent from './SignatureRowContent';
import SignatureAddBtn from './SignatureAddBtn';
import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';

import './SignatureStylePopup.scss';

const SignatureStylePopup = props => {
  const { t } = props;
  const [activeToolName, savedSignatures, displayedSignatures, selectedDisplayedSignatureIndex, maxSignaturesCount, displayedSignaturesFilterFunction] = useSelector(
    state => [
      selectors.getActiveToolName(state),
      selectors.getSavedSignatures(state),
      selectors.getDisplayedSignatures(state),
      selectors.getSelectedDisplayedSignatureIndex(state),
      selectors.getMaxSignaturesCount(state),
      selectors.getDisplayedSignaturesFilterFunction(state),
    ],
  );

  const signatureTool = core.getTool('AnnotationCreateSignature');
  const dispatch = useDispatch();

  const setSignature = async (index) => {
    dispatch(actions.setSelectedDisplayedSignatureIndex(index));
    const { annotation } = displayedSignatures[index];
    signatureTool.setSignature(annotation);
    core.setToolMode('AnnotationCreateSignature');
    if (signatureTool.hasLocation()) {
      await signatureTool.addSignature();
    } else {
      signatureTool.showPreview();
    }
  };

  const deleteSignature = (displayedSignatureIndex, savedSignatureIndex) => {
    signatureTool.deleteSavedSignature(savedSignatureIndex);

    const isDeletingSelectedSignature = selectedDisplayedSignatureIndex === displayedSignatureIndex;
    if (isDeletingSelectedSignature) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(0));
      signatureTool.annot = null;
      signatureTool.hidePreview();
      core.setToolMode(defaultTool);
      if (displayedSignatures.length === 1) {
        dispatch(actions.closeElements(['toolStylePopup']));
      }
    } else if (displayedSignatureIndex < selectedDisplayedSignatureIndex) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(selectedDisplayedSignatureIndex - 1));
    }
  };

  return (
    <div
      className="signature-style-popup"
    >
      {savedSignatures
        // Need to keep the index infromation from the original signature list
        .map((s, i) => [s, i])
        .filter(([s, i]) => displayedSignaturesFilterFunction(s, i))
        .map(([{ imgSrc }, savedSignatureIndex], indexOfDisplayedSignature) =>
          <div
            key={indexOfDisplayedSignature}
            className="signature-row"
          >
            <SignatureRowContent
              onClick={() => setSignature(indexOfDisplayedSignature)}
              imgSrc={imgSrc}
              isActive={selectedDisplayedSignatureIndex === indexOfDisplayedSignature && activeToolName === 'AnnotationCreateSignature'}
              altText={`${t('option.toolsOverlay.signatureAltText')} ${indexOfDisplayedSignature + 1}`}
            />
            <button
              className="icon"
              data-element="defaultSignatureDeleteButton"
              onClick={() => deleteSignature(indexOfDisplayedSignature, savedSignatureIndex)}
            >
              <Icon glyph="icon-delete-line" />
            </button>
          </div>
        )}
      <SignatureAddBtn
        disabled={savedSignatures.length >= maxSignaturesCount}
      />
    </div>
  );
};

export default withTranslation()(SignatureStylePopup);