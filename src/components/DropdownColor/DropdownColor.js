import React, { useState,useEffect } from 'react';
import './Dropdown.scss';
import Icon from 'components/Icon';

const items = [
  {
    color: '#000000',
    name: 'Black',
    key: 'black',
    obj: {R:0,G:0,B:0,A:1}
  },
  {
    color: '#4E7DE9',
    name: 'Blue',
    key: 'blue',
    obj: {R:78,G:125,B:233,A:1}
  },
  {
    color: '#E44234',
    name: 'Red',
    key: 'red',
    obj: {R:228,G:66,B:52,A:1}
  },
];

function DropdownColor({color,property,onStyleChange}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedColorCurrent, setSelectedColorCurrent] = useState({
    color: '#000000',
    name: 'Black',
    key: 'black',
    obj: {R:0,G:0,B:0,A:1}
  });

  function handleDropdownClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  function handleWindowClick(event) {
    if (!event.target.matches('.dropClass')) {
      setIsDropdownOpen(false);
    }
  }

  const onClickCurrent = (selectedkey) => {
    const obj = items.find(item => item.color === selectedkey);
    const color = new window.Annotations.Color(selectedkey);
    onStyleChange(property,color)
    setSelectedColorCurrent(obj);
  };

  function transformArray(arr) {
    return arr.map(({ name, key, color, obj }) => {
      return (
        <div className='styledItem' key={key} onClick={() => onClickCurrent(color)}>
          <div className='circleClass' style={{ backgroundColor: color }}>
          </div>
          <div
            style={{
              fontFamily: 'Arial',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: "12px",
              color: '#333333',
            }}>{name}</div>
        </div>
      )
    });
  }


  window.addEventListener('click', handleWindowClick);

  useEffect(() => {    
    const obj = items.find(item => item.color.toLowerCase() === color?.toHexString?.()?.toLowerCase());
    setSelectedColorCurrent(obj);
  },[]);


  return (
    <>
    <div className="dropdown">
      <div className='styledSelectpill dropClass' onClick={handleDropdownClick}>
        <div className='circleClass dropClass' style={{ backgroundColor: selectedColorCurrent.color, marginRight: '0px' }}>
        </div>
        <Icon className="arrow" glyph={`icon-chevron-${isDropdownOpen ? 'up' : 'down'}`} />
      </div>
      <div
        id="myDropdown"
        className={isDropdownOpen ? 'dropdown-content show' : 'dropdown-content'}
      >
        {transformArray(items)}
      </div>
    </div>
    </>
  );
}

export default DropdownColor;




