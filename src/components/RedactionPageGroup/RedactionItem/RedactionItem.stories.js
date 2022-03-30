import React from 'react';
import RedactionItem from './RedactionItem';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import { redactionTypeMap } from './RedactionItem';

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
  mockTextRedactionAnnotation.IsText = true;
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
  const mockRegionRedactionAnnotation = getMockRedactionAnnotation();
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
  const mockFullPageRedactionAnnotation = getMockRedactionAnnotation();
  mockFullPageRedactionAnnotation.type = redactionTypeMap['FULL_PAGE'];
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
  const mockFullPageRedactionAnnotation = getMockRedactionAnnotation();
  mockFullPageRedactionAnnotation.type = redactionTypeMap['CREDIT_CARD'];
  mockFullPageRedactionAnnotation.getContents = () => '4444 4444 4444 4444';
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

export function PhoneNumberRedactionItem() {
  const mockFullPageRedactionAnnotation = getMockRedactionAnnotation();
  mockFullPageRedactionAnnotation.type = redactionTypeMap['PHONE'];
  mockFullPageRedactionAnnotation.getContents = () => '867-5309';
  const regionRedactionItemProps = {
    icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
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

export function EmailRedactionItem() {
  const mockFullPageRedactionAnnotation = getMockRedactionAnnotation();
  mockFullPageRedactionAnnotation.type = redactionTypeMap['EMAIL'];
  mockFullPageRedactionAnnotation.getContents = () => 'duncan@dune.com';
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