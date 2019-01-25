import React from 'react';
import { connect } from 'react-redux';
import core from 'core';

import selectors from 'selectors';
import actions from 'actions';

import { zoomTo } from 'helpers/zoom';

import ToggleElementButton from '../ToggleElementButton';

import './ToggleElementDropdown.scss';

class ToggleElementDropdown extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = { zoom: Math.ceil(core.getZoom() * 100), value: 100 };
    this.textarea = React.createRef();
  }
  componentDidMount(){
    core.addEventListener('zoomUpdated', this.onZoomUpdated);
  }

  onZoomUpdated = () => {
    this.setState({ zoom: Math.ceil(core.getZoom() * 100)},
    ()=>{this.setState({ value: this.state.zoom })});
  }

  onKeyPress = e => {
    if (window.event.keyCode === 13){
      zoomTo(this.state.value/100);
    }
  }

  onChange = e => {
    const re = /^[0-9\b]+$/;
    if (re.test(e.target.value) || e.target.value === ''){
      this.setState({ value: e.target.value }); 
    }
  }

  onBlur = e => {
    if (e.target.value !== ''){
      this.setState({ value: e.target.value });
      zoomTo(e.target.value / 100);
    } else {
      this.setState({ value: this.state.zoom });
    }
  }
  
  render() { 
    return (
    <div className="ToggleElementDropdown" onClick = {this.props.onClick}>
      <div className="DropdownText">
        <textarea 
          className="textarea" 
          maxLength="4" 
          value={this.state.value}
          ref={this.textarea} 
          onChange={this.onChange} 
          onKeyPress={this.onKeyPress}
          onBlur={this.onBlur}
        />
        {'%'}
      </div>
      <div className="DropdownButton">
        <ToggleElementButton img="ic-triangle" element="zoomDropdown" dataElement="zoomDropdown"/>
      </div>
    </div>
    );
  }
}

export default ToggleElementDropdown;

// const mapStateToProps = (state, ownProps) => ({
//   className: 'ToggleElementButton',
//   isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
//   isActive: selectors.isElementOpen(state, ownProps.elemenst),
// });

// const mapDispatchToProps = dispatch => ({
//   onClick: e => {
//     e.stopPropagation();
//     dispatch(actions.toggleElement('zoomDropdown'));
//   }
// });

// export default connect(mapStateToProps, mapDispatchToProps)(ToggleElementDropdown);
