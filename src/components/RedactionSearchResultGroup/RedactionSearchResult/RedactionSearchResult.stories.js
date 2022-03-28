import React from 'react';
import RedactionSearchResult from './RedactionSearchResult';
import { redactionTypeMap } from 'src/components/RedactionPageGroup/RedactionItem/RedactionItem';

export default {
  title: 'Components/RedactionSearchPanel/RedactionSearchResult',
  component: RedactionSearchResult,
};


export function Text() {
  const props = {
    type: redactionTypeMap['TEXT'],
    resultStr: "spice",
    ambientStr: "The spice must flow.",
    resultStrStart: 4,
    resultStrEnd: 9,
  }
  return (
    <RedactionSearchResult {...props} />
  );
}

export function CreditCard() {
  const props = {
    type: redactionTypeMap['CREDIT_CARD'],
    resultStr: '4242 4242 4242 4242'
  }
  return (
    <RedactionSearchResult {...props} />
  );
}

export function Image() {
  const props = {
    type: redactionTypeMap['IMAGE'],
    resultStr: "Image"
  }
  return (
    <RedactionSearchResult {...props} />
  );
}


export function PhoneNumber() {
  const props = {
    type: redactionTypeMap['PHONE'],
    resultStr: "867-5309"
  }
  return (
    <RedactionSearchResult {...props} />
  );
}


export function Email() {
  const props = {
    type: redactionTypeMap['EMAIL'],
    resultStr: "paul.atreides@dune.com"
  }
  return (
    <RedactionSearchResult {...props} />
  );
}
