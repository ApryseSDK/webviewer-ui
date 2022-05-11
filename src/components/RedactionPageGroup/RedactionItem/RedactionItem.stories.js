import React from 'react';
import RedactionItem from './RedactionItem';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import { redactionTypeMap, defaultRedactionTypes } from 'constants/redactionTypes';

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    panelWidths: {
      redactionPanel: 330,
    },
  }
};
function rootReducer(state = initialState, action) {
  return state;
};

const store = createStore(rootReducer);

const RedactionItemWithRedux = (props) => {
  return (
    <Provider store={store}>
      <RedactionItem {...props} />
    </Provider>
  );
};


export default {
  title: 'Components/RedactionPanel/RedactionPageGroup/RedactionItem',
  component: RedactionItem,
};

const getMockRedactionAnnotation = () => ({
  Author: 'Duncan Idaho',
  DateCreated: '2021-08-19T22:43:04.795Z',
  getReplies: () => [1, 2, 3],
  getStatus: () => '',
  isReply: () => false,
});


export function TextRedactionItem() {
  const mockTextRedactionAnnotation = getMockRedactionAnnotation();
  mockTextRedactionAnnotation.redactionType = redactionTypeMap['TEXT'];
  mockTextRedactionAnnotation.icon = 'icon-form-field-text';
  const textRedactionItemProps = {
    iconColor: '#E44234',
    annotation: mockTextRedactionAnnotation,
    author: mockTextRedactionAnnotation.Author,
    dateFormat: 'MMM D, LT',
    language: 'en',
    textPreview: 'This is a preview of the text that will be redacted by Duncan'
  };

  return (
    <RedactionItemWithRedux {...textRedactionItemProps} />
  );
};

export function RegionRedactionItem() {
  const { icon, label } = defaultRedactionTypes[redactionTypeMap['REGION']];
  const mockRegionRedactionAnnotation = getMockRedactionAnnotation();
  mockRegionRedactionAnnotation.redactionType = redactionTypeMap['REGION'];
  mockRegionRedactionAnnotation.icon = icon;
  mockRegionRedactionAnnotation.label = label;

  const regionRedactionItemProps = {
    iconColor: '#E44234',
    annotation: mockRegionRedactionAnnotation,
    author: mockRegionRedactionAnnotation.Author,
    dateFormat: 'MMM D, LT',
    language: 'en',
  };
  return (
    <RedactionItemWithRedux {...regionRedactionItemProps} />
  );
};

export function FullPageRedactionItem() {
  const { icon, label } = defaultRedactionTypes[redactionTypeMap['FULL_PAGE']];
  const mockFullPageRedactionAnnotation = getMockRedactionAnnotation();
  mockFullPageRedactionAnnotation.redactionType = redactionTypeMap['FULL_PAGE'];
  mockFullPageRedactionAnnotation.icon = icon;
  mockFullPageRedactionAnnotation.label = label;

  const regionRedactionItemProps = {
    iconColor: '#E44234',
    annotation: mockFullPageRedactionAnnotation,
    author: mockFullPageRedactionAnnotation.Author,
    dateFormat: 'MMM D, LT',
    language: 'en',
  };
  return (
    <RedactionItemWithRedux {...regionRedactionItemProps} />
  );
};

export function CreditCardRedactionItem() {
  const mockCreditCardRedaction = getMockRedactionAnnotation();
  mockCreditCardRedaction.redactionType = redactionTypeMap['CREDIT_CARD'];
  mockCreditCardRedaction.icon = 'redact-icons-credit-card';
  mockCreditCardRedaction.label = 'redactionPanel.search.creditCards';

  mockCreditCardRedaction.getContents = () => '4444 4444 4444 4444';
  const regionRedactionItemProps = {
    iconColor: '#E44234',
    annotation: mockCreditCardRedaction,
    author: mockCreditCardRedaction.Author,
    dateFormat: 'MMM D, LT',
    language: 'en',
  };
  return (
    <RedactionItemWithRedux {...regionRedactionItemProps} />
  );
};

export function PhoneNumberRedactionItem() {
  const mockPhoneNumberRedaction = getMockRedactionAnnotation();
  mockPhoneNumberRedaction.redactionType = redactionTypeMap['PHONE'];
  mockPhoneNumberRedaction.icon = 'redact-icons-phone-number';
  mockPhoneNumberRedaction.label = 'redactionPanel.search.phoneNumbers';
  mockPhoneNumberRedaction.getContents = () => '867-5309';
  const regionRedactionItemProps = {
    icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
    iconColor: '#E44234',
    annotation: mockPhoneNumberRedaction,
    author: mockPhoneNumberRedaction.Author,
    dateFormat: 'MMM D, LT',
    language: 'en',
  };
  return (
    <RedactionItemWithRedux {...regionRedactionItemProps} />
  );
};

export function EmailRedactionItem() {
  const mockEmailRedaction = getMockRedactionAnnotation();
  mockEmailRedaction.redactionType = redactionTypeMap['EMAIL'];
  mockEmailRedaction.icon = 'redact-icons-email';
  mockEmailRedaction.label = 'redactionPanel.search.emails';
  mockEmailRedaction.getContents = () => 'duncan@dune.com';
  const regionRedactionItemProps = {
    iconColor: '#E44234',
    annotation: mockEmailRedaction,
    author: mockEmailRedaction.Author,
    dateFormat: 'MMM D, LT',
    language: 'en',
  };
  return (
    <RedactionItemWithRedux {...regionRedactionItemProps} />
  );
};