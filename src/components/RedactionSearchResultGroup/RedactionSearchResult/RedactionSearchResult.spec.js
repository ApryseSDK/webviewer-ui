import React from 'react';
import { render, screen } from '@testing-library/react';
import { redactionTypeMap } from 'constants/redactionTypes';
import userEvent from '@testing-library/user-event';
import RedactionSearchResult from './RedactionSearchResult';

import {
  Text,
  CreditCard,
  Image,
  PhoneNumber,
  Email,
} from './RedactionSearchResult.stories';


describe('RedactionSearchResult', () => {
  describe('storybook components', () => {
    it('renders text result story correctly', () => {
      expect(() => {
        render(<Text />);
      }).not.toThrow();
    });

    it('renders credit card result story correctly', () => {
      expect(() => {
        render(<CreditCard />);
      }).not.toThrow();
    });

    it('renders image result story correctly', () => {
      expect(() => {
        render(<Image />);
      }).not.toThrow();
    });

    it('renders phone number result story correctly', () => {
      expect(() => {
        render(<PhoneNumber />);
      }).not.toThrow();
    });

    it('renders email result story correctly', () => {
      expect(() => {
        render(<Email />);
      }).not.toThrow();
    });
  });

  describe('component', () => {
    it('when the result is of type text, it renders the correct item with the correct className', () => {
      const props = {
        type: redactionTypeMap['TEXT'],
        resultStr: 'spice',
        ambientStr: 'The spice must flow.',
        resultStrStart: 4,
        resultStrEnd: 9,
      };

      render(<RedactionSearchResult {...props} />);
      const searchResult = screen.getByText(props.resultStr);
      expect(searchResult).toHaveClass('search-value');
    });

    it('when the result is of type credit card, it renders the correct item', () => {
      const props = {
        type: redactionTypeMap['CREDIT_CARD'],
        resultStr: '4242 4242 4242 4242'
      };

      render(<RedactionSearchResult {...props} />);
      const searchResult = screen.getByText(props.resultStr);
      expect(searchResult).toHaveClass('redaction-search-result-info');
    });

    it('when the result is of type phone number, it renders the correct item', () => {
      const props = {
        type: redactionTypeMap['PHONE'],
        resultStr: '867-5309'
      };

      render(<RedactionSearchResult {...props} />);
      const searchResult = screen.getByText(props.resultStr);
      expect(searchResult).toHaveClass('redaction-search-result-info');
    });

    it('when the result is of type email, it renders the correct item', () => {
      const props = {
        type: redactionTypeMap['EMAIL'],
        resultStr: 'paul.atreides@dune.com'
      };

      render(<RedactionSearchResult {...props} />);
      const searchResult = screen.getByText(props.resultStr);
      expect(searchResult).toHaveClass('redaction-search-result-info');
    });

    it('when a user clicks on the result item it calls the correct handler', () => {
      const props = {
        type: redactionTypeMap['EMAIL'],
        resultStr: 'paul.atreides@dune.com',
        onClickResult: jest.fn()
      };

      render(<RedactionSearchResult {...props} />);
      const searchResult = screen.getByText(props.resultStr);
      userEvent.click(searchResult);
      expect(props.onClickResult).toBeCalled();
    });

    it('when a user ticks the box it calls the right handler', () => {
      const props = {
        type: redactionTypeMap['EMAIL'],
        resultStr: 'paul.atreides@dune.com',
        onChange: jest.fn(),
      };

      render(<RedactionSearchResult {...props} />);
      const checkBox = screen.getByRole('checkbox');
      userEvent.click(checkBox);
      expect(props.onChange).toBeCalledTimes(1);
    });
  });
});