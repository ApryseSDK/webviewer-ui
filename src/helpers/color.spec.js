import { rgbaToHex } from './color';

describe('Color helper functions', () => {
  it('should convert RGBA value to HEX', () => {
    const hexColorValue = rgbaToHex(52, 152, 74, 1);
    expect(hexColorValue).toEqual('#34984aff');
  });

  it('should convert RGBA value to HEX', () => {
    const hexColorValue = rgbaToHex(52, 152, 74, 0.5);
    expect(hexColorValue).toEqual('#34984a80');
  });

  it('should convert RGB value to HEX', () => {
    const hexColorValue = rgbaToHex(252, 186, 3);
    expect(hexColorValue).toEqual('#fcba03ff');
  });
});
