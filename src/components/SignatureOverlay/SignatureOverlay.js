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
import deepCopyPaths from 'helpers/deepCopyPaths';
import { mapAnnotationToKey } from 'constants/map';
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
    setCursorOverlay: PropTypes.func.isRequired,
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
    this.signatureTool.on('saveDefault', this.onSaveDefault);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'toolsOverlay', 'zoomOverlay', 'toolStylePopup']);
      this.setOverlayPosition();
    }

    const { freeHandAnnot } = this.signatureTool;
    if (
      prevProps.isOpen && !this.props.isOpen &&
      !this.props.isSignatureModalOpen &&
      freeHandAnnot && !freeHandAnnot.getPaths().length
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
    this.signatureTool.off('saveDefault', this.onSaveDefault);
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
    const signatureToolButton = document.querySelector(
      '[data-element="signatureToolButton"]',
    );

    if (!signatureToolButton && this.overlay.current) {
      // the button has been disabled using instance.disableElements
      // but this component can still be opened by clicking on a signature widget
      // in this case we just place it in the center
      const { width } = this.overlay.current.getBoundingClientRect();
      this.setState({ left: (window.innerWidth - width) / 2, right: 'auto' });
    } else {
      this.setState(
        getOverlayPositionBasedOn(
          'signatureToolButton',
          this.overlay,
          'center',
        ),
      );
    }
  }

  onSaveDefault = (e, paths, signatureAnnotation) => {
    const defaultSignatures = [...this.state.defaultSignatures];
    if (defaultSignatures.length <= this.props.maxSignaturesCount) {
      defaultSignatures.unshift();
    }

    const signatureCanvas = document.querySelector('.signature-canvas');
    const savedSignature = {
      imgSrc: signatureCanvas.toDataURL(),
      paths: deepCopyPaths(paths),
      styles: getAnnotationStyles(signatureAnnotation),
    };
    defaultSignatures.push(savedSignature);

    this.setState({ defaultSignatures });
  }

  onAnnotationChanged = (e, annotations, action) => {
    if (
      action === 'modify' &&
      annotations.length === 1 &&
      mapAnnotationToKey(annotations[0]) === 'signature'
    ) {
      const newStyles = getAnnotationStyles(annotations[0]);
      const defaultSignaturesWithNewStyles = this.state.defaultSignatures.map(({ paths }) => {
        this.signatureTool.initAnnot();
        this.signatureTool.setUpSignature(paths, newStyles);
        this.signatureTool.drawAnnot();

        return {
          imgSrc: document.querySelector('.signature-canvas').toDataURL(),
          paths,
          styles: newStyles,
        };
      });

      this.setState({ defaultSignatures: defaultSignaturesWithNewStyles });
    }
  }

  setUpSignature = index => {
    this.currentSignatureIndex = index;

    const { setCursorOverlay, closeElement, openElement } = this.props;
    const { paths, styles } = this.state.defaultSignatures[this.currentSignatureIndex];

    core.setToolMode('AnnotationCreateSignature');
    this.signatureTool.initAnnot();
    this.signatureTool.setUpSignature(paths, styles);
    closeElement('signatureOverlay');

    if (this.signatureTool.hasLocation()) {
      this.signatureTool.addSignature();
    } else {
      const { imgSrc, width, height } = this.signatureTool.getSignaturePreview();
      setCursorOverlay({ imgSrc, width, height });
      openElement('cursorOverlay');
    }
  }

  deleteDefaultSignature = index => {
    const { closeElement, setCursorOverlay } = this.props;
    const defaultSignatures = [...this.state.defaultSignatures];
    const isDeletingCurrentSignature = this.currentSignatureIndex === index;

    defaultSignatures.splice(index, 1);
    if (isDeletingCurrentSignature) {
      this.signatureTool.freeHandAnnot.emptyPaths();
      // TODO: investigate later why passing null to it will cause error sometimes
      setCursorOverlay({});
      closeElement('cursorOverlay');
      this.currentSignatureIndex = -1;
    }
    if (!defaultSignatures.length) {
      this.signatureTool.trigger('noDefaultSignatures');
    }

    this.setState({ defaultSignatures });
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
              <div className="signature-image" onClick={() => this.setUpSignature(index)}>
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
  setCursorOverlay: actions.setCursorOverlay,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(onClickOutside(SignatureOverlay)));
