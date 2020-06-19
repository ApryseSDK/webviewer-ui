import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Tabs, Tab, TabPanel } from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';
import ImageSignature from 'components/SignatureModal/ImageSignature';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import './SignatureModal.scss';

const SignatureModal = () => {
  const [isDisabled, isOpen, activeToolName, savedSignatures2] = useSelector(state => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementOpen(state, 'signatureModal'),
    selectors.getActiveToolName(state),
    selectors.getSavedSignatures(state),
  ]);

  const signatureTool = core.getTool('AnnotationCreateSignature');

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
    signatureTool.clearLocation();
    signatureTool.setSignature(null);
    dispatch(actions.closeElement('signatureModal'));
  };

  const createSignature = () => {
    if (!signatureTool.isEmptySignature()) {
      signatureTool.saveSignatures(signatureTool.annot);

      dispatch(actions.setSelectedSignatureIndex(savedSignatures2.length));
      signatureTool.setSignature(signatureTool.annot);
      core.setToolMode('AnnotationCreateSignature');

      if (signatureTool.hasLocation()) {
        signatureTool.addSignature();
      } else {
        signatureTool.showPreview();
      }
      dispatch(actions.closeElement('signatureModal'));
    }
  };

  const modalClass = classNames({
    Modal: true,
    SignatureModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <div
        className={modalClass}
        data-element="signatureModal"
        onMouseDown={closeModal}
      >
        <div
          className="container"
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="swipe-indicator" />
          <Tabs id="signatureModal">
            <div className="tab-list">
              <Tab dataElement="inkSignaturePanelButton">
                <div className="tab-options-button">
                  {t('action.draw')}
                </div>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement="textSignaturePanelButton">
                <div className="tab-options-button">
                  {t('action.type')}
                </div>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement="imageSignaturePanelButton">
                <div className="tab-options-button">
                  {t('action.upload')}
                </div>
              </Tab>
            </div>
            <TabPanel dataElement="inkSignaturePanel">
              <InkSignature
                isModalOpen={isOpen}
                createSignature={createSignature}
              />
            </TabPanel>
            <TabPanel dataElement="textSignaturePanel">
              <TextSignature
                isModalOpen={isOpen}
                createSignature={createSignature}
              />
            </TabPanel>
            <TabPanel dataElement="imageSignaturePanel">
              <ImageSignature
                isModalOpen={isOpen}
                createSignature={createSignature}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Swipeable>
  );
};

export default SignatureModal;
