import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import core from 'core';

import ToggleElementButton from 'components/ToggleElementButton';

import { zoomTo } from 'helpers/zoom';
import selectors from 'selectors';
import actions from 'actions';

import './ToggleElementOverlay.scss';

class ToggleElementOverlay extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = { value: '100' };
  }

  componentDidMount() {
    core.addEventListener('documentLoaded', this.onDocumentLoaded);
    core.addEventListener('zoomUpdated', this.onZoomUpdated);
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.onDocumentLoaded);
    core.removeEventListener('zoomUpdated', this.onZoomUpdated);
  }

  onDocumentLoaded = () => {
    this.setState({ value: Math.ceil(core.getZoom() * 100).toString() });
  }

  onZoomUpdated = () => {
    this.setState({ value: Math.ceil(core.getZoom() * 100).toString() });
  }

  onKeyPress = e => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.keyCode === 13) {
      const zoom = Math.ceil(core.getZoom() * 100).toString();
      if (e.target.value === zoom) {
        return;
      }
      if (e.target.value === '') {
        this.setState({ value: zoom });
      } else {
        zoomTo(Number(e.target.value) / 100);
      }
    }
  }

  onChange = e => {
    const re = /^(\d){0,4}$/;
    if (re.test(e.target.value) || e.target.value === '') {
      this.setState({ value: e.target.value });
    }
  }

  onBlur = e => {
    const zoom = Math.ceil(core.getZoom() * 100).toString();
    if (e.target.value === zoom) {
      return;
    }
    if (e.target.value === '' || isNaN(Number(e.target.value))) {
      this.setState({ value: zoom });
    } else {
      this.setState({ value: Number(e.target.value).toString() });
      zoomTo(e.target.value / 100);
    }
  }

  render() {
    const { isActive, onClick } = this.props;
    return (
      <div className="ToggleElementOverlay">
        <div className={['OverlayContainer', isActive ? 'active' : ''].join(' ').trim()}>
          <div className="OverlayText" onClick={onClick}>
            <input
              type="text"
              className="textarea"
              value={this.state.value}
              onChange={this.onChange}
              onKeyPress={this.onKeyPress}
              onBlur={this.onBlur}
              tabIndex={-1}
            />
            <span>%</span>
          </div>
          <ToggleElementButton className="OverlayButton" img="ic-triangle" element="zoomOverlay" dataElement="zoomOverlay"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isActive: selectors.isElementOpen(state, 'zoomOverlay'),
});

const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch(actions.toggleElement('zoomOverlay'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleElementOverlay);
