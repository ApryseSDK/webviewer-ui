import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ActionButton from 'components/ActionButton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';
import ImageSignature from 'components/SignatureModal/ImageSignature';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureModal.scss';

const SignatureModal = () => {
  const [isDisabled, isSaveSignatureDisabled, isOpen] = useSelector(state => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementDisabled(state, 'saveSignatureButton'),
    selectors.isElementOpen(state, 'signatureModal'),
  ]);
  const dispatch = useDispatch();
  const [saveSignature, setSaveSignature] = useState(false);
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
      core.setToolMode('AnnotationCreateSignature');
      dispatch(
        actions.closeElements([
          'printModal',
          'loadingModal',
          'progressModal',
          'errorModal',
        ]),
      );
    }
  }, [_setSaveSignature, dispatch, isOpen]);

  const closeModal = () => {
    signatureTool.clearLocation();
    dispatch(actions.closeElement('signatureModal'));
    core.setToolMode(defaultTool);
  };

  const toggleSaveSignature = () => {
    _setSaveSignature(!saveSignature);
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
    <div className={modalClass} onMouseDown={closeModal}>
      <div className="container" onMouseDown={e => e.stopPropagation()}>
        <Tabs>
          <div className="header">
            <TabList>
              <Tab>
                <span>{t('action.draw')}</span>
              </Tab>
              <Tab>
                <span>{t('action.type')}</span>
              </Tab>
              <Tab>
                <span>{t('action.upload')}</span>
              </Tab>
            </TabList>
            <ActionButton
              dataElement="signatureModalCloseButton"
              title="action.close"
              img="ic_close_black_24px"
              onClick={closeModal}
            />
          </div>

          <TabPanels>
            <TabPanel>
              <InkSignature
                isModalOpen={isOpen}
                _setSaveSignature={_setSaveSignature}
              />
            </TabPanel>
            <TabPanel>
              <TextSignature
                isModalOpen={isOpen}
                _setSaveSignature={_setSaveSignature}
              />
            </TabPanel>
            <TabPanel>
              <ImageSignature
                isModalOpen={isOpen}
                _setSaveSignature={_setSaveSignature}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div
          className="footer"
          style={{
            justifyContent: isSaveSignatureDisabled
              ? 'flex-end'
              : 'space-between',
          }}
        >
          {!isSaveSignatureDisabled && (
            <div className="signature-save" data-element="saveSignatureButton">
              <input
                id="default-signature"
                type="checkbox"
                checked={saveSignature}
                onChange={toggleSaveSignature}
              />
              <label htmlFor="default-signature">
                {t('option.signatureModal.saveSignature')}
              </label>
            </div>
          )}
          <div className="signature-create" onClick={createSignature}>
            {t('action.create')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
