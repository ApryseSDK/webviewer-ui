import React from 'react';
import PageNumberInput from './PageNumberInput';
import { userEvent, expect } from 'storybook/test';

function noop() { }

export default {
  title: 'Components/PageReplacementModal/PageNumberInput',
  component: PageNumberInput,
};

const PageNumberInputTemplate = (args) => (
  <PageNumberInput {...args} />
);

export const Basic = PageNumberInputTemplate.bind({});
Basic.args = {
  selectedPageNumbers: [],
  onSelectedPageNumbersChange: noop,
  pageCount: 10,
};

export const BasicWithError = PageNumberInputTemplate.bind({});
BasicWithError.args = {
  selectedPageNumbers: [],
  onSelectedPageNumbersChange: noop,
  pageCount: 10,
  pageNumberError: 'Error message',
};

BasicWithError.play = async ()  => {
  const textInput = await document.querySelector('.page-number-input');
  expect(textInput).toBeInTheDocument();

  await userEvent.type(textInput, 'Some text', {
    delay: 100,
  });

  const pElement = await document.querySelector('.page-number-error p');
  expect(pElement).toBeInTheDocument();
  expect(pElement.getAttribute('aria-live')).not.toBeNull;
};