import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from 'reducers/rootReducer';
import core from 'core';
import OfficeEditorColumnsModal from './OfficeEditorColumnsModal';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { LAYOUT_UNITS } from 'constants/officeEditor';

jest.mock('core', () => ({
  getOfficeEditor: jest.fn(),
  getDocumentViewer: jest.fn(),
}));

const baseColumns = [120, 36, 120];

describe('OfficeEditorColumnsModal', () => {
  let store;
  let officeEditorStub;

  beforeEach(() => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...initialState,
        officeEditor: {
          ...initialState.officeEditor,
          unitMeasurement: 'point',
        }
      }
    });
    officeEditorStub = {
      getSectionColumns: jest.fn().mockResolvedValue(baseColumns),
      getMaxColumns: jest.fn().mockResolvedValue(4),
      getEditingPageNumber: jest.fn().mockResolvedValue(1),
      buildEqualColumnsConfig: jest.fn().mockResolvedValue(baseColumns),
      buildEqualColumnsConfigFromWidth: jest.fn().mockResolvedValue(baseColumns),
      clampColumnWidthToSectionLimits: jest.fn().mockResolvedValue(150),
      clampColumnSpacingToSectionLimits: jest.fn().mockResolvedValue(36),
      setCustomSectionColumns: jest.fn(),
    };

    core.getOfficeEditor.mockReturnValue(officeEditorStub);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = () =>
    render(
      <Provider store={store}>
        <OfficeEditorColumnsModal />
      </Provider>
    );

  it('renders column inputs with initial values', async () => {
    renderModal();
    const widthLabel = `${getTranslatedText('officeEditor.column')} 1 ${getTranslatedText('officeEditor.columnsModal.width')}`;
    const widthInput = await screen.findByLabelText(widthLabel);
    expect(widthInput.value).toBe('120');
  });

  it('clamps column width on blur and updates the input value', async () => {
    renderModal();
    const widthLabel = `${getTranslatedText('officeEditor.column')} 1 ${getTranslatedText('officeEditor.columnsModal.width')}`;
    const widthInput = await screen.findByLabelText(widthLabel);

    fireEvent.change(widthInput, { target: { value: '20' } });
    fireEvent.blur(widthInput);

    await waitFor(() => {
      expect(officeEditorStub.clampColumnWidthToSectionLimits).toHaveBeenCalledWith(20, 2, true, LAYOUT_UNITS.PHYSICAL_POINT);
      expect(widthInput.value).toBe(`${baseColumns[0]}`);
    });
  });

  it('clamps spacing on blur and updates the input value', async () => {
    renderModal();

    const spacingLabel = `${getTranslatedText('officeEditor.column')} 1 ${getTranslatedText('officeEditor.columnsModal.spacing')}`;
    const spacingInput = await screen.findByLabelText(spacingLabel);

    fireEvent.change(spacingInput, { target: { value: '5' } });
    fireEvent.blur(spacingInput);

    await waitFor(() => {
      expect(officeEditorStub.clampColumnSpacingToSectionLimits).toHaveBeenCalledWith(5, 2, true, LAYOUT_UNITS.PHYSICAL_POINT);
      expect(spacingInput.value).toBe('36');
    });
  });

  it('commits column settings on apply', async () => {
    renderModal();
    const applyButton = await screen.findByRole('button', { name: getTranslatedText('action.apply') });
    fireEvent.click(applyButton);

    expect(officeEditorStub.setCustomSectionColumns).toHaveBeenCalledWith([120, 36, 120], LAYOUT_UNITS.PHYSICAL_POINT);
  });
});
