import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import RedactionPanel from './RedactionPanel';
import RedactionPanelContainerWithProvider from './RedactionPanelContainer';
import RightPanel from 'components/RightPanel';
import { RedactionPanelContext } from './RedactionPanelContext';
import { defaultRedactionTypes, redactionTypeMap } from 'constants/redactionTypes';
import Panel from 'components/Panel';

const noop = () => { };

export default {
  title: 'Components/RedactionPanel',
  component: RedactionPanel,
  includeStories: [
    'EmptyList', 'PanelWithRedactionItems', 'RedactionPanelWithSearch',
    'RedactionLeftGenericPanel',
    'RedactionRightGenericPanel',
    'RightPanelWithRedactionItems',
    'LeftPanelWithRedactionItems',
  ]
};

export const RedactionContextMock = ({ children, mockContext }) => {
  const context = {
    selectedRedactionItemId: '1',
    setSelectedRedactionItemId: (id) => {
      console.log({ id });
    },
    ...mockContext
  };

  return (
    <RedactionPanelContext.Provider value={context}>
      {children}
    </RedactionPanelContext.Provider>
  );
};

export const mockRedactionTypesDictionary = {
  email: {
    label: 'redactionPanel.search.emails',
    icon: 'redact-icons-email',
  },
  ...defaultRedactionTypes,
};


const initialState = {
  viewer: {
    isInDesktopOnlyMode: true,
    disabledElements: {
      logoBar: { disabled: true },
    },
    customElementOverrides: {},
    openElements: {
      header: true,
      redactionPanel: true,
      panel: true,
    },
    currentLanguage: 'en',
    panelWidths: {
      redactionPanel: 330,
      panel: 300,
    },
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
  },
  featureFlags: {
    customizableUI: false,
  },
  search: {
    redactionSearchPatterns: {
      phoneNumbers: {
        label: 'redactionPanel.search.phoneNumbers',
        icon: 'redact-icons-phone-number',
        type: 'phone',
        regex: /\d?(\s?|-?|\+?|\.?)((\(\d{1,4}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)\d{3}(-|\.|\s)\d{4,5}/,
      },
      emails: {
        label: 'redactionPanel.search.emails',
        icon: 'redact-icons-email',
        type: 'email',
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/,
      },
      creditCards: {
        label: 'redactionPanel.search.creditCards',
        icon: 'redact-icons-credit-card',
        type: 'creditCard',
        regex: /\b(?:\d[ -]*?){13,16}\b/,
      },
    }
  }
};

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const basicProps = {
  currentWidth: 330,
  redactionAnnotations: [],
  redactionTypesDictionary: mockRedactionTypesDictionary,
};

export const RedactionPanelStoryWrapper = ({ children, mockContext }) => {
  return (
    <Provider store={store}>
      <RightPanel
        dataElement="redactionPanel"
        onResize={noop}
      >
        <RedactionContextMock mockContext={mockContext}>
          {children}
        </RedactionContextMock>
      </RightPanel>
    </Provider >
  );
};

export function EmptyList() {
  return (
    <RedactionPanelStoryWrapper>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '$330px' }}>
        <RedactionPanel {...basicProps} />
      </div>
    </RedactionPanelStoryWrapper>
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
    getCustomData: () => 'Redact this text',
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
    getCustomData: () => '',
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
    getCustomData: () => '',
  },
  {
    Author: 'Duncan Idaho',
    type: redactionTypeMap['EMAIL'],
    Id: 4,
    PageNumber: 2,
    DateCreated: '2021-08-19T22:43:04.795Z',
    IsText: false,
    getReplies: () => [1, 2, 3],
    getStatus: () => '',
    isReply: () => false,
    StrokeColor: {
      toString: () => 'rgba(0,100,0,1)'
    },
    getCustomData: () => '',
    getContents: () => 'duncan@dune.ca',
  },
];

export function PanelWithRedactionItems() {
  return (
    <RedactionPanelStoryWrapper>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '330px' }}>
        <RedactionPanel {...basicProps} redactionAnnotations={redactionAnnotations} />
      </div>
    </RedactionPanelStoryWrapper>
  );
}

export function RedactionPanelWithSearch() {
  return (
    <RedactionPanelStoryWrapper>
      <RedactionPanelContainerWithProvider redactionAnnotationsList={[]} />
    </RedactionPanelStoryWrapper>
  );
}


export function RedactionLeftGenericPanel() {
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <RedactionContextMock>
          <div className="Panel RedactionPanel">
            <RedactionPanel {...basicProps} />
          </div>
        </RedactionContextMock>
      </Panel>
    </Provider >
  );
}

export function RedactionRightGenericPanel() {
  return (
    <Provider store={store}>
      <Panel location={'right'} dataElement={'panel'}>
        <RedactionContextMock>
          <div className="Panel RedactionPanel">
            <RedactionPanel {...basicProps} />
          </div>
        </RedactionContextMock>
      </Panel>
    </Provider >
  );
}


export function RightPanelWithRedactionItems() {
  return (
    <Provider store={store}>
      <Panel location={'right'} dataElement={'panel'}>
        <RedactionContextMock>
          <div className="Panel RedactionPanel">
            <RedactionPanel {...basicProps} redactionAnnotations={redactionAnnotations} />
          </div>
        </RedactionContextMock>
      </Panel>
    </Provider >
  );
}

export function LeftPanelWithRedactionItems() {
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <RedactionContextMock>
          <div className="Panel RedactionPanel">
            <RedactionPanel {...basicProps} redactionAnnotations={redactionAnnotations} />
          </div>
        </RedactionContextMock>
      </Panel>
    </Provider >
  );
}