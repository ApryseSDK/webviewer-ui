import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SheetTab from './SheetTab';

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