import React from 'react';
import RedactionPageGroup from './RedactionPageGroup';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';
import { redactionTypeMap, defaultRedactionTypes } from 'constants/redactionTypes';

const initialState = {
  viewer: {
    currentLanguage: 'en',
    disabledElements: {},
    customElementOverrides: {},
    panelWidths: {
      redactionPanel: 330,
    },
  }
};
function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const RedactionPageGroupWithRedux = (props) => {
  const context = {
    selectedRedactionItemId: '1',
    setSelectedRedactionItemId: (id) => {
      console.log({ id });
    },
  };
  return (
    <Provider store={store}>
      <RedactionPanelContext.Provider value={context}>
        <RedactionPageGroup {...props} />
      </RedactionPanelContext.Provider>
    </Provider>
  );
};

export default {
  title: 'Components/RedactionPanel/RedactionPageGroup',
  component: RedactionPageGroup,
};

const mockRedactionTextAnnotation = {
  Author: 'Duncan Idaho',
  IsText: true,
  Id: 1,
  DateCreated: '2021-08-19T22:43:04.795Z',
  getReplies: () => [1, 2, 3],
  getStatus: () => '',
  isReply: () => false,
  StrokeColor: {
    toString: () => 'rgba(255,205,69,1)'
  },
  getCustomData: () => 'Redact this text',
  redactionType: redactionTypeMap['TEXT'],
  icon: defaultRedactionTypes[redactionTypeMap['TEXT']].icon,
};

const mockRegionTextAnnotation = {
  Author: 'Duncan Idaho',
  IsText: false,
  Id: 2,
  DateCreated: '2021-08-19T22:43:04.795Z',
  getReplies: () => [1, 2, 3],
  getStatus: () => '',
  isReply: () => false,
  StrokeColor: {
    toString: () => 'rgba(255,0,0,1)'
  },
  getCustomData: () => '',
  redactionType: redactionTypeMap['REGION'],
  icon: defaultRedactionTypes[redactionTypeMap['REGION']].icon,
  label: defaultRedactionTypes[redactionTypeMap['REGION']].label,
};

const redactionItems = [
  mockRedactionTextAnnotation,
  mockRegionTextAnnotation
];

const basicProps = {
  pageNumber: 1,
  redactionItems,
};


export function Basic() {
  return (
    <div style={{ width: '330px' }}>
      <RedactionPageGroupWithRedux {...basicProps} />
    </div>
  );
}
