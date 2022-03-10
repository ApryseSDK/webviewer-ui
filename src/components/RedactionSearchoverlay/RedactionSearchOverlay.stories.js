import React from 'react';
import RedactionSearchOverlay from './RedactionSearchOverlay';


export default {
  title: 'Components/RedactionPanel/RedactionSearchOverlay',
  component: RedactionSearchOverlay,
};

const basicProps = {
}


export function Basic() {
  return (
    <RedactionSearchOverlay {...basicProps} />
  );
}