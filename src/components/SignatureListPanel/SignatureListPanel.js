import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import DataElementWrapper from '../DataElementWrapper';
import defaultTool from 'constants/defaultTool';
import selectors from 'selectors';
import actions from 'actions';
import './SignatureListPanel.scss';
import Divider from '../ModularComponents/Divider';
import SignatureModes from 'constants/signatureModes';
import SavedSignatures from './SavedSignatures';
import SignatureAddButton from './SignatureAddButton';
import core from 'core';
import DataElements from 'constants/dataElement';

const SignatureListPanel = () => {
  const [t] = useTranslation();

  const [
    savedSignatures,
    maxSignaturesCount,
    displayedSignaturesFilterFunction,
    isSignatureDeleteButtonDisabled,
    savedInitials,
    selectedSignatureIndex,
    signatureMode,
  ] = useSelector(
    (state) => [
      selectors.getSavedSignatures(state),
      selectors.getMaxSignaturesCount(state),
      selectors.getDisplayedSignaturesFilterFunction(state),
      selectors.isElementDisabled(state, 'defaultSignatureDeleteButton'),
      selectors.getSavedInitials(state),
      selectors.getSelectedDisplayedSignatureIndex(state),
      selectors.getSignatureMode(state),

    ],
    shallowEqual,
  );
  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');

  useEffect(() => {
    return () => {
      for (const signatureTool of signatureToolArray) {
        signatureTool.clearLocation();
        signatureTool.setSignature(null);
        signatureTool.setInitials(null);
      }
    };
  }, []);


  // Saved signatures and initials are now in a single object. Merge them
  const [savedSignaturesAndInitials, setSavedSignaturesAndInitials] = React.useState([]);
  useEffect(() => {
    const signaturesToDisplay = savedSignatures.filter((signature, index) => displayedSignaturesFilterFunction(signature, index));
    const mergedSignaturesAndInitals = signaturesToDisplay.map((signature, index) => {
      return {
        fullSignature: signature,
        initials: savedInitials[index] || null,
      };
    });
    setSavedSignaturesAndInitials(mergedSignaturesAndInitals);
  }, [savedSignatures, savedInitials, displayedSignaturesFilterFunction]);

  const dispatch = useDispatch();

  const setSignature = useCallback(async (index) => {
    const { fullSignature } = savedSignaturesAndInitials[index];
    const { annotation } = fullSignature;
    dispatch(actions.setSelectedDisplayedSignatureIndex(index));
    core.setToolMode('AnnotationCreateSignature');
    for (const signatureTool of signatureToolArray) {
      await signatureTool.setSignature(annotation);
      if (signatureTool.hasLocation()) {
        await signatureTool.addSignature();
      } else {
        await signatureTool.showPreview();
        dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
      }
    }
  }, [savedSignaturesAndInitials]);

  const setInitials = useCallback((async (index) => {
    const { initials } = savedSignaturesAndInitials[index];
    const { annotation } = initials;
    dispatch(actions.setSelectedDisplayedSignatureIndex(index));
    core.setToolMode('AnnotationCreateSignature');
    for (const signatureTool of signatureToolArray) {
      await signatureTool.setInitials(annotation);
      if (signatureTool.hasLocation()) {
        await signatureTool.addInitials();
        // Default mode is fullSignature. If we dont reset it here there can be a bug where
        // we preview the initials, but apply the full signature
        dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
      } else {
        await signatureTool.showInitialsPreview();
        dispatch(actions.setSignatureMode(SignatureModes.INITIALS));
      }
    }
  }), [savedSignaturesAndInitials]);

  const deleteSignatureAndInitials = useCallback(async (index) => {
    signatureToolArray[0].deleteSavedInitials(index);
    signatureToolArray[0].deleteSavedSignature(index);
    const remainingSignatures = signatureToolArray[0].getSavedSignatures();
    const isDeletingSelectedSignature = selectedSignatureIndex === index;

    if (isDeletingSelectedSignature) {
      signatureToolArray.forEach((signatureTool) => {
        signatureTool.hidePreview();
        signatureTool.setSignature(null);
        signatureTool.setInitials(null);
      });
      core.setToolMode(defaultTool);
    }

    if (remainingSignatures.length === 0) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(null));
    } else {
      let newIndex = selectedSignatureIndex;
      if (isDeletingSelectedSignature || index < selectedSignatureIndex) {
        newIndex = Math.max(0, selectedSignatureIndex - 1);
      }
      dispatch(actions.setSelectedDisplayedSignatureIndex(newIndex));
    }
  }, [selectedSignatureIndex]);


  return (
    <DataElementWrapper dataElement={DataElements.SIGNATURE_LIST_PANEL} className="Panel SignatureListPanel">
      <div className='signature-list-panel-header'>
        {t('signatureListPanel.header')}
      </div>
      <SignatureAddButton isDisabled={savedSignaturesAndInitials.length >= maxSignaturesCount} />
      <Divider />
      <SavedSignatures
        savedSignatures={savedSignaturesAndInitials}
        onFullSignatureSetHandler={setSignature}
        onInitialsSetHandler={setInitials}
        deleteHandler={deleteSignatureAndInitials}
        currentlySelectedSignature={selectedSignatureIndex}
        isDeleteDisabled={isSignatureDeleteButtonDisabled}
        signatureMode={signatureMode} />
    </DataElementWrapper>
  );
};

export default SignatureListPanel;