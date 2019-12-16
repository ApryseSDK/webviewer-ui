import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import Button from 'components/Button';
import ActionButton from 'components/ActionButton';
import Element from 'components/Element';
import Icon from 'components/Icon';

import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getClassName from 'helpers/getClassName';
import { zoomIn, zoomOut } from 'helpers/zoom';
import displayModeObjects from 'constants/displayModeObjects';
import actions from 'actions';
import selectors from 'selectors';

import './ViewControlsOverlay.scss';
import Autolinker from 'autolinker';

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
        'toolsOverlay',
        'toolStylePopup',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
      this.setState(
        getOverlayPositionBasedOn('viewControlsButton', this.overlay),
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState(
      getOverlayPositionBasedOn('viewControlsButton', this.overlay),
    );
  };

  handleClickOutside = e => {
    const clickedViewControlsButton = e.target.getAttribute('data-element') === 'viewControlsButton';

    if (!clickedViewControlsButton) {
      this.props.closeElements(['viewControlsOverlay']);
    }
  }

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
    const { isDisabled, displayMode, fitMode, totalPages, t } = this.props;
    const { left, right, top } = this.state;
    const { pageTransition, layout } = displayModeObjects.find(
      obj => obj.displayMode === displayMode,
    );
    const className = getClassName('Overlay ViewControlsOverlay', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} data-element="viewControlsOverlay" style={{ left, right, top }} ref={this.overlay}>
        <div className="ViewControlsContainer">
          <div className="type">{t('option.displayMode.pageTransition')}</div>
          {totalPages < 1000 &&
            <div className="row2">
              <Button
                title="option.pageTransition.continuous"
                dataElement="continuousPageTransitionButton"
                img="icon-header-page-manipulation-page-transition-continuous-page-line"
                onClick={() => this.handleClick('continuous', layout)}
                isActive={pageTransition === 'continuous'}
              />
              <Button
                title="option.pageTransition.default"
                dataElement="defaultPageTransitionButton"
                img="icon-header-page-manipulation-page-transition-page-by-page-line"
                onClick={() => this.handleClick('default', layout)}
                isActive={pageTransition === 'default'}
              />
            </div>
          }
          <div className="type">{t('action.rotate')}</div>
          <div className="row2">
            <ActionButton
              dataElement="rotateCounterClockwiseButton"
              title="action.rotateCounterClockwise"
              img="icon-header-page-manipulation-page-rotation-clockwise-line"
              onClick={core.rotateCounterClockwise}
            />
            <ActionButton
              dataElement="rotateClockwiseButton"
              title="action.rotateClockwise"
              img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
              onClick={core.rotateClockwise}
            />
          </div>
          <div className="type">{t('option.displayMode.layout')}</div>
          <div className="row2">
            <Button
              title="option.layout.single"
              dataElement="singleLayoutButton"
              img="icon-header-page-manipulation-page-layout-single-page-line"
              onClick={() => this.handleClick(pageTransition, 'single')}
              isActive={layout === 'single'}
            />
            <Button
              title="option.layout.double"
              dataElement="doubleLayoutButton"
              img="icon-header-page-manipulation-page-layout-double-page-line"
              onClick={() => this.handleClick(pageTransition, 'double')}
              isActive={layout === 'double'}
            />
            <Button
              title="option.layout.cover"
              dataElement="coverLayoutButton"
              img="icon-header-page-manipulation-page-layout-cover-line"
              onClick={() => this.handleClick(pageTransition, 'cover')}
              isActive={layout === 'cover'}
            />
          </div>
          {/* <Element
            className="row hide-in-desktop hide-in-tablet"
            dataElement="fitButtons"
          >
            <div className="type">{t('action.fit')}</div>
            <Button
              title="action.fitToWidth"
              dataElement="fitToWidthButton"
              img="ic_fit_width_black_24px"
              onClick={core.fitToWidth}
              isActive={fitMode === 'fitWidth'}
            />
            <Button
              title="action.fitToPage"
              dataElement="fitToPageButton"
              img="ic_fit_page_black_24px"
              onClick={core.fitToPage}
              isActive={fitMode === 'fitPage'}
            />
          </Element>
          <Element
            className="row hide-in-desktop hide-in-tablet"
            dataElement="zoomButtons"
          >
            <div className="type">{t('action.zoom')}</div>
            <ActionButton
              dataElement="zoomInButton"
              title="action.zoomIn"
              img="ic_zoom_in_black_24px"
              onClick={zoomIn}
            />
            <ActionButton
              dataElement="zoomOutButton"
              title="action.zoomOut"
              img="ic_zoom_out_black_24px"
              onClick={zoomOut}
            />
          </Element> */}
        </div>
        <div
          className="Close-Container"
        >
          <div
            className="Close-Button"
            onClick={this.handleCloseClick}
          >
            <Icon
              className="Close-Icon"
              glyph="icon-close"
            />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(onClickOutside(ViewControlsOverlay)));
