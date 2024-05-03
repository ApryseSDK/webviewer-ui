import React from 'react';
import RedactionSearchPanel from './RedactionSearchPanel';
import { RedactionPanelStoryWrapper } from 'components/RedactionPanel/RedactionPanel.stories';
import { redactionTypeMap } from 'constants/redactionTypes';

const noop = () => { };

export const mockSearchResults = [
  {
    type: redactionTypeMap['TEXT'],
    resultStr: 'spice',
    ambientStr: 'The spice must flow.',
    resultStrStart: 4,
    resultStrEnd: 9,
    index: 0,
    pageNum: 1,
    icon: 'icon-form-field-text',
  },
  {
    type: redactionTypeMap['CREDIT_CARD'],
    resultStr: '4242 4242 4242 4242',
    index: 1,
    pageNum: 1,
    icon: 'redact-icons-credit-card',
  },
  {
    type: redactionTypeMap['IMAGE'],
    resultStr: 'Image',
    index: 2,
    pageNum: 2,
    icon: 'redact-icons-image',
  },
  {
    type: redactionTypeMap['PHONE'],
    resultStr: '867-5309',
    index: 3,
    pageNum: 2,
    icon: 'redact-icons-phone-number',
  },
  {
    type: redactionTypeMap['EMAIL'],
    resultStr: 'paul.atreides@dune.com',
    index: 4,
    pageNum: 3,
    icon: 'redact-icons-email',
  }
];

export default {
  title: 'Components/RedactionSearchPanel',
  component: RedactionSearchPanel,
  includeStories: [
    'StartSearch',
    'SearchInProgress',
    'SearchInProgressWithIncomingResults',
    'SearchCompleteWithResults',
    'SearchCompleteNoResults']
};

const mockContext = {
  isRedactionSearchActive: true,
  setIsRedactionSearchActive: noop,
};

export function StartSearch() {
  const props = {
    redactionSearchResults: [],
    isProcessingRedactionResults: false,
    clearRedactionSearchResults: noop,
    searchStatus: 'SEARCH_NOT_INITIATED',
  };
  return (
    <RedactionPanelStoryWrapper mockContext={mockContext}>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '$330px' }}>
        <RedactionSearchPanel {...props} />
      </div>
    </RedactionPanelStoryWrapper>
  );
}

export function SearchInProgress() {
  const props = {
    redactionSearchResults: [],
    isProcessingRedactionResults: true,
    clearRedactionSearchResults: noop,
    searchStatus: 'SEARCH_IN_PROGRESS',
  };

  return (
    <RedactionPanelStoryWrapper mockContext={mockContext}>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '$330px' }}>
        <RedactionSearchPanel {...props} />
      </div>
    </RedactionPanelStoryWrapper>
  );
}

export function SearchInProgressWithIncomingResults() {
  const props = {
    redactionSearchResults: mockSearchResults,
    isProcessingRedactionResults: true,
    clearRedactionSearchResults: noop,
    searchStatus: 'SEARCH_IN_PROGRESS',
  };

  return (
    <RedactionPanelStoryWrapper mockContext={mockContext}>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '$330px' }}>
        <RedactionSearchPanel {...props} />
      </div>
    </RedactionPanelStoryWrapper>
  );
}

export function SearchCompleteWithResults() {
  const props = {
    redactionSearchResults: mockSearchResults,
    isProcessingRedactionResults: false,
    clearRedactionSearchResults: noop,
    searchStatus: 'SEARCH_DONE',
  };

  return (
    <RedactionPanelStoryWrapper mockContext={mockContext}>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '$330px' }}>
        <RedactionSearchPanel {...props} />
      </div>
    </RedactionPanelStoryWrapper>
  );
}

export function SearchCompleteNoResults() {
  const props = {
    redactionSearchResults: [],
    isProcessingRedactionResults: false,
    clearRedactionSearchResults: noop,
    searchStatus: 'SEARCH_DONE',
  };

  return (
    <RedactionPanelStoryWrapper mockContext={mockContext}>
      <div className="Panel RedactionPanel" style={{ width: '330px', minWidth: '$330px' }}>
        <RedactionSearchPanel {...props} />
      </div>
    </RedactionPanelStoryWrapper>
  );
}
