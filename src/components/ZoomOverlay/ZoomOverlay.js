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
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['viewControlsOverlay', 'toolsOverlay', 'searchOverlay', 'menuOverlay', 'toolStylePopup']);
      const { left, right } = getOverlayPositionBasedOn('zoomOverlayButton', this.dropdown);
      this.setState({
        left: left - 20,
        right
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  // https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md#state-derived-from-propsstate
  static getDerivedStateFromProps(nextProps, prevState){
    const hasIsOpenChanged = !prevState.mirroredIsOpen && nextProps.isOpen;
    if (hasIsOpenChanged){
      return { isOpening: true, mirroredIsOpen: nextProps.isOpen };
    }
    return { isOpening: false, mirroredIsOpen: nextProps.isOpen };
  }

  handleWindowResize = () => {
    const { left, right } = getOverlayPositionBasedOn('zoomOverlayButton', this.dropdown);
    this.setState({
      left: left - 20,
      right
    });
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
        <OverlayItem
          onClick={core.fitToWidth}
          buttonName={t('action.fitToWidth')}
          willFocus={this.state.isOpening}
        />
        <OverlayItem onClick={core.fitToPage} buttonName={t('action.fitToPage')} />
        <div className="spacer" />
        {zoomList.map((zoomValue, i) =>
          <OverlayItem key={i} onClick={() => zoomTo(zoomValue)} buttonName={zoomValue * 100 + '%'}/>
        )}
        <div className="spacer" />
        <ToolButton
          isLastInMenu
          toolName="MarqueeZoomTool"
          label={t('tool.Marquee')}
          onClick={() => closeElements(['zoomOverlay'])}
          onTabOut={() => closeElements(['zoomOverlay'])}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'zoomOverlay'),
  isOpen: selectors.isElementOpen(state, 'zoomOverlay'),
  zoomList: selectors.getZoomList(state)
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ZoomOverlay));
