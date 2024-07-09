import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ComparePanel from './ComparePanel';
import rootReducer from 'reducers/rootReducer';

export default {
  title: 'ModularComponents/ComparePanel',
  component: ComparePanel,
  parameters: {
    customizableUI: true,
  },
};

const store = configureStore({
  reducer: rootReducer,
});

export const Empty = () => {
  return (
    <Provider store={store}>
      <ComparePanel/>
    </Provider>
  );
};

const mockItems = {
  '1': [
    {
      'new': {
        'Id': '24ba68bd-4a45-4c52-b80f-b543ac5a0336'
      },
      'newText': 'Important Factors ',
      'newCount': 18,
      'old': {
        'Id': '5e45eea5-d63d-4328-811f-410ee769fe30'
      },
      'oldText': '',
      'oldCount': 0,
      'type': 'Text Content - insert'
    },
    {
      'new': {
        'Id': '99c5eacc-325c-4b40-be0c-3eb71d20430e'
      },
      'newText': ' you',
      'newCount': 4,
      'old': {
        'Id': 'fa896655-c4e2-4133-8cda-63d15d6038d3'
      },
      'oldText': '',
      'oldCount': 0,
      'type': 'Text Content - insert'
    }
  ],
  '2': [
    {
      'new': {
        'Id': 'fe9079d4-e139-44c1-afbc-48de7483efae'
      },
      'newText': 'into',
      'newCount': 4,
      'old': {
        'Id': '9608d6a2-d690-47d2-aef0-350d7ba90602'
      },
      'oldText': 'intoadsf',
      'oldCount': 8,
      'type': 'Text Content - edit'
    },
    {
      'new': {
        'Id': '4629e9e5-126e-4925-aa63-c69a103d3ace'
      },
      'newText': 'This',
      'newCount': 4,
      'old': {
        'Id': '341415d1-d4f7-4ac9-ad04-3d4ce60cdd34'
      },
      'oldText': 'Thasdfis',
      'oldCount': 8,
      'type': 'Text Content - edit'
    }
  ],
  '3': [
    {
      'new': {
        'Id': '93875dd2-8eaf-416d-a01b-b9cb807ad9a3'
      },
      'newText': 'of thing﻿',
      'newCount': 9,
      'old': {
        'Id': 'f0e5be8a-11c0-4b25-9fc4-833a9175875e'
      },
      'oldText': '3',
      'oldCount': 1,
      'type': 'Text Content - edit'
    },
    {
      'new': {
        'Id': '790fc686-4a83-4654-b74f-4f911614fe11'
      },
      'newText': ' initially on the main platforms preferred by your users. But later if you wish to expand, the library does ',
      'newCount': 108,
      'old': {
        'Id': 'c2ecc98b-3ef5-4935-838e-fc9dfc626537'
      },
      'oldText': 'y does ',
      'oldCount': 7,
      'type': 'Text Content - edit'
    }
  ],
};
const mockItemCount = 6;

export const Populated = () => {
  return (
    <Provider store={store}>
      <ComparePanel initialChangeListData={mockItems} initialTotalChanges={mockItemCount}/>
    </Provider>
  );
};
