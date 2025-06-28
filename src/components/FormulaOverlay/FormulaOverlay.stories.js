import React, { useState } from 'react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import FormulaOverlay from './FormulaOverlay';
import FORMULA_OPTIONS from 'constants/formulaOptions.json';

export default {
  title: 'SpreadsheetEditor/FormulaOverlay',
  component: FormulaOverlay,
  beforeEach: () => {
    // Ensure English is the default language for all stories
    i18next.changeLanguage('en');
  },
};

const Template = (args) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const noop = () => {};

  return (
    <I18nextProvider i18n={i18next}>
      <div style={{ position: 'relative' }}>
        <FormulaOverlay
          id="formula-overlay"
          isOpen={true}
          {...args}
          onSelect={noop}
          onClose={noop}
          triggerElement={null}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
        />
      </div>
    </I18nextProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  options: Object.entries(FORMULA_OPTIONS).slice(0, 8).map(([name, data]) => ({
    name,
    description: data.a,
  })),
};

export const FrenchTranslation = Template.bind({});
FrenchTranslation.args = {
  options: Object.entries(FORMULA_OPTIONS).slice(0, 8).map(([name, data]) => ({
    name,
    description: data.a,
  })),
};
FrenchTranslation.decorators = [
  (Story) => {
    i18next.changeLanguage('fr');
    return <Story />;
  },
];
