import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import ActionButton from 'components/ActionButton';

import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import print from 'helpers/print';
import getClassName from 'helpers/getClassName';
import openFilePicker from 'helpers/openFilePicker';
import toggleFullscreen from 'helpers/toggleFullscreen';
import downloadPdf from 'helpers/downloadPdf';
import { isIOS } from 'helpers/device';
import { documentTypes } from 'constants/types';
import actions from 'actions';
import selectors from 'selectors';

import './MenuOverlay.scss';

class MenuOverlay extends React.PureComponent {
  static propTypes = {
    documentPath: PropTypes.string,
    documentFilename: PropTypes.string,
    isDownloadable: PropTypes.bool,
    isEmbedPrintSupported: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto'
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['toolsOverlay', 'viewControlsOverlay', 'searchOverlay', 'toolStylePopup', 'signatureOverlay', 'zoomOverlay', 'redactionOverlay']);
      this.setState(getOverlayPositionBasedOn('menuButton', this.overlay));
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const hasIsOpenChanged = !prevState.mirroredIsOpen && nextProps.isOpen;
    if (hasIsOpenChanged){
      return { isOpening: true, mirroredIsOpen: nextProps.isOpen };
    }
    return { isOpening: false, mirroredIsOpen: nextProps.isOpen };
  }


  handlePrintButtonClick = () => {
    const { dispatch, isEmbedPrintSupported } = this.props;

    print(dispatch, isEmbedPrintSupported);
  }

  downloadDocument = () => {
    const { dispatch, documentPath, documentFilename } = this.props;

    downloadPdf(dispatch, {
      documentPath,
      filename: documentFilename
    });
  }

  render() {
    const { left, right, isOpening } = this.state;
    const { isDisabled, isDownloadable, isFullScreen, t, closeElements } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Overlay MenuOverlay', this.props);

    // TODO: Check if filePicker is the first button. It will need willFocus instead.
    return (
      <div className={className} data-element="menuOverlay" style={{ left, right }} ref={this.overlay}>
        <ActionButton dataElement="filePickerButton" label={t('action.openFile')} onClick={openFilePicker} />
        {!isIOS &&
          <ActionButton willFocus={isOpening} dataElement="fullScreenButton" label={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')} onClick={toggleFullscreen} />
        }
        {isDownloadable &&
          <ActionButton dataElement="downloadButton" label={t('action.download')} onClick={this.downloadDocument} />
        }
        <ActionButton
          isLast
          dataElement="printButton"
          label={t('action.print')}
          onClick={this.handlePrintButtonClick} hidden={['mobile']}
          onTabOut={() => closeElements(['menuOverlay'])}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  documentPath: selectors.getDocumentPath(state),
  documentFilename: state.document.filename,
  isDownloadable: selectors.getDocumentType(state) !== documentTypes.XOD,
  isEmbedPrintSupported: selectors.isEmbedPrintSupported(state),
  isFullScreen: selectors.isFullScreen(state),
  isDisabled: selectors.isElementDisabled(state, 'menuOverlay'),
  isOpen: selectors.isElementOpen(state, 'menuOverlay'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElements: dataElements => dispatch(actions.closeElements(dataElements))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(MenuOverlay));
