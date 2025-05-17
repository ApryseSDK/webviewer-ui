import React from 'react';
import GroupedItems from './GroupedItems';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { defaultModularComponents } from 'src/redux/modularComponents';
import initialState from 'src/redux/initialState';
import {
  button1,
  button2,
  button3,
  button4,
  button5,
  button6,
  button7,
  button8,
  button9,
} from '../Helpers/mockHeaders';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import selectors from 'selectors';
import { expect } from '@storybook/test';

export default {
  title: 'ModularComponents/GroupedItems',
  component: GroupedItems,
};


export const GroupWithFormBuilderTools = () => {
  const {
    signatureFieldButton,
    textFieldButton,
    checkboxFieldButton,
    radioFieldButton,
    listBoxFieldButton,
    comboBoxFieldButton,
  } = defaultModularComponents;
  const props = {
    dataElement: 'grouped-item',
    items: [signatureFieldButton, textFieldButton, checkboxFieldButton, radioFieldButton, listBoxFieldButton, comboBoxFieldButton],
  };

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <GroupedItems {...props} />
      </div>
    </Provider>
  );
};

const items = [
  button1,
  button2,
  button3,
  button4,
  button5,
  button6,
  button7,
  button8,
  button9,
];
const groupedItem = {
  dataElement: 'grouped-item',
  items,
};

const store = configureStore({ reducer: rootReducer });
store.dispatch(actions.setModularHeaderItems('default-top-header', [groupedItem]));
store.dispatch(actions.setCustomElementSize('grouped-item', 5));

export const GroupShouldUpdateFlyout = () => {
  return (
    <Provider store={store}>
      <InnerComponent/>
    </Provider>
  );
};

const InnerComponent = () => {
  const reduxItems = useSelector((state) => state.viewer.modularComponents['grouped-item'].items);
  const propItems = reduxItems.map((item) => items.find((i) => i.dataElement === item));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <GroupedItems dataElement={groupedItem.dataElement} items={propItems || []}/>
    </div>
  );
};

GroupShouldUpdateFlyout.play = async () => {
  const waitForStoreUpdate = async () => {
    await new Promise((resolve) => {
      store.subscribe(() => resolve());
    });
  };
  const getFlyoutItems = () => selectors.getFlyout(store.getState(), 'grouped-itemFlyout').items;

  await waitForStoreUpdate();
  await expect(getFlyoutItems().map((i) => i.dataElement)).toEqual([button5, button6, button7, button8, button9].map((i) => i.dataElement));
  store.dispatch(actions.updateGroupedItems('grouped-item', items.reverse()));
  await waitForStoreUpdate();
  await expect(getFlyoutItems().map((i) => i.dataElement)).toEqual([button5, button4, button3, button2, button1].map((i) => i.dataElement));
};