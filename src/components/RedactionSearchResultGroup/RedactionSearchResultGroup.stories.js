
import React, { useState } from 'react';
import RedactionSearchResultGroup from './RedactionSearchResultGroup';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { redactionTypeMap } from 'constants/redactionTypes';
import { RedactionContextMock } from '../RedactionPanel/RedactionPanel.stories';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const RedactionSearchResultGroupWithRedux = (props) => {
  const mockContext = {
    ...props.mockContext,
  };

  return (
    <Provider store={store}>
      <RedactionContextMock mockContext={mockContext}>
        <RedactionSearchResultGroup {...props} />
      </RedactionContextMock>
    </Provider>
  );
};

export default {
  title: 'Components/RedactionSearchPanel/RedactionSearchResultGroup',
  component: RedactionSearchResultGroup,
  includeStories: ['Basic']
};


export const mockSearchResults = [
  {
    type: redactionTypeMap['TEXT'],
    resultStr: 'spice',
    ambientStr: 'The spice must flow.',
    resultStrStart: 4,
    resultStrEnd: 9,
    index: 0,
    icon: 'icon-form-field-text',
  },
  {
    type: redactionTypeMap['CREDIT_CARD'],
    resultStr: '4242 4242 4242 4242',
    index: 1,
    icon: 'redact-icons-credit-card',
  },
  {
    type: redactionTypeMap['IMAGE'],
    resultStr: 'Image',
    index: 2,
    icon: 'redact-icons-image',
  },
  {
    type: redactionTypeMap['PHONE'],
    resultStr: '867-5309',
    index: 3,
    icon: 'redact-icons-phone-number',
  },
  {
    type: redactionTypeMap['EMAIL'],
    resultStr: 'paul.atreides@dune.com',
    index: 4,
    icon: 'redact-icons-email',
  }
];

const basicProps = {
  pageNumber: 1,
  searchResults: mockSearchResults,
};


export function Basic() {
  const [selectedSearchResultIndexes, setSelectedSearchResultIndexes] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  return (
    <div style={{ width: '330px' }}>
      <RedactionSearchResultGroupWithRedux
        selectedSearchResultIndexes={selectedSearchResultIndexes}
        setSelectedSearchResultIndexes={setSelectedSearchResultIndexes}
        {...basicProps}
      />
    </div>
  );
}
