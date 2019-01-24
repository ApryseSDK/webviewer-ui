import React from 'react';
import { connect } from 'react-redux';
import core from 'core';

import selectors from 'selectors';
import actions from 'actions';

import './ToggleElementDropdown.scss';

class ToggleElementDropdown extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = { zoom: Math.ceil(core.getZoom() * 100) };
  }
  componentDidMount(){
  core.addEventListener('zoomUpdated', this.onZoomUpdated);
  }
  onZoomUpdated = () => {
  this.setState({ zoom: Math.ceil(core.getZoom() * 100)});
  }

  render() { 
    return (
    <div className="ToggleElementDropdown" onClick = {this.props.onClick}>
      <textarea className="DropdownText">
        {this.state.zoom + '%'}
      </textarea>
    </div>
    );
  }
}

// export default ToggleElementDropdown;

const mapStateToProps = (state, ownProps) => ({
  className: 'ToggleElementButton',
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
  isActive: selectors.isElementOpen(state, ownProps.elemenst),
});

const mapDispatchToProps = dispatch => ({
  onClick: e => {
    e.stopPropagation();
    dispatch(actions.toggleElement('zoomDropdown'));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleElementDropdown);
