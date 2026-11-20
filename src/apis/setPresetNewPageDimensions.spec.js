import setPresetNewPageDimensions from './setPresetNewPageDimensions';

describe('setPresetNewPageDimensions', () => {
  it('should add the preset to the existing new-page presets without touching crop presets', () => {
    const presetNewPageDimensions = { Letter: { width: 8.5, height: 11 } };
    const presetCropDimensions = { Crop: { width: 1, height: 1 } };
    const store = {
      getState: () => ({ viewer: { presetNewPageDimensions, presetCropDimensions } }),
      dispatch: jest.fn(),
    };

    setPresetNewPageDimensions(store)('A4', { width: 8.27, height: 11.69 });

    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      payload: { presetNewPageDimensions: { Letter: { width: 8.5, height: 11 }, A4: { width: 8.27, height: 11.69 } } },
    }));
    expect(presetNewPageDimensions).toEqual({ Letter: { width: 8.5, height: 11 } });
    expect(presetCropDimensions).toEqual({ Crop: { width: 1, height: 1 } });
  });
});
