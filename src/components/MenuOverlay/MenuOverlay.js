import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import ActionButton from 'components/ActionButton';
import Icon from 'components/Icon';

import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import print from 'helpers/print';
import getClassName from 'helpers/getClassName';
import openFilePicker from 'helpers/openFilePicker';
import toggleFullscreen from 'helpers/toggleFullscreen';
import downloadPdf from 'helpers/downloadPdf';
import { isIOS } from 'helpers/device';
import { workerTypes } from 'constants/types';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import classNames from 'classnames';

import { Swipeable } from 'react-swipeable';

import './MenuOverlay.scss';

class MenuOverlay extends React.PureComponent {
  static propTypes = {
    isEmbedPrintSupported: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
      top: 'auto',
      documentType: null,
    };
  }

  componentDidMount() {
    core.addEventListener('documentLoaded', this.onDocumentLoaded);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['groupOverlay', 'viewControlsOverlay', 'searchOverlay', 'signatureOverlay', 'zoomOverlay', 'redactionOverlay']);
      this.setState(getOverlayPositionBasedOn('menuButton', this.overlay, this.props.isTabletOrMobile));
    }
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.onDocumentLoaded);
  }

  onDocumentLoaded = () => {
    this.setState({
      documentType: core.getDocument().getType(),
    });
  }

  handlePrintButtonClick = () => {
    const { dispatch, isEmbedPrintSupported } = this.props;
    this.props.closeElements(['menuOverlay']);
    print(dispatch, isEmbedPrintSupported);
  }

  handleClickOutside = e => {
    const menuButton = document.querySelector(
      '[data-element="menuButton"]',
    );
    const clickedMenuButton = menuButton?.contains(e.target);
    if (!clickedMenuButton) {
      this.props.closeElements(['menuOverlay']);
    }
  }

  downloadDocument = () => {
    downloadPdf(this.props.dispatch);
  }

  render() {
    const { left, right, top, documentType } = this.state;
    const { isDisabled, isFullScreen, t, isMobile, isOpen, isFilePickerButtonDisabled, activeTheme, setActiveLightTheme, setActiveDarkTheme } = this.props;

    if (isDisabled) {
      return null;
    }

    let style = {};
    if (!isMobile) {
      style = { left, right, top };
    }

    return (
      <Swipeable
        onSwipedUp={() => this.props.closeElements(['menuOverlay'])}
        onSwipedDown={() => this.props.closeElements(['menuOverlay'])}
        preventDefaultTouchmoveEvent
      >
        <div
          className={classNames({
            Overlay: true,
            MenuOverlay: true,
            mobile: isMobile,
            closed: !isOpen,
          })}
          data-element="menuOverlay"
          style={style}
          ref={this.overlay}
        >
          {isMobile && <div className="swipe-indicator" />}
          {!isFilePickerButtonDisabled &&
            <div className="row" data-element="filePickerButton">
              <div
                className="MenuItem"
                onClick={openFilePicker}
              >
                <Icon
                  className="MenuIcon"
                  glyph="icon-header-file-picker-line"
                />
                <div className="MenuLabel">{t('action.openFile')}</div>
              </div>
            </div>}
          {!isIOS &&
            <div className="row">
              <div
                className="MenuItem"
                onClick={toggleFullscreen}
              >
                <Icon
                  className="MenuIcon"
                  glyph={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
                />
                <div className="MenuLabel">{isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}</div>
              </div>
            </div>
          }
          {documentType !== workerTypes.XOD &&
            <div className="row">
              <div
                className="MenuItem"
                onClick={this.downloadDocument}
              >
                <Icon
                  className="MenuIcon"
                  glyph="icon-header-download"
                />
                <div className="MenuLabel">{t('action.download')}</div>
              </div>
            </div>
          }
          <div className="row">
            <div
              className="MenuItem"
              onClick={this.handlePrintButtonClick}
            >
              <Icon
                className="MenuIcon"
                glyph="icon-header-print-line"
              />
              <div className="MenuLabel">{t('action.print')}</div>
            </div>
          </div>
          {activeTheme === 'dark' ?
            <div className="row">
              <div
                className="MenuItem"
                onClick={setActiveLightTheme}
              >
                <Icon
                  className="MenuIcon"
                  glyph="icon - header - mode - day"
                />
                <div className="MenuLabel">{t('action.lightMode')}</div>
              </div>
            </div> :
            <div className="row">
              <div
                className="MenuItem"
                onClick={setActiveDarkTheme}
              >
                <Icon
                  className="MenuIcon"
                  glyph="icon - header - mode - night"
                />
                <div className="MenuLabel">{t('action.darkMode')}</div>
              </div>
            </div>}
        </div>
      </Swipeable>
    );
  }
}

const mapStateToProps = state => ({
  activeTheme: selectors.getActiveTheme(state),
  isEmbedPrintSupported: selectors.isEmbedPrintSupported(state),
  isFullScreen: selectors.isFullScreen(state),
  isDisabled: selectors.isElementDisabled(state, 'menuOverlay'),
  isFilePickerButtonDisabled: selectors.isElementDisabled(state, 'filePickerButton'),
  isOpen: selectors.isElementOpen(state, 'menuOverlay'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  setActiveLightTheme: () => dispatch(actions.setActiveTheme('light')),
  setActiveDarkTheme: () => dispatch(actions.setActiveTheme('dark')),
});

const ConnectedMenuOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(MenuOverlay)));

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletOrMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedMenuOverlay {...props} isMobile={isMobile} isTabletOrMobile={isTabletOrMobile} />
  );
};
