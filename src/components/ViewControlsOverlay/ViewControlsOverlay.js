import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import ActionButton from 'components/ActionButton';
import Element from 'components/Element';

import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getClassName from 'helpers/getClassName';
import { zoomIn, zoomOut } from 'helpers/zoom';
import displayModeObjects from 'constants/displayModeObjects';
import actions from 'actions';
import selectors from 'selectors';

import './ViewControlsOverlay.scss';

class ViewControlsOverlay extends React.PureComponent {
  static propTypes = {
    totalPages: PropTypes.number.isRequired,
    displayMode: PropTypes.string.isRequired,
    fitMode: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isDefaultPageTransitionButtonDisabled: PropTypes.bool,
    isContinuousPageTransitionButtonDisabled: PropTypes.bool,
    isSingleLayoutButtonDisabled: PropTypes.bool,
    isDoubleLayoutButtonDisabled: PropTypes.bool,
    isCoverLayoutButtonDisabled: PropTypes.bool,
    isFitToWidthButtonDisabled: PropTypes.bool,
    isFitToPageButtonDisabled: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
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

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['toolsOverlay', 'searchOverlay', 'menuOverlay', 'toolStylePopup', 'signatureOverlay', 'zoomOverlay', 'redactionOverlay']);
      this.setState(getOverlayPositionBasedOn('viewControlsButton', this.overlay));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState(getOverlayPositionBasedOn('viewControlsButton', this.overlay));
  }

  handleClick = (pageTransition, layout) => {
    const displayModeObject = displayModeObjects.find(obj => obj.pageTransition === pageTransition && obj.layout === layout);

    core.setDisplayMode(displayModeObject.displayMode);
  }

  render() {
    const { isDisabled, displayMode, fitMode, totalPages, t } = this.props;
    const { left, right } = this.state;
    const { pageTransition, layout } = displayModeObjects.find(obj => obj.displayMode === displayMode);
    const className = getClassName('Overlay ViewControlsOverlay', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} data-element="viewControlsOverlay" style={{ left, right }} ref={this.overlay} onClick={e => e.stopPropagation()}>
        {totalPages < 1000 &&
          <Element className="row" dataElement="pageTransitionButtons">
            <div className="type">{t('option.displayMode.pageTransition')}</div>
            <Tooltip content="option.pageTransition.default" isDisabled={this.props.isDefaultPageTransitionButtonDisabled}>
              <Button dataElement="defaultPageTransitionButton" img="ic_view_mode_single_black_24px" onClick={() => this.handleClick('default', layout)} isActive={pageTransition === 'default'} />
            </Tooltip>
            <Tooltip content="option.pageTransition.continuous" isDisabled={this.props.isContinuousPageTransitionButtonDisabled}>
              <Button dataElement="continuousPageTransitionButton" img="ic_view_mode_continuous_black_24px" onClick={() => this.handleClick('continuous', layout)} isActive={pageTransition === 'continuous'} />
            </Tooltip>
          </Element>
        }
        <Element className="row" dataElement="layoutButtons">
          <div className="type">{t('option.displayMode.layout')}</div>
          <Tooltip content="option.layout.single" isDisabled={this.props.isSingleLayoutButtonDisabled}>
            <Button dataElement="singleLayoutButton" img="ic_view_mode_single_black_24px" onClick={() => this.handleClick(pageTransition, 'single')} isActive={layout === 'single'} />
          </Tooltip>
          <Tooltip content="option.layout.double" isDisabled={this.props.isDoubleLayoutButtonDisabled}>
            <Button dataElement="doubleLayoutButton" img="ic_view_mode_facing_black_24px" onClick={() => this.handleClick(pageTransition, 'double')} isActive={layout === 'double'} />
          </Tooltip>
          <Tooltip content="option.layout.cover" isDisabled={this.props.isCoverLayoutButtonDisabled}>
            <Button dataElement="coverLayoutButton" img="ic_view_mode_cover_black_24px" onClick={() => this.handleClick(pageTransition, 'cover')} isActive={layout === 'cover'} />
          </Tooltip>
        </Element>
        <Element className="row" dataElement="rotateButtons">
          <div className="type">{t('action.rotate')}</div>
          <ActionButton dataElement="rotateCounterClockwiseButton" title="action.rotateCounterClockwise" img="ic_rotate_left_black_24px" onClick={core.rotateCounterClockwise} />
          <ActionButton dataElement="rotateClockwiseButton" title="action.rotateClockwise" img="ic_rotate_right_black_24px" onClick={core.rotateClockwise} />
        </Element>
        <Element className="row hide-in-desktop hide-in-tablet" dataElement="fitButtons">
          <div className="type">{t('action.fit')}</div>
          <Tooltip content="action.fitToWidth" isDisabled={this.props.isFitToWidthButtonDisabled}>
            <Button dataElement="fitToWidthButton" img="ic_fit_width_black_24px" onClick={core.fitToWidth} isActive={fitMode === 'fitWidth'} />
          </Tooltip>
          <Tooltip content="action.fitToPage" isDisabled={this.props.isFitToPageButtonDisabled}>
            <Button dataElement="fitToPageButton" img="ic_fit_page_black_24px" onClick={core.fitToPage} isActive={fitMode === 'fitPage'} />
          </Tooltip>
        </Element>
        <Element className="row hide-in-desktop hide-in-tablet" dataElement="zoomButtons">
          <div className="type">{t('action.zoom')}</div>
          <ActionButton dataElement="zoomInButton" title="action.zoomIn" img="ic_zoom_in_black_24px" onClick={zoomIn} />
          <ActionButton dataElement="zoomOutButton" title="action.zoomOut" img="ic_zoom_out_black_24px" onClick={zoomOut} />
        </Element>
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
  isDefaultPageTransitionButtonDisabled: selectors.isElementDisabled(state, 'defaultPageTransitionButton'),
  isContinuousPageTransitionButtonDisabled: selectors.isElementDisabled(state, 'continuousPageTransitionButton'),
  isSingleLayoutButtonDisabled: selectors.isElementDisabled(state, 'singleLayoutButton'),
  isDoubleLayoutButtonDisabled: selectors.isElementDisabled(state, 'doubleLayoutButton'),
  isCoverLayoutButtonDisabled: selectors.isElementDisabled(state, 'coverLayoutButton'),
  isFitToWidthButtonDisabled: selectors.isElementDisabled(state, 'fitToWidthButton'),
  isFitToPageButtonDisabled: selectors.isElementDisabled(state, 'fitToPageButton'),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ViewControlsOverlay));