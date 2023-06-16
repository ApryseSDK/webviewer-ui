import React from 'react';
import PageNumberInput from './PageNumberInput';

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
  pageCount: 10
};