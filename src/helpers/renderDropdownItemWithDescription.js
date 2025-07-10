import React from 'react';

const renderDropdownItemWithDescription = (item, t) => (
  <div className='Dropdown__item-vertical'>
    <div className='Dropdown__item-label'>{t(item.label)}</div>
    <div className='Dropdown__item-description'>{t(item.description)}</div>
  </div>
);

export default renderDropdownItemWithDescription;
