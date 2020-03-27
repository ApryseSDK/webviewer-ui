import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import ActionButton from 'components/ActionButton';
import Icon from 'components/Icon';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
import selectors from 'selectors';

import './SignatureOverlay.scss';
import '../ToolsOverlay/ToolsOverlay.scss';

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
  };

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

    if (this.props.isOpen) {
      this.setOverlayPosition();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
        'menuOverlay',
        // 'toolsOverlay',
        'zoomOverlay',
        'toolStylePopup',
      ]);
      this.setOverlayPosition();
    }

    if (
      prevProps.isOpen &&
      !this.props.isOpen &&
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
    const ToggleSignatureButton = document.querySelector('[data-element="signatureToolButton"]');
    const clickedToggleSignatureButton = ToggleSignatureButton?.contains(e.target);

    if (!clickedToggleSignatureButton) {
      this.props.closeElement('signatureOverlay');
    }
  };

  handleWindowResize = () => {
    this.setOverlayPosition();
    this.forceUpdate();
  };

  setOverlayPosition = () => {
    // const signatureToolButton = document.querySelector(
    //   '[data-element="signatureToolButton"]',
    // );

    // if (!signatureToolButton && this.overlay.current) {
    //   // the button has been disabled using instance.disableElements
    //   // but this component can still be opened by clicking on a signature widget
    //   // in this case we just place it in the center
    //   const { width } = this.overlay.current.getBoundingClientRect();
    //   this.setState({ left: (window.innerWidth - width) / 2, right: 'auto' });
    // } else {
    this.setState(
      getOverlayPositionBasedOn('signatureToolButton', this.overlay),
    );
    // }
  };

  onSignatureSaved = async annotations => {
    const numberOfSignaturesToRemove =
      this.state.defaultSignatures.length +
      annotations.length -
      this.props.maxSignaturesCount;
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
  };

  onSignatureDeleted = async () => {
    let savedSignatures = this.signatureTool.getSavedSignatures();

    // the saved signatures will have a different style than what we've saved in this component
    // if a user changes the styles of a signature after it's added to the document
    // here to sync up the styles we grab a saved signature in this component and use its styles to override the signatures saved in the tool
    if (this.state.defaultSignatures.length) {
      savedSignatures = savedSignatures.map(annotation =>
        Object.assign(
          annotation,
          getAnnotationStyles(this.state.defaultSignatures[0].annotation),
        ),
      );
    }

    this.setState({
      defaultSignatures: await this.getSignatureDataToStore(savedSignatures),
    });
  };

  onAnnotationChanged = async (annotations, action) => {
    if (
      action === 'modify' &&
      annotations.length === 1 &&
      annotations[0].ToolName === 'AnnotationCreateSignature'
    ) {
      const newStyles = getAnnotationStyles(annotations[0]);
      let annotationsWithNewStyles = this.state.defaultSignatures.map(
        ({ annotation }) => Object.assign(annotation, newStyles),
      );
      annotationsWithNewStyles = await this.getSignatureDataToStore(
        annotationsWithNewStyles,
      );

      this.setState({
        defaultSignatures: annotationsWithNewStyles,
      });
    }
  };

  // returns an array of objects in the shape of: { annotation, preview }
  // annotation: a copy of the annotation passed in
  // imgSrc: preview of the annotation, a base64 string
  getSignatureDataToStore = async annotations => {
    // copy the annotation because we need to mutate the annotation object later if there're any styles changes
    // and we don't want the original annotation to be mutated as well
    // since it's been added to the canvas
    annotations = annotations.map(core.getAnnotationCopy);
    const previews = await Promise.all(
      annotations.map(annotation => this.signatureTool.getPreview(annotation)),
    );

    return annotations.map((annotation, i) => ({
      annotation,
      imgSrc: previews[i],
    }));
  };

  setSignature = index => {
    this.currentSignatureIndex = index;

    const { annotation } = this.state.defaultSignatures[
      this.currentSignatureIndex
    ];

    core.setToolMode('AnnotationCreateSignature');
    this.signatureTool.setSignature(annotation);
    this.props.closeElement('signatureOverlay');

    if (this.signatureTool.hasLocation()) {
      this.signatureTool.addSignature();
    } else {
      this.signatureTool.showPreview();
    }
  };

  deleteDefaultSignature = index => {
    this.signatureTool.deleteSavedSignature(index);

    const isDeletingCurrentSignature = this.currentSignatureIndex === index;
    if (isDeletingCurrentSignature) {
      this.signatureTool.annot = null;
      this.signatureTool.hidePreview();
      this.currentSignatureIndex = -1;
    }
  };

  openSignatureModal = () => {
    const { defaultSignatures } = this.state;
    const { openElement, closeElement, maxSignaturesCount } = this.props;

    if (defaultSignatures.length < maxSignaturesCount) {
      openElement('signatureModal');
      closeElement('signatureOverlay');
    }
  };

  render() {
    const { left, right, top, defaultSignatures } = this.state;
    const { t, isDisabled, maxSignaturesCount, isOpen, isMobile, isTabletAndMobile } = this.props;

    const className = getClassName('Overlay ToolsOverlay SignatureOverlay', { isOpen });

    if (isDisabled) {
      return null;
    }

    let style = { left, right, top };
    let arrowStyle = {};
    if (isTabletAndMobile) {
      style = {
        // left: 0,
        // top: 52,
      };

      const signatureToolButton = document.querySelector(
        '[data-element="signatureToolButton"]',
      );
      if (signatureToolButton) {
        const { left: buttonLeft } = signatureToolButton.getBoundingClientRect();
        arrowStyle = {
          left: buttonLeft,
          right: 'auto',
          top: -10,
        };
      }
    }

    return (
      <div
        className={className}
        ref={this.overlay}
        style={style}
      >
        <div
          className="arrow-up"
          style={arrowStyle}
        />
        <div
          className="tools-container"
        >
          {defaultSignatures.map(({ imgSrc }, index) => (
            <div className="row" key={index}>
              <div
                className="content"
                onClick={() => this.setSignature(index)}
              >
                <img src={imgSrc} />
              </div>
              <div
                className="icon"
                dataElement="defaultSignatureDeleteButton"
                onClick={() => this.deleteDefaultSignature(index)}
              >
                <Icon glyph="icon-delete-line"/>
              </div>
            </div>
          ))}
          {defaultSignatures.length < maxSignaturesCount &&
            <div
              className={`row${
                defaultSignatures.length >= maxSignaturesCount
                  ? ' disabled'
                  : ' enabled'
              }`}
              onClick={this.openSignatureModal}
            >
              <div
                className={`content${
                  defaultSignatures.length < maxSignaturesCount
                    ? ' disabled'
                    : ' enabled'
                }`}
              >
                {t('option.signatureOverlay.addSignature')}
              </div>
              <div className="icon">
                <Icon glyph="icon-menu-add" />
              </div>
            </div>}
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

const ConnectedSignatureOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(SignatureOverlay)));


export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );


  return (
    <ConnectedSignatureOverlay {...props} isMobile={isMobile} isTabletAndMobile={isTabletAndMobile} />
  );
};
