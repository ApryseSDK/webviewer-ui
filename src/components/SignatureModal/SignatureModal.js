import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Tabs, Tab, TabPanel } from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';
import ImageSignature from 'components/SignatureModal/ImageSignature';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';

import './SignatureModal.scss';

const SignatureModal = () => {
  const [isDisabled, isSaveSignatureDisabled, isOpen, activeToolName, activeToolStyles, selectedTab] = useSelector(state => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementDisabled(state, 'saveSignatureButton'),
    selectors.isElementOpen(state, 'signatureModal'),
    selectors.getActiveToolName(state),
    selectors.getActiveToolStyles(state),
    selectors.getSelectedTab(state, 'signatureModal'),
  ]);

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
  const [saveSignature, setSaveSignature] = useState(true);
  const [t] = useTranslation();
  const signatureTool = core.getTool('AnnotationCreateSignature');

  const _setSaveSignature = useCallback(
    save => {
      if (!isSaveSignatureDisabled) {
        setSaveSignature(save);
      }
    },
    [isSaveSignatureDisabled],
  );

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
    dispatch(actions.closeElement('signatureModal'));
    // core.setToolMode(defaultTool);
  };

  const createSignature = () => {
    if (!signatureTool.isEmptySignature()) {
      if (saveSignature) {
        signatureTool.saveSignatures(signatureTool.annot);
      }
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
            {/* <ActionButton
              dataElement="signatureModalCloseButton"
              title="action.close"
              img="ic_close_black_24px"
              onClick={closeModal}
            /> */}
            {/* {(selectedTab === 'inkSignaturePanelButton') &&
              <StylePopup
                colorMapKey={colorMapKey}
                onStyleChange={(property, value) => {
                  setToolStyles(activeToolName, property, value);
                }}
                style={activeToolStyles}
              />} */}
            {/* <div
              className="divider-horizontal"
            /> */}
            <TabPanel dataElement="inkSignaturePanel">
              <InkSignature
                isModalOpen={isOpen}
                _setSaveSignature={_setSaveSignature}
                createSignature={createSignature}
              />
            </TabPanel>
            <TabPanel dataElement="textSignaturePanel">
              <TextSignature
                isModalOpen={isOpen}
                _setSaveSignature={_setSaveSignature}
                createSignature={createSignature}
              />
            </TabPanel>
            <TabPanel dataElement="imageSignaturePanel">
              <ImageSignature
                isModalOpen={isOpen}
                _setSaveSignature={_setSaveSignature}
                createSignature={createSignature}
              />
            </TabPanel>
          </Tabs>
          {/* <div
            className="footer"
          >
            <div className="signature-clear" onClick={() => {}}>
              {t('action.clear')}
            </div>
            <div className="signature-create" onClick={createSignature}>
              {t('action.create')}
            </div>
          </div> */}
        </div>
      </div>
    </Swipeable>
  );
};

export default SignatureModal;
