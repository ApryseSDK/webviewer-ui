import React, { useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useWindowDimensions from 'helpers/useWindowsDimensions';
import rootReducer from 'reducers/rootReducer';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import actions from 'actions';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    const translation = [(key) => key];
    translation.t = translation[0];
    return translation;
  },
}));
jest.mock('constants/spreadsheetEditor', () => ({
  SpreadsheetEditorEditMode: {
    VIEW_ONLY: 'viewOnly',
  },
}));

jest.mock('helpers/useWindowsDimensions', () => jest.fn());
jest.mock('hooks/useArrowNavigation', () => jest.fn(() => ({
  currentFocusIndex: 0,
})));

import SpreadsheetSwitcher from './SpreadsheetSwitcher';

const tabs = [
  { name: 'Sheet 1', sheetIndex: 0 },
  { name: 'Sheet 2', sheetIndex: 1 },
  { name: 'Sheet 3', sheetIndex: 2 },
  { name: 'Sheet 4', sheetIndex: 3 },
  { name: 'Sheet 5', sheetIndex: 4 },
];

const StatefulSpreadsheetSwitcher = ({
  initialActiveSheetIndex = 0,
  deleteSheet = jest.fn(),
  renameSheet = jest.fn(),
}) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(initialActiveSheetIndex);

  return (
    <SpreadsheetSwitcher
      activeSheetIndex={activeSheetIndex}
      checkIsSheetNameDuplicated={jest.fn()}
      createNewSheet={jest.fn()}
      deleteSheet={deleteSheet}
      renameSheet={renameSheet}
      skipDeleteWarning
      setActiveSheet={(_, index) => setActiveSheetIndex(index)}
      tabs={tabs}
    />
  );
};

const renderSpreadsheetSwitcher = (props) => {
  const store = configureStore({ reducer: rootReducer() });
  store.dispatch(actions.setSpreadsheetEditorEditMode(true));
  return render(
    <Provider store={store}>
      <StatefulSpreadsheetSwitcher {...props} />
      <FlyoutContainer />
    </Provider>
  );
};

describe('SpreadsheetSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the active hidden sheet in the visible tab strip after it is selected from the flyout', async () => {
    useWindowDimensions.mockReturnValue({ width: 600, height: 800 });
    const deleteSheet = jest.fn();
    const renameSheet = jest.fn();
    renderSpreadsheetSwitcher({ deleteSheet, renameSheet });

    expect(screen.getByRole('tab', { name: 'Sheet 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Sheet 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Sheet 3' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Sheet 5' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'message.showMore' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sheet 5', exact: true }));

    expect(screen.getByRole('tab', { name: 'Sheet 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Sheet 2' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'message.showMore' }));
    const promotedTab = screen.getByRole('tab', { name: 'Sheet 5' });
    expect(promotedTab).toBeInTheDocument();
    expect(promotedTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('tab', { name: 'Sheet 3' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'option.searchPanel.moreOptions Sheet 5' }));
    expect(screen.getByRole('button', { name: 'action.rename' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'action.delete' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'action.rename' }));
    const renameInput = screen.getByRole('textbox', { name: 'action.rename' });
    await userEvent.clear(renameInput);
    await userEvent.type(renameInput, 'Renamed Sheet');
    await userEvent.tab();

    expect(renameSheet).toHaveBeenCalledWith('Sheet 5', 'Renamed Sheet');

    await userEvent.click(screen.getByRole('button', { name: 'option.searchPanel.moreOptions Sheet 5' }));
    await userEvent.click(screen.getByRole('button', { name: 'action.delete' }));
    expect(deleteSheet).toHaveBeenCalledWith('Sheet 5');
  });

  it('keeps one actionable visible sheet tab at narrow mobile widths', async () => {
    useWindowDimensions.mockReturnValue({ width: 120, height: 800 });
    renderSpreadsheetSwitcher();

    expect(screen.getByRole('tab', { name: 'Sheet 1' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Sheet 2' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'message.showMore' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sheet 5', exact: true }));

    expect(screen.getByRole('tab', { name: 'Sheet 5' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Sheet 1' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'message.showMore' }));
    expect(screen.getByRole('button', { name: 'Sheet 1', exact: true })).toBeInTheDocument();
  });
});
