import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LineStyleOptions from './LineStyleOptions';
import { Basic } from './LineStyleOptions.stories';

const BasicLineStyleOptionsStory = withI18n(Basic);
const TestLineStyleOptions = withProviders(LineStyleOptions);

function noop() { }

describe('LineStyleOptions', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicLineStyleOptionsStory />);
      }).not.toThrow();
    });
  });

  describe('Basic tests', () => {
    it('should render two dropdown containers, one for each line style', () => {
      const lineStyleKey = 'None';
      const properties = { StartLineStyle: lineStyleKey, EndLineStyle: lineStyleKey };

      render(
        <TestLineStyleOptions
          properties={properties}
          onLineStyleChange={noop}
        />
      );

      const dropdowns = screen.getAllByRole('combobox');
      expect(dropdowns.length).toBe(3);
    });

    it('when a new choice is selected the callback should be invoked', () => {
      const onLineStyleChangeMock = jest.fn();
      const properties = { StartLineStyle: 'None', EndLineStyle: 'None' };

      render(
        <TestLineStyleOptions
          properties={properties}
          onLineStyleChange={onLineStyleChangeMock}
        />
      );

      //First we assert the start line style dropdown is the default
      const dropdowns = screen.getAllByRole('combobox', { description: 'None' });
      const startDropDownCombobox = dropdowns[0];
      expect(startDropDownCombobox).toBeInTheDocument();
      expect(startDropDownCombobox).toHaveAttribute('aria-describedby', 'startLineStyleDropdown-None');

      // We get the first one for the Start of the line
      const openArrowOption = screen.getAllByRole('option', { name: 'ClosedArrow' })[0];
      fireEvent.click(openArrowOption);

      // There should now be one combo box with the new value of ClosedArrow
      expect(startDropDownCombobox).toHaveAttribute('aria-describedby', 'startLineStyleDropdown-ClosedArrow');


      expect(onLineStyleChangeMock).toBeCalled();
    });
  });
});