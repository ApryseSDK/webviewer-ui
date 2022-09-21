import React, { useState } from 'react';
import Selector from './Selector';

export default {
  title: 'Components/Selector',
  component: Selector,
};

export function Basic() {
  const items = ['ITEM 1', 'ITEM 2'];
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const placeHolder = 'PLACEHOLDER';
  const onItemSelected = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <Selector
        items={items}
        selectedItem={selectedItem}
        onItemSelected={onItemSelected}
        placeHolder={placeHolder}
      />
    </div>
  );
}

export function Placeholder() {
  const items = ['ITEM 1', 'ITEM 2'];
  const [selectedItem, setSelectedItem] = useState();
  const placeHolder = 'PLACEHOLDER';
  const onItemSelected = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <Selector
        items={items}
        selectedItem={selectedItem}
        onItemSelected={onItemSelected}
        placeHolder={placeHolder}
      />
    </div>
  );
}
