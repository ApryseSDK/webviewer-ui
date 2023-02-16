import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';
import selectors from 'selectors';
import Icon from 'components/Icon';
import SignatureRowContent from './SignatureRowContent';
import SignatureAddBtn from './SignatureAddBtn';
import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import SignatureModes from 'constants/signatureModes';

import './SignatureStylePopup.scss';

const SavedSignatures = (props) => {
  const {
    savedSignatures,
    onSetHandler,
    deleteHandler,
    activeToolName,
    currentlySelectedIndex,
    isDeleteDisabled,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      {
        savedSignatures
          // Need to keep the index information from the original signature list
          .map((signature, index) => [signature, index])
          .map(([{ imgSrc }, savedSignatureIndex]) => <div
            key={savedSignatureIndex}
            className="signature-row"
          >
            <SignatureRowContent
              onClick={() => onSetHandler(savedSignatureIndex)}
              imgSrc={imgSrc}
              isActive={currentlySelectedIndex === savedSignatureIndex && activeToolName === 'AnnotationCreateSignature'}
              altText={`${t('option.toolsOverlay.signatureAltText')} ${savedSignatureIndex + 1}`}
            />
            {!isDeleteDisabled && (
              <button
                className="icon"
                data-element="defaultSignatureDeleteButton"
                onClick={() => deleteHandler(savedSignatureIndex)}
              >
                <Icon glyph="icon-delete-line" />
              </button>
            )}
          </div>
          )
      }
    </>
  );
};

const SignatureStylePopup = (props) => {
  const { t } = props;
  const [
    activeToolName,
    savedSignatures,
    displayedSignatures,
    selectedDisplayedSignatureIndex,
    maxSignaturesCount,
    displayedSignaturesFilterFunction,
    isSignatureDeleteButtonDisabled,
    savedInitials,
    selectedDisplayedInitialsIndex,
    signatureMode,
  ] = useSelector(
    (state) => [
      selectors.getActiveToolName(state),
      selectors.getSavedSignatures(state),
      selectors.getDisplayedSignatures(state),
      selectors.getSelectedDisplayedSignatureIndex(state),
      selectors.getMaxSignaturesCount(state),
      selectors.getDisplayedSignaturesFilterFunction(state),
      selectors.isElementDisabled(state, 'defaultSignatureDeleteButton'),
      selectors.getSavedInitials(state),
      selectors.getSelectedDisplayedInitialsIndex(state),
      selectors.getSignatureMode(state),
    ]
  );

  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  const dispatch = useDispatch();

  const setSignature = async (index) => {
    dispatch(actions.setSelectedDisplayedSignatureIndex(index));
    const { annotation } = displayedSignatures[index];
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
  };

  const setInitials = async (index) => {
    dispatch(actions.setSelectedDisplayedInitialsIndex(index));
    const { annotation } = savedInitials[index];
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
  };

  const deleteSignatureAndInitials = async (index) => {
    const isFullSignature = signatureMode === SignatureModes.FULL_SIGNATURE;
    signatureToolArray[0].deleteSavedInitials(index);
    signatureToolArray[0].deleteSavedSignature(index);
    const isDeletingSelectedSignature = selectedDisplayedSignatureIndex === index;
    const isDeletingSelectedInitials = selectedDisplayedInitialsIndex === index;
    if (isDeletingSelectedSignature || isDeletingSelectedInitials) {
      dispatch(actions[isDeletingSelectedSignature ? 'setSelectedDisplayedSignatureIndex' : 'setSelectedDisplayedInitialsIndex'](0));
      for (const signatureTool of signatureToolArray) {
        signatureTool.hidePreview();
      }
      core.setToolMode(defaultTool);
      const isDeletingLast = (isFullSignature ? displayedSignatures : savedInitials).length === 1;
      if (isDeletingLast) {
        dispatch(actions.closeElements(['toolStylePopup']));
      }
    } else if (index < (isFullSignature ? selectedDisplayedSignatureIndex : selectedDisplayedInitialsIndex)) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(selectedDisplayedSignatureIndex - 1));
    }
  };

  const signaturesToDisplay = savedSignatures.filter((signature, index) => displayedSignaturesFilterFunction(signature, index));

  return (
    <div
      className="signature-style-popup"
    >
      <Tabs id="savedSignatures">
        <DataElementWrapper
          dataElement="savedSignatureAndInitialsTabs"
          className="tab-list">
          <Tab dataElement={DataElements.SAVED_SIGNATURES_PANEL_BUTTON}>
            <button className="tab-options-button">
              {t('option.type.signature')}
            </button>
          </Tab>
          <Tab dataElement={DataElements.SAVED_INTIALS_PANEL_BUTTON}>
            <button className="tab-options-button">
              {t('option.type.initials')}
            </button>
          </Tab>
        </DataElementWrapper>

        <TabPanel dataElement={DataElements.SAVED_FULL_SIGNATURES_PANEL}>
          <SavedSignatures
            savedSignatures={signaturesToDisplay}
            onSetHandler={(index) => setSignature(index)}
            deleteHandler={(index) => deleteSignatureAndInitials(index)}
            currentlySelectedIndex={selectedDisplayedSignatureIndex}
            isDeleteDisabled={isSignatureDeleteButtonDisabled}
            activeToolName={activeToolName} />
        </TabPanel>
        <TabPanel dataElement={DataElements.SAVED_INITIALS_PANEL}>
          <SavedSignatures
            savedSignatures={savedInitials}
            onSetHandler={(index) => setInitials(index)}
            deleteHandler={(index) => deleteSignatureAndInitials(index)}
            currentlySelectedIndex={selectedDisplayedInitialsIndex}
            isDeleteDisabled={isSignatureDeleteButtonDisabled}
            activeToolName={activeToolName} />
        </TabPanel>
      </Tabs>
      <SignatureAddBtn
        disabled={savedSignatures.length >= maxSignaturesCount || savedInitials.length > maxSignaturesCount}
      />
    </div>
  );
};

export default withTranslation()(SignatureStylePopup);
