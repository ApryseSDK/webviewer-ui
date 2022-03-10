import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react';
import PageNumberInput from './PageNumberInput';
import { Basic } from './PageNumberInput.stories';
import userEvent from '@testing-library/user-event';

function noop() { };

describe('PageNumberInput component', () => {
  // These tests are expected to throw warnings so we do this to reduce noise in our output
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  it('Renders the StoryBook component without issues', () => {
    expect(() => {
      render(<Basic />)
    }).not.toThrow();
  });

  it('Correctly renders page numbers input when passed as prop', () => {
    const selectedPageNumbers = [1, 2, 3, 6];
    const expectedNumberString = '1-3, 6';
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 10,
      selectedPageNumbers: selectedPageNumbers
    };

    render(<PageNumberInput {...props} />);

    const input = screen.getByRole('textbox');
    expect(input.value).toEqual(expectedNumberString);
  });

  it('When a user enters a page number range, it gets correctly formatted', () => {
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 10,
      selectedPageNumbers: []
    };
    const expectedNumberString = '1-3, 6';

    render(<PageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    // We type some numbers and simulate a blur event
    userEvent.type(input, '1, 3, 2, 6');
    fireEvent.blur(input);
    expect(input.value).toEqual(expectedNumberString);
  });

  it('When a user enters a page number range with an invalid page number, it formats the string and removes the invalid page', () => {
    // pageCount determines the highest available page. So in this case, page 10 is the upper limit
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 10,
      selectedPageNumbers: []
    };
    const expectedNumberString = '1, 3';

    render(<PageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    // We type some numbers, two valid ones and an invalid one
    userEvent.type(input, '1, 3, 1945');
    fireEvent.blur(input);
    expect(input.value).toEqual(expectedNumberString);
  });

  it('When a user enters a range of invalid pages, nothing gets persisted', () => {
    // pageCount determines the highest available page. So in this case, page 10 is the upper limit
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 10,
      selectedPageNumbers: []
    };

    render(<PageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    // We type some invalid values
    userEvent.type(input, '65, easter bunny, 55');
    fireEvent.blur(input);
    expect(input.value).toEqual('');
  });

  it('When a user enters a valid range of page numbers, the callback gets called with the array of these valid page numbers', () => {
    const props = {
      onSelectedPageNumbersChange: jest.fn(),
      pageCount: 15,
      selectedPageNumbers: []
    };

    render(<PageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    userEvent.type(input, '1, 3, 2, 6, 15');
    fireEvent.blur(input);
    expect(props.onSelectedPageNumbersChange).toBeCalledWith([1, 2, 3, 6, 15]);
  });

  it('When a user enters a page number range with an invalid page number, the callback gets called only with the valid numbers', () => {
    const props = {
      onSelectedPageNumbersChange: jest.fn(), //Mock fn
      pageCount: 10,
      selectedPageNumbers: []
    };

    render(<PageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    // We type some numbers, a mix of valid and invalid
    userEvent.type(input, '1, 3, 2, 15, 2024, easter bunny');
    fireEvent.blur(input);
    // Handler should be called only with valid numbers
    expect(props.onSelectedPageNumbersChange).toBeCalledWith([1, 2, 3]);
  });
})