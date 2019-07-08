import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import ActionButton from 'components/ActionButton';

import core from 'core';
import getClassName from 'helpers/getClassName';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureModal.scss';

class SignatureModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    t: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.signatureTool = core.getTool('AnnotationCreateSignature');
    this.initialState = {
      saveSignature: false,
      canClear: false, 
      inputValue: ''
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    this.setUpSignatureCanvas();
    window.addEventListener('resize', this.setSignatureCanvasSize);
    window.addEventListener('orientationchange', this.setSignatureCanvasSize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isDisabled && !this.props.isDisabled && !this.isCanvasReady) {
      this.setUpSignatureCanvas();
    }

    if (!prevProps.isOpen && this.props.isOpen) {
      core.setToolMode('AnnotationCreateSignature');
      this.setState(this.initialState);
      this.signatureTool.clearSignatureCanvas();
      this.props.closeElements([ 'printModal', 'loadingModal', 'progressModal', 'errorModal' ]); 
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSignatureCanvasSize);
    window.removeEventListener('orientationchange', this.setSignatureCanvasSize);
  }

  setUpSignatureCanvas = () => {
    const canvas = this.canvas.current;
    if (!canvas) {
      return;
    }

    this.signatureTool.setSignatureCanvas(canvas);
    
    const multiplier = window.utils.getCanvasMultiplier();
    canvas.getContext('2d').scale(multiplier, multiplier);   
    canvas.addEventListener('mouseup', this.handleFinishDrawing);
    canvas.addEventListener('touchend', this.handleFinishDrawing);
    this.setSignatureCanvasSize();
    this.isCanvasReady = true;
  }

  setSignatureCanvasSize = () => {
    if (!this.canvas.current) {
      return;
    }

    const canvas = this.canvas.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  }

  handleFinishDrawing = e => {
    if (
      e.target === e.currentTarget && 
      !this.signatureTool.isEmptySignature()
    ) {
      this.setState({
        canClear: true,
        saveSignature: true
      });
    }
  }

  closeModal = () => { 
    this.clearCanvas();
    this.signatureTool.clearLocation();
    this.props.closeElement('signatureModal');
    core.setToolMode(defaultTool);
  }

  clearCanvas = () => {
    this.signatureTool.clearSignatureCanvas();
    this.setState(this.initialState);
  }

  handleInputChange = e => {
    const text = e.target.value;
    this.signatureTool.clearSignatureCanvas();

    const canvas = this.canvas.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    if (e.target.value) {
      this.signatureTool.setSignature(canvas.toDataURL());
      this.handleFinishDrawing(e);
      this.setState({
        inputValue: text
      });
    } else {
      this.setState(this.initialState);      
    }
  }

  handleFileChange = e => {
    this.signatureTool.clearSignatureCanvas();
    const fileReader = new FileReader();

    fileReader.onload = e => {
      const image = document.createElement('img');
      const imageData = e.target.result;
      image.src = imageData;

      image.onload = () => {
        const canvas = this.canvas.current;
        const ctx = this.canvas.current.getContext('2d');
  
        ctx.drawImage(
          image, 
          canvas.width / 2 - image.width / 2, 
          canvas.height / 2 - image.height / 2,
        );

        this.signatureTool.setSignature(imageData);
        this.handleFinishDrawing(e);
      };
    };
    fileReader.readAsDataURL(e.target.files[0]);
  }

  handleSaveSignatureChange = () => {
    this.setState(prevState => ({
      saveSignature: !prevState.saveSignature
    }));
  }

  createSignature = () => {
    const { closeElement } = this.props;
    
    if (!this.signatureTool.isEmptySignature()) {
      if (this.state.saveSignature) {
        this.signatureTool.saveSignatures(this.signatureTool.annot);
      }
      if (this.signatureTool.hasLocation()) {
        this.signatureTool.addSignature();
      } else {
        this.signatureTool.showPreview();
      }
      closeElement('signatureModal');
    }
  }

  render() {
    const { canClear } = this.state;
    const { isDisabled, t } = this.props;
    const className = getClassName('Modal SignatureModal', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} onClick={this.closeModal}>
        <div className="container" onClick={e => e.stopPropagation()} onMouseUp={this.handleFinishDrawing}>
          <div className="header">
            <input type="file" accept="image/png, image/jpeg" onChange={this.handleFileChange} />
            <input value={this.state.inputValue} type="text" onChange={this.handleInputChange} />
            <ActionButton dataElement="signatureModalCloseButton" title="action.close" img="ic_close_black_24px" onClick={this.closeModal} />
          </div>
          <div className="signature">
            <canvas className="signature-canvas" ref={this.canvas}></canvas>
            <div className="signature-background">
              <div className="signature-sign-here">
                {t('message.signHere')}
              </div>
              <div className={`signature-clear ${canClear ? 'active' : null}`} onClick={this.clearCanvas}>
                {t('action.clear')}
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="signature-save">
              <input id="default-signature" type="checkbox" checked={this.state.saveSignature} onChange={this.handleSaveSignatureChange} />
              <label htmlFor="default-signature">{t('action.saveSignature')}</label>
            </div>
            <div className="signature-create" onClick={this.createSignature}>{t('action.create')}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureModal'),
  isOpen: selectors.isElementOpen(state, 'signatureModal'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SignatureModal));