import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import ActionButton from 'components/ActionButton';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureOverlay.scss';

class SignatureOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isSignatureModalOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    maxSignaturesCount: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.signatureTool = core.getTool('AnnotationCreateSignature');
    this.overlay = React.createRef();
    this.currentSignatureIndex = -1;
    this.state = {
      defaultSignatures: [],
      left: 0,
      right: 'auto',
    };
  }

  componentDidMount() {
    this.signatureTool.on('signatureSaved', this.onSignatureSaved);
    this.signatureTool.on('signatureDeleted', this.onSignatureDeleted);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'toolsOverlay', 'zoomOverlay', 'toolStylePopup']);
      this.setOverlayPosition();
    }

    if (
      prevProps.isOpen && !this.props.isOpen &&
      !this.props.isSignatureModalOpen &&
      this.signatureTool.isEmptySignature()
    ) {
      // location of signatureTool will be set when clicking on a signature widget
      // we want to clear location when the overlay is closed without any default signatures selected
      // to prevent signature from being drawn to the previous location
      // however the overlay will be closed without any default signature selected if we clicked the "add signature" button(which opens the signature modal)
      // we don't want to clear the location in the case because we still want the signature to be automatically added to the widget after the create button is hit in the modal
      this.signatureTool.clearLocation();
    }
  }

  componentWillUnmount() {
    this.signatureTool.off('signatureSaved', this.onSignatureSaved);
    this.signatureTool.off('signatureDeleted', this.onSignatureDeleted);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleClickOutside = e => {
    const clickedSignatureButton = e.target.getAttribute('data-element') === 'signatureToolButton';

    if (!clickedSignatureButton) {
      this.props.closeElement('signatureOverlay');
    }
  }

  handleWindowResize = () => {
    this.setOverlayPosition();
  }

  setOverlayPosition = () => {
    const { left, right } = getOverlayPositionBasedOn('signatureToolButton', this.overlay);
    this.setState({
      // TODO: remove the hard-coded value.
      left: left === -9999 ? window.innerWidth / 2 - 95 : left - 95,
      right,
    });
  }

  onSignatureSaved = async annotations => {
    const numberOfSignaturesToRemove = this.state.defaultSignatures.length + annotations.length - this.props.maxSignaturesCount;
    const defaultSignatures = [...this.state.defaultSignatures];

    if (numberOfSignaturesToRemove > 0) {
      // to keep the UI sync with the signatures saved in the tool
      for (let i = 0; i < numberOfSignaturesToRemove; i++) {
        this.signatureTool.deleteSavedSignature(0);
      }

      defaultSignatures.splice(0, numberOfSignaturesToRemove);
    }

    const savedSignatures = await this.getSignatureDataToStore(annotations);
    this.setState({
      defaultSignatures: defaultSignatures.concat(savedSignatures),
    });
  }

  onSignatureDeleted = async () => {
    const savedSignatures = await this.getSignatureDataToStore(this.signatureTool.getSavedSignatures());
    this.setState({
      defaultSignatures: savedSignatures,
    });
  }

  onAnnotationChanged = async (annotations, action) => {
    if (
      action === 'modify' &&
      annotations.length === 1 &&
      annotations[0].ToolName === 'AnnotationCreateSignature'
    ) {
      const newStyles = getAnnotationStyles(annotations[0]);
      let annotationsWithNewStyles = this.state.defaultSignatures.map(({ annotation }) => Object.assign(annotation, newStyles));
      annotationsWithNewStyles = await this.getSignatureDataToStore(annotationsWithNewStyles);

      this.setState({
        defaultSignatures: annotationsWithNewStyles,
      });
    }
  }

  // returns an array of objects in the shape of: { annotation, preview }
  // annotation: a copy of the annotation passed in
  // imgSrc: preview of the annotation, a base64 string
  getSignatureDataToStore = async annotations => {
    // copy the annotation because we need to mutate the annotation object later if there're any styles changes
    // and we don't want the original annotation to be mutated as well
    // since it's been added to the canvas
    annotations = annotations.map(core.getAnnotationCopy);
    const previews = await Promise.all(annotations.map(annotation => this.signatureTool.getPreview(annotation)));

    return annotations.map((annotation, i) => ({
      annotation,
      imgSrc: previews[i],
    }));
  }

  setSignature = index => {
    this.currentSignatureIndex = index;

    const { annotation } = this.state.defaultSignatures[this.currentSignatureIndex];

    core.setToolMode('AnnotationCreateSignature');
    this.signatureTool.setSignature(annotation);
    this.props.closeElement('signatureOverlay');

    if (this.signatureTool.hasLocation()) {
      this.signatureTool.addSignature();
    } else {
      this.signatureTool.showPreview();
    }
  }

  deleteDefaultSignature = index => {
    this.signatureTool.deleteSavedSignature(index);

    const isDeletingCurrentSignature = this.currentSignatureIndex === index;
    if (isDeletingCurrentSignature) {
      this.signatureTool.annot = null;
      this.signatureTool.hidePreview();
      this.currentSignatureIndex = -1;
    }
  }

  openSignatureModal = () => {
    const { defaultSignatures } = this.state;
    const { openElement, closeElement, maxSignaturesCount } = this.props;

    if (defaultSignatures.length < maxSignaturesCount) {
      openElement('signatureModal');
      closeElement('signatureOverlay');
    }
  }

  render() {
    const { left, right, defaultSignatures } = this.state;
    const { t, isDisabled, maxSignaturesCount } = this.props;
    const className = getClassName('Overlay SignatureOverlay', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} ref={this.overlay} style={{ left, right }}>
        <div className="default-signatures-container">
          {defaultSignatures.map(({ imgSrc }, index) => (
            <div className="default-signature" key={index}>
              <div className="signature-image" onClick={() => this.setSignature(index)}>
                <img src={imgSrc} />
              </div>
              <ActionButton dataElement="defaultSignatureDeleteButton" img="ic_delete_black_24px" onClick={() => this.deleteDefaultSignature(index)} />
            </div>
          ))}
          <div
            className={`add-signature${defaultSignatures.length >= maxSignaturesCount ? ' disabled' : ' enabled'}`}
            onClick={this.openSignatureModal}
          >
            {t('option.signatureOverlay.addSignature')}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureOverlay'),
  isOpen: selectors.isElementOpen(state, 'signatureOverlay'),
  isSignatureModalOpen: selectors.isElementOpen(state, 'signatureModal'),
  maxSignaturesCount: selectors.getMaxSignaturesCount(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(onClickOutside(SignatureOverlay)));
