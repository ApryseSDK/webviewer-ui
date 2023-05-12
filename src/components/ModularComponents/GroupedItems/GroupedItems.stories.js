import React from 'react';
import GroupedItems from './GroupedItems';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'ModularComponents/GroupedItems',
  component: GroupedItems,
};

const initialState = {
  viewer: {
    modularHeaders: [],
    customElementOverrides: {},
    disabledElements: []
  },
};


const button1 = {
  dataElement: 'button',
  onClick: () => alert('Added'),
  disabled: false,
  title: 'Button 1',
  label: 'Add',
  type: 'customButton'
};

const button2 = {
  dataElement: 'button',
  onClick: () => alert('Added'),
  disabled: false,
  title: 'Button 2',
  label: 'OK',
  type: 'customButton'
};

export const Group = () => {
  const props = {
    dataElement: 'grouped-item',
    items: [button1, button2]
  };

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <GroupedItems {...props} />
      </div>
    </Provider>
  );
};