import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tab, Tabs } from './Tabs';
import selectors from 'selectors';

const TestTab = withProviders(Tabs);

jest.mock('selectors', () => ({
  getSelectedTab: jest.fn(),
  isElementDisabled: jest.fn(),
}));

describe('Tab Component', () => {
  beforeEach(() => {
    selectors.getSelectedTab.mockReturnValue('Button1');
    selectors.isElementDisabled.mockReturnValue(false);
  });
  it('Component should not throw any errors', () => {
    expect(() => {
      render(
        <TestTab>
          <Tab dataElement="Button1">
            <button className="tab-options-button">
              test
            </button>
          </Tab>
        </TestTab>
      );
    }).not.toThrow();
  });

  it('Component should have an Aria Label for the filename', () => {
    render(
      <TestTab>
        <Tab dataElement="Button1">
          <button className="tab-options-button">
            test
          </button>
        </Tab>
        <Tab dataElement="Button2">
          <button className="tab-options-button">
            test
          </button>
        </Tab>
      </TestTab>
    );

    const element = screen.getAllByRole('button');

    expect(element[0]).toHaveAttribute('aria-selected', 'true');
    expect(element[0]).toHaveAttribute('aria-current', 'page');
    expect(element[1]).toHaveAttribute('aria-selected', 'false');
    expect(element[1]).not.toHaveAttribute('aria-current');
  });
});