import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import Button from 'components/Button';
import ActionButton from 'components/ActionButton';

import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import classNames from 'classnames';
import displayModeObjects from 'constants/displayModeObjects';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './ViewControlsOverlay.scss';

class ViewControlsOverlay extends React.PureComponent {
  static propTypes = {
    totalPages: PropTypes.number.isRequired,
    displayMode: PropTypes.string.isRequired,
    fitMode: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  overlay = React.createRef();

  state = {
    left: 0,
    right: 'auto',
    top: 'auto',
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'toolsOverlay',
        'searchOverlay',
        'menuOverlay',
        'toolStylePopup',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
      this.setState(
        getOverlayPositionBasedOn('viewControlsButton', this.overlay, this.props.isTabletOrMobile),
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState(
      getOverlayPositionBasedOn('viewControlsButton', this.overlay, this.props.isTabletOrMobile),
    );
  };

  handleClickOutside = e => {
    const viewControlsButton = document.querySelector('[data-element="viewControlsButton"]');
    const clickedViewControlsButtonOrChild = viewControlsButton === e.target || viewControlsButton?.contains(e.target);
    if (!clickedViewControlsButtonOrChild) {
      this.props.closeElements(['viewControlsOverlay']);
    }
  };

  handleCloseClick = () => {
    this.props.closeElements(['viewControlsOverlay']);
  };

  handleClick = (pageTransition, layout) => {
    const displayModeObject = displayModeObjects.find(
      obj => obj.pageTransition === pageTransition && obj.layout === layout,
    );

    core.setDisplayMode(displayModeObject.displayMode);
  };

  render() {
    const { isDisabled, displayMode, totalPages, t, isMobile, isOpen } = this.props;
    const { left, right, top } = this.state;
    const { pageTransition, layout } = displayModeObjects.find(
      obj => obj.displayMode === displayMode,
    );
    // const className = getClassName('Overlay ViewControlsOverlay', this.props);

    if (isDisabled) {
      return null;
    }

    let style = {};
    if (!isMobile) {
      style = { left, right, top };
    }

    return (
      <div
        className={classNames({
          Overlay: true,
          ViewControlsOverlay: true,
          mobile: isMobile,
          closed: !isOpen,
        })}
        data-element="viewControlsOverlay"
        style={style}
        ref={this.overlay}
      >
        {isMobile && <div className="swipe-indicator" />}
        <div className="type">{t('option.displayMode.pageTransition')}</div>
        {totalPages < 1000 && (
          <React.Fragment>
            <div
              className={classNames({
                row: true,
                active: pageTransition === 'continuous',
              })}
              onClick={() => this.handleClick('continuous', layout)}
            >
              <Button
                title="option.pageTransition.continuous"
                dataElement="continuousPageTransitionButton"
                img="icon-header-page-manipulation-page-transition-continuous-page-line"
                isActive={pageTransition === 'continuous'}
              />
              <div className="title">{t('option.pageTransition.continuous')}</div>
            </div>
            <div
              className={classNames({
                row: true,
                active: pageTransition === 'default',
              })}
              onClick={() => this.handleClick('default', layout)}
            >
              <Button
                title="option.pageTransition.default"
                dataElement="defaultPageTransitionButton"
                img="icon-header-page-manipulation-page-transition-page-by-page-line"
                isActive={pageTransition === 'default'}
              />
              <div className="title">{t('option.pageTransition.default')}</div>
            </div>
            <div className="divider" />
          </React.Fragment>
        )}
        <div className="type">{t('action.rotate')}</div>
        <div
          className="row"
          onClick={core.rotateClockwise}
        >
          <ActionButton
            dataElement="rotateClockwiseButton"
            title="action.rotateClockwise"
            img="icon-header-page-manipulation-page-rotation-clockwise-line"
          />
          <div className="title">{t('action.rotateClockwise')}</div>
        </div>
        <div
          className="row"
          onClick={core.rotateCounterClockwise}
        >
          <ActionButton
            dataElement="rotateCounterClockwiseButton"
            title="action.rotateCounterClockwise"
            img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
          />
          <div className="title">{t('action.rotateCounterClockwise')}</div>
        </div>
        <div className="divider" />
        <div className="type">{t('option.displayMode.layout')}</div>
        <div
          className={classNames({
            row: true,
            active: layout === 'single',
          })}
          onClick={() => this.handleClick(pageTransition, 'single')}
        >
          <Button
            title="option.layout.single"
            dataElement="singleLayoutButton"
            img="icon-header-page-manipulation-page-layout-single-page-line"
            isActive={layout === 'single'}
          />
          <div className="title">{t('option.layout.single')}</div>
        </div>
        <div
          className={classNames({
            row: true,
            active: layout === 'double',
          })}
          onClick={() => this.handleClick(pageTransition, 'double')}
        >
          <Button
            title="option.layout.double"
            dataElement="doubleLayoutButton"
            img="icon-header-page-manipulation-page-layout-double-page-line"
            isActive={layout === 'double'}
          />
          <div className="title">{t('option.layout.double')}</div>
        </div>
        <div
          className={classNames({
            row: true,
            active: layout === 'cover',
          })}
          onClick={() => this.handleClick(pageTransition, 'cover')}
        >
          <Button
            title="option.layout.cover"
            dataElement="coverLayoutButton"
            img="icon-header-page-manipulation-page-layout-cover-line"
            isActive={layout === 'cover'}
          />
          <div className="title">{t('option.layout.cover')}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  totalPages: selectors.getTotalPages(state),
  displayMode: selectors.getDisplayMode(state),
  fitMode: selectors.getFitMode(state),
  isDisabled: selectors.isElementDisabled(state, 'viewControlsOverlay'),
  isOpen: selectors.isElementOpen(state, 'viewControlsOverlay'),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
};

const ConnectedViewControlsOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(ViewControlsOverlay)));

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
    <ConnectedViewControlsOverlay {...props} isMobile={isMobile} isTabletOrMobile={isTabletOrMobile} />
  );
};
