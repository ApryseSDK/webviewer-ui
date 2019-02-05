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
    openElement: PropTypes.func.isRequired,
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
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    this.signatureTool.on('locationSelected', this.onLocationSelected);
    this.setUpSignatureCanvas(this.canvas.current);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.setState(this.initialState);
      this.signatureTool.clearSignatureCanvas();
      this.signatureTool.openSignature();
      this.props.closeElements([ 'printModal', 'loadingModal', 'progressModal', 'errorModal' ]);
    }
  }

  componentWillUnmount() {
    this.signatureTool.off('locationSelected', this.onLocationSelected);
  }

  onLocationSelected = () => {
    if (this.signatureTool.getSignaturePaths().length) {
      this.signatureTool.addSignature();
      core.setToolMode(defaultTool);
    }
  }

  setUpSignatureCanvas = canvas => {
    this.signatureTool.setSignatureCanvas($(canvas));
    // draw nothing in the background since we want to convert the signature on the canvas
    // to an image and we don't want the background to be in the image.
    this.signatureTool.drawBackground = () => {};

    const { width, height } = canvas.getBoundingClientRect();
    const multiplier = window.utils.getCanvasMultiplier();
    canvas.width = width * multiplier;
    canvas.height = height * multiplier;
    canvas.getContext('2d').scale(multiplier, multiplier);   
    canvas.addEventListener('mouseup', this.handleFinishDrawing);
  }

  handleFinishDrawing = () => {
    if (!this.signatureTool.isEmptySignature()) {
      this.setState({
        canClear: true,
        saveSignature: true
      });
    }
  }

  closeModal = () => { 
    this.clearCanvas();
    this.props.closeElement('signatureModal');
    core.setToolMode(defaultTool);
  }

  clearCanvas = () => {
    this.signatureTool.clearSignatureCanvas();
    this.setState(this.initialState);
  }

  handleSaveSignatureChange = () => {
    this.setState(prevState => ({
      saveSignature: !prevState.saveSignature
    }));
  }

  createSignature = () => {
    if (this.state.saveSignature) {
      this.signatureTool.saveDefaultSignature();
    }
    this.props.closeElement('signatureModal');
  }

  render() {
    const { canClear } = this.state;
    const { isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Modal SignatureModal', this.props);

    return (
      <div className={className} onClick={this.closeModal}>
        <div className="container" onClick={e => e.stopPropagation()} onMouseUp={this.handleFinishDrawing}>
          <div className="header">
            <ActionButton dataElement="signatureModalCloseButton" title="action.close" img="ic_close_black_24px" onClick={this.closeModal} />
          </div>
          <div className="signature">
            <canvas className="signature-canvas" ref={this.canvas}></canvas>
            <div className="signature-background">
              <div className="signature-sign-here">
                {t('message.signHere')}
              </div>
              <div className={`signature-clear ${canClear ? 'active': null}`} onClick={this.clearCanvas}>
                {t('action.clear')}
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="signature-save">
              <input id="default-signature" type="checkbox" checked={this.state.saveSignature} onChange={this.handleSaveSignatureChange} />
              <label htmlFor="default-signature">{t('action.saveSignature')}</label>
            </div>
            <div className="signature-apply" onClick={this.createSignature}>{t('action.apply')}</div>
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
  openElement: actions.openElement,
  closeElement: actions.closeElement,
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SignatureModal));