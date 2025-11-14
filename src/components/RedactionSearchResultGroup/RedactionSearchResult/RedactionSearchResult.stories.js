import React from 'react';
import RedactionSearchResult from './RedactionSearchResult';
import { redactionTypeMap } from 'constants/redactionTypes';
import rootReducer from 'src/redux/reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'Components/RedactionSearchPanel/RedactionSearchResult',
  component: RedactionSearchResult,
};

const store = configureStore({ reducer: rootReducer });

export function Text() {
  const props = {
    type: redactionTypeMap['TEXT'],
    resultStr: 'spice',
    ambientStr: 'The spice must flow.',
    resultStrStart: 4,
    resultStrEnd: 9,
    icon: 'icon-text-redaction',
  };
  return (
    <Provider store={store}>
      <RedactionSearchResult {...props} />
    </Provider>
  );
}
Text.parameters = window.storybook.disableRtlMode;

export function CreditCard() {
  const props = {
    type: redactionTypeMap['CREDIT_CARD'],
    resultStr: '4242 4242 4242 4242',
    icon: 'redact-icons-credit-card',
  };
  return (
    <Provider store={store}>
      <RedactionSearchResult {...props} />
    </Provider>
  );
}
CreditCard.parameters = window.storybook.disableRtlMode;

export function Image() {
  const props = {
    type: redactionTypeMap['IMAGE'],
    resultStr: 'Image',
    icon: 'redact-icons-image',
  };
  return (
    <Provider store={store}>
      <RedactionSearchResult {...props} />
    </Provider>
  );
}
Image.parameters = window.storybook.disableRtlMode;

export function PhoneNumber() {
  const props = {
    type: redactionTypeMap['PHONE'],
    resultStr: '867-5309',
    icon: 'redact-icons-phone-number',
  };
  return (
    <Provider store={store}>
      <RedactionSearchResult {...props} />
    </Provider>
  );
}
PhoneNumber.parameters = window.storybook.disableRtlMode;


export function Email() {
  const props = {
    type: redactionTypeMap['EMAIL'],
    resultStr: 'paul.atreides@dune.com',
    icon: 'redact-icons-email',
  };
  return (
    <Provider store={store}>
      <RedactionSearchResult {...props} />
    </Provider>
  );
}
Email.parameters = window.storybook.disableRtlMode;
