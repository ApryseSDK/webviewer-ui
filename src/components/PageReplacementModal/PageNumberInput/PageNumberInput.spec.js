import React, { useState } from 'react';
import PropTypes from 'prop-types';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic } from './PageNumberInput.stories';
import { Provider } from 'react-redux';
import PageNumberInput from './PageNumberInput';

function noop() { }

const initialState = {
  viewer: {
    isCustomPageLabelsEnabled: false,
    pageLabels: [],
  }
};

const PageNumberInputWithRedux = ({ state = initialState, ...props }) => {
  const store = configureStore({
    reducer: () => state,
  });

  return (
    <Provider store={store}>
      <PageNumberInput {...props} />
    </Provider>
  );
};

PageNumberInputWithRedux.propTypes = {
  state: PropTypes.object,
};

const ControlledPageNumberInput = ({ onSelectedPageNumbersChange, selectedPageNumbers = [], ...rest }) => {
  const [pageNumbers, setPageNumbers] = useState(selectedPageNumbers);

  const handleSelectedPageNumbersChange = (pages) => {
    setPageNumbers(pages);
    onSelectedPageNumbersChange && onSelectedPageNumbersChange(pages);
  };

  return (
    <PageNumberInputWithRedux
      {...rest}
      selectedPageNumbers={pageNumbers}
      onSelectedPageNumbersChange={handleSelectedPageNumbersChange}
    />
  );
};

ControlledPageNumberInput.propTypes = {
  onSelectedPageNumbersChange: PropTypes.func,
  selectedPageNumbers: PropTypes.array,
};

describe('PageNumberInput component', () => {
  // These tests are expected to throw warnings so we do this to reduce noise in our output
  let warnSpy;

  beforeAll(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  afterEach(() => {
    warnSpy.mockClear();
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });

  it('Renders the StoryBook component without issues', () => {
    expect(() => {
      render(<Basic />);
    }).not.toThrow();
  });

  it('Correctly renders page numbers input when passed as prop', () => {
    const selectedPageNumbers = [1, 2, 3, 6];
    const expectedNumberString = '1-3, 6';
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 10,
      selectedPageNumbers
    };

    render(<ControlledPageNumberInput {...props} />);

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

    render(<ControlledPageNumberInput {...props} />);

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

    render(<ControlledPageNumberInput {...props} />);

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

    render(<ControlledPageNumberInput {...props} />);

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

    render(<ControlledPageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    userEvent.type(input, '1, 3, 2, 6, 15');
    fireEvent.blur(input);
    expect(props.onSelectedPageNumbersChange).toBeCalledWith([1, 2, 3, 6, 15]);
  });

  it('When a user enters a page number range with an invalid page number, the callback gets called only with the valid numbers', () => {
    const props = {
      onSelectedPageNumbersChange: jest.fn(), // Mock fn
      pageCount: 10,
      selectedPageNumbers: []
    };

    render(<ControlledPageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    // We type some numbers, a mix of valid and invalid
    userEvent.type(input, '1, 3, 2, 15, 2024, easter bunny');
    fireEvent.blur(input);
    // Handler should be called only with valid numbers
    expect(props.onSelectedPageNumbersChange).toBeCalledWith([1, 2, 3]);
  });

  it('When a user enters a page label instead of page number, the page number should be returned as well', () => {
    const props = {
      onSelectedPageNumbersChange: jest.fn(), // Mock fn
      pageCount: 5,
      selectedPageNumbers: [],
    };

    const state = {
      viewer: {
        isCustomPageLabelsEnabled: true,
        pageLabels: ['Label1', 'Label2', '3', '4', '5'],
      }
    };

    render(<ControlledPageNumberInput {...props} state={state} />);

    const input = screen.getByRole('textbox');

    // We type some numbers, a mix of valid and invalid
    userEvent.type(input, 'Label1,Label2,3');
    fireEvent.blur(input);
    // Handler should be called only with valid numbers
    expect(props.onSelectedPageNumbersChange).toBeCalledWith([1, 2, 3]);
  });

  it('When custom page labels are provided, formatted value preserves the labels', () => {
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 9,
      selectedPageNumbers: [],
    };

    const state = {
      viewer: {
        isCustomPageLabelsEnabled: true,
        pageLabels: ['91', '92', '93', '94', '95', '96', '97', '98', '99'],
      }
    };
    render(<ControlledPageNumberInput {...props} state={state} />);

    const input = screen.getByRole('textbox');

    userEvent.type(input, '91');
    fireEvent.blur(input);

    expect(input.value).toEqual('91');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('logs a warning when an invalid page label is entered', () => {
    const props = {
      onSelectedPageNumbersChange: noop,
      pageCount: 9,
      selectedPageNumbers: []
    };

    render(<ControlledPageNumberInput {...props} />);

    const input = screen.getByRole('textbox');

    userEvent.type(input, '1-10');
    fireEvent.blur(input);

    expect(input).toHaveValue('');
    expect(warnSpy).toHaveBeenCalledWith('10 is not a valid page label');
    const errorElement = screen.getByText('Invalid page number. Limit is 9.');
    expect(errorElement).toBeVisible();
  });
});
