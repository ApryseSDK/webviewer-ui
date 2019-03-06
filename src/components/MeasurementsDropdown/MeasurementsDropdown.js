import React from 'react';

import core from 'core';

import MeasurementsDropdownItem from '../MeasurementsDropdownItem';

class MeasurementsDropdown extends React.PureComponent {

  onClick = (e,item) => {
    e.stopPropagation();
    this.setState({ selectedItem: item });
    this.props.onClick(item);
  }

  render() { 
    const { dropdownList, selectedItem } = this.props;
    const { isDropdownOpen } = this.props;
    let sortedDropdownList;
    if (window.innerWidth < 640){
      sortedDropdownList = dropdownList.filter(item => item !== selectedItem).concat([selectedItem]);
    } else {
      sortedDropdownList = [selectedItem].concat(dropdownList.filter(item => item !== selectedItem));
    }
    return (
    <div className="MeasurementsDropdown">  
      { !isDropdownOpen && <MeasurementsDropdownItem 
        onClick={
          e=>{
            e.stopPropagation();
            this.props.onDropdownChange();
          }
        }
        content={selectedItem}
                           />
      }
      { isDropdownOpen &&
        sortedDropdownList.map((item, i) => {
          return <MeasurementsDropdownItem key={i} content={item} onClick={e=>{
this.onClick(e,item);
}} />;
        })
      }
    </div>
    );
  }
}
 
export default MeasurementsDropdown;