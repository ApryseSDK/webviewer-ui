import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import { zoomTo } from 'helpers/zoom';

import Icon from 'components/Icon';
import OverlayItem from '../OverlayItem';
import ToolButton from '../ToolButton';

import './ZoomOverlay.scss';

class ZoomOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    zoomList: PropTypes.arrayOf(PropTypes.number),
  };

  constructor(props) {
    super(props);
    this.dropdown = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
      top: 'auto',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'viewControlsOverlay',
        'toolsOverlay',
        'searchOverlay',
        'menuOverlay',
        'toolStylePopup',
      ]);
      const { left, right, top } = getOverlayPositionBasedOn(
        'zoomOverlayButton',
        this.dropdown,
      );
      this.setState({
        left: left - 20,
        right,
        top,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleClickOutside = e => {
    const ToggleZoomButton = document.querySelector('[data-element="zoomOverlayButton"]');
    const clickedToggleZoomButton = ToggleZoomButton?.contains(e.target);

    if (!clickedToggleZoomButton) {
      this.props.closeElements('zoomOverlay');
    }
  };

  handleWindowResize = () => {
    const { left, right, top } = getOverlayPositionBasedOn(
      'zoomOverlayButton',
      this.dropdown,
    );
    this.setState({
      left: left - 20,
      right,
      top,
    });
  };

  render() {
    const { isOpen, isDisabled, t, zoomList } = this.props;
    const className = ['ZoomOverlay', isOpen ? 'open' : 'closed']
      .join(' ')
      .trim();
    const { left, right, top } = this.state;

    if (isDisabled) {
      return null;
    }

    return (
      <div
        className={className}
        data-element="zoomOverlay"
        style={{ left, right, top }}
        ref={this.dropdown}
      >
        <div
          className="ZoomContainer"
        >
          <div
            className="ZoomItem"
            onClick={core.fitToWidth}
          >
            <Icon
              className="ZoomIcon"
              glyph="icon-header-zoom-fit-to-width"
            />
            <div className="ZoomLabel">{t('action.fitToWidth')}</div>
          </div>
          <div
            className="ZoomItem"
            onClick={core.fitToPage}
          >
            <Icon
              className="ZoomIcon"
              glyph="icon-header-zoom-fit-to-page"
            />
            <div className="ZoomLabel">{t('action.fitToPage')}</div>
          </div>
          <div className="spacer extraMarginTop" />
          {/* {zoomList.map((zoomValue, i) => (
            <OverlayItem
              key={i}
              onClick={() => zoomTo(zoomValue)}
              buttonName={`${zoomValue * 100}%`}
            />
          ))} */}
          <div className="spacer" />
          <div className="ZoomItem">
            <Icon
              className="ZoomIcon"
              glyph="icon-header-zoom-marquee"
            />
            <ToolButton toolName="MarqueeZoomTool" label={t('tool.Marquee')} />
          </div>
        </div>
        <div
          className="Close-Container"
        >
          <div
            className="Close-Button"
            onClick={this.handleClickOutside}
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
  isDisabled: selectors.isElementDisabled(state, 'zoomOverlay'),
  isOpen: selectors.isElementOpen(state, 'zoomOverlay'),
  zoomList: selectors.getZoomList(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(ZoomOverlay)));
