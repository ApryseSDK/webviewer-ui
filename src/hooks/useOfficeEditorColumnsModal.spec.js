import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import core from 'core';
import { COLUMN_INPUT_TYPES, LAYOUT_UNITS } from 'constants/officeEditor';
import { useOfficeEditorColumnsModal } from './useOfficeEditorColumnsModal';
import { modifyColumns, modifyColumnsInReverse, checkEqualColumnWidths } from 'helpers/officeEditorColumnsHelper';

jest.mock('core', () => ({
  getOfficeEditor: jest.fn(),
}));

jest.mock('helpers/officeEditorColumnsHelper', () => ({
  modifyColumns: jest.fn(),
  modifyColumnsInReverse: jest.fn(),
  checkEqualColumnWidths: jest.fn(),
}));

describe('useOfficeEditorColumnsModal', () => {
  let mockOfficeEditor;

  beforeEach(() => {
    mockOfficeEditor = {
      getSectionColumns: jest.fn().mockResolvedValue([120, 36, 120]),
      getMaxColumns: jest.fn().mockResolvedValue(4),
      getEditingPageNumber: jest.fn().mockResolvedValue(1),
      buildEqualColumnsConfig: jest.fn().mockResolvedValue([120, 36, 120]),
      buildEqualColumnsConfigFromWidth: jest.fn().mockResolvedValue([120, 36, 120]),
      clampColumnWidthToSectionLimits: jest.fn().mockResolvedValue(120),
      clampColumnSpacingToSectionLimits: jest.fn().mockResolvedValue(36),
      setCustomSectionColumns: jest.fn(),
    };

    core.getOfficeEditor.mockReturnValue(mockOfficeEditor);

    checkEqualColumnWidths.mockReturnValue(true);
    modifyColumns.mockImplementation(({ columns }) => ({ nextColumns: columns, excessAmountRemaining: 0 }));
    modifyColumnsInReverse.mockImplementation(({ columns }) => ({ nextColumns: columns, excessAmountRemaining: 0 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with columns loaded from Core', async () => {
    const { result } = renderHook(() => useOfficeEditorColumnsModal());

    await waitFor(() => expect(result.current.columns.length).toBeGreaterThan(0));

    expect(mockOfficeEditor.getSectionColumns).toHaveBeenCalledWith(LAYOUT_UNITS.PHYSICAL_POINT);
    expect(result.current.columnAmount).toBe(2);
    expect(result.current.equalColumns).toBe(true);
    expect(result.current.maxAllowedColumns).toBe(4);
  });

  it('clamps the column amount to the maximum number of columns', async () => {
    const { result } = renderHook(() => useOfficeEditorColumnsModal());
    await waitFor(() => expect(result.current.columns.length).toBe(2));

    mockOfficeEditor.buildEqualColumnsConfig.mockResolvedValue([200, 36, 200]);

    await act(async () => {
      await result.current.changeColumnAmount('10');
    });

    expect(mockOfficeEditor.getMaxColumns).toHaveBeenCalled();
    expect(result.current.columnAmount).toBe(4);
    expect(result.current.columns[0]).toEqual({ width: 200, spacing: 36 });
  });

  it('commits column values using the Core helpers', async () => {
    const { result } = renderHook(() => useOfficeEditorColumnsModal());
    await waitFor(() => expect(result.current.columns.length).toBe(2));

    mockOfficeEditor.clampColumnWidthToSectionLimits.mockResolvedValue(150);
    mockOfficeEditor.buildEqualColumnsConfigFromWidth.mockResolvedValue([150, 36, 150]);

    await act(async () => {
      await result.current.commitColumnValue('150', 0, COLUMN_INPUT_TYPES.WIDTH);
    });

    expect(mockOfficeEditor.clampColumnWidthToSectionLimits).toHaveBeenCalledWith('150', 2, true, LAYOUT_UNITS.PHYSICAL_POINT);
    expect(mockOfficeEditor.buildEqualColumnsConfigFromWidth).toHaveBeenCalledWith(150, 2, LAYOUT_UNITS.PHYSICAL_POINT);
    expect(result.current.columns[0]).toEqual({ width: 150, spacing: 36 });
  });

  it('clamps spacing via the Core helper', async () => {
    const { result } = renderHook(() => useOfficeEditorColumnsModal());
    await waitFor(() => expect(result.current.columns.length).toBe(2));

    mockOfficeEditor.clampColumnSpacingToSectionLimits.mockResolvedValue(24);
    mockOfficeEditor.buildEqualColumnsConfig.mockResolvedValue([120, 24, 120]);

    await act(async () => {
      await result.current.commitColumnValue('24', 0, COLUMN_INPUT_TYPES.SPACING);
    });

    expect(mockOfficeEditor.clampColumnSpacingToSectionLimits).toHaveBeenCalledWith('24', 2, true, LAYOUT_UNITS.PHYSICAL_POINT);
    expect(result.current.columns[0]).toEqual({ width: 120, spacing: 24 });
  });

  it('toggles equal column mode', async () => {
    const { result } = renderHook(() => useOfficeEditorColumnsModal());
    await waitFor(() => expect(result.current.columns.length).toBe(2));

    act(() => {
      result.current.toggleEqualColumns();
    });

    expect(result.current.equalColumns).toBe(false);
  });

  it('commits custom column settings through Core', async () => {
    const { result } = renderHook(() => useOfficeEditorColumnsModal());
    await waitFor(() => expect(result.current.columns.length).toBe(2));

    await act(async () => {
      result.current.commitColumnSettings();
    });

    expect(mockOfficeEditor.setCustomSectionColumns).toHaveBeenCalledWith([120, 36, 120], LAYOUT_UNITS.PHYSICAL_POINT);
  });
});
