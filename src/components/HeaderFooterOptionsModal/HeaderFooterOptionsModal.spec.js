import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import useCore from 'hooks/useCore';
import HeaderFooterModalState from 'helpers/headerFooterModalState';
import DataElements from 'constants/dataElement';
import { LAYOUT_UNITS } from 'constants/officeEditor';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import HeaderFooterOptionsModal from './HeaderFooterOptionsModal';

jest.mock('hooks/useCore');

// Keep the real unit/validation helpers (backed by window.Core), but stub
// focusContent so the close flow does not reach the real core on a timer.
jest.mock('helpers/officeEditor', () => ({
  ...jest.requireActual('helpers/officeEditor'),
  focusContent: jest.fn(),
}));

const PAGE_NUMBER = 3;
// 72 points === 1 inch === 2.54 cm, used as a small max to exercise clamping.
const MAX_MARGIN_IN_POINTS = 72;

const labels = {
  header: getTranslatedText('officeEditor.headerFooterOptionsModal.headerFromTop'),
  footer: getTranslatedText('officeEditor.headerFooterOptionsModal.footerFromBottom'),
  differentFirstPage: getTranslatedText('officeEditor.headerFooterOptionsModal.layouts.differentFirstPage'),
  differentEvenOddPages: getTranslatedText('officeEditor.headerFooterOptionsModal.layouts.differentEvenOddPages'),
  save: getTranslatedText('action.save'),
};

describe('HeaderFooterOptionsModal', () => {
  let store;
  let officeEditorStub;

  const buildStore = () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    return configureStore({
      reducer: rootReducer(),
      preloadedState: {
        ...initialState,
        viewer: {
          ...initialState.viewer,
          openElements: {
            ...initialState.viewer.openElements,
            [DataElements.HEADER_FOOTER_OPTIONS_MODAL]: true,
          },
        },
        officeEditor: {
          ...initialState.officeEditor,
          unitMeasurement: LAYOUT_UNITS.CM,
        },
      },
    });
  };

  beforeEach(() => {
    HeaderFooterModalState.setPageNumber(PAGE_NUMBER);
    officeEditorStub = {
      getHeaderFooterMargins: jest.fn().mockResolvedValue({ headerDistanceToTop: 1.27, footerDistanceToBottom: 2.54 }),
      getDifferentFirstPage: jest.fn().mockResolvedValue(false),
      getOddEven: jest.fn().mockResolvedValue(false),
      getMaxHeaderFooterDistance: jest.fn().mockResolvedValue(MAX_MARGIN_IN_POINTS),
      setDifferentFirstPage: jest.fn().mockResolvedValue(undefined),
      setOddEven: jest.fn().mockResolvedValue(undefined),
      setHeaderFooterMargins: jest.fn().mockResolvedValue(undefined),
    };
    useCore.mockReturnValue({ core: { getOfficeEditor: () => officeEditorStub } });
    store = buildStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = () =>
    render(
      <Provider store={store}>
        <HeaderFooterOptionsModal />
      </Provider>
    );

  it('does not render when the modal is closed', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const closedStore = configureStore({ reducer: rootReducer(), preloadedState: initialState });
    const { container } = render(
      <Provider store={closedStore}>
        <HeaderFooterOptionsModal />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
    expect(officeEditorStub.getHeaderFooterMargins).not.toHaveBeenCalled();
  });

  it('loads the current header and footer distances for the active page', async () => {
    renderModal();

    const headerInput = await screen.findByLabelText(labels.header);
    const footerInput = screen.getByLabelText(labels.footer);

    await waitFor(() => expect(headerInput.value).toBe('1.27'));
    expect(footerInput.value).toBe('2.54');
    expect(officeEditorStub.getHeaderFooterMargins).toHaveBeenCalledWith(PAGE_NUMBER, LAYOUT_UNITS.CM);
  });

  it('reflects the saved layout toggle states from core', async () => {
    officeEditorStub.getDifferentFirstPage.mockResolvedValue(true);
    officeEditorStub.getOddEven.mockResolvedValue(false);
    renderModal();

    const differentFirstPage = await screen.findByRole('checkbox', { name: labels.differentFirstPage });
    const differentEvenOdd = screen.getByRole('checkbox', { name: labels.differentEvenOddPages });

    await waitFor(() => expect(differentFirstPage).toBeChecked());
    expect(differentEvenOdd).not.toBeChecked();
  });

  it('clamps a header value above the maximum distance on blur', async () => {
    renderModal();
    const headerInput = await screen.findByLabelText(labels.header);
    await waitFor(() => expect(headerInput.value).toBe('1.27'));

    fireEvent.change(headerInput, { target: { value: '10' } });
    fireEvent.blur(headerInput);

    // Max distance is 72pt === 2.54cm, so the value is clamped.
    await waitFor(() => expect(headerInput.value).toBe('2.54'));
  });

  it('resets a negative footer value to zero on blur', async () => {
    renderModal();
    const footerInput = await screen.findByLabelText(labels.footer);
    await waitFor(() => expect(footerInput.value).toBe('2.54'));

    fireEvent.change(footerInput, { target: { value: '-5' } });
    fireEvent.blur(footerInput);

    await waitFor(() => expect(footerInput.value).toBe('0'));
  });

  it('persists changed distances and layout toggles on save, then closes the modal', async () => {
    renderModal();
    const headerInput = await screen.findByLabelText(labels.header);
    await waitFor(() => expect(headerInput.value).toBe('1.27'));

    fireEvent.change(headerInput, { target: { value: '2' } });
    fireEvent.blur(headerInput);
    await waitFor(() => expect(headerInput.value).toBe('2'));

    fireEvent.click(screen.getByRole('checkbox', { name: labels.differentFirstPage }));
    fireEvent.click(screen.getByRole('checkbox', { name: labels.differentEvenOddPages }));
    fireEvent.click(screen.getByRole('button', { name: labels.save }));

    await waitFor(() => {
      expect(officeEditorStub.setHeaderFooterMargins).toHaveBeenCalledWith(
        PAGE_NUMBER,
        { headerDistanceToTop: 2, footerDistanceToBottom: 2.54 },
        LAYOUT_UNITS.CM,
      );
    });
    expect(officeEditorStub.setDifferentFirstPage).toHaveBeenCalledWith(PAGE_NUMBER, true);
    expect(officeEditorStub.setOddEven).toHaveBeenCalledWith(true);
    expect(screen.queryByLabelText(labels.header)).not.toBeInTheDocument();
  });

  it('does not write header and footer margins when the distances are unchanged', async () => {
    renderModal();
    await screen.findByLabelText(labels.header);
    await waitFor(() => expect(officeEditorStub.getHeaderFooterMargins).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: labels.save }));

    await waitFor(() => {
      expect(officeEditorStub.setOddEven).toHaveBeenCalled();
      expect(officeEditorStub.setDifferentFirstPage).toHaveBeenCalled();
    });
    expect(officeEditorStub.setHeaderFooterMargins).not.toHaveBeenCalled();
  });

  it('converts the displayed distances when the measurement unit changes', async () => {
    renderModal();
    const headerInput = await screen.findByLabelText(labels.header);
    const footerInput = screen.getByLabelText(labels.footer);
    await waitFor(() => expect(headerInput.value).toBe('1.27'));

    act(() => {
      store.dispatch(actions.setOfficeEditorUnitMeasurement(LAYOUT_UNITS.MM));
    });

    // 1.27cm === 12.7mm and 2.54cm === 25.4mm.
    await waitFor(() => expect(headerInput.value).toBe('12.7'));
    expect(footerInput.value).toBe('25.4');
  });
});
