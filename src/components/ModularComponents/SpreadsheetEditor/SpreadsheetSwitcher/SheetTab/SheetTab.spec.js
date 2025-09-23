import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SheetTab from './SheetTab';
import { Provider } from 'react-redux';
import actions from 'actions';
import { isSheetNameDuplicated } from 'src/helpers/spreadsheetSwitchContainerHelpers';

const TestSheetTab = withMockRedux(SheetTab);

const sheets = [
  { sheetIndex: 0, name: 'SheetName', disabled: true },
  { sheetIndex: 1, name: 'SheetName 1' },
];

const tabObject = {
  sheet: { sheetIndex: 0, name: 'SheetName' },
  sheetCount: sheets.length,
  activeSheetLabel: 'SheetName'
};

const tabObjectTwo = {
  sheet: { sheetIndex: 0, name: 'SheetName', disabled: true },
  sheetCount: sheets.length,
  activeSheetLabel: 'SheetName'
};

describe('SheetTab', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<TestSheetTab {...tabObject}/>);
    }).not.toThrow();
    expect(true).toBe(true);
  });

  it('Component should have Aria Selected defined', () => {
    render(<TestSheetTab {...tabObject} />);

    const element = screen.getByRole('tab', { name: 'SheetName' });

    expect(element).toHaveAttribute('aria-selected', 'true');
  });

  it('Component should have Aria Selected defined and should be false', () => {
    render(<TestSheetTab {...tabObject} activeSheetLabel={'SheetName 1'} />);

    const element = screen.getByRole('tab', { name: 'SheetName', exact: true });
    expect(element).toHaveAttribute('aria-selected', 'false');
  });

  it('Component should have an Aria Label and onClick event fired', async () => {
    const onClick = jest.fn();
    render(<TestSheetTab {...tabObject} onClick={onClick} activeSheetLabel={'SheetName 1'}/>);

    const element = screen.getByLabelText('SheetName');
    expect(element).toHaveAttribute('aria-label', 'SheetName');
    expect(element).toBeInTheDocument();
    await userEvent.click(element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Component should have an Aria Label for the filename', () => {
    render(<TestSheetTab {...tabObjectTwo} />);

    const element = screen.getByRole('tab', { name: 'SheetName' });

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-label', 'SheetName');
    expect(element).toHaveAttribute('aria-selected', 'true');
    expect(element).toBeDisabled();
  });
});

describe('SheetTab interactions', () => {
  jest.mock('actions', () => ({
    showWarningMessage: jest.fn()
  }));

  const mockDispatch = jest.fn();
  const mockStore = {
    getState: () => ({}),
    dispatch: mockDispatch,
    subscribe: jest.fn(),
  };

  const activeSheetIndex = 0;

  const defaultProps = {
    sheet: { sheetIndex: 0, name: 'Sheet1' },
    activeSheetLabel: 'Sheet1',
    isEditMode: true,
    setLabelBeingEdited: jest.fn(),
    setActiveSheet: jest.fn(),
    renameSheet: jest.fn(),
    deleteSheet: jest.fn(),
    onClick: jest.fn(),
    checkIsSheetNameDuplicated: jest.fn((newName) => {
      return isSheetNameDuplicated(
        sheets,
        sheets[activeSheetIndex],
        newName
      );
    }),
  };

  const renderSheetTabAndChangeInput = (props = {}, inputValue) => {
    render(
      <Provider store={mockStore}>
        <SheetTab {...defaultProps} {...props} />
      </Provider>
    );

    const input = screen.getByRole('textbox');
    userEvent.clear(input);
    userEvent.type(input, inputValue);
    userEvent.tab(); // To blur out from the input

    return input;
  };

  const expectWarningDispatched = () => {
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SHOW_WARNING_MESSAGE',
      payload: {}
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    actions.showWarningMessage = jest.fn().mockReturnValue({
      type: 'SHOW_WARNING_MESSAGE',
      payload: {}
    });
  });

  it('should be able to rename the sheet name to the same one with different case on the same sheet', () => {
    renderSheetTabAndChangeInput({}, 'sheet1');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  describe('error scenarios', () => {
    it.each([
      ['empty', ''],
      ['whitespace only', '   '],
      ['duplicated name', 'SheetName 1']
    ])('should show error warning when input is %s on blur', async (description, inputValue) => {
      renderSheetTabAndChangeInput({}, inputValue);
      expectWarningDispatched();
    });

    it('should show error warning when checkIsSheetNameDuplicated returns true (duplicate) on blur', () => {
      const checkIsSheetNameDuplicatedMock = jest.fn().mockReturnValue(true);
      renderSheetTabAndChangeInput({ checkIsSheetNameDuplicated: checkIsSheetNameDuplicatedMock }, 'DuplicateName');
      expectWarningDispatched();
    });
  });

  it('should not show error warning when input is valid on blur', () => {
    const checkIsSheetNameDuplicatedMock = jest.fn().mockReturnValue(false);
    renderSheetTabAndChangeInput({ checkIsSheetNameDuplicated: checkIsSheetNameDuplicatedMock }, 'ValidNewName');

    expect(defaultProps.renameSheet).toHaveBeenCalledWith('Sheet1', 'ValidNewName');
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});