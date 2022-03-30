import React, { useState } from 'react';
import RedactionSearchOverlay from './RedactionSearchOverlay';


export default {
  title: 'Components/RedactionSearchPanel/RedactionSearchOverlay',
  component: RedactionSearchOverlay,
};

const noop = () => { };


const basicProps = {
  setIsRedactionSearchActive: noop,
}

export function Basic() {
  const [searchTerms, setSearchTerms] = useState([]);
  return (
    <RedactionSearchOverlay
      searchTerms={searchTerms}
      setSearchTerms={setSearchTerms}
      {...basicProps} />
  );
}