import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ActionButton from 'components/ActionButton';
import {
  Tabs, TabList, Tab, TabPanels, TabPanel,
} from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureModal.scss';

const SignatureModal = () => {
  const [isDisabled, isOpen] = useSelector(state => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementOpen(state, 'signatureModal'),
  ]);
  const dispatch = useDispatch();
  const [saveSignature, setSaveSignature] = useState(false);
  const [t] = useTranslation();
  const signatureTool = core.getTool('AnnotationCreateSignature');

  useEffect(() => {
    if (isOpen) {
      core.setToolMode('AnnotationCreateSignature');
      setSaveSignature(false);
      dispatch(
        actions.closeElements([
          'printModal',
          'loadingModal',
          'progressModal',
          'errorModal',
        ]),
      );
    }
  }, [isOpen]);

  const closeModal = () => {
    signatureTool.clearLocation();
    dispatch(actions.closeElement('signatureModal'));
    core.setToolMode(defaultTool);
  };

  const toggleSaveSignature = () => {
    setSaveSignature(!saveSignature);
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
    <div className={modalClass} onClick={closeModal}>
      <div
        className="container"
        onClick={e => e.stopPropagation()}
      >
        <Tabs>
          <div className="header">
            <TabList>
              <Tab>
                <p>Draw</p>
              </Tab>
              <Tab>
                <p>Type</p>
              </Tab>
              <Tab>
                <p>Upload</p>
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
                setSaveSignature={setSaveSignature}
              />
            </TabPanel>
            <TabPanel>
              <TextSignature setSaveSignature={setSaveSignature} />
            </TabPanel>
            <TabPanel>
              <div>Upload</div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="footer">
          <div className="signature-save">
            <input
              id="default-signature"
              type="checkbox"
              checked={saveSignature}
              onChange={toggleSaveSignature}
            />
            <label htmlFor="default-signature">
              {t('action.saveSignature')}
            </label>
          </div>
          <div className="signature-create" onClick={createSignature}>
            {t('action.create')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;

// handleFileChange = e => {
//   this.signatureTool.clearSignatureCanvas();
//   const fileReader = new FileReader();

//   fileReader.onload = e => {
//     const image = document.createElement('img');
//     const imageData = e.target.result;
//     image.src = imageData;

//     image.onload = () => {
//       const canvas = this.canvas.current;
//       const ctx = this.canvas.current.getContext('2d');

//       ctx.drawImage(
//         image,
//         canvas.width / 2 - image.width / 2,
//         canvas.height / 2 - image.height / 2
//       );

//       this.signatureTool.setSignature(imageData);
//       this.handleFinishDrawing(e);
//     };
//   };
//   fileReader.readAsDataURL(e.target.files[0]);
// };
