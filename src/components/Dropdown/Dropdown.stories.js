import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
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
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 100 }}>
        <Dropdown
          onClickItem={onClickItem}
          items={items}
          translationPrefix={translationPrefix}
          currentSelectionKey={currentSelectionKey}
        />
      </div>
    </ReduxProvider>
  );
}

export function ImageDropdown() {
  const images = [
    { key: 'None', src: 'icon-linestyle-none' },
    { key: 'ClosedArrow', src: 'icon-linestyle-start-arrow-closed' },
    { key: 'OpenArrow', src: 'icon-linestyle-start-arrow-open' },
    { key: 'ROpenArrow', src: 'icon-linestyle-start-arrow-open-reverse' }
  ];

  const dropdownWidth = 85;
  const [currentSelectionKey, setCurrentSelectionKey] = React.useState(images[0].key);

  function onClickItem(key) {
    setCurrentSelectionKey(key);
  }

  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: dropdownWidth }}>
        <Dropdown
          onClickItem={onClickItem}
          width={dropdownWidth}
          images={images}
          currentSelectionKey={currentSelectionKey}
        />
      </div>
    </ReduxProvider>
  );
}
