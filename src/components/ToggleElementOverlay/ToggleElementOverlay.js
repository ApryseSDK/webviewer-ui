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
    isActive: PropTypes.bool
  }

  constructor(props){
    super(props);
    this.state = { value: 100 };
  }

  componentDidMount() {
    core.addEventListener('zoomUpdated', this.onZoomUpdated);
  }

  componentWillUnmount() {
    core.removeEventListener('zoomUpdated', this.onZoomUpdated);
  }

  onZoomUpdated = () => {
    this.setState({ value: Math.ceil(core.getZoom() * 100) });
  }

  onKeyPress = () => {
    if (window.event.keyCode === 13){
      zoomTo(this.state.value / 100);
    }
  }

  onChange = e => {
    const re = /^[0-9\b]{0,4}$/;
    if (re.test(e.target.value) || e.target.value === ''){
      this.setState({ value: e.target.value }); 
    }
  }

  onBlur = e => {
    const zoom = Math.ceil(core.getZoom() * 100).toString();
    if (e.target.value === zoom && e.target.value !== ''){
      return; 
    } else if (e.target.value !== ''){
      this.setState({ value: e.target.value });
      zoomTo(e.target.value / 100);
    } else {
      this.setState({ value: zoom });
    }
  }
  
  render() { 
    const { isActive, onClick } = this.props;
    return (
      <div className="ToggleElementOverlay">
        <div className={[ 'OverlayContainer', isActive ? 'active' : '' ].join(' ').trim()}> 
          <div className="OverlayText" onClick={onClick}>
            <input
              type="number"
              className="textarea"
              value={this.state.value}
              onChange={this.onChange} 
              onKeyPress={this.onKeyPress}
              onBlur={this.onBlur}
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
  onClick: e => {
    e.stopPropagation();
    dispatch(actions.toggleElement('zoomOverlay'));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleElementOverlay);
