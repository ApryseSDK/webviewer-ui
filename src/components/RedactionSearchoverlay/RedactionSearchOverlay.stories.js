import React, { useState } from 'react';
import RedactionSearchOverlay from './RedactionSearchOverlay';


export default {
  title: 'Components/RedactionSearchPanel/RedactionSearchOverlay',
  component: RedactionSearchOverlay,
};

const noop = () => { };


const basicProps = {
  setIsRedactionSearchActive: noop,
  redactionSearchOptions: [
    {
      value: 'phone',
      label: 'redactionPanel.search.phoneNumbers',
      icon: 'redact-icons-phone-number',
      type: 'phone',
      regex: /\d?(\s?|-?|\+?|\.?)((\(\d{1,4}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)\d{3}(-|\.|\s)\d{4,5}/,
    },
    {
      value: 'email',
      label: 'redactionPanel.search.emails',
      icon: 'redact-icons-email',
      type: 'email',
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/,
    },
    {
      value: 'creditCard',
      label: 'redactionPanel.search.creditCards',
      icon: 'redact-icons-credit-card',
      type: 'creditCard',
      regex: /\b(?:\d[ -]*?){13,16}\b/,
    },
  ]
};

export function Basic() {
  const [searchTerms, setSearchTerms] = useState([]);
  return (
    <RedactionSearchOverlay
      searchTerms={searchTerms}
      setSearchTerms={setSearchTerms}
      {...basicProps} />
  );
}