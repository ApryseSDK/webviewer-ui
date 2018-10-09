import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ActionButton from 'components/ActionButton';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureModal.scss';

class SignatureModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.canvas = React.createRef();
    this.signatureTool = core.getTool('AnnotationCreateSignature');
  }

  componentDidMount() {
    this.signatureTool.on('locationSelected', this.onLocationSelected);
    this.signatureTool.setSignatureCanvas($(this.canvas.current));
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.updateCanvasSize();
      this.props.closeElements([ 'printModal', 'loadingModal', 'errorModal' ]);
    }
  }

  updateCanvasSize = () => {
    const width = window.innerWidth > 620 ? 600 : window.innerWidth - 20;
    const height = window.innerHeight > 466 ? 300 : window.innerHeight - 80 - 96;
    this.canvas.current.style.width = `${width}px`;
    this.canvas.current.style.height = `${height}px`;
    this.canvas.current.width = width * window.utils.getCanvasMultiplier();
    this.canvas.current.height = height * window.utils.getCanvasMultiplier();
  }

  componentWillUnmount() {
    this.signatureTool.off('locationSelected', this.onLocationSelected);
  }

  onLocationSelected = () => {
    this.props.openElement('signatureModal');
    this.signatureTool.openSignature();
  }

  closeModal = () => {
    this.signatureTool.clearSignatureCanvas();
    this.props.closeElement('signatureModal');
  }

  clearCanvas = () => {
    this.signatureTool.clearSignatureCanvas();
    this.signatureTool.drawBackground();
  }

  addSignature = () => {
    this.signatureTool.addSignature();
    this.closeModal();
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal SignatureModal', this.props);

    return (
      <div className={className} onClick={this.closeModal}>
        <div className="container" onClick={e => e.stopPropagation()}>
          <div className="header">
            <ActionButton dataElement="signatureModalCloseButton" title="action.close" img="ic_close_black_24px" onClick={this.closeModal} />
          </div>
          <canvas ref={this.canvas}></canvas>
          <div className="footer">
            <ActionButton dataElement="signatureModalClearButton" title="action.clear" img="ic_delete_black_24px" onClick={this.clearCanvas} />
            <ActionButton dataElement="signatureModalSignButton" title="action.sign" img="ic_check_black_24px" onClick={this.addSignature} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SignatureModal);