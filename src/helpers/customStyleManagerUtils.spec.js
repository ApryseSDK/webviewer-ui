import {
  getCustomData,
  setCustomData,
  syncCustomStyleSelection,
} from './customStyleManagerUtils';

describe('customStyleManagerUtils', () => {
  it('reads and writes the annotation custom-data mirror', () => {
    const annotation = {
      getCustomData: jest.fn(() => 'stored'),
      setCustomData: jest.fn(),
    };

    expect(getCustomData(annotation, 'custom-key')).toBe('stored');
    setCustomData(annotation, 'custom-key', 'next');
    expect(annotation.setCustomData).toHaveBeenCalledWith('custom-key', 'next', true);
  });

  it('stores only registered selections', () => {
    const customData = {};
    const annotation = {
      getCustomData: jest.fn((key) => customData[key] || ''),
      setCustomData: jest.fn((key, value) => {
        customData[key] = value;
      }),
    };
    const registry = { has: jest.fn((scope, key) => scope === 'fill' && key === 'hatch') };

    expect(syncCustomStyleSelection(annotation, registry, 'fill', '_customFill', 'hatch')).toBe('hatch');
    expect(syncCustomStyleSelection(annotation, registry, 'fill', '_customFill', 'solid')).toBe('');
    expect(annotation.setCustomData).toHaveBeenLastCalledWith('_customFill', '', true);

    syncCustomStyleSelection(annotation, registry, 'fill', '_customFill', 'solid');
    expect(annotation.setCustomData).toHaveBeenCalledTimes(2);
  });
});