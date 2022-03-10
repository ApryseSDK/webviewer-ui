import React from 'react';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import RedactionPanel from './RedactionPanel';
import RightPanel from 'components/RightPanel';
import { RedactionPanelContext } from './RedactionPanelContext';

const noop = () => { };

export default {
  title: 'Components/RedactionPanel',
  component: RedactionPanel,
};

const initialState = {
  viewer: {
    isInDesktopOnlyMode: true,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      header: true,
      redactionPanel: true,
    },
    currentLanguage: 'en',
    panelWidths: {
      redactionPanel: 330,
    },
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const basicProps = {
  currentWidth: 330,
  redactionAnnotations: []
}

export function EmptyList() {
  return (
    <Provider store={store}>
      <RightPanel
        dataElement="redactionPanel"
        onResize={noop}>
        <RedactionPanel {...basicProps} />
      </RightPanel>
    </Provider>
  );
}

const redactionAnnotations = [
  {
    Author: 'Duncan Idaho',
    Id: 1,
    PageNumber: 1,
    DateCreated: '2021-08-19T22:43:04.795Z',
    IsText: true,
    getReplies: () => [1, 2, 3],
    getStatus: () => '',
    isReply: () => false,
    StrokeColor: {
      toString: () => 'rgba(200,100,69,1)'

    },
    getCustomData: () => 'This is a preview of the text that will be redacted by Duncan Idaho of house Atreides',
  },
  {
    Author: 'Duncan Idaho',
    Id: 2,
    PageNumber: 1,
    DateCreated: '2021-08-19T22:43:04.795Z',
    IsText: false,
    getReplies: () => [1, 2, 3],
    getStatus: () => '',
    isReply: () => false,
    StrokeColor: {
      toString: () => 'rgba(255,0,0,1)'
    },
    getCustomData: () => 'This is a preview of the text that will be redacted by Duncan Idaho of house Atreides',
  },
  {
    Author: 'Duncan Idaho',
    Id: 3,
    PageNumber: 2,
    DateCreated: '2021-08-19T22:43:04.795Z',
    IsText: false,
    getReplies: () => [1, 2, 3],
    getStatus: () => '',
    isReply: () => false,
    StrokeColor: {
      toString: () => 'rgba(0,100,0,1)'
    },
    getCustomData: () => 'This is a preview of the text that will be redacted by Duncan Idaho of house Atreides',
  },
];

const RedactionContextMock = ({ children }) => {
  const context = {
    selectedRedactionItemId: '1',
    setSelectedRedactionItemId: (id) => { console.log({ id }) },
  };

  return (
    <RedactionPanelContext.Provider value={context}>
      {children}
    </RedactionPanelContext.Provider>
  );
}



export function PanelWithRedactionItems() {
  return (
    <Provider store={store}>
      <RightPanel
        dataElement="redactionPanel"
        onResize={noop}>
        <RedactionContextMock>
          <RedactionPanel {...basicProps} redactionAnnotations={redactionAnnotations} />
        </RedactionContextMock>
      </RightPanel>
    </Provider>
  )
};
