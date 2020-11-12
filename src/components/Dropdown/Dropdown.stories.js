import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from "react-redux";
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
