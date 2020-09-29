import React from 'react';
import Dropdown from './Dropdown';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
};

export function Basic() {
  const translationPrefix = 'option.notesOrder';
  const items = ['position', 'time', 'status', 'author', 'type'];
  const [currentSelectionKey, setCurrentSelectionKey] = React.useState(items[0]);
  function onClickItem(key) {
    setCurrentSelectionKey(key);
  }
  return (
    <div style={{ width: 100 }}>
      <Dropdown
        onClickItem={onClickItem}
        items={items}
        translationPrefix={translationPrefix}
        currentSelectionKey={currentSelectionKey}
      />
    </div>
  );
}
