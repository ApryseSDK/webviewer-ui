import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import { Tabs, Tab, TabPanel } from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';
import ImageSignature from 'components/SignatureModal/ImageSignature';
import Button from 'components/Button';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import './SignatureModal.scss';
import SignatureModes from 'constants/signatureModes';
import SavedSignatures from 'components/SignatureModal/SavedSignatures';
import DataElements from 'constants/dataElement';

const SignatureModal = () => {
  const [
    isDisabled,
    isOpen,
    activeToolName,
    signatureMode,
    activeDocumentViewerKey,
    isInitialsModeEnabled,
    isSavedTabDisabled,
    selectedTab,
    displayedSignatures,
    savedInitials,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementOpen(state, 'signatureModal'),
    selectors.getActiveToolName(state),
    selectors.getSignatureMode(state),
    selectors.getActiveDocumentViewerKey(state),
    selectors.getIsInitialsModeEnabled(state),
    selectors.isElementDisabled(state, DataElements.SAVED_SIGNATURES_TAB),
    selectors.getSelectedTab(state, 'signatureModal'),
    selectors.getDisplayedSignatures(state),
    selectors.getSavedInitials(state),
  ]);

  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Hack to close modal if hotkey to open other tool is used.
  useEffect(() => {
    if (activeToolName !== 'AnnotationCreateSignature') {
      dispatch(
        actions.closeElements([
          'signatureModal',
          'signatureOverlay',
        ]),
      );
    }
  }, [dispatch, activeToolName]);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          'printModal',
          'loadingModal',
          'progressModal',
          'errorModal',
        ]),
      );
    }
  }, [dispatch, isOpen]);

  const closeModal = () => {
    for (const signatureTool of signatureToolArray) {
      signatureTool.clearLocation();
      signatureTool.setSignature(null);
    }
    dispatch(actions.closeElement('signatureModal'));
  };

  const createSignatures = async () => {
    createFullSignature();

    if (isInitialsModeEnabled) {
      createInitials();
    }
  };

  const createFullSignature = async () => {
    signatureToolArray[0].saveSignatures(signatureToolArray[0].getFullSignatureAnnotation());
    for (let i = 1; i < signatureToolArray.length; i++) {
      await signatureToolArray[i].setSignature(signatureToolArray[0].getFullSignatureAnnotation());
    }

    const signatureTool = signatureToolArray[activeDocumentViewerKey - 1];

    if (!(await signatureTool.isEmptySignature())) {
      core.setToolMode('AnnotationCreateSignature');

      if (signatureMode === SignatureModes.FULL_SIGNATURE) {
        if (signatureTool.hasLocation()) {
          await signatureTool.addSignature();
        } else {
          for (const signatureTool of signatureToolArray) {
            await signatureTool.showPreview();
          }
        }

        dispatch(actions.closeElement('signatureModal'));
      }
    }
  };

  const createInitials = async () => {
    signatureToolArray[0].saveInitials(signatureToolArray[0].getInitialsAnnotation());
    for (let i = 1; i < signatureToolArray.length; i++) {
      await signatureToolArray[i].saveInitials(signatureToolArray[0].getInitialsAnnotation());
    }

    const signatureTool = signatureToolArray[activeDocumentViewerKey - 1];
    if (!(await signatureTool.isEmptyInitialsSignature())) {
      core.setToolMode('AnnotationCreateSignature');

      if (signatureMode === SignatureModes.INITIALS) {
        if (signatureTool.hasLocation()) {
          await signatureTool.addInitials();
        } else {
          for (const signatureTool of signatureToolArray) {
            await signatureTool.showInitialsPreview();
          }
        }
      }

      dispatch(actions.closeElement('signatureModal'));
      // back to the default mode
      dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
    }
  };

  const setSignature = async (index) => {
    const isFullSignature = signatureMode === SignatureModes.FULL_SIGNATURE;
    dispatch(actions[isFullSignature ? 'setSelectedDisplayedSignatureIndex' : 'setSelectedDisplayedInitialsIndex'](index));
    const { annotation } = isFullSignature ? displayedSignatures[index] : savedInitials[index];
    core.setToolMode('AnnotationCreateSignature');
    for (const signatureTool of signatureToolArray) {
      await signatureTool[isFullSignature ? 'setSignature' : 'setInitials'](annotation);
      if (signatureTool.hasLocation()) {
        await signatureTool[isFullSignature ? 'addSignature' : 'addInitials']();
      } else {
        await signatureTool[isFullSignature ? 'showPreview' : 'showInitialsPreview']();
      }
    }
    dispatch(actions.closeElement('signatureModal'));
  };

  const disableCreateButton = useCallback(() => {
    setCreateButtonDisabled(true);
  }, [createButtonDisabled]);

  const enableCreateButton = useCallback(() => {
    setCreateButtonDisabled(false);
  }, [createButtonDisabled]);

  const modalClass = classNames({
    Modal: true,
    SignatureModal: true,
    open: isOpen,
    closed: !isOpen,
  });
  const isSavedTabSelected = selectedTab === 'savedSignaturePanelButton';

  return isDisabled ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <FocusTrap locked={isOpen}>
        <div
          className={modalClass}
          data-element="signatureModal"
        >
          <div
            className={classNames('container', { 'include-initials': isInitialsModeEnabled })}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="swipe-indicator" />
            <Tabs id="signatureModal">
              <div className="header-container">
                <div className="header">
                  <p>{t('option.signatureModal.modalName')}</p>
                  <Button
                    className="signatureModalCloseButton"
                    dataElement="signatureModalCloseButton"
                    title="action.close"
                    img="ic_close_black_24px"
                    onClick={closeModal}
                  />
                </div>
                <div className="tab-list">
                  {!isSavedTabDisabled && <Tab dataElement="savedSignaturePanelButton">
                    <button className="tab-options-button">
                      {t('option.type.saved')}
                    </button>
                  </Tab>}
                  <div className="tab-options-divider" />
                  <Tab dataElement="inkSignaturePanelButton">
                    <button className="tab-options-button">
                      {t('action.draw')}
                    </button>
                  </Tab>
                  <div className="tab-options-divider" />
                  <Tab dataElement="textSignaturePanelButton">
                    <button className="tab-options-button">
                      {t('action.type')}
                    </button>
                  </Tab>
                  <div className="tab-options-divider" />
                  <Tab dataElement="imageSignaturePanelButton">
                    <button className="tab-options-button">
                      {t('action.upload')}
                    </button>
                  </Tab>
                </div>
              </div>
              {!isSavedTabDisabled && <TabPanel dataElement="savedSignaturePanel">
                <SavedSignatures {...{ selectedIndex, setSelectedIndex }} />
              </TabPanel>}
              <TabPanel dataElement="inkSignaturePanel">
                <InkSignature
                  isModalOpen={isOpen}
                  enableCreateButton={enableCreateButton}
                  disableCreateButton={disableCreateButton}
                  isInitialsModeEnabled={isInitialsModeEnabled}
                />
              </TabPanel>
              <TabPanel dataElement="textSignaturePanel">
                <TextSignature
                  isModalOpen={isOpen}
                  enableCreateButton={enableCreateButton}
                  disableCreateButton={disableCreateButton}
                  isInitialsModeEnabled={isInitialsModeEnabled}
                />
              </TabPanel>
              <TabPanel dataElement="imageSignaturePanel">
                <ImageSignature
                  isModalOpen={isOpen}
                  enableCreateButton={enableCreateButton}
                  disableCreateButton={disableCreateButton}
                  isInitialsModeEnabled={isInitialsModeEnabled}
                />
              </TabPanel>
              <div className="footer">
                <button className="signature-create" onClick={isSavedTabSelected ? () => setSignature(selectedIndex) : createSignatures}
                  disabled={isSavedTabSelected ? (!isSavedTabSelected || !displayedSignatures.length || !isOpen) : (!(isOpen) || createButtonDisabled)}>
                  {t(isSavedTabSelected ? 'action.apply' : 'action.create')}
                </button>
              </div>
            </Tabs>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

export default SignatureModal;
