import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import ActionButton from 'components/ActionButton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'components/Tabs';
import InkCanvas from 'components/SignatureModal/InkCanvas';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureModal.scss';

const propTypes = {
  isDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  t: PropTypes.func.isRequired,
  closeElement: PropTypes.func.isRequired,
  closeElements: PropTypes.func.isRequired
};

const SignatureModal = ({
  isDisabled,
  isOpen,
  t,
  closeElement,
  closeElements
}) => {
  const [saveSignature, setSaveSignature] = useState(false);
  const signatureTool = core.getTool('AnnotationCreateSignature');

  useEffect(() => {
    if (isOpen) {
      core.setToolMode('AnnotationCreateSignature');
      setSaveSignature(false);
      signatureTool.clearSignatureCanvas();
      closeElements([
        'printModal',
        'loadingModal',
        'progressModal',
        'errorModal'
      ]);
    }
  }, [isOpen]);

  const closeModal = () => {
    // this.clearCanvas();
    signatureTool.clearLocation();
    closeElement('signatureModal');
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
      closeElement('signatureModal');
    }
  };

  const modalClass = classNames({
    Modal: true,
    SignatureModal: true,
    open: isOpen,
    closed: !isOpen
  });

  return isDisabled ? null : (
    <div className={modalClass} onClick={closeModal}>
      <div
        className="container"
        onClick={e => e.stopPropagation()}
        // onMouseUp={handleFinishDrawing}
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
              <InkCanvas />
            </TabPanel>
            <TabPanel>
              <div>Type</div>
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

SignatureModal.propTypes = propTypes;

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureModal'),
  isOpen: selectors.isElementOpen(state, 'signatureModal')
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements
};

<<<<<<< HEAD
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SignatureModal));

// handleInputChange = e => {
//   const text = e.target.value;
//   const canvas = this.canvas.current;
//   this.signatureTool.clearSignatureCanvas();

//   const ctx = this.signatureTool.ctx;
//   ctx.save();
//   ctx.font = '50px sans-serif';
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.fillText(text, canvas.width / 2, canvas.height / 2);
//   ctx.restore();

//   if (e.target.value) {
//     this.signatureTool.setSignature(canvas.toDataURL());
//     this.handleFinishDrawing(e);
//     this.setState({
//       inputValue: text
//     });
//   } else {
//     this.setState(this.initialState);
//   }
// };

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