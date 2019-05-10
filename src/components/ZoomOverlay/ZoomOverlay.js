import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import OverlayItem from '../OverlayItem';
import ToolButton from '../ToolButton';

import core from 'core';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import { zoomTo } from 'helpers/zoom';
import actions from 'actions';
import selectors from 'selectors';

import './ZoomOverlay.scss';

class ZoomOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    zoomList: PropTypes.arrayOf(PropTypes.number)
  }

  constructor(props) {
    super(props);
    this.dropdown = React.createRef();
    this.state = {
      left: 0,
      right: 'auto'
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([ 'viewControlsOverlay', 'groupOverlay', 'searchOverlay', 'menuOverlay', 'toolStylePopup' ]);
      const { left, right } = getOverlayPositionBasedOn('zoomOverlayButton', this.dropdown);
      this.setState({
        left: left - 20,
        right
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    const { left, right } = getOverlayPositionBasedOn('zoomOverlayButton', this.dropdown);
    this.setState({
      left: left - 20,
      right
    });
  }

  handleMouseDown = e => {
    const clickedOutside = this.dropdown.current && !this.dropdown.current.contains(e.target);
    const toggleElementOverlay = document.querySelector('.ToggleElementOverlay');
    const clickedOnZoomIndicator = toggleElementOverlay && toggleElementOverlay.contains(e.target);
    if (clickedOutside && !clickedOnZoomIndicator) {
      this.props.closeElements(['zoomOverlay']);
    }
  }

  render() {
    const { isOpen, isDisabled, t, closeElements, zoomList } = this.props;
    const className = [
      'ZoomOverlay',
      isOpen ? 'open' : 'closed'
    ].join(' ').trim();
    const { left, right } = this.state;

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} data-element="zoomOverlay" style={{ left, right }} ref={this.dropdown}>
        <OverlayItem onClick={core.fitToWidth} buttonName={t('action.fitToWidth')} />
        <OverlayItem onClick={core.fitToPage} buttonName={t('action.fitToPage')} />
        <div className="spacer" />
        {zoomList.map((zoomValue, i) => 
          <OverlayItem key={i}
            onClick={() => zoomTo(zoomValue)}
            buttonName={zoomValue * 100 + '%'}
          />
        )}
        <div className="spacer" />
        <ToolButton toolName="MarqueeZoomTool" label={t('tool.Marquee')} onClick={() => closeElements(['zoomOverlay'])} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'zoomOverlay'),
  isOpen: selectors.isElementOpen(state, 'zoomOverlay'),
  isMarqueeZoomToolDisabled: selectors.isToolButtonDisabled(state, 'MarqueeZoomTool'),
  zoomList: selectors.getZoomList(state)
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ZoomOverlay));



