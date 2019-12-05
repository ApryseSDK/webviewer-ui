import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

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
    isSaveSignatureDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    t: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
  };

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
    this.setUpSignatureCanvas();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onRotate);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isDisabled && !this.props.isDisabled && !this.isCanvasReady) {
      this.setUpSignatureCanvas();
    }

    if (!prevProps.isOpen && this.props.isOpen) {
      core.setToolMode('AnnotationCreateSignature');
      this.setState(this.initialState);
      this.signatureTool.clearSignatureCanvas();
      this.props.closeElements(['printModal', 'loadingModal', 'progressModal', 'errorModal']);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onRotate);
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
  };

  setSignatureCanvasSize = () => {
    if (!this.canvas.current) {
      return;
    }

    const canvas = this.canvas.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  };

  onRotate = () => {
    const imageData = this.canvas.current.toDataURL();
    this.setSignatureCanvasSize();
    this.redrawSignatureCanvas(imageData);
  };

  onResize = () => {
    const imageData = this.canvas.current.toDataURL();
    this.setSignatureCanvasSize();
    this.redrawSignatureCanvas(imageData);
  };

  redrawSignatureCanvas = signatureData => {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = signatureData;
  };

  handleFinishDrawing = e => {
    if (
      e.target === e.currentTarget &&
      !this.signatureTool.isEmptySignature()
    ) {
      this.setState({
        canClear: true,
      });

      if (!this.props.isSaveSignatureDisabled) {
        this.setState({
          saveSignature: true,
        });
      }
    }
  };

  closeModal = () => {
    this.clearCanvas();
    this.signatureTool.clearLocation();
    this.props.closeElement('signatureModal');
    core.setToolMode(defaultTool);
  };

  clearCanvas = () => {
    this.signatureTool.clearSignatureCanvas();
    this.setState(this.initialState);
  };

  handleSaveSignatureChange = () => {
    this.setState(prevState => ({
      saveSignature: !prevState.saveSignature,
    }));
  };

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
  };

  render() {
    const { canClear } = this.state;
    const { isDisabled, isSaveSignatureDisabled, t } = this.props;
    const className = getClassName('Modal SignatureModal', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} onClick={this.closeModal}>
        <div
          className="container"
          onClick={e => e.stopPropagation()}
          onMouseUp={this.handleFinishDrawing}
        >
          <div className="header">
            <ActionButton
              dataElement="signatureModalCloseButton"
              title="action.close"
              img="ic_close_black_24px"
              onClick={this.closeModal}
            />
          </div>
          <div className="signature">
            <canvas className="signature-canvas" ref={this.canvas}></canvas>
            <div className="signature-background">
              <div className="signature-sign-here">{t('message.signHere')}</div>
              <div
                className={`signature-clear ${canClear ? 'active' : null}`}
                onClick={this.clearCanvas}
              >
                {t('action.clear')}
              </div>
            </div>
          </div>
          <div
            className="footer"
            style={{
              justifyContent: isSaveSignatureDisabled
                ? 'flex-end'
                : 'space-between',
            }}
          >
            {!isSaveSignatureDisabled && (
              <div
                className="signature-save"
                data-element="saveSignatureButton"
              >
                <input
                  id="default-signature"
                  type="checkbox"
                  checked={this.state.saveSignature}
                  onChange={this.handleSaveSignatureChange}
                />
                <label htmlFor="default-signature">
                  {t('action.saveSignature')}
                </label>
              </div>
            )}
            <div className="signature-create" onClick={this.createSignature}>
              {t('action.create')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureModal'),
  isSaveSignatureDisabled: selectors.isElementDisabled(
    state,
    'saveSignatureButton',
  ),
  isOpen: selectors.isElementOpen(state, 'signatureModal'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SignatureModal));
