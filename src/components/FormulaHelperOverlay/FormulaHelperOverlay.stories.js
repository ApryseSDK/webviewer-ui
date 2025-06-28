import React from 'react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import FormulaHelperOverlay from './FormulaHelperOverlay';

export default {
  title: 'SpreadsheetEditor/FormulaHelperOverlay',
  component: FormulaHelperOverlay,
  beforeEach: () => {
    i18next.changeLanguage('en');
  },
};

const selectedFormula = {
  'name': 'SUMIF',
  'description': 'Returns a conditional sum across a range.',
  'a': 'A conditional sum across a range.',
  'parameters': [
    {
      'name': 'range',
      'detail': 'The range which is tested against `criterion`.'
    },
    {
      'name': 'criterion',
      'detail': 'The pattern or test to apply to `range`.'
    },
    {
      'name': 'sum_range',
      'detail': 'The range to be summed, if different from `range`.'
    }
  ]
};

const Template = (args) => (
  <I18nextProvider i18n={i18next}>
    <FormulaHelperOverlay {...args} />
  </I18nextProvider>
);

export const Default = Template.bind({});
Default.args = {
  selectedFormula,
  labelId: 'formula-overlay-label',
};

export const FrenchTranslation = Template.bind({});
FrenchTranslation.args = {
  selectedFormula,
  labelId: 'formula-overlay-label',
};
FrenchTranslation.decorators = [
  (Story) => {
    i18next.changeLanguage('fr');
    return <Story />;
  },
];