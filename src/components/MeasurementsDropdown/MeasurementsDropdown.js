import React from 'react';

import core from 'core';
import MeasurementsDropdownItem from '../MeasurementsDropdownItem';

import './MeasurementsDropdown.scss';

class MeasurementsDropdown extends React.PureComponent {

  onClick = (e,item) => {
    e.stopPropagation();
    this.setState({ selectedItem: item });
    this.props.onClick(item);
  }

  render() { 
    const { dropdownList, selectedItem } = this.props;
    const { isDropdownOpen } = this.props;
    return (
    <div className="MeasurementsDropdown">  
    <MeasurementsDropdownItem 
      onClick={
        e=>{
          e.stopPropagation();
          this.props.onDropdownChange();
        }
      }
      content={selectedItem}
      />
        { isDropdownOpen && 
          dropdownList.map((item, i) => {
          return <MeasurementsDropdownItem key={i} content={item} onClick={(e)=>{this.onClick(e,item)}} isSelected={item === selectedItem}/>;
          })
        }
    </div>
    );
  }
}
 
export default MeasurementsDropdown;