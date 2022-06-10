import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LineStyleOptions from './LineStyleOptions';
import { Basic } from './LineStyleOptions.stories';

const BasicLineStyleOptionsStory = withI18n(Basic);
const TestLineStyleOptions = withProviders(LineStyleOptions);

function noop() {}

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

      const { container } = render(
        <TestLineStyleOptions
          properties={properties}
          onLineStyleChange={noop}
        />
      );

      const dropdowns = container.querySelectorAll(`button.Dropdown`);
      expect(dropdowns.length).toBe(2);
    });

    it('when a new choice is selected the callback should be invoked', () => {
      const onLineStyleChangeMock = jest.fn();
      const properties = { StartLineStyle: 'None', EndLineStyle: 'None' };

      const { container } = render(
        <TestLineStyleOptions
          properties={properties}
          onLineStyleChange={onLineStyleChangeMock}
        />
      );

      const dropdownContainer = container.querySelector('[data-element="startLineStyleDropdown"]');
      const dropdownButton = dropdownContainer.querySelector('button.Dropdown');
      const openArrowOption = dropdownContainer.querySelector('button[data-element="dropdown-item-ClosedArrow"]');
      fireEvent.click(dropdownButton);
      fireEvent.click(openArrowOption);
      expect(onLineStyleChangeMock).toBeCalled();
    });
  });
});