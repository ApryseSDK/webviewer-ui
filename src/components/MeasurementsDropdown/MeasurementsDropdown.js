import React from 'react';

import MeasurementsDropdownItem from '../MeasurementsDropdownItem';

import './MeasurementsDropdown.scss';

class MeasurementsDropdown extends React.PureComponent {
  state = { isOpen: false };

  onClick = item => {
    this.setState({ selectedItem: item, isOpen: !this.state.isOpen });
    this.props.onClick(item);
  }

  render() { 
    const { dropdownList, selectedItem } = this.props;
    const { isOpen } = this.state; 
    return (
    <div className="MeasurementsDropdown">  
      <div onClick={()=>{
          this.setState({
            isOpen: !isOpen 
          });
        }}
      >
    <MeasurementsDropdownItem content={selectedItem}/>
    </div>
        { isOpen && 
          dropdownList.map((item, i) => {
          return <MeasurementsDropdownItem key={i} content={item} onClick={()=>{this.onClick(item)}} isSelected={item === selectedItem}/>;
          })
        }
    </div>
    );
  }
}
 
export default MeasurementsDropdown;