import React from 'react';
import PropTypes from 'prop-types';

import MeasurementsDropdownItem from '../MeasurementsDropdownItem';

class MeasurementsDropdown extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    dropdownList: PropTypes.array,
    selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isDropdownOpen: PropTypes.bool,
    onDropdownChange: PropTypes.func,
  };

  onClick = (e, item) => {
    e.stopPropagation();
    this.setState({ selectedItem: item });
    this.props.onClick(item);
  };

  render() {
    const { dropdownList, selectedItem } = this.props;
    const { isDropdownOpen } = this.props;

    let sortedDropdownList;
    if (window.innerWidth < 640) {
      sortedDropdownList = dropdownList
        .filter(item => item !== selectedItem)
        .concat([selectedItem]);
    } else {
      sortedDropdownList = [selectedItem].concat(
        dropdownList.filter(item => item !== selectedItem),
      );
    }
    return (
      <div className="MeasurementsDropdown">
        {!isDropdownOpen && (
          <MeasurementsDropdownItem
            onClick={e => {
              e.stopPropagation();
              this.props.onDropdownChange();
            }}
            content={selectedItem}
          />
        )}
        {isDropdownOpen &&
          sortedDropdownList.map((item, i) => (
            <MeasurementsDropdownItem
              key={i}
              content={item}
              onClick={e => this.onClick(e, item)}
            />
          ))}
      </div>
    );
  }
}

export default MeasurementsDropdown;
