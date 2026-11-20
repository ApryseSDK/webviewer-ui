import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';
import { LAYOUT_UNITS } from 'constants/officeEditor';
import OfficeEditorMarginsModal from './OfficeEditorMarginsModal';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

jest.mock('core', () => ({
  getOfficeEditor: jest.fn(),
  getDocumentViewer: jest.fn(),
}));

// Letter page in centimeters, with the default 2.54cm (1") margins on every side.
const PAGE_DIMENSIONS_CM = { width: 21.59, height: 27.94 };
const DEFAULT_MARGINS_CM = { left: 2.54, right: 2.54, top: 2.54, bottom: 2.54 };

const labelFor = (side) => getTranslatedText(`officeEditor.marginsModal.${side}Margin`);
const getInput = (side) => screen.getByLabelText(labelFor(side));
const clickApply = () => userEvent.click(screen.getByRole('button', { name: getTranslatedText('action.apply') }));

const replaceValue = (side, value) => {
  const input = getInput(side);
  userEvent.clear(input);
  userEvent.type(input, value);
};

describe('OfficeEditorMarginsModal', () => {
  let store;
  let officeEditorStub;

  beforeEach(() => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    store = configureStore({
      reducer: rootReducer(),
      preloadedState: {
        ...initialState,
        officeEditor: {
          ...initialState.officeEditor,
          unitMeasurement: LAYOUT_UNITS.CM,
        },
      },
    });
    store.dispatch(actions.openElement(DataElements.OFFICE_EDITOR_MARGINS_MODAL));

    officeEditorStub = {
      getEditingPageNumber: jest.fn().mockResolvedValue(1),
      getSectionMargins: jest.fn().mockResolvedValue({ ...DEFAULT_MARGINS_CM }),
      getPageDimensions: jest.fn().mockReturnValue(PAGE_DIMENSIONS_CM),
      setSectionMargins: jest.fn().mockResolvedValue(undefined),
    };
    core.getOfficeEditor.mockReturnValue(officeEditorStub);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = () =>
    render(
      <Provider store={store}>
        <OfficeEditorMarginsModal />
      </Provider>
    );

  const renderLoadedModal = async () => {
    renderModal();
    await waitFor(() => expect(getInput('left').value).toBe('2.54'));
  };

  const isModalOpen = () => selectors.isElementOpen(store.getState(), DataElements.OFFICE_EDITOR_MARGINS_MODAL);

  it('should show the current section margins in the selected unit', async () => {
    renderModal();

    await waitFor(() => {
      ['left', 'right', 'top', 'bottom'].forEach((side) => expect(getInput(side).value).toBe('2.54'));
    });
    expect(officeEditorStub.getSectionMargins).toHaveBeenCalledWith(LAYOUT_UNITS.CM);
  });

  it('should apply the edited margins in the selected unit and close the modal', async () => {
    await renderLoadedModal();

    replaceValue('left', '1.5');
    replaceValue('right', '1.5');
    replaceValue('top', '1');
    // Bottom is edited last, so it only commits through the blur caused by clicking Apply.
    replaceValue('bottom', '3');
    clickApply();

    await waitFor(() => expect(isModalOpen()).toBe(false));
    expect(officeEditorStub.setSectionMargins).toHaveBeenCalledTimes(1);
    expect(officeEditorStub.setSectionMargins).toHaveBeenCalledWith(
      { left: 1.5, right: 1.5, top: 1, bottom: 3 },
      LAYOUT_UNITS.CM
    );
  });
});
