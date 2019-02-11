import getBrightness from 'helpers/getBrightness';

test('getBrightness', () => {
  const testFunc = () => {
    return 'test'; 
  }; 
  const testBright = {
    R: 0,
    G: 0,
    B: 0,
    toHexString: testFunc
  };
  const testDark = {
    R: 255,
    G: 255,
    B: 255,
    toHexString: testFunc
  };
  expect(getBrightness(testBright)).toEqual('bright');
  expect(getBrightness(testDark)).toEqual('dark');
});